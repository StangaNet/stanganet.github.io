export type {
  TypeKind,
  Param,
  MethodDoc,
  PropertyDoc,
  FieldDoc,
  EventDoc,
  EnumValueDoc,
  TypeParamDoc,
  TypeDoc,
  NamespaceDoc,
  LibraryDoc,
} from './docs/types';

export { kindLabels } from './docs/types';

import type { LibraryDoc } from './docs/types';
import { coreLibrary } from './docs/core';
import { contentFlowLibrary } from './docs/contentflow';
import { resilienceLibrary } from './docs/resilience';
import { concurrencyLibrary } from './docs/concurrency';
import { gdprLibrary } from './docs/gdpr';
import { localizeLibraries, localizeLibrary, localizeType } from './docs/localize';

/** English source of truth (API identifiers are always English). */
export const librariesEn: LibraryDoc[] = [coreLibrary, contentFlowLibrary, resilienceLibrary, concurrencyLibrary, gdprLibrary];

/** @deprecated Prefer getLibraries(locale) for localized UI/docs text. */
export const libraries: LibraryDoc[] = librariesEn;

export function getLibraries(locale: string = 'en'): LibraryDoc[] {
  return localizeLibraries(librariesEn, locale);
}

export function getLibrary(slug: string, locale: string = 'en') {
  const library = librariesEn.find((item) => item.slug === slug);
  if (!library) return undefined;
  return localizeLibrary(library, locale);
}

export function getType(librarySlug: string, typeSlug: string, locale: string = 'en') {
  const base = librariesEn.find((item) => item.slug === librarySlug);
  if (!base) return undefined;
  for (const ns of base.namespaces) {
    const type = ns.types.find((t) => t.slug === typeSlug);
    if (type) {
      const library = localizeLibrary(base, locale);
      const namespace = library.namespaces.find((n) => n.name === ns.name)!;
      const localizedType = localizeType(type, locale);
      return { library, namespace, type: localizedType };
    }
  }
  return undefined;
}

export const allTypesCount = librariesEn.reduce(
  (total, library) => total + library.namespaces.reduce((sum, ns) => sum + ns.types.length, 0),
  0,
);
