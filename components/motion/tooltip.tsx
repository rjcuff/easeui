"use client";

import {
  cloneElement,
  createContext,
  type FocusEvent,
  isValidElement,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/** How long a group stays warm after its tooltip closes, in ms. Covers the gap between triggers. */
const WARM_MS = 400;

type GroupValue = {
  /** Id of the tooltip that is open, or null. */
  activeId: string | null;
  /** Read synchronously, because leave and enter events fire before React re-renders. */
  activeRef: { current: string | null };
  warmUntil: { current: number };
  setActive: (id: string | null) => void;
};

const TooltipGroupContext = createContext<GroupValue | null>(null);

function useGroupState(): GroupValue {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const warmUntil = useRef(0);
  const setActive = useCallback((id: string | null) => {
    if (id === null && activeRef.current !== null) warmUntil.current = Date.now() + WARM_MS;
    activeRef.current = id;
    setActiveId(id);
  }, []);
  return useMemo(() => ({ activeId, activeRef, warmUntil, setActive }), [activeId, setActive]);
}

/**
 * Wrap related tooltips, such as the buttons in a toolbar. Only one opens at a
 * time. Once one has opened, moving to the next swaps them instantly.
 */
export function TooltipGroup({ children }: { children: ReactNode }) {
  const group = useGroupState();
  return <TooltipGroupContext.Provider value={group}>{children}</TooltipGroupContext.Provider>;
}

export interface TooltipProps {
  /** Short text describing what the trigger does. */
  label: string;
  /** Keyboard shortcut keys. Use "mod" for Command on Mac and Ctrl everywhere else. */
  shortcut?: string[];
  /** Show the tooltip above or below the trigger. Default "top". */
  side?: "top" | "bottom";
  /** Delay before the first tooltip opens, in ms. Default 300. */
  delay?: number;
  className?: string;
  /** A single focusable element, usually a button. */
  children: ReactElement;
}

/** Command on Apple devices, Ctrl elsewhere. Resolved after mount to avoid a hydration mismatch. */
function useModKey() {
  const [mod, setMod] = useState("Ctrl");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setMod("⌘");
  }, []);
  return mod;
}

export function Tooltip({
  label,
  shortcut,
  side = "top",
  delay = 300,
  className,
  children,
}: TooltipProps) {
  const id = useId();
  const ownGroup = useGroupState();
  const group = useContext(TooltipGroupContext) ?? ownGroup;
  const { activeRef, warmUntil, setActive } = group;
  const open = group.activeId === id;
  const mod = useModKey();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // True when this tooltip opened while the group was warm, so it appears without a transition.
  const [instant, setInstant] = useState(false);

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const show = useCallback(() => {
    cancel();
    if (activeRef.current === id) return;
    const warm = activeRef.current !== null || Date.now() < warmUntil.current;
    if (warm) {
      setInstant(true);
      setActive(id);
      return;
    }
    timer.current = setTimeout(() => {
      setInstant(false);
      setActive(id);
    }, delay);
  }, [activeRef, cancel, delay, id, setActive, warmUntil]);

  const hide = useCallback(() => {
    cancel();
    if (activeRef.current === id) setActive(null);
  }, [activeRef, cancel, id, setActive]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hide]);

  // Never leave a pending open or a stale active id behind.
  useEffect(
    () => () => {
      cancel();
      if (activeRef.current === id) setActive(null);
    },
    [activeRef, cancel, id, setActive],
  );

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-describedby": open ? id : undefined,
      })
    : children;

  const keys = shortcut?.map((key) => (key === "mod" ? mod : key));
  // Moving along a toolbar crossfades from one tooltip to the next with no delay and no scale,
  // so the label changes quickly without the pill popping in again.
  const replaced = !open && group.activeId !== null;
  const swap = open ? instant : replaced;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the wrapper only listens to hover and focus on the trigger inside it.
    <span
      className="relative inline-flex"
      // Only a real mouse opens it on hover, so taps on a phone never leave a tooltip stuck open.
      onPointerEnter={(event: PointerEvent) => {
        if (event.pointerType === "mouse") show();
      }}
      onPointerLeave={hide}
      // Pressing the trigger clears the tooltip out of the way.
      onPointerDown={hide}
      // Keyboard focus shows it. Focus that comes from a click does not.
      onFocus={(event: FocusEvent) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) show();
      }}
      onBlur={hide}
    >
      {trigger}
      {/*
        Always mounted and driven by a CSS transition. Toggling it mid-transition
        reverses smoothly from where it is, and there is no unmount to flash.
      */}
      <span
        role="tooltip"
        id={id}
        aria-hidden={!open}
        data-open={open}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 flex -translate-x-1/2 select-none items-center gap-2 whitespace-nowrap rounded-full bg-foreground py-1 pl-2.5 text-xs font-medium text-background shadow-lg",
          "opacity-0 scale-[0.97] transition-[opacity,scale] duration-100 ease-out",
          "data-[open=true]:scale-100 data-[open=true]:opacity-100 data-[open=true]:duration-150",
          "motion-reduce:transition-none",
          swap && "scale-100 data-[open=true]:duration-100",
          keys?.length ? "pr-1" : "pr-2.5",
          side === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top",
          className,
        )}
      >
        {label}
        {keys?.length ? (
          <span className="flex items-center gap-0.5">
            {keys.map((key) => (
              <kbd
                key={key}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/15 px-1.5 font-sans text-[11px] font-medium text-background/80"
              >
                {key}
              </kbd>
            ))}
          </span>
        ) : null}
      </span>
    </span>
  );
}
