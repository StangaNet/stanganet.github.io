import type { LibraryDoc } from './types';

export const resilienceLibrary: LibraryDoc = {
  slug: 'resilience',
  name: 'StangaNetLib.Resilience',
  version: '1.0.1',
  targetFrameworks: ['net8.0', 'net9.0'],
  tagline: 'Named resilience pipelines that return Result instead of throwing',
  description:
    'Cross-cutting resilience library that wraps Microsoft.Extensions.Resilience (Polly v8). Operations run through named pipelines (retry, circuit breaker, timeout); all failures become Result / Result<T> instead of exceptions, so resilience stays part of domain logic.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Resilience',
  namespaces: [
    {
      name: 'StangaNetLib.Resilience.Execution',
      summary: 'Core engine for executing operations via named resilience pipelines.',
      types: [
        {
          slug: 'iresilient-executor',
          name: 'IResilientExecutor',
          displayName: 'IResilientExecutor',
          kind: 'interface',
          namespace: 'StangaNetLib.Resilience.Execution',
          summary:
            'Executes operations through named resilience pipelines, translating retry exhaustion, circuit open, timeout, cancellation, and unexpected exceptions into Result / Result<T>.',
          remarks:
            'Named pipelines are configured via ResilienceSettings.Pipelines in appsettings.json and registered with AddStangaNetLibResilience. Use the pipeline name "Default" for the pre-configured default pipeline. An unrecognised name executes without resilience (pass-through).',
          signature: 'public interface IResilientExecutor',
          methods: [
            {
              name: 'ExecuteAsync',
              signature:
                'Task<Result<T>> ExecuteAsync<T>(string pipelineName, Func<CancellationToken, Task<T>> operation, CancellationToken cancellationToken = default)',
              summary:
                'Runs the operation through the named pipeline and returns Result<T>.Success or a typed failure from ResilienceErrors.',
              isAsync: true,
              parameters: [
                {
                  name: 'pipelineName',
                  type: 'string',
                  description: 'Pipeline key from ResilienceSettings.Pipelines (e.g. Default).',
                },
                {
                  name: 'operation',
                  type: 'Func<CancellationToken, Task<T>>',
                  description: 'Async operation; token merges caller cancellation with pipeline timeout.',
                },
                {
                  name: 'cancellationToken',
                  type: 'CancellationToken',
                  description: 'Cancellation for the overall call.',
                  optional: true,
                },
              ],
            },
            {
              name: 'ExecuteAsync',
              signature:
                'Task<Result> ExecuteAsync(string pipelineName, Func<CancellationToken, Task> operation, CancellationToken cancellationToken = default)',
              summary: 'Void overload: returns Result.Success() or Result.Failure(Error).',
              isAsync: true,
              parameters: [
                {
                  name: 'pipelineName',
                  type: 'string',
                  description: 'Pipeline key from ResilienceSettings.Pipelines.',
                },
                {
                  name: 'operation',
                  type: 'Func<CancellationToken, Task>',
                  description: 'Async void operation to execute.',
                },
                {
                  name: 'cancellationToken',
                  type: 'CancellationToken',
                  description: 'Cancellation for the overall call.',
                  optional: true,
                },
              ],
            },
          ],
          example: {
            title: 'Inject and execute',
            code: `public class OrderService
{
    private readonly IResilientExecutor _resilience;

    public OrderService(IResilientExecutor resilience)
        => _resilience = resilience;

    public Task<Result<OrderDto>> GetOrderAsync(Guid id, CancellationToken ct)
        => _resilience.ExecuteAsync("Default", async token =>
        {
            var order = await _db.Orders.FindAsync(id, token)
                ?? throw new InvalidOperationException($"Order {id} not found.");
            return OrderDto.From(order);
        }, ct);
}`,
          },
        },
      ],
    },
    {
      name: 'StangaNetLib.Resilience.Errors',
      summary: 'Typed Error factories for resilience failures.',
      types: [
        {
          slug: 'resilience-errors',
          name: 'ResilienceErrors',
          displayName: 'ResilienceErrors',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Errors',
          summary: 'Factory for well-known Errors produced when a resilience pipeline fails.',
          signature: 'public static class ResilienceErrors',
          methods: [
            {
              name: 'CircuitOpen',
              signature: 'public static Error CircuitOpen(string pipelineName, string detail)',
              summary: 'Circuit breaker is open for the named pipeline.',
              isStatic: true,
            },
            {
              name: 'Timeout',
              signature: 'public static Error Timeout(string pipelineName, string detail)',
              summary: 'Pipeline or attempt timeout elapsed.',
              isStatic: true,
            },
            {
              name: 'Cancelled',
              signature: 'public static Error Cancelled(string pipelineName)',
              summary: 'Operation was cancelled.',
              isStatic: true,
            },
            {
              name: 'ExecutionFailed',
              signature: 'public static Error ExecutionFailed(string pipelineName, Exception exception)',
              summary: 'Unexpected exception or retry exhaustion mapped to a structured Error.',
              isStatic: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Resilience.Settings',
      summary: 'Configuration models for resilience pipelines.',
      types: [
        {
          slug: 'resilience-settings',
          name: 'ResilienceSettings',
          displayName: 'ResilienceSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Settings',
          summary: 'Root configuration for StangaNetLib.Resilience (appsettings section ResilienceSettings).',
          signature: 'public sealed class ResilienceSettings',
          fields: [
            {
              name: 'SectionName',
              type: 'string',
              summary: 'appsettings section key.',
              value: '"ResilienceSettings"',
            },
          ],
          properties: [
            {
              name: 'Pipelines',
              type: 'IReadOnlyDictionary<string, ResiliencePipelineSettings>',
              access: 'get',
              summary: 'Named pipelines available to IResilientExecutor.ExecuteAsync.',
            },
          ],
        },
        {
          slug: 'resilience-pipeline-settings',
          name: 'ResiliencePipelineSettings',
          displayName: 'ResiliencePipelineSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Settings',
          summary: 'Configuration for a single named resilience pipeline (retry, circuit breaker, timeout).',
          signature: 'public sealed class ResiliencePipelineSettings',
          properties: [
            {
              name: 'RetryCount',
              type: 'int',
              access: 'get; init',
              summary: 'Maximum retry attempts (default 3). Zero disables retry.',
            },
            {
              name: 'RetryBaseDelay',
              type: 'TimeSpan',
              access: 'get; init',
              summary: 'Base delay between retries (default 1 second).',
            },
            {
              name: 'UseExponentialBackoff',
              type: 'bool',
              access: 'get; init',
              summary: 'Use exponential backoff instead of constant delay (default true).',
            },
            {
              name: 'UseJitter',
              type: 'bool',
              access: 'get; init',
              summary: 'Add jitter to retry delays (default true).',
            },
            {
              name: 'EnableCircuitBreaker',
              type: 'bool',
              access: 'get; init',
              summary: 'Enable circuit breaker strategy (default true).',
            },
            {
              name: 'CircuitBreakerFailureRatio',
              type: 'double',
              access: 'get; init',
              summary: 'Failure ratio that opens the circuit (default 0.5).',
            },
            {
              name: 'CircuitBreakerMinimumThroughput',
              type: 'int',
              access: 'get; init',
              summary: 'Minimum calls in the sampling window before the circuit can open (default 10).',
            },
            {
              name: 'CircuitBreakerSamplingDuration',
              type: 'TimeSpan',
              access: 'get; init',
              summary: 'Sampling window for failure ratio (default 30 seconds).',
            },
            {
              name: 'CircuitBreakerBreakDuration',
              type: 'TimeSpan',
              access: 'get; init',
              summary: 'How long the circuit stays open (default 30 seconds).',
            },
            {
              name: 'EnableTimeout',
              type: 'bool',
              access: 'get; init',
              summary: 'Enable per-attempt timeout (default true).',
            },
            {
              name: 'TimeoutPerAttempt',
              type: 'TimeSpan',
              access: 'get; init',
              summary: 'Timeout applied to each attempt (default 10 seconds).',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Resilience.Extensions',
      summary: 'Dependency injection registration helpers.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Extensions',
          summary: 'Registers IResilientExecutor and named Polly pipelines from configuration or code.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            {
              name: 'AddStangaNetLibResilience',
              signature:
                'public static IServiceCollection AddStangaNetLibResilience(this IServiceCollection services, IConfiguration configuration)',
              summary: 'Bind ResilienceSettings from configuration and register pipelines + IResilientExecutor.',
              isStatic: true,
            },
            {
              name: 'AddStangaNetLibResilience',
              signature:
                'public static IServiceCollection AddStangaNetLibResilience(this IServiceCollection services, Action<ResilienceSettings> configure)',
              summary: 'Configure pipelines in code (tests or no config file).',
              isStatic: true,
            },
            {
              name: 'AddStangaNetLibResilience',
              signature:
                'public static IServiceCollection AddStangaNetLibResilience(this IServiceCollection services)',
              summary:
                'Register with a single Default pipeline and production-safe defaults (3 retries, exponential backoff, circuit breaker, 10s timeout).',
              isStatic: true,
            },
          ],
          example: {
            title: 'Register from appsettings',
            code: `// Program.cs
builder.Services.AddStangaNetLibResilience(builder.Configuration);

// appsettings.json
{
  "ResilienceSettings": {
    "Pipelines": {
      "Default": {
        "RetryCount": 3,
        "RetryBaseDelay": "00:00:01",
        "UseExponentialBackoff": true,
        "EnableCircuitBreaker": true,
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
        },
      ],
    },
  ],
};
