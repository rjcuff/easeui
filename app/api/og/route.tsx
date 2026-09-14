import { ImageResponse } from "next/og";
import { OG_SIZE, ogImage } from "@/lib/og";

export const runtime = "edge";

/** Every page shares the same social card: the easeUI octagon. */
export async function GET() {
  return new ImageResponse(ogImage(), OG_SIZE);
}
