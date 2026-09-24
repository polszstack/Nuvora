export type CartItem = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
};

export const CART_KEY = "nuvora-cart";
const EMPTY_CART: CartItem[] = [];

function normalizeCart(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item): item is CartItem => !!item && typeof item === "object" && typeof (item as CartItem).id === "string")
    .map((item) => {
      const stock = Number.isFinite(item.stock) ? Math.max(0, Number(item.stock)) : undefined;
      const quantity = Number.isFinite(item.quantity) ? Number(item.quantity) : 1;
      const boundedQuantity = Math.max(0, Math.min(Math.round(quantity), stock && stock > 0 ? stock : quantity || 1));
      return { ...item, quantity: boundedQuantity, stock };
    })
    .filter((item) => item.quantity > 0);
}

let cachedRawCart = "";
let cachedCart: CartItem[] = [];

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const saved = window.localStorage.getItem(CART_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved) as unknown;
    return normalizeCart(parsed);
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
    const parsed = JSON.parse(raw) as unknown;
    cachedCart = normalizeCart(parsed);
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
