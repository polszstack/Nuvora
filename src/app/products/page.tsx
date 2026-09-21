import { ProductCard } from "@/components/product-card";
import { StoreHeader } from "@/components/store-header";
import { products } from "@/lib/products";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const databaseProducts = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  const catalog = databaseProducts.length > 0 ? databaseProducts.map((product) => ({ id: product.id, name: product.name, category: product.category, price: Number(product.price), description: product.description, imageUrl: product.imageUrl, color: "bg-[#e9f0ec]" })) : products;
  return <main className="min-h-screen bg-white"><StoreHeader /><section className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10"><div className="mb-12 max-w-xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">The collection</p><h1 className="text-5xl font-semibold tracking-[-0.05em]">Objects with intention.</h1><p className="mt-5 text-lg leading-8 text-[#77817e]">A considered edit of things that make everyday rituals feel a little more special.</p></div><div className="mb-8 flex gap-3 overflow-auto pb-2 text-sm"><button className="rounded-full bg-[#1e2a27] px-5 py-2.5 font-semibold text-white">All products</button>{["Audio", "Workspace", "Travel", "Wellness"].map((category) => <button key={category} className="whitespace-nowrap rounded-full border border-[#dfe3df] px-5 py-2.5 text-[#68766f] hover:border-[#1e2a27]">{category}</button>)}</div><div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{catalog.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></main>;
}
