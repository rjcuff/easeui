type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, name: string, params?: EventParams) => void;
    dataLayer?: unknown[];
  }
}

/** Send an analytics event. Does nothing when analytics is not loaded. */
export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
