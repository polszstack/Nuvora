import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.userType !== "CUSTOMER") {
    return NextResponse.json({ error: "Customer sign-in required." }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { customerId: session.userId },
    include: {
      product: {
        select: { id: true, slug: true, name: true, price: true, stock: true, isActive: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(items
    .filter((item) => item.product.isActive)
    .map((item) => ({
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      stock: item.product.stock,
    })), { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.userType !== "CUSTOMER") {
    return NextResponse.json({ error: "Customer sign-in required." }, { status: 401 });
  }

  const body = await request.json() as { productId?: string; action?: "add" | "set" | "remove"; quantity?: number };
  if (!body.productId || !["add", "set", "remove"].includes(body.action ?? "")) {
    return NextResponse.json({ error: "A product and cart action are required." }, { status: 400 });
  }

  if (body.action !== "remove" && (!Number.isInteger(body.quantity) || body.quantity! < 1)) {
    return NextResponse.json({ error: "Quantity must be a positive whole number." }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { id: body.productId, isActive: true },
    select: { id: true, name: true, stock: true },
  });
  if (!product) return NextResponse.json({ error: "This product is no longer available." }, { status: 404 });

  if (body.action === "remove") {
    await prisma.cartItem.deleteMany({ where: { customerId: session.userId, productId: product.id } });
    return NextResponse.json({ removed: true });
  }

  const currentItem = await prisma.cartItem.findUnique({
    where: { customerId_productId: { customerId: session.userId, productId: product.id } },
    select: { quantity: true },
  });
  const quantity = body.action === "add" ? (currentItem?.quantity ?? 0) + body.quantity! : body.quantity!;
  if (quantity > product.stock) {
    return NextResponse.json({ error: `Only ${product.stock} of ${product.name} are available.` }, { status: 409 });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: { customerId_productId: { customerId: session.userId, productId: product.id } },
    create: { customerId: session.userId, productId: product.id, quantity },
    update: { quantity },
  });
  return NextResponse.json({ productId: cartItem.productId, quantity: cartItem.quantity });
}

