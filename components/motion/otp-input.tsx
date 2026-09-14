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
  /** Switches the ring to the success color and pops in a check beside the boxes. Ignored while onVerify is set. */
  success?: boolean;
  disabled?: boolean;
  /** Name for a hidden input, so the code submits with a plain HTML form. */
  name?: string;
  className?: string;
}

// A short, gentle nudge rather than a rattle: two small swings that settle by 260ms.
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

const CHECK_POP: Keyframe[] = [
  { transform: "scale(0.6)", opacity: 0 },
  { transform: "scale(1)", opacity: 1 },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The check that pops in beside the boxes once the code is marked correct. */
function SuccessCheck() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.animate(CHECK_POP, { duration: 200, easing: EASE_OUT_CSS });
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}

/**
 * A verification code as one box per digit. Typing advances to the next box,
 * Backspace steps back through empty ones, and pasting or an SMS autofill
 * spreads its digits across the remaining boxes. Marking it invalid gives the
 * row a short, gentle shake; marking it a success pops a check in beside it.
 * Pass onVerify and the input runs the whole check-and-color cycle itself.
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
  const prevDigits = useRef(digits);
  const wasComplete = useRef(false);
  const verifyToken = useRef(0);

  // Drives its own status once onVerify is set. Otherwise the invalid/success props apply directly.
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "invalid">("idle");
  const checking = Boolean(onVerify) && status === "checking";
  const effectiveInvalid = onVerify ? status === "invalid" : invalid;
  const effectiveSuccess = onVerify ? status === "success" : success;

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

  // Pops each newly filled box, and shakes the whole row once when it turns invalid.
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
    // A short delay lets the last box's own pop settle before the row shakes,
    // so the two don't read as one overloaded motion.
    root.animate(SHAKE, { duration: 260, delay: 80, easing: "ease-out" });
  }, [effectiveInvalid]);

  const focusInput = (index: number) => refs.current[index]?.focus();

  const onInputChange = (index: number, raw: string) => {
    const chars = raw.replace(/\D/g, "");
    if (!chars) {
      setValue(digits.slice(0, index) + digits.slice(index + 1));
      return;
    }
    // A single keystroke replaces this box. A longer string, from a paste or an
    // SMS autofill landing in one box, spreads across this box and the ones after it.
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
      <div className="inline-flex items-center gap-3">
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
        {effectiveSuccess ? <SuccessCheck /> : null}
      </div>
      {checking ? (
        <span role="status" className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
          Verifying
        </span>
      ) : null}
    </div>
  );
}
