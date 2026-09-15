"use client";

import { File as FileIcon, Upload, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type DragEvent, useId, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  /** Controlled list of picked files. */
  value?: File[];
  /** Starting files when uncontrolled. Default []. */
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  /** MIME types or extensions accepted, passed to the native file input. */
  accept?: string;
  /** Allows picking or dropping more than one file at once. Default true. */
  multiple?: boolean;
  /** Largest a single file may be, in bytes. Larger files are rejected with an inline error. */
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A dropzone that also opens the native file picker on click. Picked files
 * land in a list below it, popping in on arrival, collapsing on remove.
 * Nothing here uploads anything: it just hands back File objects.
 */
export function FileUpload({
  value,
  defaultValue = [],
  onChange,
  accept,
  multiple = true,
  maxSize,
  disabled = false,
  className,
}: FileUploadProps) {
  const reduce = useReducedMotion();
  const inputId = useId();
  const dragCount = useRef(0);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isControlled = value !== undefined;
  const files = isControlled ? value : uncontrolled;

  const setFiles = (next: File[]) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  const showError = (message: string) => {
    setError(message);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(null), 3000);
  };

  const addFiles = (incoming: File[]) => {
    const accepted: File[] = [];
    let oversized: File | undefined;
    for (const file of incoming) {
      if (maxSize && file.size > maxSize) {
        oversized = file;
        continue;
      }
      accepted.push(file);
    }
    if (oversized) showError(`${oversized.name} is larger than ${formatSize(maxSize as number)}.`);
    if (accepted.length === 0) return;
    setFiles(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragCount.current = 0;
    setDragging(false);
    if (!disabled) addFiles(Array.from(event.dataTransfer.files));
  };

  const onDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragCount.current += 1;
    if (!disabled) setDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragCount.current = Math.max(0, dragCount.current - 1);
    if (dragCount.current === 0) setDragging(false);
  };

  const remove = (index: number) => setFiles(files.filter((_, i) => i !== index));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label
        htmlFor={inputId}
        data-dragging={dragging}
        onDragEnter={onDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex touch-manipulation flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border px-6 py-10 text-center transition-colors duration-150 ease-out",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-border-strong hover:bg-muted/40",
          "data-[dragging=true]:border-accent data-[dragging=true]:bg-accent/5",
        )}
      >
        <Upload aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Click to upload</span> or drag and drop
        </p>
        {accept ? <p className="text-xs text-muted-foreground">{accept.split(",").join(", ")}</p> : null}
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) addFiles(Array.from(event.target.files));
            event.target.value = "";
          }}
          className="sr-only"
        />
      </label>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {files.map((file, index) => (
              <motion.li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="flex items-center gap-2.5 overflow-hidden rounded-xl bg-card px-3 py-2 shadow-[0_0_0_1px_var(--border)]"
              >
                <FileIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => remove(index)}
                  className="relative -mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : null}
    </div>
  );
}
