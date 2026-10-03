import { ProductCatalog } from "@/components/product-catalog";
import { StoreHeader } from "@/components/store-header";
import { Icon } from "@/components/ui-icon";
import { products } from "@/lib/products";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const initialCategory = typeof params.category === "string" ? params.category : "All products";
  const databaseProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { seller: { select: { name: true, shopName: true, isActive: true } } },
  });
  const catalog = databaseProducts.length > 0
    ? databaseProducts.map((product) => ({
        id: product.id, name: product.name, category: product.category,
        price: Number(product.price), description: product.description,
        imageUrl: product.imageUrl, color: "bg-[#e9f0ec]",
        seller: product.seller?.isActive ? { name: product.seller.name, shopName: product.seller.shopName } : null,
      }))
    : products;

  return (
    <main className="storefront">
      <StoreHeader />
      <section className="collection-intro">
        <div className="site-container collection-intro-inner">
          <div><p className="eyebrow">The Nuvora collection</p><h1>Objects with <em>intention.</em></h1><p>A considered edit for your home, your routines, and the moments in between.</p></div>
          <div className="collection-seal" aria-hidden="true"><Icon name="leaf" size={35} /><span>LESS, BUT BETTER</span></div>
        </div>
      </section>
      <section className="site-container catalog-section" aria-label="Shop products"><ProductCatalog key={initialCategory} products={catalog} initialCategory={initialCategory} /></section>
    </main>
  );
}
