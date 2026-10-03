"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui-icon";

export function StoreFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="store-footer">
      <div className="site-container footer-main">
        <div>
          <Link href="/" className="wordmark" aria-label="Nuvora home">nuvora<span>.</span></Link>
          <p>Thoughtful things.<br />A little more everyday joy.</p>
        </div>
        <div><h2>Explore</h2><Link href="/products">The collection</Link><Link href="/products?category=Workspace">For your workspace</Link><Link href="/products?category=Wellness">Everyday rituals</Link></div>
        <div><h2>Nuvora</h2><Link href="/about">Our story</Link><Link href="/account/seller">Become a seller</Link><Link href="/account">Your account</Link></div>
        <div className="footer-note"><Icon name="leaf" size={26} /><p>Fewer, better things.<br />Chosen with intention.</p><Link href="/about" className="text-link">Meet our philosophy <Icon name="arrow" size={17} /></Link></div>
      </div>
      <div className="site-container footer-bottom"><span>© {new Date().getFullYear()} Nuvora. Made for living.</span><span>Considered goods. Independent makers.</span><Link href="/admin">Admin portal</Link></div>
    </footer>
  );
}
