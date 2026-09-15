import { CodeBlock } from "@/components/motion/code-block";

const CODE = `function greet(name) {
  // Say hello, politely
  const message = \`Hello, \${name}!\`;
  return message;
}`;

export function CodeBlockPreview() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock code={CODE} label="greet.js" />
    </div>
  );
}
