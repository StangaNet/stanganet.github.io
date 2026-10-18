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
      install('StangaNetLib.Core', '1.0.0'),
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
      install('StangaNetLib.Concurrency', '1.0.0'),
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
      install('StangaNetLib.Resilience', '1.0.0'),
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
      install('StangaNetLib.Caching', '1.0.1'),
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
      'Blob/object storage abstractions with local and cloud-oriented providers.',
      'Astrazioni storage blob/object con provider locali e orientati al cloud.',
    ),
    sections: [
      install('StangaNetLib.Storage', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Storage.Extensions;

builder.Services.AddStangaNetLibStorage(builder.Configuration);
// or local: services.AddStangaNetLibStorageLocal(opt => opt.RootPath = "data/blobs");`,
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
      install('StangaNetLib.Media', '1.0.1'),
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
      'JWT auth wiring, Auth0 helpers, and token store abstractions.',
      'Wiring JWT, helper Auth0 e astrazioni token store.',
    ),
    sections: [
      install('StangaNetLib.Auth', '1.0.1'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Auth.Extensions;

builder.Services.AddStangaNetLibAuth(builder.Configuration);
// Auth0: services.AddStangaNetLibAuth0(builder.Configuration);
// Dev store: services.AddStangaNetLibAuthInMemoryTokenStore();`,
      },
    ],
  },
  {
    librarySlug: 'observability',
    intro: L(
      'Structured logging, metrics, and activity tracing helpers.',
      'Helper per logging strutturato, metriche e activity tracing.',
    ),
    sections: [
      install('StangaNetLib.Observability', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Observability.Extensions;

builder.Services.AddStangaNetLibObservability(opt =>
{
    opt.ServiceName = "MyApi";
});`,
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
      install('StangaNetLib.Gdpr', '1.0.0'),
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
      'Content workflow: Draft → Pending → Approved → Published with review trails.',
      'Workflow contenuti: Draft → Pending → Approved → Published con trail di review.',
    ),
    sections: [
      install('StangaNetLib.ContentFlow', '1.1.0'),
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
      'Encrypt/decrypt, hashing, and secret-handling helpers for application code.',
      'Helper encrypt/decrypt, hashing e gestione secret per il codice applicativo.',
    ),
    sections: [
      install('StangaNetLib.Cryptography', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Cryptography.Extensions;

builder.Services.AddStangaNetLibCryptography(builder.Configuration);`,
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
      install('StangaNetLib.Tenancy', '1.0.0'),
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
      install('StangaNetLib.FeatureFlags', '1.0.0'),
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
      'Background jobs with in-memory or Hangfire backends.',
      'Job in background con backend in-memory o Hangfire.',
    ),
    sections: [
      install('StangaNetLib.Jobs', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Jobs.Extensions;

builder.Services.AddStangaNetLibJobs(builder.Configuration);
// or Hangfire: services.AddStangaNetLibJobsWithHangfire(builder.Configuration, hf => { /* ... */ });`,
      },
    ],
  },
  {
    librarySlug: 'requestprotection',
    intro: L(
      'Rate limiting and idempotency middleware backed by Caching.',
      'Rate limiting e middleware di idempotenza basati su Caching.',
    ),
    sections: [
      install('StangaNetLib.RequestProtection', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.RequestProtection.Extensions;

builder.Services.AddStangaNetLibCaching(builder.Configuration);
builder.Services.AddStangaNetLibRateLimit(builder.Configuration);
builder.Services.AddStangaNetLibIdempotency(builder.Configuration);`,
      },
    ],
  },
  {
    librarySlug: 'schemaregistry',
    intro: L(
      'Versioned JSON schema validation with in-memory or HTTP registry backends.',
      'Validazione JSON schema versionata con backend in-memory o HTTP.',
    ),
    sections: [
      install('StangaNetLib.SchemaRegistry', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.SchemaRegistry.Extensions;

builder.Services.AddStangaNetLibSchemaRegistry(builder.Configuration);
// or: services.AddStangaNetLibInMemorySchemaRegistry();`,
      },
    ],
  },
  {
    librarySlug: 'notifications',
    intro: L(
      'Multi-channel notification dispatch and templates.',
      'Dispatch notifiche multi-canale e template.',
    ),
    sections: [
      install('StangaNetLib.Notifications', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.Notifications.Extensions;

builder.Services.AddStangaNetLibNotifications(builder.Configuration);`,
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
      install('StangaNetLib.Search', '1.0.0'),
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
      install('StangaNetLib.EventBus', '1.0.0'),
      {
        id: 'register',
        title: L('Register', 'Registrazione'),
        code: `using StangaNetLib.EventBus.Extensions;

builder.Services.AddStangaNetLibEventBus(builder.Configuration);
// RabbitMQ: services.AddStangaNetLibEventBusWithRabbitMq(builder.Configuration);`,
      },
    ],
  },
];

export function getLibraryExamples(slug: string): LibraryExamplesDoc | undefined {
  return libraryExamples.find((item) => item.librarySlug === slug);
}
