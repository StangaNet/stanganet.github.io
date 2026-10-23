import type { LibraryDoc } from '../types';

export const encryptedStorageLibrary: LibraryDoc = {
  slug: 'encryptedstorage',
  name: 'StangaNetLib.EncryptedStorage',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Encrypted-at-rest local blob storage with SNEN envelopes',
  description:
    'Encrypted-at-rest blob storage for self-hosted apps: composes StangaNetLib.Storage (Local) with StangaNetLib.Cryptography (SNEN AES-GCM envelopes). No network egress required.',
  repository: 'https://github.com/StangaNet/StangaNetLib.EncryptedStorage',
  namespaces: [
    {
      name: 'StangaNetLib.EncryptedStorage.Abstractions',
      summary: 'Types in StangaNetLib.EncryptedStorage.Abstractions.',
      types: [
        {
          slug: 'i-encrypted-blob-storage',
          name: 'IEncryptedBlobStorage',
          displayName: 'IEncryptedBlobStorage',
          kind: 'interface',
          namespace: 'StangaNetLib.EncryptedStorage.Abstractions',
          summary: 'Blob storage with encryption at rest (SNEN envelope via Cryptography). Exposed metadata never includes plaintext content.',
          signature: 'public interface IEncryptedBlobStorage',
        }
      ],
    },
    {
      name: 'StangaNetLib.EncryptedStorage.Extensions',
      summary: 'Types in StangaNetLib.EncryptedStorage.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.EncryptedStorage.Extensions',
          summary: 'class ServiceCollectionExtensions.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibEncryptedStorage', signature: 'public static IServiceCollection AddStangaNetLibEncryptedStorage( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers encrypted blob storage from the EncryptedStorageSettings section. Registers Cryptography and Storage Local (at RootPath).', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibEncryptedStorage', signature: 'public static IServiceCollection AddStangaNetLibEncryptedStorage( this IServiceCollection services, string rootPath, string passphrase, string containerName = "encrypted")', summary: 'Registers encrypted blob storage with an explicit root path and passphrase. Registers Cryptography (defaults) and Storage Local at rootPath.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'rootPath', type: 'string', description: 'rootPath' }, { name: 'passphrase', type: 'string', description: 'passphrase' }, { name: 'containerName', type: 'string', description: 'containerName', optional: true }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.EncryptedStorage.Implementations',
      summary: 'Types in StangaNetLib.EncryptedStorage.Implementations.',
      types: [
        {
          slug: 'encrypted-blob-storage',
          name: 'EncryptedBlobStorage',
          displayName: 'EncryptedBlobStorage',
          kind: 'class',
          namespace: 'StangaNetLib.EncryptedStorage.Implementations',
          summary: 'Composes IBlobStorageService (Local) with IAtRestEncryptionService (SNEN).',
          signature: 'public sealed class EncryptedBlobStorage : IEncryptedBlobStorage',
          implements: ['IEncryptedBlobStorage'],
          methods: [
            { name: 'UploadAsync', signature: 'public async Task<Result<EncryptedBlobUploadResult>> UploadAsync( Stream content, string contentType, string? blobId = null, CancellationToken cancellationToken = default)', summary: 'UploadAsync', parameters: [{ name: 'content', type: 'Stream', description: 'content' }, { name: 'contentType', type: 'string', description: 'contentType' }, { name: 'blobId', type: 'string?', description: 'blobId', optional: true }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<EncryptedBlobUploadResult>>', isAsync: true },
            { name: 'DownloadAsync', signature: 'public async Task<Result<EncryptedBlobDownloadResult>> DownloadAsync( string blobId, CancellationToken cancellationToken = default)', summary: 'DownloadAsync', parameters: [{ name: 'blobId', type: 'string', description: 'blobId' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<EncryptedBlobDownloadResult>>', isAsync: true },
            { name: 'DeleteAsync', signature: 'public Task<Result> DeleteAsync(string blobId, CancellationToken cancellationToken = default)', summary: 'DeleteAsync', parameters: [{ name: 'blobId', type: 'string', description: 'blobId' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
            { name: 'ExistsAsync', signature: 'public Task<bool> ExistsAsync(string blobId, CancellationToken cancellationToken = default)', summary: 'ExistsAsync', parameters: [{ name: 'blobId', type: 'string', description: 'blobId' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<bool>', isAsync: true },
            { name: 'VerifyAsync', signature: 'public async Task<Result> VerifyAsync(string blobId, CancellationToken cancellationToken = default)', summary: 'VerifyAsync', parameters: [{ name: 'blobId', type: 'string', description: 'blobId' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.EncryptedStorage.Settings',
      summary: 'Types in StangaNetLib.EncryptedStorage.Settings.',
      types: [
        {
          slug: 'encrypted-storage-settings',
          name: 'EncryptedStorageSettings',
          displayName: 'EncryptedStorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.EncryptedStorage.Settings',
          summary: 'class EncryptedStorageSettings.',
          signature: 'public sealed class EncryptedStorageSettings',
          properties: [
            { name: 'RootPath', type: 'string', access: 'get; set', summary: 'RootPath' },
            { name: 'ContainerName', type: 'string', access: 'get; set', summary: 'ContainerName' },
            { name: 'Passphrase', type: 'string', access: 'get; set', summary: 'Passphrase' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"EncryptedStorageSettings"' },
          ],
        },
        {
          slug: 'encrypted-storage-settings-validator',
          name: 'EncryptedStorageSettingsValidator',
          displayName: 'EncryptedStorageSettingsValidator',
          kind: 'class',
          namespace: 'StangaNetLib.EncryptedStorage.Settings',
          summary: 'class EncryptedStorageSettingsValidator.',
          signature: 'public sealed class EncryptedStorageSettingsValidator : IValidateOptions<EncryptedStorageSettings>',
          implements: ['IValidateOptions<EncryptedStorageSettings>'],
          methods: [
            { name: 'Validate', signature: 'public ValidateOptionsResult Validate(string? name, EncryptedStorageSettings options)', summary: 'Validate', parameters: [{ name: 'name', type: 'string?', description: 'name' }, { name: 'options', type: 'EncryptedStorageSettings', description: 'options' }], returns: 'ValidateOptionsResult' },
          ],
        }
      ],
    }
  ],
};
