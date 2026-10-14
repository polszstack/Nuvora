// Keep image blobs out of HTML and React navigation payloads. Images load separately.
export const storeProductSelect = {
  id: true,
  slug: true,
  name: true,
  category: true,
  description: true,
  price: true,
  stock: true,
  updatedAt: true,
  seller: { select: { name: true, shopName: true, isActive: true } },
} as const;

export function productImageUrl(product: { id: string; updatedAt: Date }) {
  return `/api/products/${encodeURIComponent(product.id)}/image?v=${product.updatedAt.getTime()}`;
}
