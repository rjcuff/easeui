import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { CodeBlock } from "@/components/app/docs/code-block";
import { CopyPage } from "@/components/app/docs/copy-page";
import { InstallSection } from "@/components/app/docs/install-section";
import { PropsTable } from "@/components/app/docs/props-table";
import { NewLabel } from "@/components/app/new-indicator";
import { ShowcaseCard } from "@/components/app/showcase-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { getPreview } from "@/components/previews";
import { componentDates } from "@/lib/component-dates";
import { getComponentProps } from "@/lib/props-extractor";
import { findCategory, findComponent, registry } from "@/lib/registry";
import {
  breadcrumbJsonLd,
  componentJsonLd,
  componentKeywords,
  componentMetaDescription,
  relatedComponents,
} from "@/lib/seo";
import { pageUrlFor, withSignature } from "@/lib/signature";
import { readSourceFile } from "@/lib/source-files";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = Promise<{ category: string; slug: string }>;

export function generateStaticParams() {
  return registry.flatMap((category) =>
    category.components.map((component) => ({ category: category.slug, slug: component.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const cat = findCategory(category);
  const comp = findComponent(category, slug);
  if (!cat || !comp) return {};

  const title = `${comp.name} React Component`;
  const description = componentMetaDescription(comp);
  const pageUrl = `/components/${cat.slug}/${comp.slug}`;

  return {
    title,
    description,
    keywords: componentKeywords(cat, comp),
    openGraph: {
      title: `${title} · easeUI`,
      description,
      url: pageUrl,
      type: "article",
      siteName: "easeUI",
      images: [{ url: "/api/og", width: 1200, height: 630, alt: "easeUI" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · easeUI`,
      description,
      images: ["/api/og"],
    },
    alternates: {
      canonical: pageUrl,
      types: {
        "application/json": `/r/${comp.slug}.json`,
        "text/plain": `/r/${comp.slug}/raw`,
      },
    },
  };
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-5 border-t border-border pt-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default async function ComponentPage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const cat = findCategory(category);
  const comp = findComponent(category, slug);
  if (!cat || !comp) notFound();

  const previewFile = `components/previews/${cat.slug}/${comp.slug}.preview.tsx`;
  const usageFile = comp.usageFile ?? previewFile;
  const [source, usage] = await Promise.all([readSourceFile(comp.file), readSourceFile(usageFile)]);
  const Preview = getPreview(cat.slug, comp.slug);
  const propsDocs = getComponentProps(comp.file);
  const related = relatedComponents(cat.slug, comp.slug, 3);
  const dates = componentDates(cat.slug, comp.slug);
  const updated = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${dates.updatedAt}T00:00:00Z`),
  );

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-12 pb-8">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "easeUI", path: "/" },
            { name: cat.name, path: `/components/${cat.slug}` },
            { name: comp.name, path: `/components/${cat.slug}/${comp.slug}` },
          ]),
          componentJsonLd(cat, comp),
        ]}
      />

      <header className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
          <Link
            href={`/components/${cat.slug}`}
            className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            {cat.name}
          </Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground">{comp.name}</span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {comp.name}
            </h1>
            {comp.badge === "new" ? <NewLabel launchedAt={comp.launchedAt} /> : null}
          </div>
          <CopyPage
            markdownPath={`/components/${cat.slug}/${comp.slug}.md`}
            componentName={comp.name}
          />
        </div>
        <p className="max-w-2xl text-pretty text-muted-foreground">{comp.description}</p>
      </header>

      <section aria-label="Preview and code">
        <Tabs defaultValue="preview" variant="underline">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-5">
            <div className="flex min-h-80 items-center justify-center rounded-2xl bg-card px-6 py-12">
              {Preview ? <Preview /> : null}
            </div>
          </TabsContent>
          <TabsContent value="usage" className="mt-5">
            <CodeBlock code={usage} filename={usageFile} />
          </TabsContent>
          <TabsContent value="source" className="mt-5">
            <CodeBlock
              code={withSignature(source, comp.file, pageUrlFor(cat.slug, comp.slug))}
              filename={comp.file}
            />
          </TabsContent>
        </Tabs>
      </section>

      <Section id="install" title="Installation">
        <InstallSection category={cat.slug} slug={comp.slug} />
      </Section>

      {propsDocs.length ? (
        <Section id="api" title="API reference">
          <PropsTable docs={propsDocs} />
        </Section>
      ) : null}

      {related.length ? (
        <Section id="related" title="Related components">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ShowcaseCard
                key={`${item.category}/${item.slug}`}
                category={item.category}
                slug={item.slug}
                name={item.name}
                description={item.description}
                badge={item.badge}
                launchedAt={item.launchedAt}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Updated <time dateTime={dates.updatedAt}>{updated}</time>
      </p>
    </article>
  );
}
