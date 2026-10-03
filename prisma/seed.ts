import { PrismaClient } from "../node_modules/.prisma/nuvora-client";

const prisma = new PrismaClient();

async function main() {
  const seller = await prisma.seller.upsert({
    where: { email: "seller@nuvora.test" },
    update: {},
    create: {
      email: "seller@nuvora.test",
      name: "Alex Rivera",
      shopName: "Nuvora Studio",
      phone: "+1 555 0100",
    },
  });

  const products = [
    { name: "Linen Journal", slug: "linen-journal", category: "Workspace", description: "A quiet place for your best thoughts.", price: 28, stock: 24 },
    { name: "Arc Desk Lamp", slug: "arc-desk-lamp", category: "Workspace", description: "Warm, focused light for late ideas.", price: 119, stock: 12 },
    { name: "Cloud Ceramic Mug", slug: "cloud-ceramic-mug", category: "Wellness", description: "Hand-thrown, perfectly imperfect.", price: 34, stock: 40 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { sellerId: seller.id },
      create: { ...product, sellerId: seller.id },
    });
  }
}

main().finally(() => prisma.$disconnect());
