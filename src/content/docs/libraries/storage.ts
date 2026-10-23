import type { LibraryDoc } from '../types';

export const storageLibrary: LibraryDoc = {
  slug: 'storage',
  name: 'StangaNetLib.Storage',
  version: '1.1.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Blob storage with optional Cryptography at-rest encryption',
  description:
    'Unified blob storage for local filesystem (local-only profile), S3, and Azure Blob with streaming, pre-signed URLs, lifecycle management, and optional at-rest encryption via StangaNetLib.Cryptography.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Storage',
  namespaces: [
    {
      name: 'StangaNetLib.Storage.Abstractions',
      summary: 'Types in StangaNetLib.Storage.Abstractions.',
      types: [
        {
          slug: 'i-blob-storage-service',
          name: 'IBlobStorageService',
          displayName: 'IBlobStorageService',
          kind: 'interface',
          namespace: 'StangaNetLib.Storage.Abstractions',
          summary: 'Provides blob storage operations (upload, download, delete, list, copy, move) against a configurable backend (Local filesystem, AWS S3, or Azure Blob Storage). Implementations should be registered as Singleton.',
          signature: 'public interface IBlobStorageService',
        },
        {
          slug: 'i-container-manager',
          name: 'IContainerManager',
          displayName: 'IContainerManager',
          kind: 'interface',
          namespace: 'StangaNetLib.Storage.Abstractions',
          summary: 'Manages the lifecycle of storage containers (S3 buckets, Azure Blob containers, or local directories). Implementations should be registered as Singleton.',
          signature: 'public interface IContainerManager',
        },
        {
          slug: 'i-presigned-url-service',
          name: 'IPresignedUrlService',
          displayName: 'IPresignedUrlService',
          kind: 'interface',
          namespace: 'StangaNetLib.Storage.Abstractions',
          summary: 'Generates time-limited pre-signed URLs that allow unauthenticated upload or download of a single blob. Supported by S3 and Azure Blob backends; the local backend returns simple URLs based on StorageSettings.LocalBaseUrl. Implementations should be registered as Singleton.',
          signature: 'public interface IPresignedUrlService',
        }
      ],
    },
    {
      name: 'StangaNetLib.Storage.Extensions',
      summary: 'Types in StangaNetLib.Storage.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Storage.Extensions',
          summary: 'Extension methods to register StangaNetLib.Storage services in the DI container.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibStorage', signature: 'public static IServiceCollection AddStangaNetLibStorage( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers IBlobStorageService, IPresignedUrlService, and IContainerManager using the backend configured in StorageSettings:Provider.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibStorageLocal', signature: 'public static IServiceCollection AddStangaNetLibStorageLocal( this IServiceCollection services, string basePath = "wwwroot/storage", string baseUrl = "")', summary: 'Registers the Local filesystem provider directly, without requiring an appsettings file.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'basePath', type: 'string', description: 'basePath', optional: true }, { name: 'baseUrl', type: 'string', description: 'baseUrl', optional: true }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibStorageLocalOnly', signature: 'public static IServiceCollection AddStangaNetLibStorageLocalOnly( this IServiceCollection services, string basePath = "wwwroot/storage", string baseUrl = "", bool encryptAtRest = false, string? enc...', summary: 'Local-only production profile: forces Local and optionally enables at-rest encryption (requires AddStangaNetLibCryptography).', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'basePath', type: 'string', description: 'basePath', optional: true }, { name: 'baseUrl', type: 'string', description: 'baseUrl', optional: true }, { name: 'encryptAtRest', type: 'bool', description: 'encryptAtRest', optional: true }, { name: 'encryptionPassphrase', type: 'string?', description: 'encryptionPassphrase', optional: true }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Storage.Settings',
      summary: 'Types in StangaNetLib.Storage.Settings.',
      types: [
        {
          slug: 'azure-blob-storage-settings',
          name: 'AzureBlobStorageSettings',
          displayName: 'AzureBlobStorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Storage.Settings',
          summary: 'Azure Blob Storage connection settings. Bind to the "AzureBlobStorageSettings" configuration section. Used when Provider is AzureBlob.',
          signature: 'public sealed class AzureBlobStorageSettings',
          properties: [
            { name: 'ConnectionString', type: 'string', access: 'get; set', summary: 'Azure Storage connection string (e.g. "DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net").' },
            { name: 'ServiceUrl', type: 'string?', access: 'get; set', summary: 'Optional custom service URI for Azurite or other Azure-compatible backends. Default: — uses the official Azure endpoint derived from ConnectionString.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"AzureBlobStorageSettings"' },
          ],
        },
        {
          slug: 's3-storage-settings',
          name: 'S3StorageSettings',
          displayName: 'S3StorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Storage.Settings',
          summary: 'AWS S3 connection settings. Bind to the "S3StorageSettings" configuration section. Used when Provider is S3.',
          signature: 'public sealed class S3StorageSettings',
          properties: [
            { name: 'AccessKey', type: 'string', access: 'get; set', summary: 'AccessKey' },
            { name: 'SecretKey', type: 'string', access: 'get; set', summary: 'SecretKey' },
            { name: 'Region', type: 'string', access: 'get; set', summary: 'Region' },
            { name: 'ServiceUrl', type: 'string?', access: 'get; set', summary: 'Optional custom service endpoint for S3-compatible backends (LocalStack, MinIO). Default: — uses the official AWS endpoint.' },
            { name: 'ForcePathStyle', type: 'bool', access: 'get; set', summary: 'Forces path-style addressing (https://endpoint/bucket/key instead of virtual-hosted). Required by most S3-compatible backends. Default: .' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"S3StorageSettings"' },
          ],
        },
        {
          slug: 'storage-encryption-settings',
          name: 'StorageEncryptionSettings',
          displayName: 'StorageEncryptionSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Storage.Settings',
          summary: 'At-rest encryption options for blob storage. Bound from StorageSettings:Encryption or configured via AddStangaNetLibStorageLocalOnly.',
          signature: 'public sealed class StorageEncryptionSettings',
          properties: [
            { name: 'EncryptAtRest', type: 'bool', access: 'get; set', summary: 'When true, uploads are encrypted with IAtRestEncryptionService before being written to the underlying provider and decrypted on download. Requires AddStangaNetLibCryptography and a non-empty Passphrase.' },
            { name: 'Passphrase', type: 'string', access: 'get; set', summary: 'Passphrase used to derive the AES key via PBKDF2. Prefer secrets configuration (environment / secret store) over committing this value to source control.' },
          ],
        },
        {
          slug: 'storage-provider',
          name: 'StorageProvider',
          displayName: 'StorageProvider',
          kind: 'enum',
          namespace: 'StangaNetLib.Storage.Settings',
          summary: 'enum StorageProvider.',
          signature: 'public enum StorageProvider',
          enumValues: [
            { name: 'Local', value: 0, summary: 'Local' },
            { name: 'S3', value: 1, summary: 'S3' },
            { name: 'AzureBlob', value: 2, summary: 'AzureBlob' },
          ],
        },
        {
          slug: 'storage-settings',
          name: 'StorageSettings',
          displayName: 'StorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Storage.Settings',
          summary: 'Root settings for StangaNetLib.Storage. Bind to the "StorageSettings" configuration section.',
          signature: 'public sealed class StorageSettings',
          properties: [
            { name: 'Provider', type: 'StorageProvider', access: 'get; set', summary: 'Provider' },
            { name: 'LocalBasePath', type: 'string', access: 'get; set', summary: 'Root directory for the Local backend. Default: "wwwroot/storage".' },
            { name: 'LocalBaseUrl', type: 'string', access: 'get; set', summary: 'URL prefix used to build pre-signed download URLs for the local backend (e.g. "https://myapp.local/storage"). Default: "" — pre-signed URL generation is disabled until this is set.' },
            { name: 'Encryption', type: 'StorageEncryptionSettings', access: 'get; set', summary: 'Encryption' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"StorageSettings"' },
          ],
        }
      ],
    }
  ],
};
