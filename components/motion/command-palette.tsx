"use client";

import { Search } from "lucide-react";
import {
  Children,
  createContext,
  Fragment,
  type InputHTMLAttributes,
  isValidElement,
  type KeyboardEvent,
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

export interface CommandItemProps {
  /** Text matched against the search query. Falls back to string children. */
  value?: string;
  /** Extra terms that also match, invisibly, such as synonyms or a keyboard shortcut. */
  keywords?: string[];
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

function itemValue(props: { value?: string; children?: ReactNode }): string {
  return props.value ?? (typeof props.children === "string" ? props.children : "");
}

function isMatch(props: CommandItemProps, query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;
  const haystack = [itemValue(props), ...(props.keywords ?? [])].join(" ").toLowerCase();
  return haystack.includes(trimmed);
}

/** Walks a children tree, collecting every enabled item that matches the query, in order. */
function collectItems(children: ReactNode, query: string): CommandItemProps[] {
  const found: CommandItemProps[] = [];
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    if (child.type === Fragment || child.type === CommandGroup || child.type === CommandList) {
      found.push(...collectItems((child.props as { children?: ReactNode }).children, query));
    } else if (child.type === CommandItem) {
      const props = child.props as CommandItemProps;
      if (!props.disabled && isMatch(props, query)) found.push(props);
    }
  }
  return found;
}

interface CommandContextValue {
  query: string;
  setQuery: (query: string) => void;
  activeValue: string | undefined;
  setActiveValue: (value: string) => void;
  select: (value: string) => void;
  count: number;
  listboxId: string;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand(part: string) {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error(`${part} must be used inside <CommandPalette>`);
  return ctx;
}

export interface CommandPaletteProps {
  /** Whether the palette is open. */
  open: boolean;
  /** Called when the palette asks to close, from Escape, the backdrop, or a selection. */
  onOpenChange: (open: boolean) => void;
  /** Names the dialog for screen readers. Default "Command palette". */
  label?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A command-K style search overlay on the native dialog element. Typing
 * filters the list, arrow keys move the highlight, and Enter selects it.
 * The dialog handles focus and an inert page behind it on its own.
 */
export function CommandPalette({
  open,
  onOpenChange,
  label = "Command palette",
  className,
  children,
}: CommandPaletteProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [activeValue, setActiveValue] = useState<string>();
  const [shown, setShown] = useState(false);

  const items = useMemo(() => collectItems(children, query), [children, query]);

  // Reset the highlight only once the active item filters out.
  useEffect(() => {
    if (items.some((item) => itemValue(item) === activeValue)) return;
    setActiveValue(items[0] ? itemValue(items[0]) : undefined);
  }, [items, activeValue]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      setQuery("");
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    setShown(false);
    if (!dialog.open) return;
    const timeout = setTimeout(() => dialog.close(), 150);
    return () => clearTimeout(timeout);
  }, [open]);

  // The native dialog does not stop the page behind it from scrolling.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const select = useCallback(
    (value: string) => {
      items.find((item) => itemValue(item) === value)?.onSelect?.();
      onOpenChange(false);
    },
    [items, onOpenChange],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeValue !== undefined) select(activeValue);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (items.length === 0) return;
    const index = items.findIndex((item) => itemValue(item) === activeValue);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    setActiveValue(itemValue(items[(next + items.length) % items.length]));
  };

  const ctx = useMemo<CommandContextValue>(
    () => ({ query, setQuery, activeValue, setActiveValue, select, count: items.length, listboxId }),
    [query, activeValue, items, listboxId, select],
  );

  return (
    <dialog
      ref={ref}
      aria-label={label}
      data-shown={shown}
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      className="group fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-start justify-center overflow-hidden bg-transparent p-4 pt-[12vh] text-foreground backdrop:bg-transparent open:flex"
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 cursor-default bg-black/40 opacity-0 transition-opacity duration-150 ease-out group-data-[shown=true]:opacity-100 group-data-[shown=true]:duration-200 motion-reduce:transition-none"
      />
      <CommandContext.Provider value={ctx}>
        <div
          className={cn(
            "relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-background",
            "shadow-[0_0_0_1px_var(--border-strong),0_24px_60px_-20px_rgb(0_0_0/0.45)]",
            "scale-[0.97] opacity-0 transition-[opacity,scale] duration-150 ease-out",
            "group-data-[shown=true]:scale-100 group-data-[shown=true]:opacity-100 group-data-[shown=true]:duration-200",
            "motion-reduce:transition-none",
            className,
          )}
        >
          {children}
        </div>
      </CommandContext.Provider>
    </dialog>
  );
}

export type CommandInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "role"
>;

export function CommandInput({
  className,
  placeholder = "Type a command or search...",
  ...props
}: CommandInputProps) {
  const { query, setQuery, listboxId, activeValue } = useCommand("CommandInput");

  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4">
      <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        role="combobox"
        aria-expanded="true"
        aria-controls={listboxId}
        aria-activedescendant={activeValue ? `${listboxId}-${activeValue}` : undefined}
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, children }: { className?: string; children: ReactNode }) {
  const { listboxId } = useCommand("CommandList");
  return (
    <div
      id={listboxId}
      role="listbox"
      className={cn("flex max-h-80 flex-col gap-1 overflow-y-auto p-2", className)}
    >
      {children}
    </div>
  );
}

/** Shown in place of the list once nothing in it matches the query. */
export function CommandEmpty({ children }: { children: ReactNode }) {
  const { count } = useCommand("CommandEmpty");
  if (count > 0) return null;
  return <p className="px-4 py-8 text-center text-sm text-muted-foreground">{children}</p>;
}

export interface CommandGroupProps {
  heading?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A labeled cluster of items. Collapses along with its heading once every item in it filters out. */
export function CommandGroup({ heading, className, children }: CommandGroupProps) {
  const { query } = useCommand("CommandGroup");
  if (collectItems(children, query).length === 0) return null;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {heading ? (
        <div className="px-2.5 pt-2 pb-1 text-xs font-medium text-muted-foreground">{heading}</div>
      ) : null}
      {children}
    </div>
  );
}

export function CommandSeparator({ className }: { className?: string }) {
  return <hr className={cn("mx-2 my-1 border-t border-border", className)} />;
}

/** A selectable row. Hidden entirely once it stops matching the query. */
export function CommandItem({
  value,
  keywords,
  disabled = false,
  className,
  children,
}: CommandItemProps) {
  const { query, activeValue, setActiveValue, select, listboxId } = useCommand("CommandItem");
  const ref = useRef<HTMLButtonElement>(null);
  const thisValue = itemValue({ value, children });
  const active = activeValue === thisValue;

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!isMatch({ value, keywords, children }, query)) return null;

  return (
    <button
      ref={ref}
      type="button"
      id={`${listboxId}-${thisValue}`}
      role="option"
      tabIndex={-1}
      disabled={disabled}
      aria-selected={active}
      data-active={active && !disabled}
      onPointerMove={() => {
        if (!disabled) setActiveValue(thisValue);
      }}
      onClick={() => select(thisValue)}
      className={cn(
        "flex min-h-9 w-full touch-manipulation items-center gap-2 rounded-lg px-2.5 text-left text-sm text-foreground outline-none transition-colors duration-100",
        "data-[active=true]:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
