import { MessageBubble } from "@/components/motion/message-bubble";

export function MessageBubblePreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MessageBubble align="start">
        Can you summarize the latest deploy logs?
      </MessageBubble>
      <MessageBubble align="end" tone="accent">
        Sure, pulling the last run now.
      </MessageBubble>
      <MessageBubble align="end" tone="accent">
        Build passed. Two warnings, no errors.
      </MessageBubble>
    </div>
  );
}
