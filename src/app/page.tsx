import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { ScrollRevealObserver } from "@/components/scroll-reveal-observer";
import { StoreHeader } from "@/components/store-header";
import { products } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { convertUsdToPhp, formatPhpCurrency, FREE_SHIPPING_THRESHOLD_USD } from "@/lib/currency";

const categories = [
  { name: "Audio", icon: "o", tone: "bg-[#e9f4ef]" },
  { name: "Workspace", icon: "#", tone: "bg-[#f4eee7]" },
  { name: "Travel", icon: "+", tone: "bg-[#e9eef7]" },
  { name: "Wellness", icon: "O", tone: "bg-[#f5eaf0]" },
];

const highlights = [
  { title: "Made to last", copy: "Built with durable materials and timeless forms that earn their spot in daily routines.", accent: "bg-[#e9f4ef]" },
  { title: "Curated with care", copy: "Every product is chosen for utility, finish, and the feeling it adds to a space.", accent: "bg-[#f4eee7]" },
  { title: "Easy to shop", copy: "Fast checkout, transparent pricing, and thoughtful support from first click to delivery.", accent: "bg-[#e9eef7]" },
];

const collections = [
  { name: "Morning rituals", stats: "12 pieces", description: "Warm textures, clean lines, and little details that make the start of the day feel intentional." },
  { name: "Desk essentials", stats: "9 pieces", description: "Quiet tools for focus, planning, and a workspace that feels more like yours." },
  { name: "Weekend carry", stats: "7 pieces", description: "Roomy, refined companions for travel, routines, and the pace you want to keep." },
];

const steps = [
  { number: "01", title: "Browse the edit", copy: "Explore thoughtfully selected everyday goods shaped for real life." },
  { number: "02", title: "Choose with confidence", copy: "See details, materials, and notes from makers before you commit." },
  { number: "03", title: "Bring it home", copy: "Check out seamlessly and enjoy a calm, well-packed delivery experience." },
];

const serviceNotes = [
  { label: "Packed with care", value: "Plastic-light wrapping and protective mailers for safer arrivals." },
  { label: "Maker-led", value: "Independent sellers can keep their voice, pricing, and product story intact." },
  { label: "Calm support", value: "Clear order updates and help from real people when you need it." },
];

const lookbook = [
  { title: "Quiet mornings", image: "/images/Gemini_Generated_Image_9dgstw9dgstw9dgs.jpg", copy: "Soft ceramics, warm light, and tools that make the first hour feel grounded." },
  { title: "Focused desks", image: "/images/Gemini_Generated_Image_mllbqomllbqomllb.jpg", copy: "A neater workspace edit for planning, deep work, and late ideas." },
];

export default async function Home() {
  const databaseProducts = await prisma.product.findMany({
    where: { isActive: true, name: { not: "Linen Journal" } },
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
  const featuredProducts = [
    ...sellerProducts,
    ...products.filter((product) => product.id !== "linen-journal" && !sellerProducts.some((sellerProduct) => sellerProduct.id === product.id)),
  ].slice(0, 4);

  return (
    <main className="min-h-screen bg-white text-[#1e2a27]">
      <StoreHeader />
      <ScrollRevealObserver />
      <section className="scroll-reveal mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pt-20">
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
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#68766f]">
            <Link href="/products" className="rounded-full border border-[#dfe5e0] px-5 py-3 transition hover:border-[#e58d61] hover:text-[#e58d61]">
              Explore collection
            </Link>
            <Link href="#story" className="rounded-full border border-transparent px-5 py-3 transition hover:bg-[#f7f3ee] hover:text-[#e58d61]">
              See the standard
            </Link>
          </div>
          <div className="mt-12 flex gap-10 border-t border-[#e6e6e0] pt-6 text-sm text-[#77817e]">
            <span><strong className="block text-xl text-[#1e2a27]">4.9/5</strong> from 2,000+ customers</span>
            <span><strong className="block text-xl text-[#1e2a27]">Free</strong> shipping over {formatPhpCurrency(convertUsdToPhp(FREE_SHIPPING_THRESHOLD_USD))}</span>
          </div>
        </div>
        <div className="relative aspect-[1408/768] w-full overflow-hidden rounded-[2rem] bg-[#dceae3]">
          <Image src="/images/Gemini_Generated_Image_ua9dkyua9dkyua9d.jpg" alt="Nuvora curated everyday goods" fill priority className="object-cover" />
          <div className="absolute left-7 top-7 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6b837a] backdrop-blur">
            New seasonal edit
          </div>
          <div className="absolute bottom-7 left-7 rounded-2xl bg-white/80 px-4 py-3 text-xs backdrop-blur">
            <span className="mb-1 block text-[#8b9992]">The daily ritual</span>
            <strong className="text-sm">Slow down. Tune in.</strong>
          </div>
          <div className="absolute bottom-7 right-7 hidden max-w-[12rem] rounded-2xl bg-[#1e2a27]/90 px-4 py-3 text-xs text-white backdrop-blur sm:block">
            <span className="mb-1 block text-white/60">Editor note</span>
            <strong className="text-sm">Built around texture, utility, and calmer rooms.</strong>
          </div>
        </div>
      </section>

      <section className="scroll-reveal border-y border-[#e8e7e2] bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9ca7a2]">Shop by mood</p>
          <div className="reveal-grid flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link key={category.name} href="#shop" className={`scroll-reveal flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm ${category.tone}`}>
                <span className="text-lg">{category.icon}</span>{category.name}<span className="text-[#98a39f]">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e8e7e2] bg-[#fbfaf7] px-6 py-10 lg:px-10">
        <div className="reveal-grid mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {serviceNotes.map((note) => (
            <div key={note.label} className="scroll-reveal rounded-2xl border border-[#e8e7e2] bg-white p-5">
              <p className="text-sm font-semibold text-[#1e2a27]">{note.label}</p>
              <p className="mt-2 text-sm leading-6 text-[#77817e]">{note.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="scroll-reveal mb-10 flex items-end justify-between">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">The edit</p><h2 className="text-4xl font-semibold">Made for now</h2></div>
          <Link href="/products" className="hidden text-sm font-semibold text-[#68766f] hover:text-[#e58d61] sm:block">View all products</Link>
        </div>
        <div className="reveal-grid grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="scroll-reveal">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="reveal-grid grid gap-5 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight.title} className={`scroll-reveal rounded-2xl p-6 ${highlight.accent}`}>
              <h3 className="text-xl font-semibold">{highlight.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#68766f]">{highlight.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fbfaf7] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="scroll-reveal mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">Curated collections</p>
            <h2 className="text-4xl font-semibold leading-tight">Shop by the way you live.</h2>
          </div>
          <div className="reveal-grid grid gap-5 md:grid-cols-3">
            {collections.map((collection) => (
              <Link key={collection.name} href="/products" className="scroll-reveal group rounded-2xl border border-[#e4e1da] bg-white p-6 transition hover:-translate-y-1 hover:border-[#e58d61] hover:shadow-sm">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9ca7a2]">{collection.stats}</span>
                <h3 className="mt-5 text-2xl font-semibold">{collection.name}</h3>
                <p className="mt-3 leading-7 text-[#6e7d75]">{collection.description}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-[#e58d61] transition group-hover:translate-x-1">Shop this edit</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-grid mx-auto grid max-w-7xl gap-5 px-6 py-20 lg:grid-cols-2 lg:px-10">
        {lookbook.map((item) => (
          <article key={item.title} className="scroll-reveal overflow-hidden rounded-[2rem] border border-[#e8e7e2] bg-white">
            <div className="relative aspect-[4/3] bg-[#e9f0ec]">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">Lookbook</p>
              <h3 className="mt-3 text-3xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#6e7d75]">{item.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="story" className="scroll-reveal mx-auto mb-20 max-w-7xl px-6 lg:px-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#e9f0ec] lg:grid-cols-2">
          <div className="flex flex-col justify-center p-10 lg:p-16"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">The Nuvora standard</p><h2 className="max-w-md text-4xl font-semibold leading-tight">Less, but better. Always.</h2><p className="mt-5 max-w-md leading-7 text-[#6e7d75]">We work with independent makers to bring you pieces that earn their place in your home. No noise, no compromise, just useful beauty.</p><Link href="/about" className="mt-8 text-sm font-semibold text-[#1e2a27]">Read our story</Link></div>
          <div className="relative aspect-square min-h-[300px] bg-[#f4efe5] lg:min-h-0">
            <Image
              src="/images/Gemini_Generated_Image_mllbqomllbqomllb.jpg"
              alt="Thoughtfully selected Nuvora goods"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid gap-10 border-y border-[#e8e7e2] py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="scroll-reveal">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">How it works</p>
            <h2 className="max-w-md text-4xl font-semibold leading-tight">A slower store, made simple.</h2>
          </div>
          <div className="reveal-grid grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="scroll-reveal rounded-2xl bg-[#fbfaf7] p-6">
                <span className="text-sm font-bold text-[#e58d61]">{step.number}</span>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#77817e]">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-reveal bg-[#1e2a27] px-6 py-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/45">For buyers and sellers</p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight">Find considered goods, or bring your own thoughtful collection to Nuvora.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/account/customer" className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[#1e2a27] transition hover:bg-[#f4eee7]">
              Start shopping
            </Link>
            <Link href="/account/seller" className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-[#e58d61] hover:text-[#e58d61]">
              Open a seller space
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e8e7e2] bg-white px-6 py-10 text-sm text-[#77817e] lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row"><span className="text-lg font-bold tracking-tight text-[#1e2a27]">nuvora<span className="text-[#e58d61]">.</span></span><span>2026 Nuvora Goods. Made for living.</span><Link href="/admin" className="font-semibold hover:text-[#e58d61]">Admin portal</Link></div>
      </footer>
    </main>
  );
}
