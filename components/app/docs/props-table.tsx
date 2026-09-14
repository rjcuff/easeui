import type { ComponentPropsDoc } from "@/lib/props-extractor";

/**
 * Every prop from every exported component in one table. A component column
 * appears only when the file exports more than one component.
 */
export function PropsTable({ docs }: { docs: ComponentPropsDoc[] }) {
  const withProps = docs.filter((doc) => doc.props.length > 0);
  if (!withProps.length) return null;
  const showComponent = withProps.length > 1;

  const rows = withProps.flatMap((doc) =>
    doc.props.map((prop) => ({ component: doc.displayName, ...prop })),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-card text-xs text-muted-foreground">
            {showComponent ? <th className="px-4 py-2.5 font-medium">Component</th> : null}
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.component}-${row.name}`}
              className="border-b border-border align-top last:border-b-0"
            >
              {showComponent ? (
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                  {row.component}
                </td>
              ) : null}
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                {row.name}
                {row.required ? null : <span className="text-muted-foreground">?</span>}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
                {row.type}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                {row.defaultValue ?? "-"}
              </td>
              <td className="px-4 py-3 text-sm leading-6 text-muted-foreground">
                {row.description || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
