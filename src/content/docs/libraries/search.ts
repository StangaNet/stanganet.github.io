import type { LibraryDoc } from '../types';

export const searchLibrary: LibraryDoc = {
  slug: 'search',
  name: 'StangaNetLib.Search',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0'],
  tagline: 'Search abstractions with in-memory BM25 provider',
  description:
    'ISearchService and in-memory BM25 indexing for full-text search without external dependencies.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Search',
  namespaces: [
    {
      name: 'StangaNetLib.Search.Abstractions',
      summary: 'Types in StangaNetLib.Search.Abstractions.',
      types: [
        {
          slug: 'i-search-index-manager',
          name: 'ISearchIndexManager',
          displayName: 'ISearchIndexManager',
          kind: 'interface',
          namespace: 'StangaNetLib.Search.Abstractions',
          summary: 'Manages search index lifecycle: creation, deletion, existence checks, and reindexing.',
          signature: 'public interface ISearchIndexManager',
        },
        {
          slug: 'i-search-service-t-document',
          name: 'ISearchService',
          displayName: 'ISearchService<TDocument>',
          kind: 'interface',
          namespace: 'StangaNetLib.Search.Abstractions',
          summary: 'Provides document indexing and search operations for a specific document type. Each registration targets a single named index.',
          signature: 'public interface ISearchService<TDocument> where TDocument : class',
          inherits: 'class',
          typeParameters: [
            { name: 'TDocument', constraint: 'class', description: 'Type parameter TDocument.' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Search.Extensions',
      summary: 'Types in StangaNetLib.Search.Extensions.',
      types: [
        {
          slug: 'product-service',
          name: 'ProductService',
          displayName: 'ProductService',
          kind: 'class',
          namespace: 'StangaNetLib.Search.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Search services.',
          signature: 'public class ProductService(ISearchService&lt;ProductDocument&gt; search)',
        },
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Search.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Search services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibSearch', signature: 'public static IServiceCollection AddStangaNetLibSearch<TDocument>( this IServiceCollection services, string indexName)', summary: 'Registers StangaNetLib.Search with the in-memory backend for TDocument using the specified indexName.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'indexName', type: 'string', description: 'indexName' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibSearch', signature: 'public static IServiceCollection AddStangaNetLibSearch<TDocument>( this IServiceCollection services, IConfiguration configuration, string configSection = SearchSettings.SectionName)', summary: 'Registers StangaNetLib.Search with the in-memory backend for TDocument, reading the index name from configSection in configuration. When IndexName is not configured or empty, falls back to typeof(TDocument).Name.ToLowerInvariant().', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }, { name: 'configSection', type: 'string', description: 'configSection', optional: true }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Search.Models',
      summary: 'Types in StangaNetLib.Search.Models.',
      types: [
        {
          slug: 'search-query',
          name: 'SearchQuery',
          displayName: 'SearchQuery',
          kind: 'class',
          namespace: 'StangaNetLib.Search.Models',
          summary: 'Represents a search request: full-text term, field filters, pagination, sorting, and facets.',
          signature: 'public sealed class SearchQuery',
          properties: [
            { name: 'Term', type: 'string?', access: 'get; init', summary: 'Full-text search term. When or empty, all documents match and results are ordered by SortBy or by document ID.' },
            { name: 'Filters', type: 'IReadOnlyDictionary<string, string[]>', access: 'get; init', summary: 'Field-level filters. Key is the field name; value is the list of accepted values (OR logic within a field, AND logic across fields). Example: { "Category": ["Electronics", "Computers"], "Brand": ["Apple"] }' },
            { name: 'SortBy', type: 'string?', access: 'get; init', summary: 'Field name to sort by. When , results are ordered by relevance score descending (when a Term is provided) or by document ID.' },
            { name: 'SortDescending', type: 'bool', access: 'get; init', summary: 'When and SortBy is set, sorts in descending order.' },
            { name: 'PageNumber', type: 'int', access: 'get; init', summary: 'PageNumber' },
            { name: 'PageSize', type: 'int', access: 'get; init', summary: 'Number of results per page. Defaults to 20. Must be between 1 and 1000.' },
            { name: 'Facets', type: 'string[]', access: 'get; init', summary: 'Field names for which to compute facet value counts. An empty array disables facet computation.' },
          ],
        },
        {
          slug: 'search-result-t-document',
          name: 'SearchResult',
          displayName: 'SearchResult<TDocument>',
          kind: 'class',
          namespace: 'StangaNetLib.Search.Models',
          summary: 'The result of a SearchAsync call.',
          signature: 'public sealed class SearchResult<TDocument>',
          typeParameters: [
            { name: 'TDocument', description: 'Type parameter TDocument.' },
          ],
          properties: [
            { name: 'Hits', type: 'IReadOnlyList<SearchHit<TDocument>>', access: 'get; init', summary: 'Hits' },
            { name: 'TotalCount', type: 'long', access: 'get; init', summary: 'TotalCount' },
            { name: 'PageNumber', type: 'int', access: 'get; init', summary: 'PageNumber' },
            { name: 'PageSize', type: 'int', access: 'get; init', summary: 'PageSize' },
            { name: 'Facets', type: 'IReadOnlyDictionary<string, FacetResult>', access: 'get; init', summary: 'Facets' },
            { name: 'TookMilliseconds', type: 'long', access: 'get; init', summary: 'TookMilliseconds' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Search.Settings',
      summary: 'Types in StangaNetLib.Search.Settings.',
      types: [
        {
          slug: 'search-settings',
          name: 'SearchSettings',
          displayName: 'SearchSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Search.Settings',
          summary: 'Configuration for a search index registration.',
          signature: 'public sealed class SearchSettings',
          properties: [
            { name: 'IndexName', type: 'string', access: 'get; set', summary: 'Name of the search index. When empty, the document type\'s simple name (lowercased) is used as the default index name.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"Search"' },
          ],
        }
      ],
    }
  ],
};
