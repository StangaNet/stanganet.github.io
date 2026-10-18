export type HighlightPair = readonly [string, string];

const libraryHighlightsEn: Record<string, readonly HighlightPair[]> = {
  core: [
    ['AggregateRoot<TId>', 'Domain entities with event tracking'],
    ['Result<T>', 'Explicit, functional outcomes'],
    ['ISpecification<T>', 'Encapsulated query rules'],
    ['ValueObject', 'Structural equality for domain values'],
  ],
};

const libraryHighlightsIt: Record<string, readonly HighlightPair[]> = {
  core: [
    ['AggregateRoot<TId>', 'Entity di dominio con tracking degli eventi'],
    ['Result<T>', 'Esiti espliciti e funzionali'],
    ['ISpecification<T>', 'Regole di query incapsulate'],
    ['ValueObject', 'Uguaglianza strutturale per valori di dominio'],
  ],
};

export function getLibraryHighlights(locale: string, slug: string): readonly HighlightPair[] {
  const table = locale === 'it' ? libraryHighlightsIt : libraryHighlightsEn;
  return table[slug] ?? table.core;
}
