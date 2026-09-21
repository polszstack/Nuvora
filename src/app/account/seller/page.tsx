import Link from "next/link";
import { StoreHeader } from "@/components/store-header";
import { createSellerAccount } from "../actions";

export default function SellerAccountPage() {
  return (
    <main className="min-h-screen bg-white text-[#1e2a27]">
      <StoreHeader />
      <section className="mx-auto max-w-md px-6 pb-24 pt-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">Seller account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Open your seller space.</h1>
        <p className="mt-4 text-[#77817e]">Create a shop profile so you can list products and manage orders.</p>
        <form action={createSellerAccount} className="mt-10 rounded-2xl border border-[#e4e8e4] bg-white p-7 text-left shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="seller-name">Full name</label>
          <input id="seller-name" name="name" type="text" placeholder="Your name" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="shop-name">Shop name</label>
          <input id="shop-name" name="shopName" type="text" placeholder="Your shop" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="seller-email">Email address</label>
          <input id="seller-email" name="email" type="email" placeholder="seller@example.com" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="seller-phone">Phone number</label>
          <input id="seller-phone" name="phone" type="tel" placeholder="Optional" className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="seller-password">Password</label>
          <input id="seller-password" name="password" type="password" minLength={8} placeholder="At least 8 characters" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="seller-password-confirmation">Confirm password</label>
          <input id="seller-password-confirmation" name="passwordConfirmation" type="password" minLength={8} placeholder="Re-enter your password" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <button type="submit" className="mt-5 w-full rounded-full bg-[#1e2a27] py-3.5 text-sm font-semibold text-white hover:bg-[#e58d61]">Create seller account</button>
          <p className="mt-5 text-center text-xs text-[#9aa49f]">After signup, you will go to the seller dashboard.</p>
        </form>
        <Link href="/account/seller/signin" className="mt-8 inline-block text-sm font-semibold hover:text-[#e58d61]">Already have a seller account? Sign in →</Link>
        <Link href="/admin" className="mt-8 inline-block text-sm font-semibold hover:text-[#e58d61]">Go to seller dashboard</Link>
      </section>
    </main>
  );
}
