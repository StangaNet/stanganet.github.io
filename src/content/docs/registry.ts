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
} from './types';

export { kindLabels } from './types';

import type { LibraryDoc } from './types';
import { authLibrary } from './libraries/auth';
import { cachingLibrary } from './libraries/caching';
import { concurrencyLibrary } from './libraries/concurrency';
import { contentFlowLibrary } from './libraries/contentflow';
import { coreLibrary } from './libraries/core';
import { cryptographyLibrary } from './libraries/cryptography';
import { eventBusLibrary } from './libraries/eventbus';
import { featureFlagsLibrary } from './libraries/featureflags';
import { gdprLibrary } from './libraries/gdpr';
import { jobsLibrary } from './libraries/jobs';
import { mediaLibrary } from './libraries/media';
import { notificationsLibrary } from './libraries/notifications';
import { observabilityLibrary } from './libraries/observability';
import { requestProtectionLibrary } from './libraries/requestprotection';
import { resilienceLibrary } from './libraries/resilience';
import { schemaRegistryLibrary } from './libraries/schemaregistry';
import { searchLibrary } from './libraries/search';
import { storageLibrary } from './libraries/storage';
import { tenancyLibrary } from './libraries/tenancy';
import { localizeLibraries, localizeLibrary, localizeType } from './localize';

/** English source of truth (API identifiers are always English). */
export const librariesEn: LibraryDoc[] = [
  coreLibrary,
  concurrencyLibrary,
  resilienceLibrary,
  cachingLibrary,
  storageLibrary,
  mediaLibrary,
  authLibrary,
  observabilityLibrary,
  gdprLibrary,
  contentFlowLibrary,
  cryptographyLibrary,
  tenancyLibrary,
  featureFlagsLibrary,
  jobsLibrary,
  requestProtectionLibrary,
  schemaRegistryLibrary,
  notificationsLibrary,
  searchLibrary,
  eventBusLibrary,
];

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
  (total, library) =>
    total + library.namespaces.reduce((sum, ns) => sum + ns.types.length, 0),
  0,
);
