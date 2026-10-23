export type HighlightPair = readonly [string, string];

const libraryHighlightsEn: Record<string, readonly HighlightPair[]> = {
  core: [
    ['AggregateRoot<TId>', 'Domain entities with event tracking'],
    ['Result<T>', 'Explicit, functional outcomes'],
    ['ISpecification<T>', 'Encapsulated query rules'],
    ['ValueObject', 'Structural equality for domain values'],
  ],
  auth: [
    ['AddStangaNetLibAuthSelfHosted', 'JWT + Argon2id + TOTP + lockout'],
    ['ITotpService', 'TOTP MFA enrollment and verify'],
    ['ILoginAttemptService', 'Account login lockout'],
    ['External IdP', 'Google, Apple, Facebook, Microsoft'],
  ],
  cryptography: [
    ['IAtRestEncryptionService', 'AES-GCM SNEN envelopes'],
    ['AtRestKdf', 'PBKDF2 and HKDF key derivation'],
    ['FileEnvelope', 'Encrypt/decrypt files at rest'],
    ['HMAC / RSA', 'Integrity and signatures'],
  ],
  storage: [
    ['IBlobStorageService', 'Local, S3, and Azure Blob'],
    ['AddStangaNetLibStorageLocalOnly', 'Local-only production profile'],
    ['EncryptAtRest', 'Optional Cryptography decorator'],
    ['Pre-signed URLs', 'Streaming and lifecycle'],
  ],
  media: [
    ['IImageOptimizationService', 'JPEG/WebP multi-variant output'],
    ['PhotoValidator', 'Magic-byte validation before decode'],
    ['Photo storage', 'Backed by StangaNetLib.Storage'],
    ['Local-first', 'Self-hosted photo profiles'],
  ],
  observability: [
    ['UseStangaNetLibObservability', 'Correlation, logging, ProblemDetails'],
    ['MaskFinancialPii', 'Amount, IBAN, description scrub'],
    ['ETag / security headers', 'Conditional requests and hardening'],
    ['ILogMaskingService', 'PII-safe structured logs'],
  ],
  jobs: [
    ['EnqueueAsync + key', 'Idempotent job scheduling'],
    ['MaterializeHorizonDays', 'Cron materialization window'],
    ['In-memory / Hangfire', 'Swap backends without rewriting jobs'],
    ['IJobScheduler', 'Enqueue, schedule, recurring'],
  ],
  notifications: [
    ['IInboxService', 'In-app inbox and unread counts'],
    ['EnableEmail/InApp/Push', 'Per-channel toggles'],
    ['Templates + retry', 'Multi-channel dispatch'],
    ['Delivery tracking', 'Result-based send outcomes'],
  ],
  requestprotection: [
    ['AuthLockout', 'Login surface rate-limit preset'],
    ['RequireKey', 'Mandatory idempotency on paths'],
    ['Fixed-window limits', 'Caching-backed rate limiting'],
    ['Idempotency middleware', 'Safe retries for mutating APIs'],
  ],
  schemaregistry: [
    ['BackupManifest', 'Portable backup schema DTOs'],
    ['BackupManifestSchemaSeeder', 'Seed stanganet.backup.manifest'],
    ['SchemaRegistrySnapshot', 'Export/import registry state'],
    ['ISchemaRegistry', 'Versioned JSON validation'],
  ],
};

const libraryHighlightsIt: Record<string, readonly HighlightPair[]> = {
  core: [
    ['AggregateRoot<TId>', 'Entity di dominio con tracking degli eventi'],
    ['Result<T>', 'Esiti espliciti e funzionali'],
    ['ISpecification<T>', 'Regole di query incapsulate'],
    ['ValueObject', 'Uguaglianza strutturale per valori di dominio'],
  ],
  auth: [
    ['AddStangaNetLibAuthSelfHosted', 'JWT + Argon2id + TOTP + lockout'],
    ['ITotpService', 'Enrollment e verifica TOTP MFA'],
    ['ILoginAttemptService', 'Lockout sui tentativi di login'],
    ['External IdP', 'Google, Apple, Facebook, Microsoft'],
  ],
  cryptography: [
    ['IAtRestEncryptionService', 'Envelope SNEN AES-GCM'],
    ['AtRestKdf', 'Derivazione chiave PBKDF2 e HKDF'],
    ['FileEnvelope', 'Cifra/decifra file at-rest'],
    ['HMAC / RSA', 'Integrità e firme'],
  ],
  storage: [
    ['IBlobStorageService', 'Local, S3 e Azure Blob'],
    ['AddStangaNetLibStorageLocalOnly', 'Profilo production local-only'],
    ['EncryptAtRest', 'Decorator Cryptography opzionale'],
    ['Pre-signed URLs', 'Streaming e lifecycle'],
  ],
  media: [
    ['IImageOptimizationService', 'Varianti JPEG/WebP'],
    ['PhotoValidator', 'Validazione magic-byte prima del decode'],
    ['Photo storage', 'Basato su StangaNetLib.Storage'],
    ['Local-first', 'Profili foto self-hosted'],
  ],
  observability: [
    ['UseStangaNetLibObservability', 'Correlation, logging, ProblemDetails'],
    ['MaskFinancialPii', 'Scrub amount, IBAN, description'],
    ['ETag / security headers', 'Richieste condizionali e hardening'],
    ['ILogMaskingService', 'Log strutturati senza PII'],
  ],
  jobs: [
    ['EnqueueAsync + key', 'Scheduling job idempotente'],
    ['MaterializeHorizonDays', 'Finestra di materializzazione cron'],
    ['In-memory / Hangfire', 'Cambia backend senza riscrivere i job'],
    ['IJobScheduler', 'Enqueue, schedule, recurring'],
  ],
  notifications: [
    ['IInboxService', 'Inbox in-app e conteggio non letti'],
    ['EnableEmail/InApp/Push', 'Flag per canale'],
    ['Templates + retry', 'Dispatch multi-canale'],
    ['Delivery tracking', 'Esiti di invio basati su Result'],
  ],
  requestprotection: [
    ['AuthLockout', 'Preset rate-limit sulle superfici di login'],
    ['RequireKey', 'Idempotency obbligatoria su path'],
    ['Fixed-window limits', 'Rate limiting su Caching'],
    ['Idempotency middleware', 'Retry sicuri per API mutanti'],
  ],
  schemaregistry: [
    ['BackupManifest', 'DTO schema backup portabile'],
    ['BackupManifestSchemaSeeder', 'Seed stanganet.backup.manifest'],
    ['SchemaRegistrySnapshot', 'Export/import stato registry'],
    ['ISchemaRegistry', 'Validazione JSON versionata'],
  ],
};

export function getLibraryHighlights(locale: string, slug: string): readonly HighlightPair[] {
  const table = locale === 'it' ? libraryHighlightsIt : libraryHighlightsEn;
  return table[slug] ?? table.core;
}
