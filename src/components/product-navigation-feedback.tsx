"use client";

import { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";

export function ProductNavigationFeedback() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return createPortal(
    <div className="product-navigation-feedback" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      Opening product…
    </div>,
    document.body,
  );
}
