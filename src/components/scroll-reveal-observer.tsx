"use client";

import { useEffect } from "react";

export function ScrollRevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      root.dataset.scrollDirection = currentScrollY < lastScrollY ? "up" : "down";
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestScrollDirectionUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    root.classList.add("scroll-reveal-ready");
    root.dataset.scrollDirection = "down";
    updateScrollDirection();
    window.addEventListener("scroll", requestScrollDirectionUpdate, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { rootMargin: "-6% 0px -10% 0px", threshold: 0.18 },
    );

    reveals.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestScrollDirectionUpdate);
      root.classList.remove("scroll-reveal-ready");
      delete root.dataset.scrollDirection;
    };
  }, []);

  return null;
}
