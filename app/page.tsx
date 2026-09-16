import Link from "next/link";
import { SiteFrame } from "@/components/app/chrome/site-frame";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { InstallCommand } from "@/components/app/docs/install-command";
import { Hero } from "@/components/app/landing/hero";
import { ShowcaseCard } from "@/components/app/showcase-card";
import { registry } from "@/lib/registry";

const HOME_COMPONENT_LIMIT = 21;

export default function Home() {
  const components = registry
    .flatMap((category) => category.components.map((component) => ({ category: category.slug, component })))
    .slice(0, HOME_COMPONENT_LIMIT);

  return (
    <SiteFrame>
      <div className="flex w-full flex-col">
        <section className="relative isolate pb-16 pt-20 md:pt-28">
          <Hero />
        </section>

        <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 pb-20">
          <p className="text-center text-sm text-muted-foreground">
            Install any component with a single shadcn command.
          </p>
          <InstallCommand />
        </section>

        {components.length ? (
          <section
            aria-label="Components"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {components.map(({ category, component }) => (
              <ShowcaseCard
                key={`${category}-${component.slug}`}
                category={category}
                slug={component.slug}
                name={component.name}
                description={component.description}
                badge={component.badge}
                launchedAt={component.launchedAt}
              />
            ))}
          </section>
        ) : null}

        <div className="flex justify-center pb-20 pt-4">
          <Link
            href="/components/motion"
            className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--border-strong)] transition-colors duration-150 hover:bg-foreground/5"
          >
            Browse all components
          </Link>
        </div>

        <SiteFooter />
      </div>
    </SiteFrame>
  );
}
