"use client";

import { Check, Loader2 } from "lucide-react";
import { type ClipboardEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  /** How many digits. Default 6. */
  length?: number;
  /** Controlled value. */
  value?: string;
  /** Starting value when uncontrolled. Default "". */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every box has a digit, before onVerify runs. */
  onComplete?: (value: string) => void;
  /**
   * Runs once every box has a digit. Return (or resolve) true or false and the
   * input shows a spinner below the boxes while it waits, then colors itself
   * green or red from the result on its own. Leave it out to keep driving
   * invalid/success yourself.
   */
  onVerify?: (value: string) => boolean | Promise<boolean>;
  /** Shakes the boxes once and switches the ring to the destructive color. Ignored while onVerify is set. */
  invalid?: boolean;
  /** Switches the ring to the success color and shows a check below the boxes. Ignored while onVerify is set. */
  success?: boolean;
  disabled?: boolean;
  /** Name for a hidden input, so the code submits with a plain HTML form. */
  name?: string;
  className?: string;
}

// A gentle nudge, not a rattle.
const SHAKE: Keyframe[] = [
  { transform: "translateX(0)" },
  { transform: "translateX(-5px)" },
  { transform: "translateX(4px)" },
  { transform: "translateX(-2px)" },
  { transform: "translateX(0)" },
];

const POP: Keyframe[] = [
  { transform: "scale(0.9)", opacity: 0.6 },
  { transform: "scale(1)", opacity: 1 },
];

// Spinner and check share a slot, so success morphs in place.
const SWAP = "col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none";
const SHOWN = "scale-100 opacity-100";
const HIDDEN = "scale-50 opacity-0";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A verification code as one box per digit. Typing advances to the next box,
 * Backspace steps back through empty ones, and pasting or an SMS autofill
 * spreads its digits across the remaining boxes. Marking it invalid gives the
 * row a short, gentle shake. Pass onVerify and the input runs the whole
 * check-and-color cycle itself, morphing its own spinner into a check.
 */
export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  onVerify,
  invalid = false,
  success = false,
  disabled = false,
  name,
  className,
}: OtpInputProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const digits = (isControlled ? value : uncontrolled).slice(0, length);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const rootRef = useRef<HTMLFieldSetElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const prevDigits = useRef(digits);
  const wasComplete = useRef(false);
  const verifyToken = useRef(0);

  // Auto status when onVerify is set; otherwise the props drive it.
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "invalid">("idle");
  const checking = Boolean(onVerify) && status === "checking";
  const effectiveInvalid = onVerify ? status === "invalid" : invalid;
  const effectiveSuccess = onVerify ? status === "success" : success;
  const showStatus = checking || effectiveSuccess;

  const setValue = (next: string) => {
    const clipped = next.slice(0, length);
    if (!isControlled) setUncontrolled(clipped);
    onChange?.(clipped);
    // Editing after a result starts the next attempt fresh.
    if (onVerify && status !== "idle") setStatus("idle");

    const complete = clipped.length === length;
    if (complete && !wasComplete.current) {
      onComplete?.(clipped);
      if (onVerify) {
        verifyToken.current += 1;
        const token = verifyToken.current;
        setStatus("checking");
        Promise.resolve(onVerify(clipped))
          .then((ok) => {
            if (verifyToken.current === token) setStatus(ok ? "success" : "invalid");
          })
          .catch(() => {
            if (verifyToken.current === token) setStatus("invalid");
          });
      }
    }
    wasComplete.current = complete;
  };

  // Pop new digits, shake the row when invalid.
  useEffect(() => {
    if (prefersReducedMotion()) {
      prevDigits.current = digits;
      return;
    }
    const prev = prevDigits.current;
    prevDigits.current = digits;
    for (let index = 0; index < length; index += 1) {
      if (digits[index] && digits[index] !== prev[index]) {
        refs.current[index]?.animate(POP, { duration: 140, easing: EASE_OUT_CSS });
      }
    }
  }, [digits, length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!effectiveInvalid || !root || prefersReducedMotion()) return;
    // Wait for the last pop to settle first, so the two don't overlap.
    root.animate(SHAKE, { duration: 260, delay: 80, easing: "ease-out" });
  }, [effectiveInvalid]);

  // Fades the status row in once, on its first appearance only.
  useEffect(() => {
    const el = statusRef.current;
    if (!showStatus || !el || prefersReducedMotion()) return;
    el.animate([{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], {
      duration: 150,
      easing: EASE_OUT_CSS,
    });
  }, [showStatus]);

  const focusInput = (index: number) => refs.current[index]?.focus();

  const onInputChange = (index: number, raw: string) => {
    const chars = raw.replace(/\D/g, "");
    if (!chars) {
      setValue(digits.slice(0, index) + digits.slice(index + 1));
      return;
    }
    // One key replaces a box; a paste or autofill spreads across several.
    const next = (digits.slice(0, index) + chars + digits.slice(index + 1)).slice(0, length);
    setValue(next);
    focusInput(Math.min(index + chars.length, length - 1));
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setValue(digits.slice(0, index - 1) + digits.slice(index));
      focusInput(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    onInputChange(index, event.clipboardData.getData("text"));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <fieldset ref={rootRef} className={cn("m-0 inline-flex gap-2 border-0 p-0", className)}>
        <legend className="sr-only">Verification code</legend>
        {Array.from({ length }, (_, index) => index).map((index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={length}
            disabled={disabled || checking}
            aria-invalid={effectiveInvalid}
            value={digits[index] ?? ""}
            onChange={(event) => onInputChange(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            onPaste={(event) => onPaste(index, event)}
            onFocus={(event) => event.target.select()}
            className={cn(
              "h-12 w-10 rounded-xl bg-card text-center text-lg font-medium text-foreground shadow-[0_0_0_1px_var(--border-strong)] outline-none transition-shadow duration-150 ease-out",
              "focus:shadow-[0_0_0_2px_var(--accent)]",
              effectiveSuccess
                ? "shadow-[0_0_0_2px_var(--success)]"
                : "aria-invalid:shadow-[0_0_0_2px_var(--destructive)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        ))}
        {name ? <input type="hidden" name={name} value={digits} /> : null}
      </fieldset>
      {showStatus ? (
        <span ref={statusRef} role="status" className="inline-flex items-center gap-2 text-xs font-medium">
          <span aria-hidden="true" className="grid h-3.5 w-3.5 place-items-center">
            <Loader2
              className={cn(SWAP, "h-3.5 w-3.5 animate-spin text-muted-foreground", checking ? SHOWN : HIDDEN)}
            />
            <Check
              strokeWidth={3}
              className={cn(SWAP, "h-3.5 w-3.5 text-success", checking ? HIDDEN : SHOWN)}
            />
          </span>
          <span aria-hidden="true" className="grid">
            <span className={cn(SWAP, "text-muted-foreground", checking ? SHOWN : HIDDEN)}>Verifying</span>
            <span className={cn(SWAP, "text-success", checking ? HIDDEN : SHOWN)}>Verified</span>
          </span>
          <span className="sr-only">{checking ? "Verifying" : "Verified"}</span>
        </span>
      ) : null}
    </div>
  );
}
