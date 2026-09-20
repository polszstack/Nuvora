import Link from "next/link";
import { StoreHeader } from "@/components/store-header";
import { createCustomerAccount } from "../actions";

export default function CustomerAccountPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#1e2a27]">
      <StoreHeader />
      <section className="mx-auto max-w-md px-6 pb-24 pt-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">Customer account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Create your buyer profile.</h1>
        <p className="mt-4 text-[#77817e]">Use this account to shop, track orders, and save products.</p>
        <form action={createCustomerAccount} className="mt-10 rounded-2xl border border-[#e4e8e4] bg-white p-7 text-left shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="customer-name">Full name</label>
          <input id="customer-name" name="name" type="text" placeholder="Your name" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="customer-email">Email address</label>
          <input id="customer-email" name="email" type="email" placeholder="you@example.com" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="customer-password">Password</label>
          <input id="customer-password" name="password" type="password" minLength={8} placeholder="At least 8 characters" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#77817e]" htmlFor="customer-password-confirmation">Confirm password</label>
          <input id="customer-password-confirmation" name="passwordConfirmation" type="password" minLength={8} placeholder="Re-enter your password" required className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
          <button type="submit" className="mt-5 w-full rounded-full bg-[#1e2a27] py-3.5 text-sm font-semibold text-white hover:bg-[#e58d61]">Create customer account</button>
          <p className="mt-5 text-center text-xs text-[#9aa49f]">After signup, you will go straight to the product collection.</p>
        </form>
        <Link href="/account/customer/signin" className="mt-8 inline-block text-sm font-semibold hover:text-[#e58d61]">Already have an account? Sign in →</Link>
        <Link href="/products" className="mt-8 inline-block text-sm font-semibold hover:text-[#e58d61]">Browse products</Link>
      </section>
    </main>
  );
}
