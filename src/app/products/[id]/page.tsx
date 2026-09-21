import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { StoreHeader } from "@/components/store-header";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: id }], isActive: true } });
  if (!product) notFound();
  return <main className="min-h-screen bg-white"><StoreHeader /><section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-8 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:pt-14"><div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] bg-[#e9f0ec]">{product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill unoptimized className="object-cover" /> : <div className="relative flex h-72 w-56 items-end justify-center rounded-t-[7rem] rounded-b-3xl bg-[#f6f0e6] shadow-2xl"><div className="absolute top-[-2.5rem] h-24 w-36 rounded-full bg-[#b9d5c8] shadow-inner" /><div className="mb-12 h-20 w-20 rounded-full border-[12px] border-[#d5936d] bg-[#f5c1a5]" /><span className="absolute bottom-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#718079]">nuvora</span></div>}</div><div className="flex flex-col justify-center"><Link href="/products" className="mb-10 text-sm text-[#8b9791] hover:text-[#e58d61]">← Back to collection</Link><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">{product.category}</p><h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">{product.name}</h1><p className="mt-5 text-2xl font-semibold">${Number(product.price).toFixed(2)}</p><p className="mt-6 max-w-md leading-7 text-[#77817e]">{product.description}</p><p className="mt-4 text-sm text-[#8b9791]">{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}</p><div className="mt-10 flex gap-3">{product.stock > 0 ? <AddToCart product={{ id: product.id, name: product.name, price: Number(product.price), quantity: 1 }} /> : <button disabled className="flex-1 rounded-full bg-[#cbd3cf] px-7 py-4 text-sm font-semibold text-white">Out of stock</button>}<button className="rounded-full border border-[#dfe3df] px-5 text-xl hover:border-[#e58d61]">♡</button></div><p className="mt-5 text-center text-xs text-[#8b9791]">Free shipping on orders over $75 · 30-day returns</p></div></section></main>;
}
