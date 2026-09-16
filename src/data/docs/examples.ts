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

export const libraryExamples: LibraryExamplesDoc[] = [
  {
    librarySlug: 'core',
    intro: L(
      'Practical patterns for entities, Result, guards, specifications, and unit of work. Copy what you need into a domain or application project that references StangaNetLib.Core.',
      'Pattern pratici per entity, Result, guard, specification e unit of work. Copia ciò che ti serve in un progetto di dominio o applicazione che referenzia StangaNetLib.Core.',
    ),
    sections: [
      {
        id: 'install',
        title: L('Install', 'Installazione'),
        description: L(
          'Add the GitHub Packages feed, then reference Core.',
          'Aggiungi il feed GitHub Packages, poi referenzia Core.',
        ),
        code: `<!-- NuGet.config -->
<packageSources>
  <add key="github" value="https://nuget.pkg.github.com/StangaNet/index.json" />
</packageSources>

<!-- .csproj -->
<PackageReference Include="StangaNetLib.Core" Version="1.0.2" />`,
      },
      {
        id: 'entity-result',
        title: L('Entity + Result', 'Entity + Result'),
        description: L(
          'Domain entity with Guid key and a factory that returns Result instead of throwing for validation failures.',
          'Entity di dominio con chiave Guid e factory che restituisce Result invece di lanciare per errori di validazione.',
        ),
        code: `using StangaNetLib.Core.Entities;
using StangaNetLib.Core.Common;
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

public sealed class OpenOrdersSpec : Specification<Order>
{
    public OpenOrdersSpec(string customerId)
    {
        Criteria = o => o.CustomerId == customerId && o.Total > 0;
        ApplyOrderBy(o => o.CreatedAt);
        ApplyPaging(skip: 0, take: 20);
    }
}

// repo.ListAsync(new OpenOrdersSpec(customerId));`,
      },
      {
        id: 'unit-of-work',
        title: L('Unit of work', 'Unit of work'),
        description: L(
          'Persist changes through IUnitOfWork after mutating aggregates.',
          'Persisti le modifiche tramite IUnitOfWork dopo aver mutato gli aggregate.',
        ),
        code: `using StangaNetLib.Core.Persistence;

public sealed class PlaceOrderHandler(IOrderRepository orders, IUnitOfWork uow)
{
    public async Task<Result<Guid>> Handle(string customerId, decimal total, CancellationToken ct)
    {
        var created = Order.Create(customerId, total);
        if (created.IsFailure) return Result<Guid>.Failure(created.Error);

        await orders.AddAsync(created.Value, ct);
        await uow.SaveChangesAsync(ct);
        return Result<Guid>.Success(created.Value.Id);
    }
}`,
      },
    ],
  },
  {
    librarySlug: 'contentflow',
    intro: L(
      'Register ContentFlow, configure the scheduler, and drive the Draft → Published lifecycle with Result-based transitions.',
      'Registra ContentFlow, configura lo scheduler e guida il ciclo Draft → Published con transizioni basate su Result.',
    ),
    sections: [
      {
        id: 'install-settings',
        title: L('Install & settings', 'Installazione e settings'),
        code: `<PackageReference Include="StangaNetLib.ContentFlow" Version="1.0.1" />

// appsettings.json
{
  "ContentFlowSettings": {
    "SchedulerInterval": "00:00:30",
    "SchedulerActor": "system"
  }
}`,
      },
      {
        id: 'di',
        title: L('Dependency injection', 'Dependency injection'),
        code: `// Program.cs
builder.Services.AddStangaNetLibContentFlow(builder.Configuration);
builder.Services.AddStangaNetLibContentFlowType<ArticleBody>(); // payload type

public sealed record ArticleBody(string Title, string Html);`,
      },
      {
        id: 'workflow',
        title: L('Workflow transitions', 'Transizioni di workflow'),
        description: L(
          'Create content and move it through Pending, Approved, and Published.',
          'Crea contenuto e fallo passare da Pending, Approved e Published.',
        ),
        code: `using StangaNetLib.ContentFlow;

public sealed class ArticlePublisher(IContentWorkflowService<ArticleBody> workflow)
{
    public async Task<Result> PublishDraftAsync(ArticleBody body, string actor, CancellationToken ct)
    {
        var created = await workflow.CreateAsync(body, ct);
        if (created.IsFailure) return Result.Failure(created.Error);

        var item = created.Value;
        var pending = await workflow.SubmitForReviewAsync(item.Id, actor, ct);
        if (pending.IsFailure) return Result.Failure(pending.Error);

        var approved = await workflow.ApproveAsync(item.Id, actor, ct);
        if (approved.IsFailure) return Result.Failure(approved.Error);

        return await workflow.PublishAsync(item.Id, actor, expiresAt: null, ct: ct);
    }
}`,
      },
      {
        id: 'schedule',
        title: L('Scheduled publish', 'Publish programmato'),
        code: `// Approve, then schedule automatic publish in the future
var when = DateTimeOffset.UtcNow.AddHours(2);
await workflow.SchedulePublishAsync(itemId, actor, when, ct: ct);
// Background scheduler (from DI) promotes Approved → Published when due.`,
      },
    ],
  },
  {
    librarySlug: 'resilience',
    intro: L(
      'Configure named Polly pipelines and execute work through IResilientExecutor so failures become Result, not exceptions.',
      'Configura pipeline Polly nominate ed esegui il lavoro tramite IResilientExecutor così i fallimenti diventano Result, non eccezioni.',
    ),
    sections: [
      {
        id: 'install-settings',
        title: L('Install & settings', 'Installazione e settings'),
        code: `<PackageReference Include="StangaNetLib.Resilience" Version="1.0.1" />

// appsettings.json
{
  "ResilienceSettings": {
    "Pipelines": {
      "Default": {
        "RetryCount": 3,
        "RetryBaseDelay": "00:00:01",
        "UseExponentialBackoff": true,
        "EnableCircuitBreaker": true,
        "CircuitBreakerFailureRatio": 0.5,
        "EnableTimeout": true,
        "TimeoutPerAttempt": "00:00:10"
      },
      "Http": {
        "RetryCount": 5,
        "TimeoutPerAttempt": "00:00:30"
      }
    }
  }
}`,
      },
      {
        id: 'di',
        title: L('Dependency injection', 'Dependency injection'),
        code: `// Program.cs — from configuration
builder.Services.AddStangaNetLibResilience(builder.Configuration);

// Or defaults only
// builder.Services.AddStangaNetLibResilience();`,
      },
      {
        id: 'execute',
        title: L('Execute through a pipeline', 'Eseguire tramite pipeline'),
        code: `using StangaNetLib.Resilience.Execution;
using StangaNetLib.Core.Common;

public sealed class OrderClient(IResilientExecutor resilience, HttpClient http)
{
    public Task<Result<string>> GetPayloadAsync(Guid id, CancellationToken ct)
        => resilience.ExecuteAsync("Http", async token =>
        {
            var response = await http.GetAsync($"/orders/{id}", token);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync(token);
        }, ct);
}

// result.IsFailure → ResilienceErrors (timeout, circuit open, …)`,
      },
    ],
  },
  {
    librarySlug: 'concurrency',
    intro: L(
      'Register concurrency primitives, tune defaults from configuration, and use keyed locks, throttles, queues, and debouncing.',
      'Registra le primitive di concorrenza, regola i default da configuration e usa keyed lock, throttle, code e debounce.',
    ),
    sections: [
      {
        id: 'install-settings',
        title: L('Install & settings', 'Installazione e settings'),
        code: `<PackageReference Include="StangaNetLib.Concurrency" Version="1.0.1" />

// appsettings.json
{
  "ConcurrencySettings": {
    "DefaultThrottleMaxConcurrency": 10,
    "WorkQueueCapacity": 1000,
    "WorkQueueFullMode": "Wait"
  }
}`,
      },
      {
        id: 'di',
        title: L('Dependency injection', 'Dependency injection'),
        code: `builder.Services.AddStangaNetLibConcurrency(builder.Configuration);
// Registers IKeyedLock, IAsyncThrottle, IWorkQueue<T>, IDebouncer, IAtomicCounterFactory, …`,
      },
      {
        id: 'keyed-lock',
        title: L('Keyed lock', 'Keyed lock'),
        code: `using StangaNetLib.Concurrency.Locking;

public sealed class OrderService(IKeyedLock keyedLock)
{
    public async Task ProcessAsync(string orderId, CancellationToken ct)
    {
        await using var _ = await keyedLock.AcquireAsync(orderId, ct);
        // Only one concurrent operation per orderId
    }
}`,
      },
      {
        id: 'throttle-queue',
        title: L('Throttle + work queue', 'Throttle + coda di lavoro'),
        code: `using StangaNetLib.Concurrency.Throttling;
using StangaNetLib.Concurrency.Synchronization;

public sealed class IngestWorker(
    IAsyncThrottle throttle,
    IWorkQueue<string> queue)
{
    public async Task EnqueueAsync(string job, CancellationToken ct)
    {
        await using var slot = await throttle.WaitAsync(ct);
        await queue.EnqueueAsync(job, ct);
    }

    public async Task RunAsync(CancellationToken ct)
    {
        await foreach (var job in queue.ConsumeAllAsync(ct))
            await ProcessAsync(job, ct);
    }

    private static Task ProcessAsync(string job, CancellationToken ct) => Task.CompletedTask;
}`,
      },
      {
        id: 'debouncer',
        title: L('Debouncer', 'Debouncer'),
        code: `using StangaNetLib.Concurrency.Scheduling;

public sealed class SearchBox(IDebouncer debouncer, ISearchApi api)
{
    public void OnQueryChanged(string query)
    {
        debouncer.Debounce(
            key: "search",
            action: ct => api.SearchAsync(query, ct),
            delay: TimeSpan.FromMilliseconds(300));
    }
}`,
      },
    ],
  },
  {
    librarySlug: 'gdpr',
    intro: L(
      'Wire GDPR options, middleware, consent checks, DSAR-style services, and pseudonymization. Host apps still implement persistence interfaces.',
      'Collega options GDPR, middleware, controlli di consenso, servizi in stile DSAR e pseudonimizzazione. L’app host implementa ancora le interfacce di persistenza.',
    ),
    sections: [
      {
        id: 'install-settings',
        title: L('Install & settings', 'Installazione e settings'),
        code: `<PackageReference Include="StangaNetLib.Gdpr" Version="1.0.0" />

// appsettings.json
{
  "GdprSettings": {
    "DataControllerName": "Acme Corp",
    "DpoEmail": "dpo@acme.com",
    "PseudonymizationKey": "BASE64_32_BYTE_KEY"
  },
  "DataRetentionSettings": {
    "InactiveUserDays": 365,
    "AuditLogDays": 730
  }
}

// Generate a key:
// Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))`,
      },
      {
        id: 'di-middleware',
        title: L('DI + middleware', 'DI + middleware'),
        description: L(
          'Register options and pseudonymization, then add consent/restriction middleware after auth.',
          'Registra options e pseudonimizzazione, poi aggiungi i middleware di consenso/limitazione dopo auth.',
        ),
        code: `// Program.cs
builder.Services.AddStangaNetLibGdpr(builder.Configuration);
builder.Services.AddScoped<IConsentRepository, EfConsentRepository>();
// Register other host implementations as needed (IDsarService, …)

var app = builder.Build();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseStangaNetLibGdpr();               // RequireConsentAttribute → 403
app.UseStangaNetLibGdprRestrictions();   // RequireNoRestrictionAttribute → 451`,
      },
      {
        id: 'consent',
        title: L('Consent', 'Consenso'),
        code: `using StangaNetLib.Gdpr.Consent.Attributes;
using StangaNetLib.Gdpr.Consent.Abstractions;

[RequireConsent("Marketing")]
public async Task<IResult> SendNewsletter(
    string userId,
    IConsentRepository consents,
    CancellationToken ct)
{
    // Middleware already enforced grant; optional explicit check:
    if (!await consents.HasConsentAsync(userId, "Marketing", ct))
        return Results.Forbid();

    return Results.Ok();
}

// Grant / withdraw
await consents.GrantAsync(userId, "Marketing", policyVersion: "2026-01", ct: ct);
await consents.WithdrawAsync(userId, "Marketing", ct);`,
      },
      {
        id: 'pseudonymization',
        title: L('Pseudonymization', 'Pseudonimizzazione'),
        code: `using StangaNetLib.Gdpr.Pseudonymization.Abstractions;

public sealed class UserAnonymizer(IPseudonymizationService crypto)
{
    public string StoreEmail(string email) => crypto.Encrypt(email);

    public string ReadEmail(string token) => crypto.Decrypt(token);

    public string Fingerprint(string value) => crypto.Anonymize(value); // irreversible
}`,
      },
      {
        id: 'dsar-sketch',
        title: L('DSAR sketch', 'Schema DSAR'),
        description: L(
          'Track a request deadline with IDsarService; export/delete remain host-specific.',
          'Traccia la scadenza con IDsarService; export/delete restano specifici dell’host.',
        ),
        code: `using StangaNetLib.Gdpr.Dsar.Abstractions;
using StangaNetLib.Gdpr.Dsar.Models;

public sealed class DsarFacade(IDsarService dsar, IDataExportService export)
{
    public async Task<Result> HandleAccessAsync(string userId, CancellationToken ct)
    {
        var opened = await dsar.SubmitAsync(userId, DsarType.Access, ct);
        if (opened.IsFailure) return Result.Failure(opened.Error);

        var data = await export.ExportUserDataAsync(userId, ct);
        if (data.IsFailure) return Result.Failure(data.Error);

        return await dsar.CompleteAsync(opened.Value.Id, ct);
    }
}`,
      },
    ],
  },
];

export function getLibraryExamples(slug: string): LibraryExamplesDoc | undefined {
  return libraryExamples.find((item) => item.librarySlug === slug);
}
