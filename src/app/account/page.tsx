import Link from "next/link";
import { StoreHeader } from "@/components/store-header";
import { Icon } from "@/components/ui-icon";

export default function AccountPage() {
  return (
    <main className="account-page">
      <StoreHeader />
      <section className="account-chooser">
        <p className="eyebrow">Your little corner of Nuvora</p>
        <h1>Good to have you here.</h1>
        <p>Discover your next everyday favorite, or share something you made.<br />Choose your space to get started.</p>
        <div className="account-choices">
          <div className="account-choice"><Icon name="bag" size={32} /><h2>Here to discover.</h2><p>Shop considered goods, track your orders, and make yourself at home.</p><Link href="/account/customer/signin" className="button-primary">Customer sign in <Icon name="arrow" size={18} /></Link><Link href="/account/customer" className="text-link">New here? Create an account <Icon name="arrow" size={15} /></Link></div>
          <div className="account-choice"><Icon name="leaf" size={32} /><h2>Here to create.</h2><p>A home for your products, your craft, and the story behind every piece.</p><Link href="/account/seller/signin" className="button-secondary">Seller sign in <Icon name="arrow" size={18} /></Link><Link href="/account/seller" className="text-link">Become a Nuvora seller <Icon name="arrow" size={15} /></Link></div>
        </div>
      </section>
    </main>
  );
}
