import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { convertUsdToPhp, formatPhpCurrency } from "@/lib/currency";
import { Icon, type IconName } from "@/components/ui-icon";

const categoryIcons: Record<string, IconName> = { Workspace: "desk", Wellness: "sun", Audio: "headphones", Travel: "bag" };

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.id}`} className={`product-image ${product.color || "bg-[#e9f0ec]"}`} aria-label={`View ${product.name}`}>
        {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill unoptimized sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className="object-cover" /> :
          <div className="product-placeholder"><span className="placeholder-orbit" /><Icon name={categoryIcons[product.category] || "box"} size={76} strokeWidth={0.8} /><span className="placeholder-label">{product.category}</span></div>}
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className="product-open"><Icon name="arrow" size={18} /></span>
      </Link>
      <div className="product-meta"><span>{product.category}</span><span className="product-dot" aria-hidden="true" /></div>
      <div className="product-title-row"><h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3><p>{formatPhpCurrency(convertUsdToPhp(product.price))}</p></div>
      <p className="product-description">{product.description}</p>
    </article>
  );
}
