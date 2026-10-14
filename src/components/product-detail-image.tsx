"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductDetailImage({ src, name }: { src: string; name: string }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  return <div className="product-detail-image" aria-busy={state === "loading"}>
    {state !== "ready" && <div className="product-photo-status" role="status">
      {state === "loading" && <span className="loading-spinner" aria-hidden="true" />}
      <span>{state === "error" ? "Product photo unavailable" : "Loading photo…"}</span>
    </div>}
    {state !== "error" && <Image src={src} alt={name} fill unoptimized loading="eager" fetchPriority="high"
      sizes="(max-width: 767px) 100vw, 55vw"
      className={`object-cover ${state === "ready" ? "opacity-100" : "opacity-0"}`}
      onLoad={() => setState("ready")} onError={() => setState("error")} />}
  </div>;
}
