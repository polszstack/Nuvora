import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  const products = await prisma.product.findMany({ where: { isActive: true, ...(session?.userType === "SELLER" ? { sellerId: session.userId } : {}) }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.userType !== "SELLER") return NextResponse.json({ error: "Seller sign-in required." }, { status: 401 });
  const form = await request.formData();
  const name = form.get("name");
  const category = form.get("category");
  const description = form.get("description");
  const price = Number(form.get("price"));
  const stock = Number(form.get("stock"));
  const image = form.get("image");
  if (typeof name !== "string" || typeof category !== "string" || typeof description !== "string" || !name.trim() || !category.trim() || !description.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    return NextResponse.json({ error: "Name, category, description, price, and stock are required." }, { status: 400 });
  }
  let imageUrl: string | undefined;
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) return NextResponse.json({ error: "Product image must be an image file." }, { status: 400 });
    if (image.size > 3 * 1024 * 1024) return NextResponse.json({ error: "Product image must be smaller than 3 MB." }, { status: 400 });
    imageUrl = `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString("base64")}`;
  }
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
  const product = await prisma.product.create({ data: { name: name.trim(), slug, category: category.trim(), description: description.trim(), price, stock, imageUrl, sellerId: session.userId } });
  return NextResponse.json(product, { status: 201 });
}
