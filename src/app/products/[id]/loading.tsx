import { StoreHeader } from "@/components/store-header";

export default function ProductLoading() {
  return <main className="storefront" aria-busy="true">
    <StoreHeader />
    <section className="site-container product-detail-section" role="status" aria-label="Loading product">
      <p className="product-breadcrumb">Loading product…</p>
      <div className="product-detail-grid" aria-hidden="true">
        <div className="product-detail-image animate-pulse" />
        <div className="space-y-6">
          <div className="h-4 w-24 rounded bg-[#eceee4]" />
          <div className="h-12 w-3/4 rounded bg-[#eceee4]" />
          <div className="h-7 w-28 rounded bg-[#eceee4]" />
          <div className="h-24 rounded bg-[#eceee4]" />
          <div className="h-14 rounded bg-[#eceee4]" />
        </div>
      </div>
    </section>
  </main>;
}
