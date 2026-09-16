import type { ReactNode } from "react";
import { ComponentsSidebar } from "@/components/app/components-sidebar";
import { SiteFrame } from "@/components/app/chrome/site-frame";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-6 md:pl-52">
      <ComponentsSidebar />
      <div className="min-w-0">
        <SiteFrame>{children}</SiteFrame>
      </div>
    </div>
  );
}
