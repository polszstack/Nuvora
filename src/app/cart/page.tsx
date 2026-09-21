"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { StoreHeader } from "@/components/store-header";
import { CART_KEY, getCartSnapshot, getServerCartSnapshot, subscribeToCart, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const storedItems = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const [items, setItems] = useState<CartItem[]>([]);
  const cartItems = storedItems.length === items.length && storedItems.every((item, index) => item.id === items[index]?.id && item.quantity === items[index]?.quantity) ? items : storedItems;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function update(id: string, quantity: number) {
    const updated = cartItems.map((item) => item.id === id ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
    setItems(updated);
    window.localStorage.setItem(CART_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Placing order...");
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, items: items.map((item) => ({ slug: item.id, quantity: item.quantity })) }) });
    const result = await response.json() as { error?: string; orderId?: string };
    if (!response.ok) { setMessage(result.error ?? "Unable to place order."); return; }
    setItems([]);
    window.localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("cart-updated"));
    setMessage(`Order ${result.orderId} placed. Thank you!`);
  }

  return <main className="min-h-screen bg-white"><StoreHeader /><section className="mx-auto max-w-5xl px-6 pb-24 pt-10 lg:px-10"><Link href="/products" className="text-sm text-[#8b9791] hover:text-[#e58d61]">← Continue shopping</Link><h1 className="mt-8 text-5xl font-semibold tracking-[-0.05em]">Your cart.</h1>{cartItems.length === 0 ? <div className="mt-12 rounded-2xl border border-[#e4e8e4] bg-white p-12 text-center"><p className="text-lg text-[#77817e]">{message || "Your cart is waiting for something good."}</p><Link href="/products" className="mt-6 inline-block rounded-full bg-[#1e2a27] px-6 py-3 text-sm font-semibold text-white">Browse collection</Link></div> : <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]"><div className="divide-y divide-[#e4e8e4] rounded-2xl border border-[#e4e8e4] bg-white px-6">{cartItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-6"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-[#8b9791]">${item.price} each</p></div><div className="flex items-center gap-4"><select aria-label={`Quantity for ${item.name}`} value={item.quantity} onChange={(event) => update(item.id, Number(event.target.value))} className="rounded-lg border border-[#dfe5e0] px-3 py-2 text-sm">{[1, 2, 3, 4, 5].map((quantity) => <option key={quantity}>{quantity}</option>)}</select><strong>${(item.price * item.quantity).toFixed(2)}</strong><button type="button" aria-label={`Remove ${item.name} from cart`} onClick={() => update(item.id, 0)} className="rounded-full border border-[#e0e6e1] px-3 py-2 text-xs font-semibold text-[#77817e] hover:border-[#c66d4c] hover:text-[#c66d4c]">Remove</button></div></div>)}</div><form onSubmit={checkout} className="h-fit rounded-2xl border border-[#e4e8e4] bg-white p-6"><h2 className="font-semibold">Order summary</h2><div className="mt-6 flex justify-between text-sm text-[#77817e]"><span>Subtotal</span><span>${total.toFixed(2)}</span></div><div className="mt-3 flex justify-between text-sm text-[#77817e]"><span>Shipping</span><span>{total >= 75 ? "Free" : "$8.00"}</span></div><div className="my-5 border-t border-[#e4e8e4] pt-5 flex justify-between font-semibold"><span>Total</span><span>${(total + (total >= 75 ? 0 : 8)).toFixed(2)}</span></div><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email for order confirmation" className="w-full rounded-xl border border-[#dfe5e0] px-4 py-3 text-sm outline-none focus:border-[#e58d61]" /><button className="mt-4 w-full rounded-full bg-[#1e2a27] py-3.5 text-sm font-semibold text-white hover:bg-[#e58d61]">Place order</button>{message && <p className="mt-4 text-center text-xs text-[#77817e]">{message}</p>}</form></div>}</section></main>;
}
