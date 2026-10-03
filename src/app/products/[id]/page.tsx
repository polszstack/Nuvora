import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { StoreHeader } from "@/components/store-header";
import { Icon, type IconName } from "@/components/ui-icon";
import { convertUsdToPhp, formatPhpCurrency, FREE_SHIPPING_THRESHOLD_USD } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

const categoryIcons: Record<string, IconName> = { Workspace: "desk", Wellness: "sun", Audio: "headphones", Travel: "bag" };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }], isActive: true },
  });
  if (!product) notFound();
  const priceInPhp = convertUsdToPhp(Number(product.price));

  return <main className="storefront">
    <StoreHeader />
    <section className="site-container product-detail-section">
      <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/products">The collection</Link><span aria-hidden="true">/</span><Link href={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 767px) 100vw, 55vw" className="object-cover" /> : <div className="product-placeholder"><span className="placeholder-orbit" /><Icon name={categoryIcons[product.category] || "box"} size={96} strokeWidth={.8} /><span className="placeholder-label">Image coming soon</span></div>}
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPhpCurrency(priceInPhp)}</p>
          <p className="detail-description">{product.description}</p>
          <p className={`stock-status ${product.stock > 0 ? "" : "stock-empty"}`}><span />{product.stock > 0 ? `In stock · ${product.stock} available` : "Currently out of stock"}</p>
          <div className="detail-cart">{product.stock > 0 ? <AddToCart product={{ id: product.id, slug: product.slug, name: product.name, price: priceInPhp, quantity: 1, stock: product.stock }} /> : <button disabled className="button-primary w-full opacity-50">Out of stock</button>}</div>
          <div className="detail-shipping"><Icon name="box" size={19} /><p>Free shipping on orders over <strong>{formatPhpCurrency(convertUsdToPhp(FREE_SHIPPING_THRESHOLD_USD))}</strong></p></div>
          <details className="product-disclosure"><summary>The Nuvora standard <span aria-hidden="true">+</span></summary><p>Every piece in our collection is chosen with everyday living in mind. Thoughtful objects, independent makers, and a little more intention.</p></details>
          <Link href="/products" className="text-link mt-7"><Icon name="arrow" className="rotate-180" size={17} /> Back to the collection</Link>
        </div>
      </div>
    </section>
  </main>;
}
