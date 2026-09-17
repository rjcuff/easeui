"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MobileSidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** True while the current page has its own sidebar (like the components catalog), so the header's menu button should open that instead of the default site menu. */
  hasSidebar: boolean;
  registerSidebar: (present: boolean) => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextValue | null>(null);

/** Lets the header's single mobile menu button open whichever panel the current page provides. */
export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasSidebar, setHasSidebar] = useState(false);

  const registerSidebar = useCallback((present: boolean) => {
    setHasSidebar(present);
  }, []);

  return (
    <MobileSidebarContext.Provider value={{ open, setOpen, hasSidebar, registerSidebar }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);
  if (!context) throw new Error("useMobileSidebar must be used within MobileSidebarProvider");
  return context;
}
