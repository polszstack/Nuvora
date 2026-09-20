export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export const CART_KEY = "nuvora-cart";
const EMPTY_CART: CartItem[] = [];

let cachedRawCart = "";
let cachedCart: CartItem[] = [];

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(CART_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getClientCartSnapshot() {
  const raw = window.localStorage.getItem(CART_KEY) ?? "";
  if (raw === cachedRawCart) return cachedCart;
  cachedRawCart = raw;
  if (!raw) {
    cachedCart = [];
    return cachedCart;
  }
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    cachedCart = Array.isArray(parsed) ? parsed : [];
  } catch {
    cachedCart = [];
  }
  return cachedCart;
}

export function subscribeToCart(onChange: () => void) {
  window.addEventListener("cart-updated", onChange);
  return () => window.removeEventListener("cart-updated", onChange);
}

export function getCartSnapshot() {
  return getClientCartSnapshot();
}

export function getServerCartSnapshot() {
  return EMPTY_CART;
}
