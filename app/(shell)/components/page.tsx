import { redirect } from "next/navigation";
import { registry } from "@/lib/registry";

export default function ComponentsIndex() {
  const first = registry[0];
  redirect(first ? `/components/${first.slug}` : "/");
}
