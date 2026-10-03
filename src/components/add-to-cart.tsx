"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CART_KEY, readCart, type CartItem } from "@/lib/cart";

export function AddToCart({ product }: { product: CartItem }) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  async function add() {
    const response = await fetch("/api/auth/session");
    const session = await response.json() as { authenticated: boolean };
    if (!session.authenticated) {
      router.push("/account/customer");
      return;
    }

    const stock = product.stock ?? 0;
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    const currentQuantity = existing?.quantity ?? 0;
    const nextQuantity = currentQuantity + 1;
    if (stock > 0 && nextQuantity > stock) {
      return;
    }

    const updated = existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: nextQuantity } : item)
      : [...cart, { ...product, quantity: 1 }];
    window.localStorage.setItem(CART_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
  }

  return (
    <button
      onClick={add}
      disabled={Boolean(product.stock && product.stock <= 0)}
      className="w-full rounded-full bg-[#1e2a27] px-7 py-4 text-sm font-semibold text-white hover:bg-[#e58d61] disabled:cursor-not-allowed disabled:bg-[#cbd3cf]"
    >
      {added ? "Added to cart" : <>Add to cart <span className="ml-3">+</span></>}
    </button>
  );
}
