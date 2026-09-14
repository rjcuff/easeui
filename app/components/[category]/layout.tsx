import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ComponentsSidebar } from "@/components/app/components-sidebar";
import { findCategory } from "@/lib/registry";

export default async function ComponentsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  return (
    <div className="flex flex-1 flex-col items-start gap-6 md:flex-row md:gap-6">
      <ComponentsSidebar
        categorySlug={cat.slug}
        components={cat.components.map((component) => ({
          slug: component.slug,
          name: component.name,
        }))}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
