"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Icon } from "@/components/ui-icon";
import type { Product } from "@/lib/products";

export function ProductCatalog({ products, initialCategory = "All products" }: { products: Product[]; initialCategory?: string }) {
  const categories = [...new Set(["All products", "Workspace", "Wellness", "Travel", "Audio", ...products.map((product) => product.category), initialCategory])];
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const filteredProducts = products.filter((product) =>
    (category === "All products" || product.category === category) &&
    `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : 0);

  function resetFilters() { setCategory("All products"); setQuery(""); setSort("featured"); }

  return <div className="catalog-content">
    <div className="catalog-toolbar">
      <div className="catalog-filters" role="group" aria-label="Filter by category">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className="filter-pill">{item}{item === "All products" && <span>{products.length}</span>}</button>)}
      </div>
      <label className="catalog-search"><Icon name="search" size={18} /><span className="sr-only">Search products</span><input id="catalog-search" type="search" placeholder="Find something good…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    <div className="catalog-results-bar"><p aria-live="polite" aria-atomic="true">{filteredProducts.length} {filteredProducts.length === 1 ? "considered piece" : "considered pieces"}{category !== "All products" && ` in ${category}`}</p><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
    {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><span className="empty-icon"><Icon name="search" size={32} /></span><h2>A little room to explore.</h2><p>No pieces match your search. Try another word or browse the full collection.</p><button type="button" className="button-primary" onClick={resetFilters}>View all products <Icon name="arrow" size={18} /></button></div>}
  </div>;
}
