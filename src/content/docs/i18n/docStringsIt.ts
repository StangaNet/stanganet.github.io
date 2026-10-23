/** English → Italian for API docs human-readable fields (names/signatures stay English). */
export const docStringsIt: Record<string, string> = {
  "Clean Architecture and DDD primitives for .NET domain layers":
    "Primitivi Clean Architecture e DDD per i layer di dominio .NET",
  "Foundation library for domain-driven design and Clean Architecture: entities, aggregate roots, value objects, specifications, explicit Result types, guards, pagination, auditing, and domain events. Depends on Microsoft.Extensions.Options for settings validation via SettingsValidatorBase<TOptions>; all other building blocks avoid heavy infrastructure coupling.":
    "Libreria di fondazione per DDD e Clean Architecture: entity, aggregate root, value object, specification, Result espliciti, guard, paginazione, auditing e domain event. Dipende da Microsoft.Extensions.Options per la validazione settings via SettingsValidatorBase<TOptions>; gli altri building block evitano accoppiamento infrastrutturale pesante.",
  "Entities, aggregate roots, structured errors, Result types, and unit-of-work abstraction.":
    "Entity, aggregate root, errori strutturati, tipi Result e astrazione unit of work.",
  "Creates a new entity with a randomly generated Guid.": "Crea una nuova entity con un Guid generato casualmente.",
  "The entity identifier.": "L'identificatore dell'entity.",
  "Entity identifier.": "Identificatore dell'entity.",
  "UTC timestamp of creation.": "Timestamp UTC di creazione.",
  "UTC timestamp of last update. Null until the first mutation.": "Timestamp UTC dell'ultimo aggiornamento. Null fino alla prima mutazione.",
  "Sets UpdatedAt to the current UTC time. Call at the end of mutating methods.": "Imposta UpdatedAt all'ora UTC corrente. Chiamare alla fine dei metodi che mutano lo stato.",
  "Convenience base class for aggregate roots keyed by Guid.": "Classe base di comodo per aggregate root con chiave Guid.",
  "Creates a new aggregate root with a randomly generated Guid.": "Crea un nuovo aggregate root con un Guid generato casualmente.",
  "Identifier type.": "Tipo dell'identificatore.",
  "Raise a domain event": "Emettere un domain event",
  "Used only by Error.None — not a real failure.": "Usato solo da Error.None — non è un fallimento reale.",
  "Throws ArgumentNullException if value is null.": "Lancia ArgumentNullException se value è null.",
  "Combine specifications": "Combinare le specification",
  "Money value object": "Value object Money",
  "Type of entity involved, if any.": "Tipo di entity coinvolta, se presente.",
  "Actor IP address.": "Indirizzo IP dell'attore.",
  "Actor User-Agent.": "User-Agent dell'attore.",
  "The type of the entity's identifier.": "Il tipo dell'identificatore dell'entity.",
  "The entity's identifier.": "L'identificatore dell'entity.",

  // Suite library taglines / descriptions
  "Self-hosted JWT auth with Argon2id, TOTP MFA, and login lockout":
    "Auth JWT self-hosted con Argon2id, TOTP MFA e login lockout",
  "JWT issuance/validation with refresh-token rotation, pluggable password hashing (BCrypt / Argon2id), TOTP MFA, login lockout, cache-backed revocation, optional Auth0 and external IdP exchange (Google, Apple, Facebook, Microsoft).":
    "Emissione/validazione JWT con rotazione refresh-token, hashing password plugabile (BCrypt / Argon2id), TOTP MFA, login lockout, revoca cache-backed, Auth0 e token exchange IdP opzionali (Google, Apple, Facebook, Microsoft).",
  "In-memory and distributed caching with lock-aware helpers":
    "Caching in-memory e distribuito con helper lock-aware",
  "Caching abstractions and providers (in-memory / Redis) with distributed lock support, built on Core and Concurrency.":
    "Astrazioni e provider di caching (in-memory / Redis) con lock distribuiti, basati su Core e Concurrency.",
  "Keyed locks, throttles, work queues, and debouncing":
    "Lock per chiave, throttle, work queue e debounce",
  "Async concurrency primitives: keyed locks, semaphore throttles, bounded work queues, and per-key debouncers.":
    "Primitivi di concurrency async: keyed lock, throttle a semaforo, work queue limitate e debouncer per chiave.",
  "Content lifecycle workflow with Result-based transitions":
    "Workflow del ciclo di vita dei contenuti con transizioni basate su Result",
  "Immutable content items and workflow services for Draft → Pending → Approved → Published with review trails.":
    "Content item immutabili e servizi di workflow Draft → Pending → Approved → Published con trail di review.",
  "Hashing, KDF, HMAC, and AES-GCM at-rest SNEN envelopes":
    "Hashing, KDF, HMAC e envelope SNEN AES-GCM at-rest",
  "Hashing, key derivation, HMAC, AES-GCM encryption, versioned SNEN at-rest blob/stream envelopes, RSA digital signatures, and secure token generation.":
    "Hashing, derivazione chiave, HMAC, cifratura AES-GCM, envelope SNEN at-rest versionati per blob/stream, firme RSA e generazione token sicuri.",
  "Pub/sub messaging with in-memory and broker backends":
    "Messaging pub/sub con backend in-memory e broker",
  "Event bus abstractions with in-memory and RabbitMQ-style providers, integrated with Jobs where needed.":
    "Astrazioni event bus con provider in-memory e stile RabbitMQ, integrabili con Jobs quando serve.",
  "Feature flag evaluation and providers":
    "Valutazione feature flag e provider",
  "Feature flag service abstractions and in-memory/config providers for toggling behavior safely.":
    "Astrazioni e provider in-memory/config per attivare funzionalità in modo controllato.",
  "Consent, DSAR, and pseudonymization for GDPR compliance":
    "Consenso, DSAR e pseudonimizzazione per la compliance GDPR",
  "GDPR-oriented services: consent repositories, DSAR lifecycle, pseudonymization, and endpoint consent enforcement.":
    "Servizi orientati al GDPR: repository consenso, ciclo di vita DSAR, pseudonimizzazione e enforcement del consenso sugli endpoint.",
  "Background jobs with idempotent enqueue and cron horizon":
    "Job in background con enqueue idempotente e orizzonte cron",
  "Background job infrastructure for recurring and scheduled jobs — in-memory backend and Hangfire adapter, with idempotent enqueue and cron materialization horizon on the in-memory backend.":
    "Infrastruttura job ricorrenti e schedulati — backend in-memory e adapter Hangfire, con enqueue idempotente e orizzonte di materializzazione cron sul backend in-memory.",
  "Image variants, magic-byte validation, and photo storage":
    "Varianti immagine, validazione magic-byte e photo storage",
  "Image optimization (multi-variant JPEG/WebP), magic-byte validation before decode, and cloud/local photo storage backed by StangaNetLib.Storage.":
    "Ottimizzazione immagini (varianti JPEG/WebP), validazione magic-byte prima del decode e photo storage cloud/local basato su StangaNetLib.Storage.",
  "Multi-channel notifications with inbox and channel toggles":
    "Notifiche multi-canale con inbox e flag per canale",
  "Multi-channel notification dispatch (email, in-app, push) with templates, retry, delivery tracking, in-app inbox read-state, and per-channel enable flags.":
    "Dispatch notifiche multi-canale (email, in-app, push) con template, retry, tracking consegna, stato letto dell'inbox e flag di abilitazione per canale.",
  "ASP.NET observability middleware with financial PII masking":
    "Middleware di observability ASP.NET con masking PII finanziaria",
  "Correlation IDs, request logging, ProblemDetails exceptions, ETag, security headers, and PII log masking including financial helpers (amount, IBAN, description).":
    "Correlation ID, request logging, eccezioni ProblemDetails, ETag, security header e masking PII nei log inclusi helper finanziari (importo, IBAN, descrizione).",
  "Rate limiting, AuthLockout preset, and required idempotency keys":
    "Rate limiting, preset AuthLockout e chiavi di idempotenza obbligatorie",
  "Distributed fixed-window rate limiting and idempotency deduplication (Caching-backed), with AuthLockout preset and optional required idempotency keys on matched paths.":
    "Rate limiting a finestra fissa e deduplica idempotenza (su Caching), con preset AuthLockout e chiavi di idempotenza obbligatorie opzionali sui path corrispondenti.",
  "Named Polly pipelines that return Result":
    "Pipeline Polly nominate che restituiscono Result",
  "Resilience pipelines (retry, circuit breaker, timeout) via Microsoft.Extensions.Resilience, mapping failures to Core Result types.":
    "Pipeline di resilience (retry, circuit breaker, timeout) via Microsoft.Extensions.Resilience, con fallimenti mappati sui Result di Core.",
  "Versioned JSON schemas with portable backup manifests":
    "JSON schema versionati con backup-manifest portabili",
  "JSON payload validation against versioned schemas with in-process and remote registry backends, portable backup-manifest schemas, and registry snapshot export/import.":
    "Validazione payload JSON su schema versionati con backend in-process e remoti, schema backup-manifest portabili e export/import snapshot del registry.",
  "Search abstractions with in-memory BM25 provider":
    "Astrazioni di search con provider BM25 in-memory",
  "ISearchService and in-memory BM25 indexing for full-text search without external dependencies.":
    "ISearchService e indicizzazione BM25 in-memory per full-text search senza dipendenze esterne.",
  "Blob storage with optional Cryptography at-rest encryption":
    "Storage blob con cifratura at-rest Cryptography opzionale",
  "Unified blob storage for local filesystem (local-only profile), S3, and Azure Blob with streaming, pre-signed URLs, lifecycle management, and optional at-rest encryption via StangaNetLib.Cryptography.":
    "Storage blob unificato per filesystem locale (profilo local-only), S3 e Azure Blob con streaming, URL pre-signed, lifecycle e cifratura at-rest opzionale via StangaNetLib.Cryptography.",
  "Multi-tenant context and resolution":
    "Contesto e risoluzione multi-tenant",
  "Tenant identification, context accessors, and resolution strategies for multi-tenant applications.":
    "Identificazione tenant, accessor di contesto e strategie di risoluzione per applicazioni multi-tenant.",
};
