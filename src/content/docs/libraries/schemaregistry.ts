import type { LibraryDoc } from '../types';

export const schemaRegistryLibrary: LibraryDoc = {
  slug: 'schemaregistry',
  name: 'StangaNetLib.SchemaRegistry',
  version: '1.1.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Versioned JSON schemas with portable backup manifests',
  description:
    'JSON payload validation against versioned schemas with in-process and remote registry backends, portable backup-manifest schemas, and registry snapshot export/import.',
  repository: 'https://github.com/StangaNet/StangaNetLib.SchemaRegistry',
  namespaces: [
    {
      name: 'StangaNetLib.SchemaRegistry.Abstractions',
      summary: 'Types in StangaNetLib.SchemaRegistry.Abstractions.',
      types: [
        {
          slug: 'i-schema-registry',
          name: 'ISchemaRegistry',
          displayName: 'ISchemaRegistry',
          kind: 'interface',
          namespace: 'StangaNetLib.SchemaRegistry.Abstractions',
          summary: 'Provides CRUD operations for versioned JSON Schemas grouped by subject.',
          signature: 'public interface ISchemaRegistry',
        },
        {
          slug: 'i-schema-validator',
          name: 'ISchemaValidator',
          displayName: 'ISchemaValidator',
          kind: 'interface',
          namespace: 'StangaNetLib.SchemaRegistry.Abstractions',
          summary: 'Validates JSON payloads against schemas stored in the registry.',
          signature: 'public interface ISchemaValidator',
        }
      ],
    },
    {
      name: 'StangaNetLib.SchemaRegistry.Extensions',
      summary: 'Types in StangaNetLib.SchemaRegistry.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Extensions',
          summary: 'Extension methods for registering StangaNetLib.SchemaRegistry services in the DI container.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibSchemaRegistry', signature: 'public static IServiceCollection AddStangaNetLibSchemaRegistry( this IServiceCollection services, IConfiguration configuration, Action<IHttpClientBuilder>? configureHttpClient = null)', summary: 'Registers ISchemaRegistry and ISchemaValidator based on the "SchemaRegistrySettings" configuration section.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'The service collection to add to. Application configuration. Optional callback invoked on the IHttpClientBuilder when the Http provider is selected. Ignored for the InMemory provider. Use it to attach delegating handlers to the registry\'s HttpClient. Do not combine this with a registered IResilientExecutor; use one approach or the other.' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }, { name: 'configureHttpClient', type: 'Action<IHttpClientBuilder>?', description: 'configureHttpClient', optional: true }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibInMemorySchemaRegistry', signature: 'public static IServiceCollection AddStangaNetLibInMemorySchemaRegistry(this IServiceCollection services)', summary: 'Registers ISchemaRegistry and ISchemaValidator with an in-process, in-memory backend. Suitable for testing and single-instance applications.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibHttpSchemaRegistry', signature: 'public static IServiceCollection AddStangaNetLibHttpSchemaRegistry( this IServiceCollection services, string baseUrl, TimeSpan? timeout = null, Action<IHttpClientBuilder>? configureHttpClient = null)', summary: 'Registers ISchemaRegistry and ISchemaValidator with an HTTP backend pointing to a remote registry.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'The service collection to add to. Base URL of the remote schema registry (e.g. https://schema-registry.example.com). HTTP request timeout. Defaults to 30 seconds. Optional callback to further configure the IHttpClientBuilder for the registry HttpClient. Use it to attach delegating handlers. Do not combine this with a registered IResilientExecutor; use one approach or the other.' }, { name: 'baseUrl', type: 'string', description: 'baseUrl' }, { name: 'timeout', type: 'TimeSpan?', description: 'timeout', optional: true }, { name: 'configureHttpClient', type: 'Action<IHttpClientBuilder>?', description: 'configureHttpClient', optional: true }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibBackupManifestSchemasAsync', signature: 'public static async Task<IServiceProvider> AddStangaNetLibBackupManifestSchemasAsync( this IServiceProvider services, CancellationToken cancellationToken = default)', summary: 'Seeds the embedded stanganet.backup.manifest / 1.0.0 schema into the registered ISchemaRegistry. Call after building the service provider.', parameters: [{ name: 'services', type: 'IServiceProvider', description: 'services' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<IServiceProvider>', isStatic: true, isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.SchemaRegistry.Manifests',
      summary: 'Types in StangaNetLib.SchemaRegistry.Manifests.',
      types: [
        {
          slug: 'backup-manifest',
          name: 'BackupManifest',
          displayName: 'BackupManifest',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Manifests',
          summary: 'class BackupManifest.',
          signature: 'public sealed class BackupManifest',
          properties: [
            { name: 'SchemaVersion', type: 'string', access: 'get; set', summary: 'SchemaVersion' },
            { name: 'ExportedAt', type: 'DateTimeOffset', access: 'get; set', summary: 'ExportedAt' },
            { name: 'Product', type: 'string', access: 'get; set', summary: 'Product' },
            { name: 'ContentHash', type: 'string?', access: 'get; set', summary: 'ContentHash' },
            { name: 'Items', type: 'List<BackupManifestItem>', access: 'get; set', summary: 'Items' },
            { name: 'Encryption', type: 'BackupManifestEncryption?', access: 'get; set', summary: 'Encryption' },
          ],
        },
        {
          slug: 'backup-manifest-encryption',
          name: 'BackupManifestEncryption',
          displayName: 'BackupManifestEncryption',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Manifests',
          summary: 'class BackupManifestEncryption.',
          signature: 'public sealed class BackupManifestEncryption',
          properties: [
            { name: 'Algorithm', type: 'string', access: 'get; set', summary: 'Algorithm' },
            { name: 'Kdf', type: 'string?', access: 'get; set', summary: 'Kdf' },
          ],
        },
        {
          slug: 'backup-manifest-item',
          name: 'BackupManifestItem',
          displayName: 'BackupManifestItem',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Manifests',
          summary: 'class BackupManifestItem.',
          signature: 'public sealed class BackupManifestItem',
          properties: [
            { name: 'Type', type: 'string', access: 'get; set', summary: 'Type' },
            { name: 'Id', type: 'string', access: 'get; set', summary: 'Id' },
            { name: 'Path', type: 'string?', access: 'get; set', summary: 'Path' },
            { name: 'PayloadRef', type: 'string?', access: 'get; set', summary: 'PayloadRef' },
            { name: 'Checksum', type: 'string?', access: 'get; set', summary: 'Checksum' },
            { name: 'SizeBytes', type: 'long?', access: 'get; set', summary: 'SizeBytes' },
          ],
        },
        {
          slug: 'backup-manifest-schema-seeder',
          name: 'BackupManifestSchemaSeeder',
          displayName: 'BackupManifestSchemaSeeder',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Manifests',
          summary: 'class BackupManifestSchemaSeeder.',
          signature: 'public static class BackupManifestSchemaSeeder',
          methods: [
            { name: 'SeedAsync', signature: 'public static async Task<Result> SeedAsync( ISchemaRegistry registry, CancellationToken cancellationToken = default)', summary: 'Registers the embedded stanganet.backup.manifest / 1.0.0 JSON Schema when it is not already present.', parameters: [{ name: 'registry', type: 'ISchemaRegistry', description: 'registry' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isStatic: true, isAsync: true },
          ],
        },
        {
          slug: 'backup-manifest-subjects',
          name: 'BackupManifestSubjects',
          displayName: 'BackupManifestSubjects',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Manifests',
          summary: 'class BackupManifestSubjects.',
          signature: 'public static class BackupManifestSubjects',
          fields: [
            { name: 'BackupManifest', type: 'string', summary: 'BackupManifest', value: '"stanganet.backup.manifest"' },
            { name: 'Version100', type: 'string', summary: 'Version100', value: '"1.0.0"' },
          ],
        },
        {
          slug: 'schema-registry-snapshot',
          name: 'SchemaRegistrySnapshot',
          displayName: 'SchemaRegistrySnapshot',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Manifests',
          summary: 'class SchemaRegistrySnapshot.',
          signature: 'public static class SchemaRegistrySnapshot',
          methods: [
            { name: 'ExportAsync', signature: 'public static async Task<Result<string>> ExportAsync( ISchemaRegistry registry, CancellationToken cancellationToken = default)', summary: 'Exports all subjects/versions currently in registry as a JSON array of SchemaDefinitionSnapshot.', parameters: [{ name: 'registry', type: 'ISchemaRegistry', description: 'registry' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<string>>', isStatic: true, isAsync: true },
            { name: 'ImportAsync', signature: 'public static async Task<Result> ImportAsync( ISchemaRegistry registry, string snapshotJson, CancellationToken cancellationToken = default)', summary: 'Imports schemas from a JSON snapshot produced by ExportAsync. Existing subject/version pairs are skipped (no overwrite).', parameters: [{ name: 'registry', type: 'ISchemaRegistry', description: 'registry' }, { name: 'snapshotJson', type: 'string', description: 'snapshotJson' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isStatic: true, isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.SchemaRegistry.Models',
      summary: 'Types in StangaNetLib.SchemaRegistry.Models.',
      types: [
        {
          slug: 'schema-definition',
          name: 'SchemaDefinition',
          displayName: 'SchemaDefinition',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Models',
          summary: 'Represents a versioned JSON Schema stored in the registry.',
          signature: 'public sealed class SchemaDefinition',
          properties: [
            { name: 'Subject', type: 'string', access: 'get', summary: 'Subject' },
            { name: 'Version', type: 'string', access: 'get', summary: 'Version' },
            { name: 'JsonSchemaContent', type: 'string', access: 'get', summary: 'JsonSchemaContent' },
            { name: 'RegisteredAt', type: 'DateTimeOffset', access: 'get; init', summary: 'RegisteredAt' },
          ],
        },
        {
          slug: 'schema-validation-result',
          name: 'SchemaValidationResult',
          displayName: 'SchemaValidationResult',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Models',
          summary: 'Represents the outcome of validating a JSON payload against a schema.',
          signature: 'public sealed class SchemaValidationResult',
          properties: [
            { name: 'IsValid', type: 'bool', access: 'get', summary: 'IsValid' },
            { name: 'Errors', type: 'IReadOnlyList<string>', access: 'get', summary: 'Errors' },
          ],
          methods: [
            { name: 'Valid', signature: 'public static SchemaValidationResult Valid()', summary: 'Valid', returns: 'SchemaValidationResult', isStatic: true },
            { name: 'Invalid', signature: 'public static SchemaValidationResult Invalid(IReadOnlyList<string> errors)', summary: 'Invalid', parameters: [{ name: 'errors', type: 'IReadOnlyList<string>', description: 'errors' }], returns: 'SchemaValidationResult', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.SchemaRegistry.Settings',
      summary: 'Types in StangaNetLib.SchemaRegistry.Settings.',
      types: [
        {
          slug: 'schema-registry-provider',
          name: 'SchemaRegistryProvider',
          displayName: 'SchemaRegistryProvider',
          kind: 'enum',
          namespace: 'StangaNetLib.SchemaRegistry.Settings',
          summary: 'enum SchemaRegistryProvider.',
          signature: 'public enum SchemaRegistryProvider',
          enumValues: [
            { name: 'InMemory', value: 0, summary: 'InMemory' },
            { name: 'Http', value: 1, summary: 'Http' },
          ],
        },
        {
          slug: 'schema-registry-settings',
          name: 'SchemaRegistrySettings',
          displayName: 'SchemaRegistrySettings',
          kind: 'class',
          namespace: 'StangaNetLib.SchemaRegistry.Settings',
          summary: 'Configuration settings for StangaNetLib.SchemaRegistry. Bind from the "SchemaRegistrySettings" configuration section.',
          signature: 'public sealed class SchemaRegistrySettings',
          properties: [
            { name: 'Provider', type: 'SchemaRegistryProvider', access: 'get; set', summary: 'Schema registry backend. Default: InMemory.' },
            { name: 'BaseUrl', type: 'string?', access: 'get; set', summary: 'Base URL of the remote schema registry. Required when Provider is Http. Example: https://schema-registry.example.com' },
            { name: 'HttpTimeout', type: 'TimeSpan', access: 'get; set', summary: 'HttpTimeout' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"SchemaRegistrySettings"' },
          ],
        }
      ],
    }
  ],
};
