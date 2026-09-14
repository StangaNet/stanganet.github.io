import type {
  EnumValueDoc,
  EventDoc,
  FieldDoc,
  MethodDoc,
  PropertyDoc,
  TypeParamDoc,
} from "../../data/docs";
import { CodeBlock, InlineCode } from "./primitives";

function Modifier({ label }: { label: string }) {
  return (
    <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-muted-foreground">
      {label}
    </span>
  );
}

export function MethodList({ methods }: { methods: MethodDoc[] }) {
  return (
    <div className="grid gap-4">
      {methods.map((method) => (
        <article
          key={method.signature}
          id={`m-${method.name.toLowerCase()}`}
          className="min-w-0 scroll-mt-24 rounded-md border border-border bg-card p-5"
        >
          <header className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-[15px] font-semibold">{method.name}</h3>
            {method.isStatic && <Modifier label="static" />}
            {method.isAsync && <Modifier label="async" />}
            {method.isVirtual && <Modifier label="virtual" />}
          </header>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{method.summary}</p>
          <div className="mt-4">
            <CodeBlock lang="csharp" code={method.signature} />
          </div>
          {method.parameters?.length ? (
            <div className="mt-4 min-w-0">
              <p className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">Parameters</p>
              <ul className="mt-2 grid gap-2">
                {method.parameters.map((parameter) => (
                  <li key={parameter.name} className="text-sm leading-6">
                    <InlineCode>{parameter.name}</InlineCode>{" "}
                    <span className="font-mono text-xs text-primary">{parameter.type}</span>
                    {parameter.optional && <span className="ml-2 text-xs text-muted-foreground">(optional)</span>}
                    <span className="text-muted-foreground"> — {parameter.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {method.returns && (
            <p className="mt-4 text-sm leading-6">
              <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">Returns </span>
              <span className="text-muted-foreground">{method.returns}</span>
            </p>
          )}
          {method.exceptions?.length ? (
            <div className="mt-4">
              <p className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">Exceptions</p>
              <ul className="mt-2 grid gap-1 text-sm">
                {method.exceptions.map((exception) => (
                  <li key={exception.type}>
                    <InlineCode>{exception.type}</InlineCode>
                    <span className="text-muted-foreground"> — {exception.when}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function TableShell({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead className="bg-muted">
          <tr>
            {head.map((label) => (
              <th key={label} className="px-4 py-3 font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">{children}</tbody>
      </table>
    </div>
  );
}

export function PropertyTable({ properties }: { properties: PropertyDoc[] }) {
  return (
    <TableShell head={["Name", "Type", "Accessors", "Summary"]}>
      {properties.map((property) => (
        <tr key={property.name}>
          <td className="px-4 py-3 font-mono font-medium">{property.name}</td>
          <td className="px-4 py-3 font-mono text-xs text-primary">{property.type}</td>
          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{property.access}</td>
          <td className="px-4 py-3 leading-6 text-muted-foreground">{property.summary}</td>
        </tr>
      ))}
    </TableShell>
  );
}

export function FieldTable({ fields }: { fields: FieldDoc[] }) {
  return (
    <TableShell head={["Name", "Type", "Value", "Summary"]}>
      {fields.map((field) => (
        <tr key={field.name}>
          <td className="px-4 py-3 font-mono font-medium">{field.name}</td>
          <td className="px-4 py-3 font-mono text-xs text-primary">{field.type}</td>
          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{field.value ?? "—"}</td>
          <td className="px-4 py-3 leading-6 text-muted-foreground">{field.summary}</td>
        </tr>
      ))}
    </TableShell>
  );
}

export function EventTable({ events }: { events: EventDoc[] }) {
  return (
    <TableShell head={["Name", "Handler type", "Summary"]}>
      {events.map((event) => (
        <tr key={event.name}>
          <td className="px-4 py-3 font-mono font-medium">{event.name}</td>
          <td className="px-4 py-3 font-mono text-xs text-primary">{event.type}</td>
          <td className="px-4 py-3 leading-6 text-muted-foreground">{event.summary}</td>
        </tr>
      ))}
    </TableShell>
  );
}

export function EnumTable({ values }: { values: EnumValueDoc[] }) {
  return (
    <TableShell head={["Member", "Value", "Summary"]}>
      {values.map((value) => (
        <tr key={value.name}>
          <td className="px-4 py-3 font-mono font-medium">{value.name}</td>
          <td className="px-4 py-3 font-mono text-xs text-primary">{value.value}</td>
          <td className="px-4 py-3 leading-6 text-muted-foreground">{value.summary}</td>
        </tr>
      ))}
    </TableShell>
  );
}

export function TypeParamTable({ params }: { params: TypeParamDoc[] }) {
  return (
    <TableShell head={["Parameter", "Constraint", "Description"]}>
      {params.map((param) => (
        <tr key={param.name}>
          <td className="px-4 py-3 font-mono font-medium">{param.name}</td>
          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
            {param.constraint ? `where ${param.name} : ${param.constraint}` : "—"}
          </td>
          <td className="px-4 py-3 leading-6 text-muted-foreground">{param.description}</td>
        </tr>
      ))}
    </TableShell>
  );
}
