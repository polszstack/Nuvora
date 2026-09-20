"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

export function CartBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(readCart().reduce((total, item) => total + item.quantity, 0));
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);
  return <Link href="/cart" aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`} title="Cart" className="relative flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-[#52615b] transition hover:border-[#dfe5e0] hover:bg-white hover:text-[#e58d61]">
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h2l1.5 10h9.8L20 8H7" /><circle cx="10" cy="19" r="1.2" /><circle cx="17" cy="19" r="1.2" /></svg>
    <span className="hidden sm:inline">Cart</span>
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e58d61] px-1 text-[10px] font-bold text-white">{count}</span>
  </Link>;
}
