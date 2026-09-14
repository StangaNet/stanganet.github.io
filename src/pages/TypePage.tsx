import { Link, useParams } from 'react-router-dom';
import {
  EnumTable,
  EventTable,
  FieldTable,
  MethodList,
  PropertyTable,
  TypeParamTable,
} from '../components/docs/member-lists';
import { CodeBlock, InlineCode, KindBadge, MemberSection } from '../components/docs/primitives';
import { getType } from '../data/docs';
import { NotFound } from './NotFound';
import { useI18n } from '../i18n';

export function TypePage() {
  const { library: librarySlug, type: typeSlug } = useParams<{ library: string; type: string }>();
  const { t, path, locale } = useI18n();
  const found = librarySlug && typeSlug ? getType(librarySlug, typeSlug, locale) : undefined;
  if (!found) return <NotFound />;

  const { library, namespace, type } = found;

  const sections = [
    type.typeParameters?.length && { id: 'type-parameters', label: t.docs.typeParameters },
    type.constructors?.length && { id: 'constructors', label: t.docs.constructors },
    type.properties?.length && { id: 'properties', label: t.docs.properties },
    type.methods?.length && { id: 'methods', label: t.docs.methods },
    type.fields?.length && { id: 'fields', label: t.docs.fields },
    type.events?.length && { id: 'events', label: t.docs.events },
    type.enumValues?.length && { id: 'values', label: t.docs.enumValues },
    type.example && { id: 'example', label: t.docs.example },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="min-w-0">
      <nav className="min-w-0 font-mono text-xs text-muted-foreground">
        <Link to={path('/docs')} className="hover:text-foreground">
          docs
        </Link>
        {' / '}
        <Link to={path(`/docs/${library.slug}`)} className="hover:text-foreground">
          {library.slug}
        </Link>
        <span className="break-all"> / {type.slug}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <KindBadge kind={type.kind} />
        <h1 className="min-w-0 break-words font-mono text-2xl font-extrabold tracking-tight sm:text-3xl">
          {type.displayName}
        </h1>
      </div>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{namespace.name}</p>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{type.summary}</p>

      <div className="mt-6">
        <CodeBlock label={t.docs.declaration} lang="csharp" code={type.signature} />
      </div>

      {(type.inherits || type.implements?.length) && (
        <div className="mt-5 grid gap-2 text-sm">
          {type.inherits && (
            <p>
              <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                {t.docs.inherits}{' '}
              </span>
              <InlineCode>{type.inherits}</InlineCode>
            </p>
          )}
          {type.implements?.length ? (
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
                {t.docs.implements}
              </span>
              {type.implements.map((item) => (
                <InlineCode key={item}>{item}</InlineCode>
              ))}
            </p>
          ) : null}
        </div>
      )}

      {type.remarks && (
        <div className="mt-6 rounded-md border-l-2 border-primary bg-muted/60 p-4">
          <p className="font-mono text-[11px] font-semibold uppercase text-muted-foreground">
            {t.docs.remarks}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{type.remarks}</p>
        </div>
      )}

      {sections.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-12">
        {type.typeParameters?.length ? (
          <MemberSection id="type-parameters" title={t.docs.typeParameters} count={type.typeParameters.length}>
            <TypeParamTable params={type.typeParameters} />
          </MemberSection>
        ) : null}
        {type.constructors?.length ? (
          <MemberSection id="constructors" title={t.docs.constructors} count={type.constructors.length}>
            <MethodList methods={type.constructors} />
          </MemberSection>
        ) : null}
        {type.properties?.length ? (
          <MemberSection id="properties" title={t.docs.properties} count={type.properties.length}>
            <PropertyTable properties={type.properties} />
          </MemberSection>
        ) : null}
        {type.methods?.length ? (
          <MemberSection id="methods" title={t.docs.methods} count={type.methods.length}>
            <MethodList methods={type.methods} />
          </MemberSection>
        ) : null}
        {type.fields?.length ? (
          <MemberSection id="fields" title={t.docs.fields} count={type.fields.length}>
            <FieldTable fields={type.fields} />
          </MemberSection>
        ) : null}
        {type.events?.length ? (
          <MemberSection id="events" title={t.docs.events} count={type.events.length}>
            <EventTable events={type.events} />
          </MemberSection>
        ) : null}
        {type.enumValues?.length ? (
          <MemberSection id="values" title={t.docs.enumValues} count={type.enumValues.length}>
            <EnumTable values={type.enumValues} />
          </MemberSection>
        ) : null}
        {type.example && (
          <MemberSection id="example" title={t.docs.example}>
            <CodeBlock label={type.example.title} lang="csharp" code={type.example.code} />
          </MemberSection>
        )}
        {type.seeAlso?.length ? (
          <MemberSection id="see-also" title={t.docs.seeAlso}>
            <ul className="grid gap-2 text-sm">
              {type.seeAlso.map((item) => (
                <li key={item}>
                  <InlineCode>{item}</InlineCode>
                </li>
              ))}
            </ul>
          </MemberSection>
        ) : null}
      </div>
    </div>
  );
}
