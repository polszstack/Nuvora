import Image from "next/image";
import Link from "next/link";
import { StoreHeader } from "@/components/store-header";
import { Icon, type IconName } from "@/components/ui-icon";

const values: { title: string; copy: string; icon: IconName }[] = [
  { title: "Useful by nature.", copy: "Things that fit into your real life, bringing a little ease to your daily routines.", icon: "sun" },
  { title: "Considered in every detail.", copy: "Honest materials, thoughtful design, and the small details that make a piece worth keeping.", icon: "leaf" },
  { title: "A place for independent makers.", copy: "People who care about their craft, with space to tell the story behind what they make.", icon: "box" },
];

export default function AboutPage() {
  return <main className="storefront">
    <StoreHeader />
    <section className="site-container about-hero">
      <div><p className="eyebrow"><span className="eyebrow-line" /> The story behind the edit</p><h1>Less, but <em>better.</em><br />Always.</h1><p>Nuvora began with a simple idea: the things we live with should feel as considered as the way we want to live.</p><Link href="/products" className="button-primary">Discover the collection <Icon name="arrow" size={18} /></Link></div>
      <div className="about-image"><Image src="/images/everyday-edit.png" alt="Warm afternoon light on a collection of ceramics, linen, and everyday essentials" fill preload sizes="(max-width: 767px) 100vw, 55vw" className="object-cover" /></div>
    </section>
    <section className="about-manifesto"><div className="site-container"><p className="eyebrow">Room for what matters</p><h2>Everyday things.<br />A more intentional life.</h2><div><p>We work with independent makers who care about materials, process, and the small details that make an object worth keeping. Every piece is chosen to be useful, beautiful, and made to stay with you.</p><p>There is no endless scroll here and no pressure to buy more. Just a slower, more thoughtful edit of everyday goods for the spaces and rituals that matter.</p></div></div></section>
    <section className="site-container section-space"><div className="section-heading"><div><p className="eyebrow">The Nuvora standard</p><h2>Good things start with care.</h2></div></div><div className="about-values">{values.map((value) => <article key={value.title}><Icon name={value.icon} size={30} /><h3>{value.title}</h3><p>{value.copy}</p></article>)}</div><Link href="/products" className="text-link mt-8">Find your everyday favorites <Icon name="arrow" size={18} /></Link></section>
  </main>;
}
