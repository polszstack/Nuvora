"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CartBadge } from "@/components/cart-badge";

export function StoreHeader() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"CUSTOMER" | "SELLER" | null>(null);

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

  return <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
    <Link href="/" aria-label="Nuvora home" className="flex items-center">
      <Image src="/images/Gemini_Generated_Image_sjit65sjit65sjit.jpg" alt="Nuvora" width={126} height={32} priority />
    </Link>
    <nav className="hidden items-center gap-8 text-sm font-medium text-[#68766f] md:flex"><Link href="/products" className="hover:text-[#e58d61]">Shop</Link><Link href="/about" className="hover:text-[#e58d61]">Our story</Link><Link href="#journal" className="hover:text-[#e58d61]">Journal</Link></nav>
    {authenticated && <div className="flex items-center gap-2">
      <Link href={userType === "SELLER" ? "/account/seller/profile" : "/account/customer/profile"} aria-label="Open your profile" title="Profile" className="flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-[#52615b] transition hover:border-[#dfe5e0] hover:bg-white hover:text-[#e58d61]">
        <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.4 3.1-5.2 7-5.2s6.3 1.8 7 5.2" /></svg>
        <span className="hidden sm:inline">Profile</span>
      </Link>
      {userType !== "SELLER" && <CartBadge />}
    </div>}
  </header>;
}
