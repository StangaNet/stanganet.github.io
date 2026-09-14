import type { LibraryDoc, TypeDoc } from './types';
import { docStringsIt } from './docStringsIt';

const TEXT_KEYS = new Set([
  'summary',
  'description',
  'remarks',
  'tagline',
  'title',
]);

function tr(value: string, locale: string): string {
  if (locale !== 'it') return value;
  return docStringsIt[value] ?? value;
}

function mapUnknown(value: unknown, locale: string): unknown {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapUnknown(item, locale));
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string' && TEXT_KEYS.has(key)) {
        out[key] = tr(val, locale);
      } else {
        out[key] = mapUnknown(val, locale);
      }
    }
    return out;
  }
  return value;
}

export function localizeLibraries(libraries: LibraryDoc[], locale: string): LibraryDoc[] {
  if (locale !== 'it') return libraries;
  return libraries.map((lib) => mapUnknown(lib, locale) as LibraryDoc);
}

export function localizeLibrary(library: LibraryDoc, locale: string): LibraryDoc {
  if (locale !== 'it') return library;
  return mapUnknown(library, locale) as LibraryDoc;
}

export function localizeType(type: TypeDoc, locale: string): TypeDoc {
  if (locale !== 'it') return type;
  return mapUnknown(type, locale) as TypeDoc;
}
