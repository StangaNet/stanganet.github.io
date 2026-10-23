import type { LibraryDoc } from '../types';

export const requestProtectionLibrary: LibraryDoc = {
  slug: 'requestprotection',
  name: 'StangaNetLib.RequestProtection',
  version: '1.1.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Rate limiting, AuthLockout preset, and required idempotency keys',
  description:
    'Distributed fixed-window rate limiting and idempotency deduplication (Caching-backed), with AuthLockout preset and optional required idempotency keys on matched paths.',
  repository: 'https://github.com/StangaNet/StangaNetLib.RequestProtection',
  namespaces: [
    {
      name: 'StangaNetLib.RequestProtection.Extensions',
      summary: 'Types in StangaNetLib.RequestProtection.Extensions.',
      types: [
        {
          slug: 'idempotency-extensions',
          name: 'IdempotencyExtensions',
          displayName: 'IdempotencyExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.Extensions',
          summary: 'class IdempotencyExtensions.',
          signature: 'public static class IdempotencyExtensions',
          methods: [
            { name: 'AddStangaNetLibIdempotency', signature: 'public static IServiceCollection AddStangaNetLibIdempotency( this IServiceCollection services, IConfiguration configuration, Action<IdempotencyOptions>? configure = null)', summary: 'Registers IdempotencyMiddleware and binds its options from the "IdempotencyOptions" configuration section. An optional delegate applied via PostConfigure can override individual values after binding.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }, { name: 'configure', type: 'Action<IdempotencyOptions>?', description: 'configure', optional: true }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibIdempotency', signature: 'public static IServiceCollection AddStangaNetLibIdempotency( this IServiceCollection services, Action<IdempotencyOptions>? configure = null)', summary: 'Registers IdempotencyMiddleware and configures its options via code only. Prefer the IConfiguration overload when settings are managed in appsettings.json.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configure', type: 'Action<IdempotencyOptions>?', description: 'configure', optional: true }], returns: 'IServiceCollection', isStatic: true },
            { name: 'UseStangaNetLibIdempotency', signature: 'public static IApplicationBuilder UseStangaNetLibIdempotency(this IApplicationBuilder app)', summary: 'Adds IdempotencyMiddleware to the pipeline. Place this immediately after UseStangaNetLibAuth() so that authentication state is available for per-user key scoping.', parameters: [{ name: 'app', type: 'IApplicationBuilder', description: 'app' }], returns: 'IApplicationBuilder', isStatic: true },
          ],
        },
        {
          slug: 'rate-limit-extensions',
          name: 'RateLimitExtensions',
          displayName: 'RateLimitExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.Extensions',
          summary: 'class RateLimitExtensions.',
          signature: 'public static class RateLimitExtensions',
          methods: [
            { name: 'AddStangaNetLibRateLimit', signature: 'public static IServiceCollection AddStangaNetLibRateLimit( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers IRateLimitService (RateLimitService), IRateLimitCounterStore (CacheRateLimitCounterStore), settings validation, and DistributedRateLimitingMiddleware.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibRateLimitStore', signature: 'public static IServiceCollection AddStangaNetLibRateLimitStore<TStore>( this IServiceCollection services)', summary: 'Replaces the default IRateLimitCounterStore with a custom implementation. Use this to plug in an atomic Redis INCR store for strict enforcement under high concurrency.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'UseStangaNetLibRateLimit', signature: 'public static IApplicationBuilder UseStangaNetLibRateLimit(this IApplicationBuilder app)', summary: 'Adds DistributedRateLimitingMiddleware to the pipeline. Must be placed after UseRouting() so that endpoint metadata (and therefore [RateLimit] attributes) are available.', parameters: [{ name: 'app', type: 'IApplicationBuilder', description: 'app' }], returns: 'IApplicationBuilder', isStatic: true },
            { name: 'AddStangaNetLibAuthLockoutRateLimit', signature: 'public static IServiceCollection AddStangaNetLibAuthLockoutRateLimit( this IServiceCollection services, int limit = 5, int windowSeconds = 900)', summary: 'Registers the AuthLockout rate-limit preset (default: 5 requests / 15 minutes / IP). This is an endpoint rate limit for failed-login surfaces; account-level lockout belongs in Auth ILoginAttemptService — combine both for defence in depth. Call after AddStangaNetLibRateLimit.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'limit', type: 'int', description: 'limit', optional: true }, { name: 'windowSeconds', type: 'int', description: 'windowSeconds', optional: true }], returns: 'IServiceCollection', isStatic: true },
          ],
          fields: [
            { name: 'AuthLockoutPolicyName', type: 'string', summary: 'Policy name for the auth lockout rate-limit preset. Use with [RateLimit("AuthLockout")].', value: '"AuthLockout"' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.Idempotency.Middleware',
      summary: 'Types in StangaNetLib.RequestProtection.Idempotency.Middleware.',
      types: [
        {
          slug: 'idempotency-middleware',
          name: 'IdempotencyMiddleware',
          displayName: 'IdempotencyMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.Idempotency.Middleware',
          summary: 'ASP.NET Core middleware that enforces idempotency for configured HTTP methods. On the first request with a given Idempotency-Key the response is captured and cached. Subsequent requests with the same key replay the cached response without invoking the handler. Concurrent duplicate requests (same key, handler still in-flight) are rejected with HTTP 409.',
          signature: 'public sealed partial class IdempotencyMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context)', summary: 'Processes the request through the idempotency filter. Passes through immediately for non-protected methods or requests without an idempotency key.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }], returns: 'Task', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.Idempotency.Models',
      summary: 'Types in StangaNetLib.RequestProtection.Idempotency.Models.',
      types: [
        {
          slug: 'idempotency-response',
          name: 'IdempotencyResponse',
          displayName: 'IdempotencyResponse',
          kind: 'record',
          namespace: 'StangaNetLib.RequestProtection.Idempotency.Models',
          summary: 'record IdempotencyResponse.',
          signature: 'public sealed record IdempotencyResponse',
          properties: [
            { name: 'StatusCode', type: 'int', access: 'get; init', summary: 'StatusCode' },
            { name: 'ContentType', type: 'string', access: 'get; init', summary: 'ContentType' },
            { name: 'Body', type: 'string', access: 'get; init', summary: 'Body' },
            { name: 'CachedAt', type: 'DateTimeOffset', access: 'get; init', summary: 'CachedAt' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.Idempotency.Options',
      summary: 'Types in StangaNetLib.RequestProtection.Idempotency.Options.',
      types: [
        {
          slug: 'idempotency-options',
          name: 'IdempotencyOptions',
          displayName: 'IdempotencyOptions',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.Idempotency.Options',
          summary: 'Configuration for IdempotencyMiddleware. Bind from appsettings.json under "IdempotencyOptions" or configure via AddStangaNetLibIdempotency(configuration).',
          signature: 'public sealed class IdempotencyOptions',
          properties: [
            { name: 'HeaderName', type: 'string', access: 'get; set', summary: 'HeaderName' },
            { name: 'KeyExpiryMinutes', type: 'int', access: 'get; set', summary: 'KeyExpiryMinutes' },
            { name: 'ProtectedMethods', type: 'ICollection<string>', access: 'get; set', summary: 'HTTP methods (case-insensitive) whose requests are subject to idempotency processing. Default: POST and PATCH. PUT is naturally idempotent by REST convention and is excluded by default. Configurable from appsettings.json as a string array, e.g. ["POST","PATCH"].' },
            { name: 'LockTimeout', type: 'TimeSpan', access: 'get; set', summary: 'Duration of the in-flight processing lock used to detect and reject concurrent duplicate requests. Must be shorter than KeyExpiryMinutes. Default: 30 seconds.' },
            { name: 'RequireKey', type: 'bool', access: 'get; set', summary: 'When true, requests that match RequiredPathPrefixes / RequiredPathPatterns must include HeaderName or receive HTTP 400.' },
            { name: 'RequiredPathPrefixes', type: 'ICollection<string>', access: 'get; set', summary: 'Path prefixes (e.g. /api/import) that require an idempotency key when RequireKey is true. Comparison is ordinal-ignore-case against Path.Value.' },
            { name: 'RequiredPathPatterns', type: 'ICollection<string>', access: 'get; set', summary: 'Simple wildcard path patterns (e.g. /api/*/write) that require an idempotency key when RequireKey is true. * matches a single path segment.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"IdempotencyOptions"' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Abstractions',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Abstractions.',
      types: [
        {
          slug: 'i-rate-limit-counter-store',
          name: 'IRateLimitCounterStore',
          displayName: 'IRateLimitCounterStore',
          kind: 'interface',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Abstractions',
          summary: 'Increments a named counter within a fixed window and returns the new count.',
          signature: 'public interface IRateLimitCounterStore',
        },
        {
          slug: 'i-rate-limit-service',
          name: 'IRateLimitService',
          displayName: 'IRateLimitService',
          kind: 'interface',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Abstractions',
          summary: 'interface IRateLimitService.',
          signature: 'public interface IRateLimitService',
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Attributes',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Attributes.',
      types: [
        {
          slug: 'rate-limit-attribute',
          name: 'RateLimitAttribute',
          displayName: 'RateLimitAttribute',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Attributes',
          summary: 'Applies the named rate limit policy to the decorated controller or action. Stackable: multiple attributes are evaluated independently — any exceeded policy rejects the request.',
          signature: 'public sealed class RateLimitAttribute : Attribute',
          inherits: 'Attribute',
          properties: [
            { name: 'PolicyName', type: 'string', access: 'get', summary: 'PolicyName' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Middleware',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Middleware.',
      types: [
        {
          slug: 'distributed-rate-limiting-middleware',
          name: 'DistributedRateLimitingMiddleware',
          displayName: 'DistributedRateLimitingMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Middleware',
          summary: 'ASP.NET Core middleware that enforces rate limiting using named policies. Evaluates [RateLimit] attributes on the matched endpoint; falls back to GlobalPolicyName when no attribute is present. Returns HTTP 429 with Retry-After and X-RateLimit-* headers on violation.',
          signature: 'public sealed class DistributedRateLimitingMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context)', summary: 'Evaluates all applicable rate limit policies for the request. Calls the next middleware when all policies allow the request; otherwise short-circuits with HTTP 429.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }], returns: 'Task', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Models',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Models.',
      types: [
        {
          slug: 'rate-limit-policy',
          name: 'RateLimitPolicy',
          displayName: 'RateLimitPolicy',
          kind: 'record',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Models',
          summary: 'record RateLimitPolicy.',
          signature: 'public sealed record RateLimitPolicy',
          properties: [
            { name: 'Name', type: 'string', access: 'get; init', summary: 'Name' },
            { name: 'Limit', type: 'int', access: 'get; init', summary: 'Limit' },
            { name: 'WindowSeconds', type: 'int', access: 'get; init', summary: 'WindowSeconds' },
            { name: 'Scope', type: 'RateLimitScope', access: 'get; init', summary: 'Scope' },
            { name: 'ApiKeyHeader', type: 'string', access: 'get; init', summary: 'Header name from which the API key is extracted when Scope is ApiKey. Default: X-API-Key.' },
          ],
        },
        {
          slug: 'rate-limit-result',
          name: 'RateLimitResult',
          displayName: 'RateLimitResult',
          kind: 'record',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Models',
          summary: 'record RateLimitResult.',
          signature: 'public sealed record RateLimitResult',
          properties: [
            { name: 'IsAllowed', type: 'bool', access: 'get; init', summary: 'IsAllowed' },
            { name: 'PolicyName', type: 'string', access: 'get; init', summary: 'PolicyName' },
            { name: 'Limit', type: 'int', access: 'get; init', summary: 'Limit' },
            { name: 'CurrentCount', type: 'int', access: 'get; init', summary: 'CurrentCount' },
            { name: 'ResetAtEpoch', type: 'long', access: 'get; init', summary: 'ResetAtEpoch' },
            { name: 'RetryAfterSeconds', type: 'int', access: 'get; init', summary: 'RetryAfterSeconds' },
          ],
          methods: [
            { name: 'Allow', signature: 'public static RateLimitResult Allow(string policyName, int limit, int currentCount, long resetAt)', summary: 'Allow', parameters: [{ name: 'policyName', type: 'string', description: 'policyName' }, { name: 'limit', type: 'int', description: 'limit' }, { name: 'currentCount', type: 'int', description: 'currentCount' }, { name: 'resetAt', type: 'long', description: 'resetAt' }], returns: 'RateLimitResult', isStatic: true },
            { name: 'Reject', signature: 'public static RateLimitResult Reject(string policyName, int limit, long resetAt)', summary: 'Reject', parameters: [{ name: 'policyName', type: 'string', description: 'policyName' }, { name: 'limit', type: 'int', description: 'limit' }, { name: 'resetAt', type: 'long', description: 'resetAt' }], returns: 'RateLimitResult', isStatic: true },
            { name: 'PolicyNotFound', signature: 'public static RateLimitResult PolicyNotFound(string policyName)', summary: 'Creates a pass-through result used when the policy name is not found in settings. Always allows the request.', parameters: [{ name: 'policyName', type: 'string', description: 'policyName' }], returns: 'RateLimitResult', isStatic: true },
          ],
        },
        {
          slug: 'rate-limit-scope',
          name: 'RateLimitScope',
          displayName: 'RateLimitScope',
          kind: 'enum',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Models',
          summary: 'enum RateLimitScope.',
          signature: 'public enum RateLimitScope',
          enumValues: [
            { name: 'IP', value: 0, summary: 'IP' },
            { name: 'User', value: 1, summary: 'User' },
            { name: 'Global', value: 2, summary: 'Global' },
            { name: 'ApiKey', value: 3, summary: 'ApiKey' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Services',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Services.',
      types: [
        {
          slug: 'rate-limit-service',
          name: 'RateLimitService',
          displayName: 'RateLimitService',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Services',
          summary: 'Default IRateLimitService implementation. Evaluates named policies from RateLimitingSettings using the configured IRateLimitCounterStore.',
          signature: 'public sealed class RateLimitService : IRateLimitService',
          implements: ['IRateLimitService'],
          methods: [
            { name: 'CheckAsync', signature: 'public async Task<RateLimitResult> CheckAsync( string policyName, HttpContext context, CancellationToken ct = default)', summary: 'CheckAsync', parameters: [{ name: 'policyName', type: 'string', description: 'policyName' }, { name: 'context', type: 'HttpContext', description: 'context' }, { name: 'ct', type: 'CancellationToken', description: 'ct', optional: true }], returns: 'A RateLimitResult with IsAllowed set to false when the policy limit is exceeded, or PolicyNotFound when the policy name is unknown or the policy is misconfigured.', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Settings',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Settings.',
      types: [
        {
          slug: 'rate-limiting-settings',
          name: 'RateLimitingSettings',
          displayName: 'RateLimitingSettings',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Settings',
          summary: 'Configuration root for rate limiting. Bind from appsettings.json under "RateLimitingSettings" or via AddStangaNetLibRateLimit(configuration).',
          signature: 'public sealed class RateLimitingSettings',
          properties: [
            { name: 'Policies', type: 'List<RateLimitPolicy>', access: 'get; init', summary: 'Policies' },
            { name: 'GlobalPolicyName', type: 'string?', access: 'get; init', summary: 'If set, applies this policy to every request that has no [RateLimit] attribute. Must match one of the names in Policies.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"RateLimitingSettings"' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.RequestProtection.RateLimit.Stores',
      summary: 'Types in StangaNetLib.RequestProtection.RateLimit.Stores.',
      types: [
        {
          slug: 'cache-rate-limit-counter-store',
          name: 'CacheRateLimitCounterStore',
          displayName: 'CacheRateLimitCounterStore',
          kind: 'class',
          namespace: 'StangaNetLib.RequestProtection.RateLimit.Stores',
          summary: 'ICacheService-backed counter store. Uses a fixed-window bucket key with a non-atomic Get+Set. For strict atomic counting replace with a Redis INCR-based implementation.',
          signature: 'public sealed class CacheRateLimitCounterStore : IRateLimitCounterStore',
          implements: ['IRateLimitCounterStore'],
          methods: [
            { name: 'IncrementAsync', signature: 'public async Task<int> IncrementAsync(string key, TimeSpan window, CancellationToken ct = default)', summary: 'IncrementAsync', parameters: [{ name: 'key', type: 'string', description: 'key' }, { name: 'window', type: 'TimeSpan', description: 'window' }, { name: 'ct', type: 'CancellationToken', description: 'ct', optional: true }], returns: 'Task<int>', isAsync: true },
          ],
        }
      ],
    }
  ],
};
