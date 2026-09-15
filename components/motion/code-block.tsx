"use client";

import { FileCode } from "lucide-react";
import { CopyButton } from "@/components/motion/copy-button";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  /** Shown in the header, such as a language name or a filename. Default "code". */
  label?: string;
  className?: string;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case",
  "break", "continue", "class", "interface", "type", "extends", "implements", "import", "from",
  "export", "default", "async", "await", "new", "this", "super", "try", "catch", "finally", "throw",
  "typeof", "instanceof", "in", "of", "true", "false", "null", "undefined", "void", "yield", "static",
  "public", "private", "protected", "readonly", "def", "elif", "lambda", "pass", "with", "as", "None",
  "True", "False", "self",
]);

type TokenType = "keyword" | "string" | "comment" | "number" | "plain";
type Token = { text: string; type: TokenType };

const TOKEN_PATTERN =
  /(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;

/** A best-effort tokenizer for keywords, strings, comments and numbers. Not a real parser. */
function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: line.slice(last, index), type: "plain" });
    const text = match[0];
    const type: TokenType =
      text.startsWith("//") || text.startsWith("#")
        ? "comment"
        : /^["'`]/.test(text)
          ? "string"
          : /^\d/.test(text)
            ? "number"
            : KEYWORDS.has(text)
              ? "keyword"
              : "plain";
    tokens.push({ text, type });
    last = index + text.length;
  }
  if (last < line.length) tokens.push({ text: line.slice(last), type: "plain" });
  return tokens;
}

const TOKEN_CLASS: Record<TokenType, string> = {
  keyword: "text-accent",
  string: "text-success",
  comment: "italic text-muted-foreground",
  number: "text-warning",
  plain: "text-foreground",
};

/** A code block with a label, a copy button, and light syntax coloring. No highlighter dependency. */
export function CodeBlock({ code, label = "code", className }: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl bg-card font-mono text-[13px] leading-relaxed shadow-[0_0_0_1px_var(--border)]",
        className,
      )}
    >
      <figcaption className="flex h-11 items-center justify-between gap-3 border-b border-border pl-4 pr-1.5">
        <span className="flex min-w-0 items-center gap-2 font-sans text-xs text-muted-foreground">
          <FileCode aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        <CopyButton value={code} />
      </figcaption>
      <pre className="max-h-96 overflow-x-auto overflow-y-auto py-4">
        <code>
          {lines.map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines only append or grow in place while streaming.
            <div key={index} className="px-4">
              {line.length === 0
                ? " "
                : tokenize(line).map((token, tokenIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: tokens are recomputed fresh from the line on every render.
                    <span key={tokenIndex} className={TOKEN_CLASS[token.type]}>
                      {token.text}
                    </span>
                  ))}
            </div>
          ))}
        </code>
      </pre>
    </figure>
  );
}
