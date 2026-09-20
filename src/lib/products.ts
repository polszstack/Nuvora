export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  color: string;
  imageUrl?: string | null;
  badge?: string;
};

export const products: Product[] = [
  { id: "linen-journal", name: "Linen Journal", category: "Workspace", price: 28, description: "A quiet place for your best thoughts.", color: "bg-[#e9ded2]", badge: "Bestseller" },
  { id: "arc-desk-lamp", name: "Arc Desk Lamp", category: "Workspace", price: 119, description: "Warm, focused light for late ideas.", color: "bg-[#d5e1eb]" },
  { id: "cloud-mug", name: "Cloud Ceramic Mug", category: "Wellness", price: 34, description: "Hand-thrown, perfectly imperfect.", color: "bg-[#eee9df]" },
  { id: "daily-tote", name: "Daily Canvas Tote", category: "Travel", price: 52, description: "Carries the essentials, beautifully.", color: "bg-[#d7e5dd]", badge: "New" },
  { id: "quiet-headphones", name: "Quiet Headphones", category: "Audio", price: 149, description: "Your space, wherever you are.", color: "bg-[#dcd9e8]" },
  { id: "linen-throw", name: "Linen Throw", category: "Wellness", price: 86, description: "Soft texture for slower evenings.", color: "bg-[#eee0d3]" },
];
