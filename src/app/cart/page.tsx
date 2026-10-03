"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { StoreHeader } from "@/components/store-header";
import { Icon } from "@/components/ui-icon";
import { CART_KEY, getCartSnapshot, getServerCartSnapshot, subscribeToCart, type CartItem } from "@/lib/cart";
import { convertUsdToPhp, formatPhpCurrency, FREE_SHIPPING_THRESHOLD_USD, SHIPPING_FEE_USD } from "@/lib/currency";

type CustomerAccount = { name: string | null; email: string };

function quantityOptions(stock?: number) {
  const maxQuantity = Number.isFinite(stock) && stock && stock > 0 ? stock : 1;
  return Array.from({ length: maxQuantity }, (_, index) => index + 1);
}

export default function CartPage() {
  const storedItems = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerAccount, setCustomerAccount] = useState<CustomerAccount | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/cart", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<CartItem[]>;
      })
      .then((accountItems) => {
        if (!active || !accountItems) return;
        const mergedItems = accountItems.map((item) => ({ ...item, price: convertUsdToPhp(Number(item.price)) }));
        setItems(mergedItems);
        window.localStorage.setItem(CART_KEY, JSON.stringify(mergedItems));
        window.dispatchEvent(new Event("cart-updated"));
      })
      .catch(() => undefined);

    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/customer/profile", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ customer: CustomerAccount }>;
      })
      .then((result) => {
        if (active && result) setCustomerAccount(result.customer);
      })
      .catch(() => undefined);

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (storedItems.length === 0) return;

    let active = true;
    fetch("/api/products")
      .then((response) => response.json() as Promise<Array<{ id: string; slug: string; stock: number; price: number | string }>>)
      .then((products) => {
        if (!active) return;
        const productMap = new Map(products.map((product) => [product.id, product]));
        const merged = storedItems.map((item) => {
          const product = productMap.get(item.id);
          const productStock = product?.stock ?? item.stock;
          const sanitizedQuantity = productStock && productStock > 0 ? Math.min(item.quantity, productStock) : item.quantity;
          return { ...item, price: product ? convertUsdToPhp(Number(product.price)) : item.price, stock: productStock, quantity: sanitizedQuantity };
        }).filter((item) => item.quantity > 0);
        setItems(merged);
      })
      .catch(() => {
        if (active) setItems(storedItems);
      });

    return () => {
      active = false;
    };
  }, [storedItems]);

  const cartItems = storedItems.length === items.length && storedItems.every((item, index) => item.id === items[index]?.id && item.quantity === items[index]?.quantity) ? items : storedItems;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function update(id: string, quantity: number) {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    const maxQuantity = Number.isFinite(item?.stock) && item!.stock! > 0 ? item!.stock! : 1;
    const nextQuantity = Math.max(0, Math.min(quantity, maxQuantity));
    const updated = cartItems.map((cartItem) => cartItem.id === id ? { ...cartItem, quantity: nextQuantity } : cartItem).filter((cartItem) => cartItem.quantity > 0);
    setItems(updated);
    window.localStorage.setItem(CART_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    void fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, action: nextQuantity === 0 ? "remove" : "set", quantity: nextQuantity }),
    }).then(async (response) => {
      if (response.ok) return;
      const result = await response.json() as { error?: string };
      setMessage(result.error ?? "Your cart couldn't be updated on your account.");
    }).catch(() => setMessage("Your cart couldn't be updated on your account."));
  }

  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Placing order...");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customerAccount?.email || email, items: cartItems.map((item) => ({ slug: item.slug ?? item.id, quantity: item.quantity })) }),
    });
    const result = await response.json() as { error?: string; orderId?: string };
    if (!response.ok) {
      setMessage(result.error ?? "Unable to place order.");
      return;
    }
    setItems([]);
    window.localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("cart-updated"));
    setMessage(`Order ${result.orderId} placed. Thank you!`);
  }

  const freeShippingThreshold = convertUsdToPhp(FREE_SHIPPING_THRESHOLD_USD);
  const shippingFee = convertUsdToPhp(SHIPPING_FEE_USD);
  const isFreeShipping = total >= freeShippingThreshold;

  return (
    <main className="cart-page min-h-screen">
      <StoreHeader />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-10">
        <Link href="/products" className="text-sm text-[#8b9791] hover:text-[#e58d61]">
          ← Continue shopping
        </Link>
        <p className="eyebrow mt-8">A few good things</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Your cart.</h1>

        {cartItems.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#e4e8e4] bg-white p-6 text-center sm:mt-12 sm:p-12">
            <span className="empty-icon"><Icon name="bag" size={32} /></span>
            <p className="text-base leading-7 text-[#77817e] sm:text-lg">{message || "Your cart is waiting for something good."}</p>
            <Link href="/products" className="button-primary mt-6">
              Browse collection <Icon name="arrow" size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-[1fr_360px] lg:gap-10">
            <div className="divide-y divide-[#e4e8e4] rounded-2xl border border-[#e4e8e4] bg-white px-4 sm:px-6">
              {cartItems.map((item) => (
                <div key={item.id} className="grid gap-4 py-5 sm:flex sm:items-center sm:justify-between sm:py-6">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{item.name}</p>
                    <p className="mt-1 text-sm text-[#8b9791]">{formatPhpCurrency(item.price)} each</p>
                    {item.stock !== undefined && <p className="mt-1 text-xs text-[#8b9791]">{item.stock} available</p>}
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-3 sm:flex sm:gap-4">
                    <select
                      aria-label={`Quantity for ${item.name}`}
                      value={item.quantity}
                      onChange={(event) => update(item.id, Number(event.target.value))}
                      className="rounded-lg border border-[#dfe5e0] px-3 py-2 text-sm"
                    >
                      {quantityOptions(item.stock).map((quantity) => (
                        <option key={quantity} value={quantity}>{quantity}</option>
                      ))}
                    </select>
                    <strong className="text-right sm:min-w-28">{formatPhpCurrency(item.price * item.quantity)}</strong>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => update(item.id, 0)}
                      className="col-span-2 rounded-full border border-[#e0e6e1] px-3 py-2 text-xs font-semibold text-[#77817e] hover:border-[#c66d4c] hover:text-[#c66d4c] sm:col-span-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={checkout} className="h-fit rounded-2xl border border-[#e4e8e4] bg-white p-5 sm:p-6">
              <h2 className="font-semibold">Order summary</h2>
              {customerAccount ? (
                <div className="cart-customer-account">
                  <span className="cart-customer-avatar" aria-hidden="true">{(customerAccount.name || customerAccount.email).charAt(0).toUpperCase()}</span>
                  <span className="cart-customer-details"><span>Shopping as</span><strong>{customerAccount.name || "Nuvora customer"}</strong><span>{customerAccount.email}</span></span>
                  <Link href="/account/customer/profile" className="cart-customer-profile" aria-label="Manage customer profile" title="Manage customer profile"><Icon name="user" size={18} /></Link>
                </div>
              ) : (
                <div className="cart-signin-note"><Icon name="user" size={17} /><span>Have a customer account? <Link href="/account/customer/signin">Sign in</Link></span></div>
              )}
              <div className="mt-6 flex justify-between gap-4 text-sm text-[#77817e]">
                <span>Subtotal</span>
                <span>{formatPhpCurrency(total)}</span>
              </div>
              <div className="mt-3 flex justify-between gap-4 text-sm text-[#77817e]">
                <span>Shipping</span>
                <span>{isFreeShipping ? "Free" : formatPhpCurrency(shippingFee)}</span>
              </div>
              <div className="my-5 flex justify-between gap-4 border-t border-[#e4e8e4] pt-5 font-semibold">
                <span>Total</span>
                <span>{formatPhpCurrency(total + (isFreeShipping ? 0 : shippingFee))}</span>
              </div>
              {customerAccount ? <p className="cart-confirmation-email">Order confirmation will be sent to <strong>{customerAccount.email}</strong>.</p> : <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email for order confirmation"
                className="w-full rounded-xl border border-[#dfe5e0] px-4 py-3 text-sm outline-none focus:border-[#e58d61]"
              />}
              <button className="mt-4 w-full rounded-full bg-[#1e2a27] py-3.5 text-sm font-semibold text-white hover:bg-[#e58d61]">
                Place order
              </button>
              {message && <p className="mt-4 text-center text-xs leading-5 text-[#77817e]">{message}</p>}
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
