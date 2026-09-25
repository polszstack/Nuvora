import Link from "next/link";
import { AdminProductForm } from "@/components/admin-product-form";
import { signOut } from "@/app/account/actions";
import { getSession } from "@/lib/auth";
import { convertUsdToPhp, formatPhpCurrency } from "@/lib/currency";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const session = getSession();
  return <AdminContent sessionPromise={session} />;
}

async function AdminContent({ sessionPromise }: { sessionPromise: ReturnType<typeof getSession> }) {
  const session = await sessionPromise;
  if (!session || session.userType !== "SELLER") redirect("/account/seller");
  const seller = await prisma.seller.findUnique({ where: { id: session.userId }, include: { products: { orderBy: { createdAt: "desc" } } } });
  if (!seller) redirect("/account/seller/signin");
  const inventory = seller.products.reduce((total, product) => total + product.stock, 0);
  return <main className="min-h-screen bg-[#f4f6f3] text-[#1e2a27]"><aside className="fixed hidden h-screen w-64 border-r border-[#e0e6e1] bg-white p-8 md:block"><Link href="/" className="text-xl font-bold tracking-tight">nuvora<span className="text-[#e58d61]">.</span></Link><p className="mb-10 mt-2 text-xs text-[#93a098]">Seller workspace</p><nav className="space-y-2 text-sm"><Link href="/admin" className="block rounded-xl bg-[#e9f0ec] px-4 py-3 font-semibold">Overview</Link><Link href="/admin/products" className="block rounded-xl px-4 py-3 text-[#718079] hover:bg-[#f4f6f3]">Products</Link><Link href="/account/seller/profile" className="block rounded-xl px-4 py-3 text-[#718079] hover:bg-[#f4f6f3]">Shop profile</Link></nav></aside><section className="mx-auto max-w-6xl px-6 py-8 md:ml-64 md:px-12"><div className="mb-10 flex items-center justify-between"><div><p className="text-sm text-[#8c9891]">Seller dashboard</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome, {seller.name}</h1></div><div className="flex items-center gap-3"><Link href="/account/seller/profile" className="rounded-full border border-[#dce3de] bg-white px-5 py-2.5 text-sm font-semibold hover:border-[#e58d61]">Shop profile</Link><form action={signOut}><button className="rounded-full border border-[#dce3de] bg-white px-4 py-2.5 text-sm font-semibold text-[#77817e] hover:text-[#e58d61]">Sign out</button></form></div></div><div className="grid gap-4 sm:grid-cols-3"><Stat label="Listed products" value={String(seller.products.length)} change="Live catalog" /><Stat label="Inventory units" value={String(inventory)} change="Across products" /><Stat label="Low stock" value={String(seller.products.filter((product) => product.stock < 5).length)} change="Needs attention" /></div><div id="products" className="mt-8 overflow-hidden rounded-2xl border border-[#e0e6e1] bg-white"><div className="flex items-center justify-between border-b border-[#e9eeea] p-6"><div><h2 className="font-semibold">Your products</h2><p className="mt-1 text-sm text-[#8c9891]">Add products and monitor inventory.</p></div><AdminProductForm /></div><div className="divide-y divide-[#e9eeea]">{seller.products.length === 0 ? <p className="p-6 text-sm text-[#77817e]">Your catalog is empty. Add your first product above.</p> : seller.products.map((product) => <div key={product.id} className="flex items-center justify-between gap-4 p-5"><div><p className="font-semibold">{product.name}</p><p className="text-xs text-[#8c9891]">{product.category}</p></div><div className="flex items-center gap-6"><span className="font-semibold">{formatPhpCurrency(convertUsdToPhp(Number(product.price)))}</span><span className={product.stock < 5 ? "text-sm font-semibold text-[#c66d4c]" : "text-sm text-[#8c9891]"}>{product.stock} in stock</span></div></div>)}</div></div></section></main>;
}

function Stat({ label, value, change }: { label: string; value: string; change: string }) {
  return <div className="rounded-2xl border border-[#e0e6e1] bg-white p-6"><p className="text-sm text-[#8c9891]">{label}</p><div className="mt-3 flex items-end justify-between"><strong className="text-3xl tracking-tight">{value}</strong><span className="rounded-full bg-[#e9f0ec] px-2.5 py-1 text-xs font-semibold text-[#557367]">{change}</span></div></div>;
}
