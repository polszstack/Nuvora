import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import { signOut } from "@/app/account/actions";
import { getSession } from "@/lib/auth";
import { convertUsdToPhp, formatPhpCurrency } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

export default function AdminPage() {
  const session = getSession();
  return <AdminContent sessionPromise={session} />;
}

async function AdminContent({ sessionPromise }: { sessionPromise: ReturnType<typeof getSession> }) {
  const session = await sessionPromise;
  if (!session || session.userType !== "SELLER") redirect("/account/seller");

  const seller = await prisma.seller.findUnique({
    where: { id: session.userId },
    include: { products: { orderBy: { createdAt: "desc" } } },
  });
  if (!seller) redirect("/account/seller/signin");

  const inventory = seller.products.reduce((total, product) => total + product.stock, 0);

  return (
    <main className="min-h-screen bg-[#f4f6f3] text-[#1e2a27]">
      <AdminSidebar active="overview" />
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:ml-64 md:px-8 lg:px-12">
        <div className="mb-8 grid gap-4 sm:mb-10 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-[#8c9891]">Seller dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Welcome, {seller.name}
            </h1>
          </div>
          <div className="grid gap-3 sm:flex sm:items-center">
            <Link href="/account/seller/profile" className="rounded-full border border-[#dce3de] bg-white px-5 py-2.5 text-center text-sm font-semibold hover:border-[#e58d61]">
              Shop profile
            </Link>
            <form action={signOut}>
              <button className="w-full rounded-full border border-[#dce3de] bg-white px-4 py-2.5 text-sm font-semibold text-[#77817e] hover:text-[#e58d61] sm:w-auto">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Listed products" value={String(seller.products.length)} change="Live catalog" />
          <Stat label="Inventory units" value={String(inventory)} change="Across products" />
          <Stat label="Low stock" value={String(seller.products.filter((product) => product.stock < 5).length)} change="Needs attention" />
        </div>

        <div id="products" className="mt-8 overflow-hidden rounded-2xl border border-[#e0e6e1] bg-white">
          <div className="grid gap-4 border-b border-[#e9eeea] p-4 sm:flex sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="font-semibold">Your products</h2>
              <p className="mt-1 text-sm leading-6 text-[#8c9891]">Add products and monitor inventory.</p>
            </div>
            <AdminProductForm />
          </div>
          <div className="divide-y divide-[#e9eeea]">
            {seller.products.length === 0 ? (
              <p className="p-6 text-sm text-[#77817e]">Your catalog is empty. Add your first product above.</p>
            ) : (
              seller.products.map((product) => (
                <div key={product.id} className="grid gap-3 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{product.name}</p>
                    <p className="text-xs text-[#8c9891]">{product.category}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="font-semibold">{formatPhpCurrency(convertUsdToPhp(Number(product.price)))}</span>
                    <span className={product.stock < 5 ? "text-sm font-semibold text-[#c66d4c]" : "text-sm text-[#8c9891]"}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminSidebar({ active }: { active: "overview" | "products" }) {
  return (
    <aside className="border-b border-[#e0e6e1] bg-white p-4 md:fixed md:h-screen md:w-64 md:border-b-0 md:border-r md:p-8">
      <Link href="/" className="text-xl font-bold tracking-tight">nuvora<span className="text-[#e58d61]">.</span></Link>
      <p className="mb-4 mt-2 text-xs text-[#93a098] md:mb-10">Seller workspace</p>
      <nav className="flex gap-2 overflow-x-auto text-sm md:block md:space-y-2 md:overflow-visible">
        <Link href="/admin" className={`block rounded-xl px-4 py-3 ${active === "overview" ? "bg-[#e9f0ec] font-semibold" : "text-[#718079] hover:bg-[#f4f6f3]"}`}>
          Overview
        </Link>
        <Link href="/admin/products" className={`block rounded-xl px-4 py-3 ${active === "products" ? "bg-[#e9f0ec] font-semibold" : "text-[#718079] hover:bg-[#f4f6f3]"}`}>
          Products
        </Link>
        <Link href="/account/seller/profile" className="block rounded-xl px-4 py-3 text-[#718079] hover:bg-[#f4f6f3]">
          Shop profile
        </Link>
      </nav>
    </aside>
  );
}

function Stat({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-2xl border border-[#e0e6e1] bg-white p-5 sm:p-6">
      <p className="text-sm text-[#8c9891]">{label}</p>
      <div className="mt-3 grid gap-3 sm:flex sm:items-end sm:justify-between">
        <strong className="text-3xl tracking-tight">{value}</strong>
        <span className="w-fit rounded-full bg-[#e9f0ec] px-2.5 py-1 text-xs font-semibold text-[#557367]">{change}</span>
      </div>
    </div>
  );
}
