import type { LibraryDoc } from '../types';

export const cryptographyLibrary: LibraryDoc = {
  slug: 'cryptography',
  name: 'StangaNetLib.Cryptography',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Encryption, hashing, and secret-handling helpers',
  description:
    'Cryptographic utilities (encrypt/decrypt, hash, protect) designed for application and domain use without heavy framework coupling.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Cryptography',
  namespaces: [
    {
      name: 'StangaNetLib.Cryptography.Abstractions',
      summary: 'Types in StangaNetLib.Cryptography.Abstractions.',
      types: [
        {
          slug: 'i-digital-signature-service',
          name: 'IDigitalSignatureService',
          displayName: 'IDigitalSignatureService',
          kind: 'interface',
          namespace: 'StangaNetLib.Cryptography.Abstractions',
          summary: 'interface IDigitalSignatureService.',
          signature: 'public interface IDigitalSignatureService',
        },
        {
          slug: 'i-encryption-service',
          name: 'IEncryptionService',
          displayName: 'IEncryptionService',
          kind: 'interface',
          namespace: 'StangaNetLib.Cryptography.Abstractions',
          summary: 'Provides authenticated symmetric encryption and decryption using AES-256-GCM. The ciphertext format is: nonce (12 bytes) || ciphertext || authentication tag (16 bytes). The authentication tag prevents undetected tampering — decryption fails with a validation error if the data has been modified.',
          signature: 'public interface IEncryptionService',
        },
        {
          slug: 'i-hash-service',
          name: 'IHashService',
          displayName: 'IHashService',
          kind: 'interface',
          namespace: 'StangaNetLib.Cryptography.Abstractions',
          summary: 'interface IHashService.',
          signature: 'public interface IHashService',
        },
        {
          slug: 'i-hmac-service',
          name: 'IHmacService',
          displayName: 'IHmacService',
          kind: 'interface',
          namespace: 'StangaNetLib.Cryptography.Abstractions',
          summary: 'interface IHmacService.',
          signature: 'public interface IHmacService',
        },
        {
          slug: 'i-key-derivation-service',
          name: 'IKeyDerivationService',
          displayName: 'IKeyDerivationService',
          kind: 'interface',
          namespace: 'StangaNetLib.Cryptography.Abstractions',
          summary: 'interface IKeyDerivationService.',
          signature: 'public interface IKeyDerivationService',
        },
        {
          slug: 'i-secure-token-service',
          name: 'ISecureTokenService',
          displayName: 'ISecureTokenService',
          kind: 'interface',
          namespace: 'StangaNetLib.Cryptography.Abstractions',
          summary: 'interface ISecureTokenService.',
          signature: 'public interface ISecureTokenService',
        }
      ],
    },
    {
      name: 'StangaNetLib.Cryptography.Extensions',
      summary: 'Types in StangaNetLib.Cryptography.Extensions.',
      types: [
        {
          slug: 'my-service',
          name: 'MyService',
          displayName: 'MyService',
          kind: 'class',
          namespace: 'StangaNetLib.Cryptography.Extensions',
          summary: 'Registers all cryptography services using settings bound from configuration.',
          signature: 'public class MyService(IHashService hash, IHmacService hmac,',
        },
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Cryptography.Extensions',
          summary: 'class ServiceCollectionExtensions.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'MyService', signature: 'public class MyService(IHashService hash, IHmacService hmac, /// IKeyDerivationService kdf, IDigitalSignatureService sig, /// IEncryptionService enc, ISecureTokenService tokens)', summary: 'Registers all cryptography services using settings bound from configuration.', parameters: [{ name: 'hash', type: 'IHashService', description: 'hash' }, { name: 'hmac', type: 'IHmacService', description: 'hmac' }, { name: 'kdf', type: '/// IKeyDerivationService', description: 'kdf' }, { name: 'sig', type: 'IDigitalSignatureService', description: 'sig' }, { name: 'enc', type: '/// IEncryptionService', description: 'enc' }, { name: 'tokens', type: 'ISecureTokenService', description: 'tokens' }], returns: 'class' },
            { name: 'AddStangaNetLibCryptography', signature: 'public static IServiceCollection AddStangaNetLibCryptography( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers all cryptography services using settings bound from configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibCryptography', signature: 'public static IServiceCollection AddStangaNetLibCryptography( this IServiceCollection services)', summary: 'Registers all cryptography services using default CryptographySettings values. Suitable for environments where no external configuration is needed.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Cryptography.Models',
      summary: 'Types in StangaNetLib.Cryptography.Models.',
      types: [
        {
          slug: 'crypto-hash-algorithm',
          name: 'CryptoHashAlgorithm',
          displayName: 'CryptoHashAlgorithm',
          kind: 'enum',
          namespace: 'StangaNetLib.Cryptography.Models',
          summary: 'Identifies the cryptographic hash algorithm to use. SHA-3 variants require platform support — check SHA3_256.IsSupported (available from .NET 8) before using them in a portable application. SHA-3 is not supported by IDigitalSignatureService.',
          signature: 'public enum CryptoHashAlgorithm',
          enumValues: [
            { name: 'SHA256', value: 0, summary: 'SHA256' },
            { name: 'SHA384', value: 1, summary: 'SHA384' },
            { name: 'SHA512', value: 2, summary: 'SHA512' },
            { name: 'SHA3_256', value: 3, summary: 'SHA3_256' },
            { name: 'SHA3_384', value: 4, summary: 'SHA3_384' },
            { name: 'SHA3_512', value: 5, summary: 'SHA3_512' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Cryptography.Settings',
      summary: 'Types in StangaNetLib.Cryptography.Settings.',
      types: [
        {
          slug: 'cryptography-settings',
          name: 'CryptographySettings',
          displayName: 'CryptographySettings',
          kind: 'class',
          namespace: 'StangaNetLib.Cryptography.Settings',
          summary: 'class CryptographySettings.',
          signature: 'public sealed class CryptographySettings',
          properties: [
            { name: 'Pbkdf2Iterations', type: 'int', access: 'get; init', summary: 'Number of PBKDF2 iterations. Must be at least 100 000. OWASP recommends 600 000 for PBKDF2-SHA256 as of 2023.' },
            { name: 'DefaultSaltLengthBytes', type: 'int', access: 'get; init', summary: 'DefaultSaltLengthBytes' },
            { name: 'DefaultKeyLengthBytes', type: 'int', access: 'get; init', summary: 'DefaultKeyLengthBytes' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"CryptographySettings"' },
          ],
        }
      ],
    }
  ],
};
