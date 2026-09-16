import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/app/analytics/google-analytics";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { KeyboardShortcuts } from "@/components/app/chrome/keyboard-shortcuts";
import { SiteHeader } from "@/components/app/chrome/site-header";
import { ThemeProvider } from "@/components/app/chrome/theme-provider";
import { getGithubStarCount } from "@/lib/github";
import {
  AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  siteJsonLd,
} from "@/lib/seo";
import { AUTHOR_X_URL, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const SOCIAL_TITLE = `${SITE_NAME} · ${SITE_TITLE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SOCIAL_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR, url: AUTHOR_X_URL }],
  creator: AUTHOR,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    types: {
      "application/json": "/registry.json",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: SOCIAL_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: SOCIAL_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/api/og"],
  },
  keywords: [
    "easeUI",
    "React UI library",
    "React components",
    "Next.js components",
    "Tailwind CSS components",
    "shadcn registry",
    "React animation components",
    "easing and spring animations",
    "open source UI components",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const githubStarCount = await getGithubStarCount();
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en" suppressHydrationWarning className={cn(sans.variable, mono.variable)}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/easeui-mark.svg" />
        <link rel="alternate icon" type="image/png" href="/easeui-mark.png" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="alternate" type="application/json" title="Component registry" href="/r" />
        <link rel="alternate" type="application/json" title="shadcn registry" href="/registry.json" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <JsonLd data={siteJsonLd()} />
        <ThemeProvider>
          <KeyboardShortcuts />
          <SiteHeader githubStarCount={githubStarCount} />
          <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-14 md:px-6">
            {children}
          </main>
          {isProduction ? <Analytics /> : null}
          {isProduction ? <SpeedInsights /> : null}
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        </ThemeProvider>
      </body>
    </html>
  );
}
