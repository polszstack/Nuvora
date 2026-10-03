import type { SVGProps } from "react";

export type IconName = "arrow" | "bag" | "user" | "search" | "menu" | "close" | "leaf" | "box" | "headphones" | "desk" | "sun" | "check";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  leaf: <><path d="M20 3C9 2 3 8 5 15c7 4 15-1 15-12Z" /><path d="M3 21 15 9" /></>,
  box: <><path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z" /><path d="m3 8 9 5 9-5m-9 5v9M8 5l9 5" /></>,
  headphones: <><path d="M4 14V11a8 8 0 0 1 16 0v3" /><rect x="3" y="12" width="5" height="9" rx="2" /><rect x="16" y="12" width="5" height="9" rx="2" /></>,
  desk: <><path d="M3 14h18M5 14v7m14-7v7M8 11l5-8 6 5-5 3H8Zm5 0v3" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
