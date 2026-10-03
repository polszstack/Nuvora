"use client";

import { useState } from "react";
import { convertPhpToUsd } from "@/lib/currency";

export function AdminProductForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", category: "Workspace", description: "", price: "", stock: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const priceInPhp = Number(formData.get("price"));
    formData.set("price", String(convertPhpToUsd(priceInPhp)));
    const response = await fetch("/api/products", { method: "POST", body: formData });
    if (!response.ok) {
      const result = await response.json() as { error?: string };
      setStatus(result.error ?? "Unable to save product.");
      return;
    }
    setStatus("Product saved. Refresh the catalog to see it.");
    setForm({ name: "", category: "Workspace", description: "", price: "", stock: "" });
    formElement.reset();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-[#1e2a27] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e58d61] sm:w-auto"
      >
        + Add product
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="border-b border-[#e9eeea] bg-[#fbfcfa] p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#e58d61]" />
        <select name="category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-sm">
          <option>Workspace</option>
          <option>Audio</option>
          <option>Travel</option>
          <option>Wellness</option>
        </select>
        <textarea name="description" required placeholder="Short description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#e58d61] sm:col-span-2" />
        <input name="price" required min="0" step="0.01" type="number" placeholder="Price (PHP)" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-sm" />
        <input name="stock" required min="0" type="number" placeholder="Stock quantity" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-sm" />
        <input name="image" type="file" accept="image/*" className="rounded-xl border border-[#dfe5e0] bg-white px-4 py-3 text-sm sm:col-span-2" />
        <p className="text-xs leading-5 text-[#9aa49f] sm:col-span-2">Optional product image, maximum 3 MB.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:flex sm:items-center sm:gap-4">
        <button type="submit" className="rounded-full bg-[#e58d61] px-5 py-2.5 text-sm font-semibold text-white">
          Save product
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-[#dfe5e0] px-5 py-2.5 text-sm font-semibold text-[#77817e] sm:border-0 sm:px-0">
          Cancel
        </button>
        {status && <span className="text-sm leading-6 text-[#77817e]">{status}</span>}
      </div>
    </form>
  );
}
