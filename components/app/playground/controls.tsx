"use client";

import type { ReactNode } from "react";
import { RangeSlider } from "@/components/motion/range-slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import type { ControlDef, ControlValue, Values } from "./core";

/** Decimal places implied by a step, such as 0.05 giving 2. */
const decimalsOf = (step: number) => (String(step).split(".")[1] ?? "").length;

function Field({
  label,
  readout,
  hint,
  children,
}: {
  label: string;
  readout?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        {readout ? (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{readout}</span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Controls({
  controls,
  values,
  onChange,
}: {
  controls: ControlDef[];
  values: Values;
  onChange: (key: string, value: ControlValue) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {controls.map((control) => {
        const raw = values[control.key];

        if (control.kind === "select") {
          const current = typeof raw === "string" ? raw : control.options[0]?.value;
          return (
            <Field key={control.key} label={control.label} hint={control.hint}>
              <Select value={current} onValueChange={(next) => onChange(control.key, next)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {control.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          );
        }

        const current = typeof raw === "number" ? raw : control.min;
        const readout = `${+current.toFixed(decimalsOf(control.step))}${control.unit ?? ""}`;
        return (
          <Field key={control.key} label={control.label} readout={readout} hint={control.hint}>
            <RangeSlider
              aria-label={control.label}
              min={control.min}
              max={control.max}
              step={control.step}
              value={current}
              onValueChange={(next) => onChange(control.key, next)}
            />
          </Field>
        );
      })}
    </div>
  );
}
