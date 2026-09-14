"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  // disableTransitionOnChange stops every component's own CSS transition from
  // firing at a different speed while the theme flips.
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      enableColorScheme={false}
      disableTransitionOnChange
      {...props}
    />
  );
}
