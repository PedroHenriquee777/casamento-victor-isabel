import type { ReactElement } from "react";

export type IconName =
  | "dress"
  | "clock"
  | "car"
  | "sun"
  | "heart"
  | "camera"
  | "gift"
  | "champagne"
  | "pin"
  | "chevron-down"
  | "chevron-up"
  | "arrow-down"
  | "check"
  | "minus"
  | "plus";

const paths: Record<IconName, ReactElement> = {
  dress: (
    <>
      <path d="M10 3 L12 5.6 L14 3" />
      <path d="M12 5.6 V8.2 M9.6 8.2 H14.4 L13.3 12.4 L17.8 21 H6.2 L10.7 12.4 Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4 V12 L15.2 14" />
    </>
  ),
  car: (
    <>
      <path d="M4.2 16.2 V12.4 L6.4 7.6 H17.6 L19.8 12.4 V16.2 Z" />
      <path d="M4.2 12.4 H19.8" />
      <circle cx="8" cy="16.2" r="1.5" />
      <circle cx="16" cy="16.2" r="1.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.4 V5.6 M12 18.4 V20.6 M3.4 12 H5.6 M18.4 12 H20.6 M6 6 L7.5 7.5 M16.5 16.5 L18 18 M18 6 L16.5 7.5 M7.5 16.5 L6 18" />
    </>
  ),
  heart: <path d="M12 20 C5.4 15.4 3.2 11.8 3.2 8.8 C3.2 6.4 5 4.8 7.1 4.8 C9.1 4.8 11 5.8 12 7.8 C13 5.8 14.9 4.8 16.9 4.8 C19 4.8 20.8 6.4 20.8 8.8 C20.8 11.8 18.6 15.4 12 20 Z" />,
  camera: (
    <>
      <path d="M4 8.2 H7.4 L8.8 6 H15.2 L16.6 8.2 H20 V18 H4 Z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  gift: (
    <>
      <path d="M4.5 10 H19.5 V20 H4.5 Z M3.5 7 H20.5 V10 H3.5 Z M12 7 V20" />
      <path d="M12 7 C10 7 8 6 8 4.6 C8 3.4 9.4 3.2 10.4 4 C11.2 4.6 12 7 12 7 C12 7 12.8 4.6 13.6 4 C14.6 3.2 16 3.4 16 4.6 C16 6 14 7 12 7 Z" />
    </>
  ),
  champagne: (
    <>
      <path d="M7 4 H11.4 L10.8 10 C10.6 11.8 8.2 11.8 8 10 Z M9.2 11.4 V18 M7 18.4 H11.4" />
      <path d="M14.6 4 H19 L18.4 10 C18.2 11.8 15.8 11.8 15.6 10 Z M16.8 11.4 V18 M14.6 18.4 H19" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21 C8 16 5.6 13 5.6 9.6 C5.6 6.2 8.4 3.6 12 3.6 C15.6 3.6 18.4 6.2 18.4 9.6 C18.4 13 16 16 12 21 Z" />
      <circle cx="12" cy="9.6" r="2.4" />
    </>
  ),
  "chevron-down": <path d="M6 9.5 L12 15.5 L18 9.5" />,
  "chevron-up": <path d="M6 14.5 L12 8.5 L18 14.5" />,
  "arrow-down": <path d="M12 5 V19 M6.5 13.5 L12 19 L17.5 13.5" />,
  check: <path d="M5 12.6 L10 17.4 L19 7.6" />,
  minus: <path d="M6 12 H18" />,
  plus: <path d="M6 12 H18 M12 6 V18" />,
};

export function Icon({ name, size = 24, stroke = 1.15, className }: { name: IconName; size?: number | string; stroke?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
