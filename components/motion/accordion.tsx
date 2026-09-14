"use client";

import { ChevronDown } from "lucide-react";
import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
};

type ItemContextValue = { value: string; open: boolean; triggerId: string; panelId: string };

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useAccordionPart<T>(context: React.Context<T | null>, part: string): T {
  const value = useContext(context);
  if (!value) throw new Error(`${part} must be used inside an Accordion`);
  return value;
}

export interface AccordionProps {
  /** Let several items stay open at once. Default false. */
  multiple?: boolean;
  /** Open items when uncontrolled. */
  defaultValue?: string[];
  /** Open items when controlled. */
  value?: string[];
  /** Called with the open items after each change. */
  onValueChange?: (value: string[]) => void;
  className?: string;
  children: ReactNode;
}

/** Arrow keys, Home, and End move between triggers, like a list of tabs. */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
  const target = event.target as HTMLElement;
  if (!keys.includes(event.key) || !target.matches("[data-accordion-trigger]")) return;
  const triggers = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]:not(:disabled)"),
  );
  const index = triggers.indexOf(target as HTMLButtonElement);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? triggers.length - 1
        : (index + (event.key === "ArrowDown" ? 1 : -1) + triggers.length) % triggers.length;
  event.preventDefault();
  triggers[next]?.focus();
}

export function Accordion({
  multiple = false,
  defaultValue = [],
  value,
  onValueChange,
  className,
  children,
}: AccordionProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const openValues = value ?? uncontrolled;

  const toggle = useCallback(
    (item: string) => {
      const isOpen = openValues.includes(item);
      const next = isOpen
        ? openValues.filter((v) => v !== item)
        : multiple
          ? [...openValues, item]
          : [item];
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [multiple, onValueChange, openValues, value],
  );

  const context = useMemo(
    () => ({ isOpen: (item: string) => openValues.includes(item), toggle }),
    [openValues, toggle],
  );

  return (
    <AccordionContext.Provider value={context}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: key handling only moves focus between the trigger buttons inside. */}
      <div onKeyDown={moveFocus} className={cn("flex flex-col", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  /** Unique id for this item within the accordion. */
  value: string;
  className?: string;
  children: ReactNode;
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { isOpen } = useAccordionPart(AccordionContext, "AccordionItem");
  const id = useId();
  const open = isOpen(value);
  const item = useMemo(
    () => ({ value, open, triggerId: `${id}-trigger`, panelId: `${id}-panel` }),
    [id, open, value],
  );

  return (
    <ItemContext.Provider value={item}>
      <div data-state={open ? "open" : "closed"} className={cn("border-b border-border", className)}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export interface AccordionTriggerProps {
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}

export function AccordionTrigger({ className, disabled, children }: AccordionTriggerProps) {
  const { toggle } = useAccordionPart(AccordionContext, "AccordionTrigger");
  const { value, open, triggerId, panelId } = useAccordionPart(ItemContext, "AccordionTrigger");

  return (
    <h3 className="flex">
      <button
        id={triggerId}
        type="button"
        data-accordion-trigger=""
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        onClick={() => toggle(value)}
        className={cn(
          "group flex min-h-12 flex-1 touch-manipulation items-center justify-between gap-4 py-3 text-left text-sm font-medium text-foreground outline-none",
          "focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-foreground/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
    </h3>
  );
}

export interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

/**
 * The panel grows from zero rows to its full height with a grid transition,
 * so there is nothing to measure. Closed panels are inert, so Tab skips them.
 */
export function AccordionContent({ className, children }: AccordionContentProps) {
  const { open, triggerId, panelId } = useAccordionPart(ItemContext, "AccordionContent");

  return (
    <section
      id={panelId}
      aria-labelledby={triggerId}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "pb-4 text-sm leading-6 text-muted-foreground transition-opacity duration-200 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
