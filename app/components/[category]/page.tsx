import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { ShowcaseListItem } from "@/components/app/showcase-list-item";
import { findCategory, registry } from "@/lib/registry";
import { breadcrumbJsonLd, categoryJsonLd } from "@/lib/seo";

const categoryContent = {
  motion: {
    title: "Open Source React Motion Components",
    heading: "Components",
    description:
      "Every easeUI component, ready to preview. Each one comes as a TypeScript source file you add with the shadcn CLI.",
  },
  blocks: {
    title: "React UI Blocks",
    heading: "Blocks",
    description:
      "Larger easeUI patterns built from the core components that you can adapt to your product.",
  },
  agents: {
    title: "React Components for AI Interfaces",
    heading: "AI interface components",
    description:
      "easeUI components for AI products, covering conversations, streaming answers, progress, and tool activity.",
  },
} as const;

function contentFor(slug: string) {
  return (
    categoryContent[slug as keyof typeof categoryContent] ??
    categoryContent.motion
  );
}

export function generateStaticParams() {
  return registry.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) return {};

  const content = contentFor(cat.slug);
  const ogTitle = `${content.title} · easeUI`;
  const pageUrl = `/components/${cat.slug}`;
  const imageUrl = `/api/og?category=${cat.slug}`;

  return {
    title: content.title,
    description: content.description,
    keywords: [
      "easeUI",
      "React components",
      "animated React components",
      "Tailwind CSS components",
      "shadcn registry",
      ...cat.components.map((comp) => comp.name),
    ],
    openGraph: {
      title: ogTitle,
      description: content.description,
      url: pageUrl,
      type: "website",
      siteName: "easeUI",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${cat.name} by easeUI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: content.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
      types: {
        "application/json": "/registry.json",
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();
  const content = contentFor(cat.slug);
  const count = cat.components.length;

  return (
    <div className="flex w-full flex-col gap-12 pb-16">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "easeUI", path: "/" },
            { name: cat.name, path: `/components/${cat.slug}` },
          ]),
          categoryJsonLd(cat),
        ]}
      />

      <header className="flex flex-col items-center gap-3 pt-4 text-center">
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] tabular-nums text-muted-foreground">
          {String(count).padStart(2, "0")} {count === 1 ? "component" : "components"}
        </span>
        <h1 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {content.heading}
        </h1>
        <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
          {content.description}
        </p>
      </header>

      <section
        aria-label={content.heading}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cat.components.map((comp) => (
          <ShowcaseListItem
            key={comp.slug}
            category={cat.slug}
            slug={comp.slug}
            name={comp.name}
            description={comp.description}
            badge={comp.badge}
            launchedAt={comp.launchedAt}
          />
        ))}
      </section>
    </div>
  );
}
