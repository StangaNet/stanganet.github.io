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
  "Authentication and authorization building blocks for ASP.NET":
    "Building block di autenticazione e autorizzazione per ASP.NET",
  "Auth primitives for token handling, identity, and policy helpers aligned with StangaNetLib.Core Result patterns.":
    "Primitivi Auth per token, identity e policy helper allineati ai pattern Result di StangaNetLib.Core.",
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
  "Encryption, hashing, and secret-handling helpers":
    "Helper per cifratura, hashing e gestione dei secret",
  "Cryptographic utilities (encrypt/decrypt, hash, protect) designed for application and domain use without heavy framework coupling.":
    "Utility crittografiche (encrypt/decrypt, hash, protect) per uso applicativo e di dominio senza accoppiamento framework pesante.",
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
  "Background job scheduling and execution":
    "Scheduling ed esecuzione di job in background",
  "Job definitions, schedulers, and runners for reliable background work on top of Core concurrency primitives.":
    "Definizioni job, scheduler e runner per lavoro in background affidabile sopra i primitivi di concurrency di Core.",
  "Media storage, processing, and metadata":
    "Storage media, processing e metadata",
  "Media asset abstractions for upload, storage backends, and processing pipelines.":
    "Astrazioni media asset per upload, backend di storage e pipeline di processing.",
  "Multi-channel notification dispatch and templates":
    "Dispatch notifiche multi-canale e template",
  "Notification channels, templates, and dispatch services for email and other providers.":
    "Canali di notifica, template e servizi di dispatch per email e altri provider.",
  "Logging, metrics, and tracing helpers":
    "Helper per logging, metriche e tracing",
  "Observability wiring for structured logging, metrics, and activity tracing across StangaNetLib services.":
    "Wiring di observability per logging strutturato, metriche e activity tracing nei servizi StangaNetLib.",
  "Rate limiting and request abuse protection":
    "Rate limiting e protezione da abusi sulle richieste",
  "ASP.NET request protection: rate limits, bot/abuse controls, backed by Caching where appropriate.":
    "Protezione richieste ASP.NET: rate limit, controlli bot/abuso, con Caching dove appropriato.",
  "Named Polly pipelines that return Result":
    "Pipeline Polly nominate che restituiscono Result",
  "Resilience pipelines (retry, circuit breaker, timeout) via Microsoft.Extensions.Resilience, mapping failures to Core Result types.":
    "Pipeline di resilience (retry, circuit breaker, timeout) via Microsoft.Extensions.Resilience, con fallimenti mappati sui Result di Core.",
  "Versioned JSON schema validation":
    "Validazione JSON schema versionata",
  "Schema registry for versioned JSON contracts with validation against registered schemas.":
    "Schema registry per contratti JSON versionati con validazione rispetto agli schema registrati.",
  "Search abstractions with in-memory BM25 provider":
    "Astrazioni di search con provider BM25 in-memory",
  "ISearchService and in-memory BM25 indexing for full-text search without external dependencies.":
    "ISearchService e indicizzazione BM25 in-memory per full-text search senza dipendenze esterne.",
  "Blob/object storage abstractions and providers":
    "Astrazioni e provider di storage blob/object",
  "Storage service contracts with local and cloud-oriented providers for binary object persistence.":
    "Contratti di storage con provider locali e orientati al cloud per oggetti binari.",
  "Multi-tenant context and resolution":
    "Contesto e risoluzione multi-tenant",
  "Tenant identification, context accessors, and resolution strategies for multi-tenant applications.":
    "Identificazione tenant, accessor di contesto e strategie di risoluzione per applicazioni multi-tenant.",
};
