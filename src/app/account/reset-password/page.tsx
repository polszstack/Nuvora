import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { StoreHeader } from "@/components/store-header";
import { resetPassword } from "../actions";

export default function ResetPasswordPage() {
  return <main className="account-page min-h-screen text-[#1e2a27]">
    <StoreHeader />
    <section className="mx-auto max-w-md px-6 pb-24 pt-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e58d61]">Account recovery</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Reset your password.</h1>
      <p className="mt-4 text-[#77817e]">Enter your customer or seller email. We’ll send a link to choose a new password.</p>
      <AuthForm action={resetPassword} className="mt-10 rounded-2xl border border-[#e4e8e4] bg-white p-7 text-left shadow-sm">
        <label htmlFor="reset-email" className="text-xs font-bold uppercase tracking-wider text-[#77817e]">Email address</label>
        <input id="reset-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-[#dfe5e0] px-4 py-3 outline-none focus:border-[#e58d61]" />
        <button type="submit" className="mt-5 w-full rounded-full bg-[#1e2a27] py-3.5 text-sm font-semibold text-white hover:bg-[#e58d61]">Send reset link</button>
      </AuthForm>
      <div className="mt-8 flex justify-center gap-6 text-sm font-semibold text-[#e58d61]">
        <Link href="/account/customer/signin">Customer sign in</Link>
        <Link href="/account/seller/signin">Seller sign in</Link>
      </div>
    </section>
  </main>;
}
