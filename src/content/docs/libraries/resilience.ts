import type { LibraryDoc } from '../types';

export const resilienceLibrary: LibraryDoc = {
  slug: 'resilience',
  name: 'StangaNetLib.Resilience',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0'],
  tagline: 'Named Polly pipelines that return Result',
  description:
    'Resilience pipelines (retry, circuit breaker, timeout) via Microsoft.Extensions.Resilience, mapping failures to Core Result types.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Resilience',
  namespaces: [
    {
      name: 'StangaNetLib.Resilience.Errors',
      summary: 'Types in StangaNetLib.Resilience.Errors.',
      types: [
        {
          slug: 'resilience-errors',
          name: 'ResilienceErrors',
          displayName: 'ResilienceErrors',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Errors',
          summary: 'Pre-defined Error factory methods for resilience pipeline failures. Each error has a machine-readable Resilience.* code and an Internal type so consumers can branch on the code without parsing the description.',
          signature: 'public static class ResilienceErrors',
          methods: [
            { name: 'CircuitOpen', signature: 'public static Error CircuitOpen(string pipelineName, string detail)', summary: 'The circuit breaker for pipelineName is open — the operation was rejected immediately without attempting execution. Error code: Resilience.CircuitOpen.', parameters: [{ name: 'pipelineName', type: 'string', description: 'pipelineName' }, { name: 'detail', type: 'string', description: 'detail' }], returns: 'Error', isStatic: true },
            { name: 'Timeout', signature: 'public static Error Timeout(string pipelineName, string detail)', summary: 'The operation exceeded its configured per-attempt timeout. Error code: Resilience.Timeout.', parameters: [{ name: 'pipelineName', type: 'string', description: 'pipelineName' }, { name: 'detail', type: 'string', description: 'detail' }], returns: 'Error', isStatic: true },
            { name: 'Cancelled', signature: 'public static Error Cancelled(string pipelineName)', summary: 'The operation was cancelled via the caller\'s CancellationToken. Error code: Resilience.Cancelled.', parameters: [{ name: 'pipelineName', type: 'string', description: 'pipelineName' }], returns: 'Error', isStatic: true },
            { name: 'ExecutionFailed', signature: 'public static Error ExecutionFailed(string pipelineName, Exception exception)', summary: 'The operation failed after all retry attempts were exhausted, or an unexpected exception was thrown and the pipeline did not rethrow a more specific resilience exception. Error code: Resilience.ExecutionFailed.', parameters: [{ name: 'pipelineName', type: 'string', description: 'pipelineName' }, { name: 'exception', type: 'Exception', description: 'exception' }], returns: 'Error', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Resilience.Execution',
      summary: 'Types in StangaNetLib.Resilience.Execution.',
      types: [
        {
          slug: 'i-resilient-executor',
          name: 'IResilientExecutor',
          displayName: 'IResilientExecutor',
          kind: 'interface',
          namespace: 'StangaNetLib.Resilience.Execution',
          summary: 'Executes operations through named resilience pipelines, translating all failures (retry exhaustion, circuit open, timeout, cancellation, unexpected exceptions) into Result / Result{T} instead of throwing exceptions.',
          signature: 'public interface IResilientExecutor',
        },
        {
          slug: 'order-service',
          name: 'OrderService',
          displayName: 'OrderService',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Execution',
          summary: 'Executes operations through named resilience pipelines, translating all failures (retry exhaustion, circuit open, timeout, cancellation, unexpected exceptions) into Result / Result{T} instead of throwing exceptions.',
          signature: 'public class OrderService',
        }
      ],
    },
    {
      name: 'StangaNetLib.Resilience.Extensions',
      summary: 'Types in StangaNetLib.Resilience.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Resilience services in the DI container.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibResilience', signature: 'public static IServiceCollection AddStangaNetLibResilience( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers IResilientExecutor and all named resilience pipelines defined in the "ResilienceSettings" configuration section. Also registers IOptions{ResilienceSettings} for consumers that need dynamic access to settings, and IValidateOptions{TOptions} for startup validation.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibResilience', signature: 'public static IServiceCollection AddStangaNetLibResilience( this IServiceCollection services, Action<ResilienceSettings> configure)', summary: 'Registers IResilientExecutor using a direct configuration delegate. Use for testing or scenarios where no configuration file is available.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configure', type: 'Action<ResilienceSettings>', description: 'configure' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibResilience', signature: 'public static IServiceCollection AddStangaNetLibResilience(this IServiceCollection services)', summary: 'Registers IResilientExecutor with a single "Default" pipeline using production-safe defaults (3 retries, exponential backoff, circuit breaker, 10 s timeout).', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Resilience.Settings',
      summary: 'Types in StangaNetLib.Resilience.Settings.',
      types: [
        {
          slug: 'resilience-pipeline-settings',
          name: 'ResiliencePipelineSettings',
          displayName: 'ResiliencePipelineSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Settings',
          summary: 'class ResiliencePipelineSettings.',
          signature: 'public sealed class ResiliencePipelineSettings',
          properties: [
            { name: 'RetryCount', type: 'int', access: 'get; init', summary: 'Number of retry attempts after the initial failure. Set to 0 to disable retries entirely. Defaults to 3.' },
            { name: 'RetryBaseDelay', type: 'TimeSpan', access: 'get; init', summary: 'Base delay between retry attempts. When UseExponentialBackoff is this is the initial delay; subsequent attempts multiply it exponentially. Defaults to 1 second.' },
            { name: 'UseExponentialBackoff', type: 'bool', access: 'get; init', summary: 'When (default), retry delays grow exponentially with each attempt. When , a constant delay equal to RetryBaseDelay is used.' },
            { name: 'UseJitter', type: 'bool', access: 'get; init', summary: 'When (default), adds a small random jitter to each retry delay to prevent thundering-herd effects when many callers retry simultaneously.' },
            { name: 'EnableCircuitBreaker', type: 'bool', access: 'get; init', summary: 'Whether the circuit-breaker strategy is active for this pipeline. Defaults to .' },
            { name: 'CircuitBreakerFailureRatio', type: 'double', access: 'get; init', summary: 'The ratio of failures within the sampling window that triggers the circuit to open. Must be in [0.0, 1.0]. For example, 0.5 means 50 % of calls must fail. Defaults to 0.5.' },
            { name: 'CircuitBreakerMinimumThroughput', type: 'int', access: 'get; init', summary: 'Minimum number of calls that must occur within the sampling window before the circuit-breaker can evaluate and potentially open. Defaults to 10.' },
            { name: 'CircuitBreakerSamplingDuration', type: 'TimeSpan', access: 'get; init', summary: 'Duration of the sliding window used to measure the failure ratio. Defaults to 30 seconds.' },
            { name: 'CircuitBreakerBreakDuration', type: 'TimeSpan', access: 'get; init', summary: 'Duration the circuit stays open (fully rejecting all calls) before transitioning to half-open and attempting a probe request. Defaults to 30 seconds.' },
            { name: 'EnableTimeout', type: 'bool', access: 'get; init', summary: 'Whether the per-attempt timeout strategy is active for this pipeline. Defaults to .' },
            { name: 'TimeoutPerAttempt', type: 'TimeSpan', access: 'get; init', summary: 'Maximum allowed duration for each individual attempt (including the initial call and every retry). The timeout is applied independently to each attempt, not to the total execution. Defaults to 10 seconds.' },
          ],
        },
        {
          slug: 'resilience-settings',
          name: 'ResilienceSettings',
          displayName: 'ResilienceSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Resilience.Settings',
          summary: 'class ResilienceSettings.',
          signature: 'public sealed class ResilienceSettings',
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"ResilienceSettings"' },
          ],
        }
      ],
    }
  ],
};
