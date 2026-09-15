import { NextResponse } from "next/server";
import { COMPONENT_COUNT } from "@/lib/registry";

export const dynamic = "force-static";

/** Shields.io endpoint schema: https://shields.io/badges/endpoint-badge */
export async function GET() {
  return NextResponse.json(
    {
      schemaVersion: 1,
      label: "components",
      message: String(COMPONENT_COUNT),
      color: "e11d48",
    },
    {
      headers: {
        "cache-control": "public, max-age=300, s-maxage=3600",
        "access-control-allow-origin": "*",
      },
    },
  );
}
