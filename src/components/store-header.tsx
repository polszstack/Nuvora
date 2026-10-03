"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartBadge } from "@/components/cart-badge";
import { Icon } from "@/components/ui-icon";
import { convertUsdToPhp, formatPhpCurrency, FREE_SHIPPING_THRESHOLD_USD } from "@/lib/currency";

const navLinks = [
  { href: "/products", label: "The collection" },
  { href: "/about", label: "Our story" },
  { href: "/account/seller", label: "For makers" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"CUSTOMER" | "SELLER" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((response) => response.json() as Promise<{ authenticated: boolean; userType: "CUSTOMER" | "SELLER" | null }>)
      .then((result) => {
        if (active) { setAuthenticated(result.authenticated); setUserType(result.userType); }
      })
      .catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const profileHref = userType === "SELLER" ? "/account/seller/profile" : "/account/customer/profile";
  const accountHref = authenticated ? profileHref : "/account";

  return (
    <>
      <div className="announcement"><Icon name="box" size={14} /><span>A little something, thoughtfully delivered. <strong>Free shipping over {formatPhpCurrency(convertUsdToPhp(FREE_SHIPPING_THRESHOLD_USD))}</strong></span></div>
      <header className="store-header">
        <div className="site-container header-inner">
          <Link href="/" aria-label="Nuvora home" className="wordmark">nuvora<span>.</span></Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href || (link.href === "/products" && pathname.startsWith("/products/")) ? "page" : undefined}>{link.label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link href="/products#catalog-search" className="icon-button header-search" aria-label="Search the collection"><Icon name="search" /></Link>
            <Link href={accountHref} className="icon-button" aria-label={authenticated ? "Your profile" : "Sign in"}><Icon name="user" /></Link>
            {authenticated && userType !== "SELLER" && <CartBadge />}
            <button ref={menuButton} type="button" className="icon-button mobile-menu-button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Icon name={mobileMenuOpen ? "close" : "menu"} /></button>
          </div>
        </div>
        {mobileMenuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{link.label}<Icon name="arrow" size={17} /></Link>)}
          <Link href={accountHref} onClick={() => setMobileMenuOpen(false)}>{authenticated ? "Your profile" : "Sign in / Create account"}<Icon name="user" size={17} /></Link>
          {authenticated && userType !== "SELLER" && <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>Your cart<Icon name="bag" size={17} /></Link>}
        </nav>}
      </header>
    </>
  );
}
