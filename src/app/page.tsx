import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { StoreHeader } from "@/components/store-header";
import { products } from "@/lib/products";
import { prisma } from "@/lib/prisma";

const categories = [
  { name: "Audio", icon: "o", tone: "bg-[#e9f4ef]" },
  { name: "Workspace", icon: "#", tone: "bg-[#f4eee7]" },
  { name: "Travel", icon: "+", tone: "bg-[#e9eef7]" },
  { name: "Wellness", icon: "O", tone: "bg-[#f5eaf0]" },
];

export default async function Home() {
  const databaseProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  const sellerProducts = databaseProducts.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    description: product.description,
    imageUrl: product.imageUrl,
    color: "bg-[#e9f0ec]",
  }));
  const featuredProducts = [...sellerProducts, ...products.filter((product) => !sellerProducts.some((sellerProduct) => sellerProduct.id === product.id))].slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#1e2a27]">
      <StoreHeader />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pt-20">
        <div>
          <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#6b837a]">
            <span className="h-px w-8 bg-[#e58d61]" /> Curated for the everyday
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.04] text-[#1e2a27] sm:text-7xl">
            Better things for a <em className="font-serif font-normal text-[#e58d61]">slower</em> life.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#6d7975]">
            Thoughtful objects, designed well and made to stay with you. Start as a buyer or open your space as a seller.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <Link href="/account/customer" className="rounded-2xl bg-[#1e2a27] px-6 py-5 text-white transition hover:bg-[#e58d61]">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-white/65">Buy item</span>
              <strong className="mt-2 block text-xl">Create customer account</strong>
              <span className="mt-3 block text-sm text-white/75">Shop products, track orders, and save favorites.</span>
            </Link>
            <Link href="/account/seller" className="rounded-2xl border border-[#dfe5e0] bg-white px-6 py-5 transition hover:border-[#e58d61] hover:shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">Sell item</span>
              <strong className="mt-2 block text-xl">Create seller account</strong>
              <span className="mt-3 block text-sm text-[#6d7975]">Set up your shop and list products for customers.</span>
            </Link>
          </div>
          <div className="mt-12 flex gap-10 border-t border-[#e6e6e0] pt-6 text-sm text-[#77817e]">
            <span><strong className="block text-xl text-[#1e2a27]">4.9/5</strong> from 2,000+ customers</span>
            <span><strong className="block text-xl text-[#1e2a27]">Free</strong> shipping over $75</span>
          </div>
        </div>
        <div className="relative aspect-[1408/768] w-full overflow-hidden rounded-[2rem] bg-[#dceae3]">
          <Image src="/images/Gemini_Generated_Image_ua9dkyua9dkyua9d.jpg" alt="Nuvora curated everyday goods" fill priority className="object-cover" />
          <div className="absolute bottom-7 left-7 rounded-2xl bg-white/80 px-4 py-3 text-xs backdrop-blur">
            <span className="mb-1 block text-[#8b9992]">The daily ritual</span>
            <strong className="text-sm">Slow down. Tune in.</strong>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8e7e2] bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9ca7a2]">Shop by mood</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link key={category.name} href="#shop" className={`flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm ${category.tone}`}>
                <span className="text-lg">{category.icon}</span>{category.name}<span className="text-[#98a39f]">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">The edit</p><h2 className="text-4xl font-semibold">Made for now</h2></div>
          <Link href="/products" className="hidden text-sm font-semibold text-[#68766f] hover:text-[#e58d61] sm:block">View all products</Link>
        </div>
        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section id="story" className="mx-auto mb-20 max-w-7xl px-6 lg:px-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#e9f0ec] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-10 lg:p-16"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">The Nuvora standard</p><h2 className="max-w-md text-4xl font-semibold leading-tight">Less, but better. Always.</h2><p className="mt-5 max-w-md leading-7 text-[#6e7d75]">We work with independent makers to bring you pieces that earn their place in your home. No noise, no compromise, just useful beauty.</p><Link href="/about" className="mt-8 text-sm font-semibold text-[#1e2a27]">Read our story</Link></div>
          <div className="relative min-h-[300px] bg-[#bed6ca]"><div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-[28px] border-[#f1e6d5] shadow-[0_0_0_12px_#d5936d]"><div className="h-full w-full rounded-full bg-[#d5e5dd]" /></div></div>
        </div>
      </section>

      <footer className="border-t border-[#e8e7e2] bg-white px-6 py-10 text-sm text-[#77817e] lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row"><span className="text-lg font-bold tracking-tight text-[#1e2a27]">nuvora<span className="text-[#e58d61]">.</span></span><span>2026 Nuvora Goods. Made for living.</span><Link href="/admin" className="font-semibold hover:text-[#e58d61]">Admin portal</Link></div>
      </footer>
    </main>
  );
}
