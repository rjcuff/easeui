import Script from "next/script";

/**
 * Loads Google Analytics after the page is idle, so it never competes with the
 * first render. Renders nothing when no measurement id is configured.
 */
export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  if (!measurementId) return null;

  const id = JSON.stringify(measurementId);
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="lazyOnload"
      />
      <Script id="easeui-gtag" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() { window.dataLayer.push(arguments); };
window.gtag("js", new Date());
window.gtag("config", ${id});`}
      </Script>
    </>
  );
}
