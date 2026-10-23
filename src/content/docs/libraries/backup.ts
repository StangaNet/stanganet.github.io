import type { LibraryDoc } from '../types';

export const backupLibrary: LibraryDoc = {
  slug: 'backup',
  name: 'StangaNetLib.Backup',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Encrypted portable backups with versioned manifests',
  description:
    'Create, verify, and restore encrypted portable backups for self-hosted apps (SNEN envelope + ZIP + versioned manifest). Uses Cryptography and SchemaRegistry.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Backup',
  namespaces: [
    {
      name: 'StangaNetLib.Backup.Abstractions',
      summary: 'Types in StangaNetLib.Backup.Abstractions.',
      types: [
        {
          slug: 'i-backup-part-exporter',
          name: 'IBackupPartExporter',
          displayName: 'IBackupPartExporter',
          kind: 'interface',
          namespace: 'StangaNetLib.Backup.Abstractions',
          summary: 'Consumer-provided port that exports application data streams to include in a backup.',
          signature: 'public interface IBackupPartExporter',
        },
        {
          slug: 'i-backup-part-importer',
          name: 'IBackupPartImporter',
          displayName: 'IBackupPartImporter',
          kind: 'interface',
          namespace: 'StangaNetLib.Backup.Abstractions',
          summary: 'Consumer-provided port that applies restored parts to the target instance. This operation is destructive relative to target state — policy is owned by the consumer.',
          signature: 'public interface IBackupPartImporter',
        },
        {
          slug: 'i-backup-service',
          name: 'IBackupService',
          displayName: 'IBackupService',
          kind: 'interface',
          namespace: 'StangaNetLib.Backup.Abstractions',
          summary: 'Creates, verifies, inspects, and restores encrypted portable backup archives (`.snbak`).',
          signature: 'public interface IBackupService',
        }
      ],
    },
    {
      name: 'StangaNetLib.Backup.Extensions',
      summary: 'Types in StangaNetLib.Backup.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Backup.Extensions',
          summary: 'class ServiceCollectionExtensions.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibBackup', signature: 'public static IServiceCollection AddStangaNetLibBackup(this IServiceCollection services)', summary: 'Registers IBackupService. Requires consumer registrations of IBackupPartExporter and IBackupPartImporter. Also registers Cryptography. Register SchemaRegistry + call AddStangaNetLibBackupManifestSchemasAsync on the built provider before verify/restore.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibBackup', signature: 'public static IServiceCollection AddStangaNetLibBackup( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers IBackupService (same as parameterless) after optionally binding configuration for Cryptography settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Backup.Implementations',
      summary: 'Types in StangaNetLib.Backup.Implementations.',
      types: [
        {
          slug: 'backup-service',
          name: 'BackupService',
          displayName: 'BackupService',
          kind: 'class',
          namespace: 'StangaNetLib.Backup.Implementations',
          summary: 'class BackupService.',
          signature: 'public sealed class BackupService : IBackupService',
          implements: ['IBackupService'],
          methods: [
            { name: 'CreateBackupAsync', signature: 'public async Task<Result> CreateBackupAsync( string path, string passphrase, string product, CancellationToken cancellationToken = default)', summary: 'CreateBackupAsync', parameters: [{ name: 'path', type: 'string', description: 'path' }, { name: 'passphrase', type: 'string', description: 'passphrase' }, { name: 'product', type: 'string', description: 'product' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
            { name: 'VerifyBackupAsync', signature: 'public async Task<Result> VerifyBackupAsync( string path, string passphrase, CancellationToken cancellationToken = default)', summary: 'VerifyBackupAsync', parameters: [{ name: 'path', type: 'string', description: 'path' }, { name: 'passphrase', type: 'string', description: 'passphrase' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
            { name: 'GetBackupMetadataAsync', signature: 'public async Task<Result<BackupMetadata>> GetBackupMetadataAsync( string path, string passphrase, CancellationToken cancellationToken = default)', summary: 'GetBackupMetadataAsync', parameters: [{ name: 'path', type: 'string', description: 'path' }, { name: 'passphrase', type: 'string', description: 'passphrase' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<BackupMetadata>>', isAsync: true },
            { name: 'RestoreBackupAsync', signature: 'public async Task<Result> RestoreBackupAsync( string path, string passphrase, CancellationToken cancellationToken = default)', summary: 'RestoreBackupAsync', parameters: [{ name: 'path', type: 'string', description: 'path' }, { name: 'passphrase', type: 'string', description: 'passphrase' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Backup.Models',
      summary: 'Types in StangaNetLib.Backup.Models.',
      types: [
        {
          slug: 'backup-part',
          name: 'BackupPart',
          displayName: 'BackupPart',
          kind: 'class',
          namespace: 'StangaNetLib.Backup.Models',
          summary: 'A single application data part contributed to (or restored from) a backup archive. The caller owns Content and should dispose it after export/import completes.',
          signature: 'public sealed class BackupPart',
          properties: [
            { name: 'Id', type: 'string', access: 'get; init', summary: 'Id' },
            { name: 'Type', type: 'string', access: 'get; init', summary: 'Type' },
            { name: 'Content', type: 'Stream', access: 'get; init', summary: 'Content' },
            { name: 'Checksum', type: 'string?', access: 'get; set', summary: 'Checksum' },
          ],
        }
      ],
    }
  ],
};
