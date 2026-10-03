"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CART_KEY, readCart, type CartItem } from "@/lib/cart";

export function AddToCart({ product }: { product: CartItem }) {
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function add() {
    if (isAdding) return;
    setIsAdding(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json() as { authenticated: boolean; userType: "CUSTOMER" | "SELLER" | null };
      if (!session.authenticated || session.userType !== "CUSTOMER") {
        router.push("/account/customer");
        return;
      }

      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, action: "add", quantity: 1 }),
      });
      const result = await cartResponse.json() as { error?: string };
      if (!cartResponse.ok) {
        setMessage(result.error ?? "This item could not be added to your cart.");
        return;
      }

      const cart = readCart();
      const existing = cart.find((item) => item.id === product.id);
      const updated = existing
        ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...cart, { ...product, quantity: 1 }];
      window.localStorage.setItem(CART_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated"));
      setAdded(true);
    } catch {
      setMessage("We couldn't update your cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <>
      <button
        onClick={add}
        disabled={isAdding || Boolean(product.stock && product.stock <= 0)}
        className="w-full rounded-full bg-[#1e2a27] px-7 py-4 text-sm font-semibold text-white hover:bg-[#e58d61] disabled:cursor-not-allowed disabled:bg-[#cbd3cf]"
      >
        {isAdding ? "Adding…" : added ? "Added to cart ✓" : <>Add to cart <span className="ml-3">+</span></>}
      </button>
      <p aria-live="polite" className={`mt-2 text-center text-xs ${message ? "text-[#9c614b]" : "sr-only"}`}>{message}</p>
    </>
  );
}

