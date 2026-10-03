import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json() as { email?: string; items?: { slug: string; quantity: number }[] };
  const session = await getSession();
  if (session && session.userType !== "CUSTOMER") return NextResponse.json({ error: "A customer account is required to place this order." }, { status: 403 });
  if ((!session && !body.email) || !Array.isArray(body.items) || body.items.length === 0) return NextResponse.json({ error: "Email and at least one item are required." }, { status: 400 });
  const customerAccount = session ? await prisma.customer.findUnique({ where: { id: session.userId }, select: { id: true } }) : null;
  if (session && !customerAccount) return NextResponse.json({ error: "The signed-in customer account could not be found." }, { status: 401 });
  const slugs = body.items.map((item) => item.slug);
  const products = await prisma.product.findMany({ where: { slug: { in: slugs }, isActive: true } });
  const productMap = new Map(products.map((product) => [product.slug, product]));
  const lineItems = body.items.map((item) => ({ product: productMap.get(item.slug), quantity: item.quantity })).filter((item) => item.product && Number.isInteger(item.quantity) && item.quantity > 0);
  if (lineItems.length !== body.items.length) return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
  for (const item of lineItems) if (item.product!.stock < item.quantity) return NextResponse.json({ error: `${item.product!.name} does not have enough stock.` }, { status: 409 });
  const total = lineItems.reduce((sum, item) => sum + Number(item.product!.price) * item.quantity, 0);
  const order = await prisma.$transaction(async (transaction) => {
    const customer = customerAccount ?? await transaction.customer.upsert({ where: { email: body.email!.toLowerCase() }, update: {}, create: { email: body.email!.toLowerCase() } });
    const created = await transaction.order.create({ data: { customerId: customer.id, total, items: { create: lineItems.map((item) => ({ productId: item.product!.id, quantity: item.quantity, unitPrice: item.product!.price })) } } });
    for (const item of lineItems) await transaction.product.update({ where: { id: item.product!.id }, data: { stock: { decrement: item.quantity } } });
    if (customerAccount) await transaction.cartItem.deleteMany({ where: { customerId: customer.id } });
    return created;
  });
  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
