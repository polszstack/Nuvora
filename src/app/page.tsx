import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { ScrollRevealObserver } from "@/components/scroll-reveal-observer";
import { StoreHeader } from "@/components/store-header";
import { Icon, type IconName } from "@/components/ui-icon";
import { products } from "@/lib/products";
import { prisma } from "@/lib/prisma";

const categories: { name: string; icon: IconName; note: string }[] = [
  { name: "Workspace", icon: "desk", note: "Make room for focus" },
  { name: "Wellness", icon: "sun", note: "Your everyday rituals" },
  { name: "Travel", icon: "bag", note: "Good things to go" },
  { name: "Audio", icon: "headphones", note: "Find your quiet" },
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
  const featuredProducts = (sellerProducts.length > 0
    ? sellerProducts
    : products.filter((product) => product.id !== "linen-journal")
  ).slice(0, 4);

  return (
    <main className="storefront">
      <StoreHeader />
      <ScrollRevealObserver />
      <section className="site-container home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> A considered way of living</p>
          <h1>Good things.<br />For a <em>slower</em><br className="hero-break" /> everyday.</h1>
          <p className="hero-description">Thoughtful objects for the spaces you love and the rituals that make them yours. Less noise. More meaning.</p>
          <div className="hero-actions"><Link href="/products" className="button-primary">Explore the collection <Icon name="arrow" size={18} /></Link><Link href="/about" className="text-link">Our story <span aria-hidden="true">↗</span></Link></div>
          <div className="hero-footnote"><span className="small-leaf"><Icon name="leaf" size={18} /></span><span>Everyday essentials. Chosen with intention.</span></div>
        </div>
        <div className="hero-visual">
          <Image src="/images/everyday-edit.png" alt="Sunlit ceramics, a linen journal, and an olive desk lamp on a warm stone table" fill preload sizes="(max-width: 767px) 100vw, 58vw" className="hero-image" />
          <div className="hero-image-label"><span className="status-dot" /> THE EVERYDAY EDIT</div>
          <Link href="/products" className="hero-image-caption"><span><small>A little less ordinary</small><strong>Make yourself at home.</strong></span><span className="caption-arrow"><Icon name="arrow" /></span></Link>
        </div>
      </section>

      <section className="values-strip" aria-label="Our approach">
        <div className="site-container values-inner">
          <span><Icon name="leaf" /> Thoughtfully selected</span><span><Icon name="sun" /> Made for everyday living</span><span><Icon name="box" /> Packed with care</span>
          <Link href="/about">The Nuvora standard <Icon name="arrow" size={16} /></Link>
        </div>
      </section>

      <section className="site-container section-space" id="shop">
        <div className="section-heading scroll-reveal"><div><p className="eyebrow">Find your everyday</p><h2>A place for every ritual.</h2></div><p>Small upgrades. A world of difference.</p></div>
        <div className="category-grid">
          {categories.map((category, index) => <Link key={category.name} href={`/products?category=${category.name}`} className={`category-card category-tone-${index}`}><span className="category-icon"><Icon name={category.icon} size={29} /></span><span><strong>{category.name}</strong><small>{category.note}</small></span><Icon name="arrow" size={18} /></Link>)}
        </div>
      </section>

      <section className="site-container featured-section">
        <div className="section-heading scroll-reveal"><div><p className="eyebrow">The considered collection</p><h2>Meet your new favorites.</h2></div><Link href="/products" className="text-link">Shop all pieces <Icon name="arrow" size={18} /></Link></div>
        <div className="product-grid reveal-grid">{featuredProducts.map((product) => <div key={product.id} className="scroll-reveal"><ProductCard product={product} /></div>)}</div>
        <Link href="/products" className="button-secondary mobile-shop-link">Explore all products <Icon name="arrow" size={18} /></Link>
      </section>

      <section id="story" className="site-container story-section">
        <div className="story-panel">
          <div className="story-image"><Image src="/images/everyday-edit.png" alt="Natural linen, warm ceramics, and thoughtful everyday details" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover object-left" /><span className="image-note">THE BEAUTY IS IN THE EVERYDAY</span></div>
          <div className="story-copy scroll-reveal"><p className="eyebrow">The Nuvora philosophy</p><h2>Less, but better.<br /><em>Always.</em></h2><p>We believe the best things are the ones you reach for every day. Beautiful in their simplicity. Useful by nature. Worth making room for.</p><p>Our edit brings together independent makers and considered objects, each with a place in a life well lived.</p><Link href="/about" className="text-link">A little more about us <Icon name="arrow" size={18} /></Link></div>
        </div>
      </section>

      <section className="site-container section-space community-section">
        <div className="section-heading scroll-reveal"><div><p className="eyebrow">Make yourself part of it</p><h2>Good company. Better things.</h2></div><p>A little space for buyers and makers alike.</p></div>
        <div className="community-grid">
          <Link href="/account/customer" className="community-card"><span className="community-icon"><Icon name="bag" size={25} /></span><div><p className="eyebrow">For the everyday explorer</p><h3>Find things that feel like you.</h3><p>Create a customer account to shop the collection and keep track of your orders.</p><span className="text-link">Create customer account <Icon name="arrow" size={18} /></span></div></Link>
          <Link href="/account/seller" className="community-card maker-card"><span className="community-icon"><Icon name="leaf" size={25} /></span><div><p className="eyebrow">For the thoughtful maker</p><h3>Your craft. A place to grow.</h3><p>Open your own space, share your story, and bring your products to the collection.</p><span className="text-link">Open a seller space <Icon name="arrow" size={18} /></span></div></Link>
        </div>
      </section>
    </main>
  );
}
