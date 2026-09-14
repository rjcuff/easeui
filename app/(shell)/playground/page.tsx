import type { Metadata } from "next";
import { Playground } from "@/components/app/playground/playground";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Experiment with springs, tweens, and staggered sequences in the browser, then copy the resulting Motion code into your project.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return <Playground />;
}
