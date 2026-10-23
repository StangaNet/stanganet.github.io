import type { LibraryDoc } from '../types';

export const mediaLibrary: LibraryDoc = {
  slug: 'media',
  name: 'StangaNetLib.Media',
  version: '1.0.2',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Media storage, processing, and metadata',
  description:
    'Media asset abstractions for upload, storage backends, and processing pipelines.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Media',
  namespaces: [
    {
      name: 'StangaNetLib.Media.Abstractions',
      summary: 'Types in StangaNetLib.Media.Abstractions.',
      types: [
        {
          slug: 'i-image-optimization-service',
          name: 'IImageOptimizationService',
          displayName: 'IImageOptimizationService',
          kind: 'interface',
          namespace: 'StangaNetLib.Media.Abstractions',
          summary: 'Processes raw image bytes into a set of optimized variants. Implementations should be registered as Singleton (stateless).',
          signature: 'public interface IImageOptimizationService',
        },
        {
          slug: 'i-photo-storage-service',
          name: 'IPhotoStorageService',
          displayName: 'IPhotoStorageService',
          kind: 'interface',
          namespace: 'StangaNetLib.Media.Abstractions',
          summary: 'Persists and retrieves photo variants from a storage backend. Implementations should be registered as Singleton.',
          signature: 'public interface IPhotoStorageService',
        }
      ],
    },
    {
      name: 'StangaNetLib.Media.Extensions',
      summary: 'Types in StangaNetLib.Media.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Extensions',
          summary: 'Extension methods to register StangaNetLib.Media services in the DI container.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibMedia', signature: 'public static IServiceCollection AddStangaNetLibMedia( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers IImageOptimizationService and IPhotoStorageService. The storage backend is chosen by StorageSettings:Provider in configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibMediaLocal', signature: 'public static IServiceCollection AddStangaNetLibMediaLocal( this IServiceCollection services, string basePath = "wwwroot/uploads/photos", string baseUrl = "/uploads/photos")', summary: 'Convenience overload that registers the Local filesystem provider directly, without requiring an appsettings file. Useful in integration tests or development.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'basePath', type: 'string', description: 'basePath', optional: true }, { name: 'baseUrl', type: 'string', description: 'baseUrl', optional: true }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddMediaWithStorage', signature: 'public static IServiceCollection AddMediaWithStorage( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers IImageOptimizationService and a IPhotoStorageService backed by an IBlobStorageService from StangaNetLib.Storage.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Media.Models',
      summary: 'Types in StangaNetLib.Media.Models.',
      types: [
        {
          slug: 'image-size-type',
          name: 'ImageSizeType',
          displayName: 'ImageSizeType',
          kind: 'enum',
          namespace: 'StangaNetLib.Media.Models',
          summary: 'enum ImageSizeType.',
          signature: 'public enum ImageSizeType',
          enumValues: [
            { name: 'Thumbnail', value: 0, summary: 'Thumbnail' },
            { name: 'Medium', value: 1, summary: 'Medium' },
            { name: 'Large', value: 2, summary: 'Large' },
            { name: 'Original', value: 3, summary: 'Original' },
            { name: 'WebP', value: 4, summary: 'WebP' },
          ],
        },
        {
          slug: 'image-variants',
          name: 'ImageVariants',
          displayName: 'ImageVariants',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Models',
          summary: 'Container for all variants produced by ProcessAsync.',
          signature: 'public sealed class ImageVariants',
          properties: [
            { name: 'Thumbnail', type: 'ImageVariant', access: 'get; init', summary: 'Thumbnail' },
            { name: 'Medium', type: 'ImageVariant', access: 'get; init', summary: 'Medium' },
            { name: 'Large', type: 'ImageVariant', access: 'get; init', summary: 'Large' },
            { name: 'Original', type: 'ImageVariant', access: 'get; init', summary: 'Original' },
            { name: 'WebP', type: 'ImageVariant?', access: 'get; init', summary: 'WebP' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Media.Settings',
      summary: 'Types in StangaNetLib.Media.Settings.',
      types: [
        {
          slug: 'azure-blob-storage-settings',
          name: 'AzureBlobStorageSettings',
          displayName: 'AzureBlobStorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Settings',
          summary: 'Azure Blob Storage connection settings. Bind to "AzureBlobStorage". Only used when Provider = AzureBlob.',
          signature: 'public sealed class AzureBlobStorageSettings',
          properties: [
            { name: 'ConnectionString', type: 'string', access: 'get; set', summary: 'ConnectionString' },
            { name: 'ContainerName', type: 'string', access: 'get; set', summary: 'ContainerName' },
            { name: 'BaseUrl', type: 'string?', access: 'get; set', summary: 'Optional CDN/custom domain prefix. When null the Azure blob URI is used directly. Example: "https://cdn.example.com"' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"AzureBlobStorage"' },
          ],
        },
        {
          slug: 'image-settings',
          name: 'ImageSettings',
          displayName: 'ImageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Settings',
          summary: 'class ImageSettings.',
          signature: 'public sealed class ImageSettings',
          properties: [
            { name: 'ThumbnailSize', type: 'int', access: 'get; set', summary: 'ThumbnailSize' },
            { name: 'MediumSize', type: 'int', access: 'get; set', summary: 'MediumSize' },
            { name: 'LargeSize', type: 'int', access: 'get; set', summary: 'LargeSize' },
            { name: 'CompressionQuality', type: 'int', access: 'get; set', summary: 'CompressionQuality' },
            { name: 'ThumbnailQuality', type: 'int', access: 'get; set', summary: 'ThumbnailQuality' },
            { name: 'MaxUploadSizeBytes', type: 'long', access: 'get; set', summary: 'MaxUploadSizeBytes' },
            { name: 'EnableWebP', type: 'bool', access: 'get; set', summary: 'EnableWebP' },
            { name: 'WebPQuality', type: 'int', access: 'get; set', summary: 'WebPQuality' },
            { name: 'EnableProgressiveJpeg', type: 'bool', access: 'get; set', summary: 'EnableProgressiveJpeg' },
            { name: 'AllowedMimeTypes', type: 'string[]', access: 'get; set', summary: 'AllowedMimeTypes' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"ImageSettings"' },
          ],
        },
        {
          slug: 'storage-backed-photo-storage-settings',
          name: 'StorageBackedPhotoStorageSettings',
          displayName: 'StorageBackedPhotoStorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Settings',
          summary: 'Settings for StorageBackedPhotoStorageService, which delegates photo variant persistence to an IBlobStorageService from StangaNetLib.Storage.',
          signature: 'public sealed class StorageBackedPhotoStorageSettings',
          properties: [
            { name: 'ContainerName', type: 'string', access: 'get; set', summary: 'ContainerName' },
            { name: 'BaseUrl', type: 'string', access: 'get; set', summary: 'Base URL prepended to blob keys when constructing public photo URLs. Example: "https://cdn.example.com". Leave empty to return relative paths.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"StorageBackedPhotoStorage"' },
          ],
        },
        {
          slug: 'storage-provider',
          name: 'StorageProvider',
          displayName: 'StorageProvider',
          kind: 'enum',
          namespace: 'StangaNetLib.Media.Settings',
          summary: 'enum StorageProvider.',
          signature: 'public enum StorageProvider',
          enumValues: [
            { name: 'Local', value: 0, summary: 'Local' },
            { name: 'AzureBlob', value: 1, summary: 'AzureBlob' },
          ],
        },
        {
          slug: 'storage-settings',
          name: 'StorageSettings',
          displayName: 'StorageSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Settings',
          summary: 'class StorageSettings.',
          signature: 'public sealed class StorageSettings',
          properties: [
            { name: 'Provider', type: 'StorageProvider', access: 'get; set', summary: 'Provider' },
            { name: 'LocalBasePath', type: 'string', access: 'get; set', summary: 'LocalBasePath' },
            { name: 'LocalBaseUrl', type: 'string', access: 'get; set', summary: 'LocalBaseUrl' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"StorageSettings"' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Media.Storage',
      summary: 'Types in StangaNetLib.Media.Storage.',
      types: [
        {
          slug: 'null-photo-storage-service',
          name: 'NullPhotoStorageService',
          displayName: 'NullPhotoStorageService',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Storage',
          summary: 'No-op implementation for use in unit tests of code that depends on IPhotoStorageService. Always returns success without touching the filesystem. Register manually in your test DI setup: services.AddSingleton&lt;IPhotoStorageService, NullPhotoStorageService&gt;();',
          signature: 'public sealed class NullPhotoStorageService : IPhotoStorageService',
          implements: ['IPhotoStorageService'],
          methods: [
            { name: 'UploadVariantsAsync', signature: 'public Task<Result<PhotoUploadResult>> UploadVariantsAsync( string ownerId, ImageVariants variants, CancellationToken ct = default)', summary: 'UploadVariantsAsync', parameters: [{ name: 'ownerId', type: 'string', description: 'ownerId' }, { name: 'variants', type: 'ImageVariants', description: 'variants' }, { name: 'ct', type: 'CancellationToken', description: 'ct', optional: true }], returns: 'Task<Result<PhotoUploadResult>>', isAsync: true },
            { name: 'DeleteVariantsAsync', signature: 'public Task<Result> DeleteVariantsAsync( string ownerId, string photoId, CancellationToken ct = default)', summary: 'DeleteVariantsAsync', parameters: [{ name: 'ownerId', type: 'string', description: 'ownerId' }, { name: 'photoId', type: 'string', description: 'photoId' }, { name: 'ct', type: 'CancellationToken', description: 'ct', optional: true }], returns: 'Task<Result>', isAsync: true },
            { name: 'ExistsAsync', signature: 'public Task<bool> ExistsAsync( string ownerId, string photoId, CancellationToken ct = default)', summary: 'ExistsAsync', parameters: [{ name: 'ownerId', type: 'string', description: 'ownerId' }, { name: 'photoId', type: 'string', description: 'photoId' }, { name: 'ct', type: 'CancellationToken', description: 'ct', optional: true }], returns: 'Task<bool>', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Media.Validation',
      summary: 'Types in StangaNetLib.Media.Validation.',
      types: [
        {
          slug: 'photo-validator',
          name: 'PhotoValidator',
          displayName: 'PhotoValidator',
          kind: 'class',
          namespace: 'StangaNetLib.Media.Validation',
          summary: 'Validates raw image bytes before processing. Checks size limits, allowed MIME types, and magic-byte signatures to prevent content-type spoofing and oversized uploads from reaching the processing pipeline.',
          signature: 'public static class PhotoValidator',
          methods: [
            { name: 'Validate', signature: 'public static Result Validate( byte[] data, string fileName, string contentType, long maxSizeBytes, string[] allowedMimeTypes)', summary: 'Validates data against size, MIME type, and magic-bytes.', parameters: [{ name: 'data', type: 'byte[]', description: 'data' }, { name: 'fileName', type: 'string', description: 'fileName' }, { name: 'contentType', type: 'string', description: 'contentType' }, { name: 'maxSizeBytes', type: 'long', description: 'maxSizeBytes' }, { name: 'allowedMimeTypes', type: 'string[]', description: 'allowedMimeTypes' }], returns: 'Success() when all checks pass; otherwise a failure Result with one of the error codes: Photo.Empty, Photo.TooLarge, Photo.InvalidMimeType, or Photo.InvalidSignature.', isStatic: true },
          ],
        }
      ],
    }
  ],
};
