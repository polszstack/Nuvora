"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CartBadge } from "@/components/cart-badge";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/account", label: "Account" },
];

export function StoreHeader() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"CUSTOMER" | "SELLER" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((response) => response.json() as Promise<{ authenticated: boolean; userType: "CUSTOMER" | "SELLER" | null }>)
      .then((result) => {
        if (active) {
          setAuthenticated(result.authenticated);
          setUserType(result.userType);
        }
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const profileHref = userType === "SELLER" ? "/account/seller/profile" : "/account/customer/profile";

  return (
    <header className="relative z-30 border-b border-[#edf1ee] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Nuvora home" className="flex items-center shrink-0">
          <Image src="/images/Gemini_Generated_Image_sjit65sjit65sjit.jpg" alt="Nuvora" width={126} height={32} priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#68766f] md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#e58d61]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {authenticated && (
            <>
              <Link
                href={profileHref}
                aria-label="Open your profile"
                title="Profile"
                className="hidden items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-[#52615b] transition hover:border-[#dfe5e0] hover:bg-white hover:text-[#e58d61] sm:flex"
              >
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.7-3.4 3.1-5.2 7-5.2s6.3 1.8 7 5.2" />
                </svg>
                <span>Profile</span>
              </Link>
              {userType !== "SELLER" && <CartBadge />}
            </>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e0e7e3] bg-white text-[#1e2a27] shadow-sm transition hover:border-[#e58d61] md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={mobileMenuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#edf1ee] bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-[#4d5d57] transition hover:bg-[#f7f3ee] hover:text-[#e58d61]"
              >
                {link.label}
              </Link>
            ))}

            {authenticated ? (
              <>
                <Link
                  href={profileHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-[#4d5d57] transition hover:bg-[#f7f3ee] hover:text-[#e58d61]"
                >
                  Profile
                </Link>
                {userType !== "SELLER" && (
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-[#4d5d57] transition hover:bg-[#f7f3ee] hover:text-[#e58d61]"
                  >
                    Cart
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl bg-[#1e2a27] px-3 py-3 text-base font-semibold text-white transition hover:bg-[#e58d61]"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
