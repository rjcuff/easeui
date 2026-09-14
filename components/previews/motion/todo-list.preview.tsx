import { TodoList } from "@/components/motion/todo-list";

const ITEMS = [
  { id: "1", label: "Read the failing test", status: "done" as const },
  { id: "2", label: "Reproduce the bug locally", status: "done" as const },
  {
    id: "3",
    label: "Patch the race condition",
    status: "active" as const,
    meta: "lib/queue.ts",
  },
  { id: "4", label: "Add a regression test", status: "pending" as const },
];

export function TodoListPreview() {
  return (
    <div className="w-full max-w-sm">
      <TodoList title="Fix flaky test" items={ITEMS} />
    </div>
  );
}
