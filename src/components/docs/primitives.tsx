import { useCallback, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { kindLabels, type TypeKind } from '../../data/docs';
import { highlightCode } from '../../utils/highlight';
import { useOptionalI18n } from '../../i18n';

const kindStyles: Record<TypeKind, string> = {
  class: 'border-primary/30 bg-primary/10 text-primary',
  interface: 'border-chart-2/40 bg-chart-2/10 text-chart-2',
  enum: 'border-chart-4/50 bg-chart-4/15 text-chart-4',
  record: 'border-success/40 bg-success/10 text-success',
  struct: 'border-chart-3/40 bg-chart-3/10 text-chart-3',
  delegate: 'border-border bg-muted text-muted-foreground',
};

const kindLabelsIt: Record<TypeKind, string> = {
  class: 'Classe',
  interface: 'Interfaccia',
  enum: 'Enum',
  record: 'Record',
  struct: 'Struct',
  delegate: 'Delegate',
};

export function KindBadge({ kind, className }: { kind: TypeKind; className?: string }) {
  const i18n = useOptionalI18n();
  const labels = i18n?.locale === 'it' ? kindLabelsIt : kindLabels;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide',
        kindStyles[kind],
        className,
      )}
    >
      {labels[kind]}
    </span>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CodeBlock({
  code,
  label,
  lang,
}: {
  code: string;
  label?: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);
  const i18n = useOptionalI18n();
  const copyLabel = i18n?.t.code.copy ?? 'Copy';
  const copiedLabel = i18n?.t.code.copied ?? 'Copied';
  const codeLabel = i18n?.t.code.code ?? 'code';

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [code]);

  const html = highlightCode(code, lang);

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-label">{label ?? lang ?? codeLabel}</span>
        <button
          type="button"
          className="code-block-copy"
          data-copied={copied ? 'true' : 'false'}
          onClick={onCopy}
          aria-label={copied ? copiedLabel : copyLabel}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="code-block-body">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">
      {children}
    </code>
  );
}

export function MemberSection({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-center gap-3 text-xl font-bold">
        {title}
        {typeof count === 'number' && (
          <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
            {count}
          </span>
        )}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
