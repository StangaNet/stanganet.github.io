export type LocalizedText = { en: string; it: string };

export type UsageSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  code: string;
};

export type LibraryExamplesDoc = {
  librarySlug: string;
  intro: LocalizedText;
  sections: UsageSection[];
};

function L(en: string, it: string): LocalizedText {
  return { en, it };
}

function install(packageName: string, version: string): UsageSection {
  return {
    id: 'install',
    title: L('Install', 'Installazione'),
    description: L(
      'Add the GitHub Packages feed, then reference the package.',
      'Aggiungi il feed GitHub Packages, poi referenzia il pacchetto.',
    ),
    code: `<!-- NuGet.config -->
<packageSources>
  <add key="github" value="https://nuget.pkg.github.com/StangaNet/index.json" />
</packageSources>

<!-- .csproj -->
<PackageReference Include="${packageName}" Version="${version}" />`,
  };
}

export const libraryExamples: LibraryExamplesDoc[] = [
  {
    librarySlug: 'core',
    intro: L(
      'Practical patterns for entities, Result, guards, specifications, and unit of work. Copy what you need into a domain or application project that references StangaNetLib.Core.',
      'Pattern pratici per entity, Result, guard, specification e unit of work. Copia ciò che ti serve in un progetto di dominio o applicazione che referenzia StangaNetLib.Core.',
    ),
    sections: [
      install('StangaNetLib.Core', '1.0.1'),
      {
        id: 'entity-result',
        title: L('Entity + Result', 'Entity + Result'),
        description: L(
          'Domain entity with Guid key and a factory that returns Result instead of throwing for validation failures.',
          'Entity di dominio con chiave Guid e factory che restituisce Result invece di lanciare per errori di validazione.',
        ),
        code: `using StangaNetLib.Core.Common;
using StangaNetLib.Core.Guards;

public sealed class Order : Entity
{
    public string CustomerId { get; private set; } = "";
    public decimal Total { get; private set; }

    private Order() { }

    public static Result<Order> Create(string customerId, decimal total)
    {
        if (string.IsNullOrWhiteSpace(customerId))
            return Result<Order>.Failure(Error.Validation(nameof(customerId), "Customer is required."));
        if (total < 0)
            return Result<Order>.Failure(Error.Validation(nameof(total), "Total cannot be negative."));

        return Result<Order>.Success(new Order
        {
            CustomerId = customerId.Trim(),
            Total = total,
        });
    }

    public void Touch() => MarkUpdated();
}

// Usage
var result = Order.Create("cust-1", 42.5m);
result.Match(
    onSuccess: order => Console.WriteLine(order.Id),
    onFailure: error => Console.WriteLine(error.Description));`,
      },
      {
        id: 'guards',
        title: L('Guards', 'Guard'),
        description: L(
          'Validate arguments at the boundary; returns the value for fluent assignment.',
          'Valida gli argomenti al confine; restituisce il valore per l’assegnazione fluente.',
        ),
        code: `using StangaNetLib.Core.Guards;

public void Register(string email, Guid userId)
{
    email = Guard.Against.NullOrWhiteSpace(email, nameof(email));
    userId = Guard.Against.Default(userId, nameof(userId));
    // ...
}`,
      },
      {
        id: 'specification',
        title: L('Specification', 'Specification'),
        description: L(
          'Encapsulate a query filter (and optional paging) for repositories.',
          'Incapsula un filtro di query (e paginazione opzionale) per i repository.',
        ),
        code: `using StangaNetLib.Core.Specifications;

public sealed class OpenOrdersSpec : BaseSpecification<Order>
{
    public OpenOrdersSpec(string customerId)
        : base(o => o.CustomerId == customerId && o.Total > 0)
    {
        ApplyOrderBy(o => o.CreatedAt);
        ApplyPaging(skip: 0, take: 20);
    }
}

// await repo.FindAsync(new OpenOrdersSpec(customerId));`,
      },
      {
        id: 'unit-of-work',
        title: L('Unit of work', 'Unit of work'),
        description: L(
          'Persist changes through IUnitOfWork after mutating aggregates.',
          'Persisti le modifiche tramite IUnitOfWork dopo aver mutato gli aggregate.',
        ),
        code: `using StangaNetLib.Core.Common;
using StangaNetLib.Core.Repositories;

public sealed class PlaceOrderHandler(IRepository<Order> orders, IUnitOfWork uow)
{
    public async Task<Result<Guid>> Handle(string customerId, decimal total, CancellationToken ct)
    {
        var created = Order.Create(customerId, total);
        if (created.IsFailure) return Result<Guid>.Failure(created.Error);

        await orders.AddAsync(created.Value!, ct);
        await uow.SaveChangesAsync(ct);
        return Result<Guid>.Success(created.Value!.Id);
    }
}`,
      },
    ],
  },
  {
    librarySlug: 'concurrency',
    intro: L(
      'Keyed locks, throttles, work queues, and debouncers for async coordination.',
      'Lock per chiave, throttle, work queue e debouncer per il coordinamento async.',
    ),
    sections: [
      install('StangaNetLib.Concurrency', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Concurrency.Extensions;

builder.Services.AddStangaNetLibConcurrency(builder.Configuration);`,
      },
      {
        id: 'keyed-lock',
        title: L('Keyed lock', 'Keyed lock'),
        description: L(
          'Serialize work per key without blocking unrelated keys.',
          'Serializza il lavoro per chiave senza bloccare le altre chiavi.',
        ),
        code: `using StangaNetLib.Concurrency.Extensions;
using StangaNetLib.Concurrency.Locking;

public sealed class ProfileUpdater(IKeyedLock keyedLock)
{
    public Task UpdateAsync(string userId, Func<CancellationToken, Task> work, CancellationToken ct)
        => keyedLock.ExecuteAsync($"user:{userId}", work, ct);
}`,
      },
    ],
  },
  {
    librarySlug: 'resilience',
    intro: L(
      'Named Polly pipelines that map failures to Core Result types.',
      'Pipeline Polly nominate che mappano i fallimenti sui tipi Result di Core.',
    ),
    sections: [
      install('StangaNetLib.Resilience', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Resilience.Extensions;

builder.Services.AddStangaNetLibResilience(builder.Configuration);`,
      },
      {
        id: 'execute',
        title: L('Execute with Result', 'Esegui con Result'),
        code: `using StangaNetLib.Resilience.Execution;

public sealed class RemoteClient(IResilientExecutor executor)
{
    public Task<Result<string>> GetAsync(CancellationToken ct)
        => executor.ExecuteAsync("Default", async token =>
        {
            // call dependency; exceptions become Result failures
            return await FetchPayloadAsync(token);
        }, ct);
}`,
      },
    ],
  },
  {
    librarySlug: 'caching',
    intro: L(
      'In-memory or Redis caching with lock-aware helpers on top of Concurrency.',
      'Cache in-memory o Redis con helper lock-aware basati su Concurrency.',
    ),
    sections: [
      install('StangaNetLib.Caching', '1.0.2'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Caching.Extensions;

builder.Services.AddStangaNetLibCaching(builder.Configuration);
// or: services.AddStangaNetLibInMemoryCache();`,
      },
      {
        id: 'get-or-set',
        title: L('Get or set', 'Get or set'),
        code: `using StangaNetLib.Caching.Storage;

public sealed class ProfileCache(ICacheService cache)
{
    public Task<Result<UserProfile>> GetAsync(string userId, CancellationToken ct)
        => cache.GetOrSetAsync(
            $"profile:{userId}",
            token => LoadFromDbAsync(userId, token),
            TimeSpan.FromMinutes(10),
            ct);
}`,
      },
    ],
  },
  {
    librarySlug: 'storage',
    intro: L(
      'Blob storage (local, S3, Azure) with optional Cryptography at-rest encryption.',
      'Storage blob (local, S3, Azure) con cifratura at-rest opzionale via Cryptography.',
    ),
    sections: [
      install('StangaNetLib.Storage', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Cryptography.Extensions;
using StangaNetLib.Storage.Extensions;

builder.Services.AddStangaNetLibCryptography(); // required when EncryptAtRest is true
builder.Services.AddStangaNetLibStorage(builder.Configuration);
// Local-only profile with optional encryption:
// services.AddStangaNetLibStorageLocalOnly("wwwroot/storage", encryptAtRest: true, encryptionPassphrase: "...");`,
      },
      {
        id: 'upload',
        title: L('Upload', 'Upload'),
        code: `using StangaNetLib.Storage.Abstractions;

public sealed class AvatarStore(IBlobStorageService blobs)
{
    public Task<Result<BlobUploadResult>> SaveAsync(Stream content, string blobKey, CancellationToken ct)
        => blobs.UploadAsync("avatars", blobKey, content, "image/png", ct: ct);
}`,
      },
    ],
  },
  {
    librarySlug: 'media',
    intro: L(
      'Media asset upload and processing pipelines, often paired with Storage.',
      'Upload e pipeline di processing media, spesso abbinati a Storage.',
    ),
    sections: [
      install('StangaNetLib.Media', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Media.Extensions;

builder.Services.AddStangaNetLibMedia(builder.Configuration);
// or local: services.AddStangaNetLibMediaLocal(...);`,
      },
    ],
  },
  {
    librarySlug: 'auth',
    intro: L(
      'Self-hosted JWT with Argon2id, TOTP MFA, login lockout, plus optional Auth0 and external IdP exchange.',
      'JWT self-hosted con Argon2id, TOTP MFA, login lockout, più Auth0 e token exchange IdP opzionali.',
    ),
    sections: [
      install('StangaNetLib.Auth', '1.2.0'),
      {
        id: 'register',
        title: L('Self-hosted register', 'Registrazione self-hosted'),
        code: `using StangaNetLib.Auth.Extensions;

// JWT + Argon2id + TOTP + login lockout (no Auth0)
builder.Services.AddStangaNetLibAuthSelfHosted(builder.Configuration);
// Or compose: AddStangaNetLibAuth + AddStangaNetLibAuthArgon2id + AddStangaNetLibAuthTotp + AddStangaNetLibAuthLoginLockout
// Auth0: services.AddStangaNetLibAuth0(builder.Configuration);`,
      },
      {
        id: 'totp-lockout',
        title: L('TOTP MFA and lockout', 'TOTP MFA e lockout'),
        code: `using StangaNetLib.Auth.Abstractions;

// Enroll
var secret = totp.GenerateSecret();
var uri = totp.GetOtpAuthUri(secret, accountName: "user@example.com", issuer: "MyApp");

// Verify + lockout
if (await lockout.IsLockedOutAsync(userId, ct)) return Results.StatusCode(429);
var ok = totp.Verify(secret, code);
if (!ok) { await lockout.RecordFailureAsync(userId, ct); return Results.Unauthorized(); }
await lockout.ResetAsync(userId, ct);`,
      },
      {
        id: 'external-providers',
        title: L('External identity (token exchange)', 'Identity esterna (token exchange)'),
        description: L(
          'Validate Google/Apple/Microsoft ID tokens or Facebook access tokens, then issue your own JWT.',
          'Valida ID token Google/Apple/Microsoft o access token Facebook, poi emetti il tuo JWT.',
        ),
        code: `using StangaNetLib.Auth.Abstractions;
using StangaNetLib.Auth.Extensions;
using StangaNetLib.Auth.Models;

builder.Services.AddStangaNetLibAuth(builder.Configuration);
builder.Services.AddStangaNetLibAuthExternalGoogle(builder.Configuration);
builder.Services.AddStangaNetLibAuthExternalApple(builder.Configuration);
builder.Services.AddStangaNetLibAuthExternalFacebook(builder.Configuration);
builder.Services.AddStangaNetLibAuthExternalMicrosoft(builder.Configuration);

// In an endpoint:
var result = await external.ValidateAsync(ExternalAuthProviders.Google, idToken);
if (result.IsFailure) return Results.Unauthorized();
// Map result.Value to a local user, then IJwtTokenGenerator.GenerateAccessToken(...)`,
      },
    ],
  },
  {
    librarySlug: 'observability',
    intro: L(
      'ASP.NET middleware for correlation, logging, ProblemDetails, and PII masking including financial fields.',
      'Middleware ASP.NET per correlation, logging, ProblemDetails e masking PII inclusi campi finanziari.',
    ),
    sections: [
      install('StangaNetLib.Observability', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Observability.Extensions;

builder.Services.AddStangaNetLibObservability();
app.UseStangaNetLibObservability();`,
      },
      {
        id: 'financial-mask',
        title: L('Financial PII masking', 'Masking PII finanziaria'),
        code: `using StangaNetLib.Observability.Masking;

var masked = masking.MaskFinancialPii("IBAN IT60X0542811101000000123456 amount 1.234,56");
// Also: MaskAmount / MaskIban / MaskDescription`,
      },
    ],
  },
  {
    librarySlug: 'gdpr',
    intro: L(
      'Consent, DSAR lifecycle, pseudonymization, and related GDPR services.',
      'Consenso, ciclo di vita DSAR, pseudonimizzazione e servizi GDPR correlati.',
    ),
    sections: [
      install('StangaNetLib.Gdpr', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Gdpr.Infrastructure.Extensions;

builder.Services.AddStangaNetLibGdpr(builder.Configuration);`,
      },
    ],
  },
  {
    librarySlug: 'contentflow',
    intro: L(
      'Content workflow: Draft ? Pending ? Approved ? Published with review trails.',
      'Workflow contenuti: Draft ? Pending ? Approved ? Published con trail di review.',
    ),
    sections: [
      install('StangaNetLib.ContentFlow', '1.1.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.ContentFlow.Extensions;

builder.Services.AddStangaNetLibContentFlow(builder.Configuration);
builder.Services.AddStangaNetLibContentFlowType<Article>();`,
      },
    ],
  },
  {
    librarySlug: 'cryptography',
    intro: L(
      'Hashing, KDF, HMAC, and AES-GCM at-rest encryption with versioned SNEN envelopes.',
      'Hashing, KDF, HMAC e cifratura AES-GCM at-rest con envelope SNEN versionati.',
    ),
    sections: [
      install('StangaNetLib.Cryptography', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Cryptography.Extensions;

builder.Services.AddStangaNetLibCryptography(builder.Configuration);`,
      },
      {
        id: 'at-rest',
        title: L('At-rest SNEN envelope', 'Envelope SNEN at-rest'),
        code: `using StangaNetLib.Cryptography.Abstractions;

var encrypted = atRest.EncryptBlob(plainBytes, passphrase);
var decrypted = atRest.DecryptBlob(encrypted, passphrase);
// Streams: EncryptStreamAsync / DecryptStreamAsync; files: FileEnvelope.WriteAsync / ReadAsync`,
      },
    ],
  },
  {
    librarySlug: 'tenancy',
    intro: L(
      'Multi-tenant resolution (header, claim, path, host) and tenant context accessors.',
      'Risoluzione multi-tenant (header, claim, path, host) e accessor del contesto tenant.',
    ),
    sections: [
      install('StangaNetLib.Tenancy', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Tenancy.Extensions;

builder.Services.AddStangaNetLibTenancy(builder.Configuration);
// optional: services.AddStangaNetLibTenancyCache<MyTenantStore>(TimeSpan.FromMinutes(10));`,
      },
    ],
  },
  {
    librarySlug: 'featureflags',
    intro: L(
      'Feature flag evaluation with in-memory and configuration providers.',
      'Valutazione feature flag con provider in-memory e da configurazione.',
    ),
    sections: [
      install('StangaNetLib.FeatureFlags', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.FeatureFlags.Extensions;

builder.Services.AddStangaNetLibFeatureFlags(builder.Configuration);
// or bind flags from config: services.AddStangaNetLibFeatureFlagsFromConfiguration(builder.Configuration);`,
      },
      {
        id: 'evaluate',
        title: L('Evaluate', 'Valutazione'),
        code: `using StangaNetLib.FeatureFlags.Abstractions;

public sealed class Checkout(IFeatureFlagService flags)
{
    public async Task<bool> IsNewCheckoutAsync(string? userId, CancellationToken ct)
    {
        var result = await flags.IsEnabledAsync("checkout.v2", userId, cancellationToken: ct);
        return result.IsSuccess && result.Value;
    }
}`,
      },
    ],
  },
  {
    librarySlug: 'jobs',
    intro: L(
      'Background jobs with idempotent enqueue and cron materialization horizon (in-memory).',
      'Job in background con enqueue idempotente e orizzonte di materializzazione cron (in-memory).',
    ),
    sections: [
      install('StangaNetLib.Jobs', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Jobs.Extensions;

builder.Services.AddStangaNetLibJobs(builder.Configuration);
// JobsSettings.MaterializeHorizonDays defaults to 7 (in-memory only)
// Hangfire: services.AddStangaNetLibJobsWithHangfire(builder.Configuration, hf => { /* ... */ });`,
      },
      {
        id: 'idempotent-enqueue',
        title: L('Idempotent enqueue', 'Enqueue idempotente'),
        code: `using StangaNetLib.Jobs.Abstractions;

await scheduler.EnqueueAsync<SendEmailJob, SendEmailArgs>(
    args,
    idempotencyKey: $"email:{userId}:{templateId}");`,
      },
    ],
  },
  {
    librarySlug: 'requestprotection',
    intro: L(
      'Rate limiting with AuthLockout preset and optional required idempotency keys.',
      'Rate limiting con preset AuthLockout e chiavi di idempotenza obbligatorie opzionali.',
    ),
    sections: [
      install('StangaNetLib.RequestProtection', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.RequestProtection.Extensions;

builder.Services.AddStangaNetLibCaching(builder.Configuration);
builder.Services.AddStangaNetLibRateLimit(builder.Configuration);
builder.Services.AddStangaNetLibAuthLockoutRateLimit(); // [RateLimit("AuthLockout")]
builder.Services.AddStangaNetLibIdempotency(opt =>
{
    opt.RequireKey = true;
    opt.RequiredPathPrefixes = ["/api/payments"];
});`,
      },
    ],
  },
  {
    librarySlug: 'schemaregistry',
    intro: L(
      'Versioned JSON schemas with portable backup-manifest seeding and registry snapshots.',
      'JSON schema versionati con seed del backup-manifest e snapshot del registry.',
    ),
    sections: [
      install('StangaNetLib.SchemaRegistry', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.SchemaRegistry.Extensions;

builder.Services.AddStangaNetLibSchemaRegistry(builder.Configuration);
var app = builder.Build();
await app.Services.AddStangaNetLibBackupManifestSchemasAsync();
// Snapshot: SchemaRegistrySnapshot.ExportAsync / ImportAsync`,
      },
    ],
  },
  {
    librarySlug: 'notifications',
    intro: L(
      'Multi-channel dispatch (email, in-app, push) with inbox read-state and channel toggles.',
      'Dispatch multi-canale (email, in-app, push) con inbox e flag per canale.',
    ),
    sections: [
      install('StangaNetLib.Notifications', '1.1.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Notifications.Extensions;

builder.Services.AddStangaNetLibNotifications(builder.Configuration);
// NotificationsSettings: EnableEmail / EnableInApp / EnablePush`,
      },
      {
        id: 'inbox',
        title: L('In-app inbox', 'Inbox in-app'),
        code: `using StangaNetLib.Notifications.Abstractions;

var page = await inbox.GetInboxAsync(userId, skip: 0, take: 20, ct);
await inbox.MarkAsReadAsync(userId, notificationId, ct);
var unread = await inbox.GetUnreadCountAsync(userId, ct);`,
      },
    ],
  },
  {
    librarySlug: 'search',
    intro: L(
      'Full-text search abstractions with an in-memory BM25 provider.',
      'Astrazioni di full-text search con provider BM25 in-memory.',
    ),
    sections: [
      install('StangaNetLib.Search', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Search.Extensions;

builder.Services.AddStangaNetLibSearch<ProductDocument>("products");
// or bind from config: services.AddStangaNetLibSearch<ProductDocument>(builder.Configuration);`,
      },
    ],
  },
  {
    librarySlug: 'eventbus',
    intro: L(
      'Pub/sub messaging with in-memory and RabbitMQ-style providers.',
      'Messaging pub/sub con provider in-memory e stile RabbitMQ.',
    ),
    sections: [
      install('StangaNetLib.EventBus', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.EventBus.Extensions;

builder.Services.AddStangaNetLibEventBus(builder.Configuration);
// RabbitMQ: services.AddStangaNetLibEventBusWithRabbitMq(builder.Configuration);`,
      },
    ],
  },
  {
    librarySlug: 'money',
    intro: L(
      'Minor-unit Money value object with EUR-first arithmetic, allocate/split, and formatting.',
      'Value object Money in unità minori con aritmetica EUR-first, allocate/split e formattazione.',
    ),
    sections: [
      install('StangaNetLib.Money', '1.0.0'),
      {
        id: 'usage',
        title: L('Create and allocate', 'Creazione e allocate'),
        code: `using StangaNetLib.Money.ValueObjects;

var price = Money.FromDecimal(12.34m).Value!;
var tax = price.Multiply(0.22m).Value!;
var total = price.Add(tax).Value!;
var shares = total.Allocate(3).Value!;
Console.WriteLine(total.Format());`,
      },
    ],
  },
  {
    librarySlug: 'encryptedstorage',
    intro: L(
      'Local encrypted-at-rest blobs via Storage + Cryptography SNEN envelopes.',
      'Blob locali cifrati at-rest via Storage + envelope SNEN di Cryptography.',
    ),
    sections: [
      install('StangaNetLib.EncryptedStorage', '1.0.0'),
      {
        id: 'register',
        title: L('Register and upload', 'Registrazione e upload'),
        code: `using StangaNetLib.EncryptedStorage.Abstractions;
using StangaNetLib.EncryptedStorage.Extensions;

builder.Services.AddStangaNetLibEncryptedStorage(
    rootPath: "/var/app/blobs",
    passphrase: builder.Configuration["EncryptedStorageSettings:Passphrase"]!);

var store = sp.GetRequiredService<IEncryptedBlobStorage>();
await using var input = File.OpenRead("doc.pdf");
var uploaded = await store.UploadAsync(input, "application/pdf");
await store.VerifyAsync(uploaded.Value!.BlobId);`,
      },
    ],
  },
  {
    librarySlug: 'recurrence',
    intro: L(
      'Calendar recurrence rules with idempotent occurrence materialization to a horizon.',
      'Regole di ricorrenza calendario con materializzazione idempotente delle occorrenze.',
    ),
    sections: [
      install('StangaNetLib.Recurrence', '1.0.0'),
      {
        id: 'register',
        title: L('Register and materialize', 'Registrazione e materializzazione'),
        code: `using StangaNetLib.Recurrence.Abstractions;
using StangaNetLib.Recurrence.Extensions;
using StangaNetLib.Recurrence.Models;

builder.Services.AddStangaNetLibRecurrenceInMemory(builder.Configuration);

await rules.SaveAsync(new RecurrenceRule
{
    Id = "rent",
    Frequency = RecurrenceFrequency.Monthly,
    Interval = 1,
    DayOfMonth = 31,
    Start = new DateOnly(2026, 1, 31),
    TimeZoneId = "UTC"
});
await materializer.MaterializeAsync(); // HorizonDays default 60`,
      },
    ],
  },
  {
    librarySlug: 'backup',
    intro: L(
      'Encrypted portable .snbak archives with SchemaRegistry-validated manifests.',
      'Archivi .snbak portabili cifrati con manifest validati da SchemaRegistry.',
    ),
    sections: [
      install('StangaNetLib.Backup', '1.0.0'),
      {
        id: 'register',
        title: L('Create and verify backup', 'Crea e verifica backup'),
        code: `using StangaNetLib.Backup.Abstractions;
using StangaNetLib.Backup.Extensions;
using StangaNetLib.SchemaRegistry.Extensions;

builder.Services.AddStangaNetLibInMemorySchemaRegistry();
builder.Services.AddSingleton<IBackupPartExporter, MyExporter>();
builder.Services.AddSingleton<IBackupPartImporter, MyImporter>();
builder.Services.AddStangaNetLibBackup(builder.Configuration);

var app = builder.Build();
await app.Services.AddStangaNetLibBackupManifestSchemasAsync();
var backups = app.Services.GetRequiredService<IBackupService>();
await backups.CreateBackupAsync("instance.snbak", passphrase, product: "MyApp");
await backups.VerifyBackupAsync("instance.snbak", passphrase);`,
      },
    ],
  },
];

export function getLibraryExamples(slug: string): LibraryExamplesDoc | undefined {
  return libraryExamples.find((item) => item.librarySlug === slug);
}
