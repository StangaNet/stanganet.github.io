import type { LibraryDoc } from '../types';

export const observabilityLibrary: LibraryDoc = {
  slug: 'observability',
  name: 'StangaNetLib.Observability',
  version: '1.0.1',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Logging, metrics, and tracing helpers',
  description:
    'Observability wiring for structured logging, metrics, and activity tracing across StangaNetLib services.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Observability',
  namespaces: [
    {
      name: 'StangaNetLib.Observability.Attributes',
      summary: 'Types in StangaNetLib.Observability.Attributes.',
      types: [
        {
          slug: 'no-e-tag-attribute',
          name: 'NoETagAttribute',
          displayName: 'NoETagAttribute',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Attributes',
          summary: 'Prevents the ETagMiddleware from processing this endpoint. Use on real-time or always-changing endpoints where ETags provide no benefit.',
          signature: 'public sealed class NoETagAttribute : Attribute',
          inherits: 'Attribute',
        }
      ],
    },
    {
      name: 'StangaNetLib.Observability.Correlation',
      summary: 'Types in StangaNetLib.Observability.Correlation.',
      types: [
        {
          slug: 'i-correlation-id-accessor',
          name: 'ICorrelationIdAccessor',
          displayName: 'ICorrelationIdAccessor',
          kind: 'interface',
          namespace: 'StangaNetLib.Observability.Correlation',
          summary: 'Provides access to the current request\'s correlation ID. Inject this service in use cases or services that need to include the correlation ID in outgoing HTTP calls, audit logs, or external service requests.',
          signature: 'public interface ICorrelationIdAccessor',
        }
      ],
    },
    {
      name: 'StangaNetLib.Observability.Extensions',
      summary: 'Types in StangaNetLib.Observability.Extensions.',
      types: [
        {
          slug: 'application-builder-extensions',
          name: 'ApplicationBuilderExtensions',
          displayName: 'ApplicationBuilderExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Extensions',
          summary: 'Extension methods for adding StangaNetLib.Observability middleware to the pipeline.',
          signature: 'public static class ApplicationBuilderExtensions',
          methods: [
            { name: 'UseStangaNetLibObservability', signature: 'public static IApplicationBuilder UseStangaNetLibObservability(this IApplicationBuilder app)', summary: 'Adds all StangaNetLib.Observability middleware in the correct order: ExceptionHandlingMiddleware — outermost, catches everything SecurityHeadersMiddleware — security headers on every response CorrelationIdMiddleware — generates/propagates correlation ID RequestLoggingMiddleware — logs with correlation ID already available ETagMiddleware — conditional requests Individual middleware can be disabled via ObservabilityOptions.', parameters: [{ name: 'app', type: 'IApplicationBuilder', description: 'app' }], returns: 'IApplicationBuilder', isStatic: true },
          ],
        },
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Observability services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibObservability', signature: 'public static IServiceCollection AddStangaNetLibObservability( this IServiceCollection services, Action<ObservabilityOptions>? configureOptions = null, Action<SecurityHeadersOptions>? configureSecu...', summary: 'Registers all StangaNetLib.Observability services into the DI container. Call this in Program.cs before builder.Build(). Options can also be bound from appsettings.json via services.Configure&lt;ObservabilityOptions&gt;(config.GetSection("Observability")) before or after calling this method.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configureOptions', type: 'Action<ObservabilityOptions>?', description: 'configureOptions', optional: true }, { name: 'configureSecurityHeaders', type: 'Action<SecurityHeadersOptions>?', description: 'configureSecurityHeaders', optional: true }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Observability.Masking',
      summary: 'Types in StangaNetLib.Observability.Masking.',
      types: [
        {
          slug: 'i-log-masking-service',
          name: 'ILogMaskingService',
          displayName: 'ILogMaskingService',
          kind: 'interface',
          namespace: 'StangaNetLib.Observability.Masking',
          summary: 'Masks personally identifiable information (PII) before writing it to logs. Implements GDPR Art. 32 (security of processing) by preventing PII from appearing in plain text in log files. Register as singleton via AddStangaNetLibObservability.',
          signature: 'public interface ILogMaskingService',
        },
        {
          slug: 'log-masking-service',
          name: 'LogMaskingService',
          displayName: 'LogMaskingService',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Masking',
          summary: 'Default implementation of ILogMaskingService.',
          signature: 'public sealed class LogMaskingService : ILogMaskingService',
          implements: ['ILogMaskingService'],
          methods: [
            { name: 'MaskEmail', signature: 'public Result<string> MaskEmail(string? email)', summary: 'MaskEmail', parameters: [{ name: 'email', type: 'string?', description: 'email' }], returns: 'Result<string>' },
            { name: 'HashEmail', signature: 'public Result<string> HashEmail(string? email)', summary: 'HashEmail', parameters: [{ name: 'email', type: 'string?', description: 'email' }], returns: 'Result<string>' },
            { name: 'MaskIpAddress', signature: 'public Result<string> MaskIpAddress(string? ipAddress)', summary: 'MaskIpAddress', parameters: [{ name: 'ipAddress', type: 'string?', description: 'ipAddress' }], returns: 'Result<string>' },
            { name: 'MaskPhoneNumber', signature: 'public Result<string> MaskPhoneNumber(string? phoneNumber)', summary: 'MaskPhoneNumber', parameters: [{ name: 'phoneNumber', type: 'string?', description: 'phoneNumber' }], returns: 'Result<string>' },
            { name: 'MaskName', signature: 'public Result<string> MaskName(string? name)', summary: 'MaskName', parameters: [{ name: 'name', type: 'string?', description: 'name' }], returns: 'Result<string>' },
            { name: 'MaskString', signature: 'public Result<string> MaskString(string? value, int visibleChars = 2)', summary: 'MaskString', parameters: [{ name: 'value', type: 'string?', description: 'value' }, { name: 'visibleChars', type: 'int', description: 'visibleChars', optional: true }], returns: 'Result<string>' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Observability.Middleware',
      summary: 'Types in StangaNetLib.Observability.Middleware.',
      types: [
        {
          slug: 'correlation-id-middleware',
          name: 'CorrelationIdMiddleware',
          displayName: 'CorrelationIdMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Middleware',
          summary: 'Generates or propagates a correlation ID for each HTTP request. Resolution order: 1. Existing CorrelationIdHeader from the incoming request. 2. Current TraceId when OpenTelemetry / distributed tracing is active. 3. A newly generated short Guid. The ID and any active TraceId/SpanId are pushed to the ILogger scope so they appear in all log entries for this request. The ID is also written to the response header.',
          signature: 'public sealed class CorrelationIdMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context)', summary: 'Resolves the correlation ID for the request, stores it in ICorrelationIdAccessor, adds it to the response header, and pushes it to the ILogger scope.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }], returns: 'Task', isAsync: true },
          ],
        },
        {
          slug: 'e-tag-middleware',
          name: 'ETagMiddleware',
          displayName: 'ETagMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Middleware',
          summary: 'Adds ETag support and conditional request handling to GET and HEAD endpoints. Computes an ETag from the SHA-256 of the response body and returns 304 Not Modified when the client\'s If-None-Match matches. Responses whose body grows beyond ETagMaxBodySizeBytes are flushed through without an ETag to avoid large memory allocations. Endpoints decorated with NoETagAttribute are excluded. Use [NoETag] on streaming or real-time endpoints to skip buffering entirely.',
          signature: 'public sealed class ETagMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context)', summary: 'Buffers the response body for GET and HEAD requests, computes a SHA-256 ETag, and returns 304 Not Modified when the client\'s If-None-Match header matches. Non-GET/HEAD requests and endpoints marked with NoETagAttribute pass through unchanged.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }], returns: 'Task', isAsync: true },
          ],
        },
        {
          slug: 'exception-handling-middleware',
          name: 'ExceptionHandlingMiddleware',
          displayName: 'ExceptionHandlingMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Middleware',
          summary: 'Catches unhandled exceptions, logs them, and returns a structured ProblemDetails (RFC 7807) response. OperationCanceledException caused by client disconnection is logged at Information level and produces no response. Exception details are included in Development or when IncludeExceptionDetailsInResponse is true.',
          signature: 'public sealed class ExceptionHandlingMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context, ICorrelationIdAccessor correlationIdAccessor)', summary: 'Invokes the next middleware and catches any unhandled exception, writing a structured ProblemDetails JSON response. Client-abort exceptions are swallowed after an Information log.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }, { name: 'correlationIdAccessor', type: 'ICorrelationIdAccessor', description: 'correlationIdAccessor' }], returns: 'Task', isAsync: true },
          ],
        },
        {
          slug: 'request-logging-middleware',
          name: 'RequestLoggingMiddleware',
          displayName: 'RequestLoggingMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Middleware',
          summary: 'Logs every HTTP request with: method, path, status code, elapsed milliseconds, and correlation ID. Logs at Warning if the response status is 5xx or if elapsed time exceeds SlowRequestThresholdMs. Query string parameter names (not values) are included when LogQueryString is true. Must be placed after CorrelationIdMiddleware in the pipeline.',
          signature: 'public sealed class RequestLoggingMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context, ICorrelationIdAccessor correlationIdAccessor)', summary: 'Logs the incoming request and the outgoing response. Skips paths listed in ExcludedLogPaths.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }, { name: 'correlationIdAccessor', type: 'ICorrelationIdAccessor', description: 'correlationIdAccessor' }], returns: 'Task', isAsync: true },
          ],
        },
        {
          slug: 'security-headers-middleware',
          name: 'SecurityHeadersMiddleware',
          displayName: 'SecurityHeadersMiddleware',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Middleware',
          summary: 'Adds security-related HTTP response headers to every response. Headers are configurable via SecurityHeadersOptions. Set any header value to null to omit it.',
          signature: 'public sealed class SecurityHeadersMiddleware',
          methods: [
            { name: 'InvokeAsync', signature: 'public async Task InvokeAsync(HttpContext context)', summary: 'Registers an OnStarting callback that appends configured security headers to the response, skipping any header already set by the endpoint or a downstream middleware.', parameters: [{ name: 'context', type: 'HttpContext', description: 'context' }], returns: 'Task', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Observability.Options',
      summary: 'Types in StangaNetLib.Observability.Options.',
      types: [
        {
          slug: 'observability-options',
          name: 'ObservabilityOptions',
          displayName: 'ObservabilityOptions',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Options',
          summary: 'Configures the StangaNetLib.Observability middleware stack.',
          signature: 'public class ObservabilityOptions',
          properties: [
            { name: 'CorrelationIdHeader', type: 'string', access: 'get; set', summary: 'Name of the HTTP header used to propagate the correlation ID. Default: "X-Correlation-Id".' },
            { name: 'GeneratedCorrelationIdLength', type: 'int', access: 'get; set', summary: 'Length of the generated correlation ID when not provided by the client. Default: 12 characters (hex substring of a Guid).' },
            { name: 'EnableRequestLogging', type: 'bool', access: 'get; set', summary: 'Whether to enable the RequestLoggingMiddleware. Default: true.' },
            { name: 'EnableETag', type: 'bool', access: 'get; set', summary: 'Whether to enable the ETagMiddleware. Default: true.' },
            { name: 'EnableSecurityHeaders', type: 'bool', access: 'get; set', summary: 'Whether to enable the SecurityHeadersMiddleware. Default: true.' },
            { name: 'EnableExceptionHandling', type: 'bool', access: 'get; set', summary: 'Whether to enable the ExceptionHandlingMiddleware. Default: true.' },
            { name: 'IncludeExceptionDetailsInResponse', type: 'bool', access: 'get; set', summary: 'When true, exception details (message, stack trace) are included in error responses. Should be false in production. Automatically overridden to true in Development environment. Default: false.' },
            { name: 'SlowRequestThresholdMs', type: 'int', access: 'get; set', summary: 'Requests whose elapsed time exceeds this threshold are logged at Warning level. Set to 0 to disable. Default: 2000 ms.' },
            { name: 'LogQueryString', type: 'bool', access: 'get; set', summary: 'When true, the query string is appended to request log entries (parameter names only; values are masked). Default: false.' },
            { name: 'ETagMaxBodySizeBytes', type: 'int', access: 'get; set', summary: 'Maximum response body size (in bytes) for which the ETag middleware will compute a hash. Responses larger than this threshold bypass buffering. Default: 262144 (256 KB).' },
            { name: 'ExcludedLogPaths', type: 'IList<string>', access: 'get; set', summary: 'Request paths that are excluded from request logging. Comparison is case-insensitive prefix match. Default: /health, /healthz, /metrics.' },
            { name: 'CustomExceptionStatusCodes', type: 'Dictionary<Type, int>', access: 'get; set', summary: 'Additional exception-to-HTTP-status-code mappings used by ExceptionHandlingMiddleware. Custom mappings take precedence over the built-in ones. Example: { [typeof(MyNotFoundException)] = 404 }.' },
          ],
        },
        {
          slug: 'security-headers-options',
          name: 'SecurityHeadersOptions',
          displayName: 'SecurityHeadersOptions',
          kind: 'class',
          namespace: 'StangaNetLib.Observability.Options',
          summary: 'Configures the security headers added by SecurityHeadersMiddleware. Set any property to null to omit that header from the response.',
          signature: 'public class SecurityHeadersOptions',
          properties: [
            { name: 'XContentTypeOptions', type: 'string?', access: 'get; set', summary: 'XContentTypeOptions' },
            { name: 'XFrameOptions', type: 'string?', access: 'get; set', summary: 'XFrameOptions' },
            { name: 'XXssProtection', type: 'string?', access: 'get; set', summary: 'XXssProtection' },
            { name: 'ReferrerPolicy', type: 'string?', access: 'get; set', summary: 'ReferrerPolicy' },
            { name: 'PermissionsPolicy', type: 'string?', access: 'get; set', summary: 'PermissionsPolicy' },
            { name: 'StrictTransportSecurity', type: 'string?', access: 'get; set', summary: 'Strict-Transport-Security (HSTS). Default: null (omitted). Set to e.g. "max-age=31536000; includeSubDomains" for HTTPS-only apps. Do not enable in Development — it permanently forces HTTPS in the browser.' },
            { name: 'ContentSecurityPolicy', type: 'string?', access: 'get; set', summary: 'Content-Security-Policy. Default: null (omitted). Highly app-specific; set a restrictive policy for production, e.g. "default-src \'self\'; object-src \'none\'; frame-ancestors \'none\'".' },
            { name: 'AdditionalHeaders', type: 'Dictionary<string, string>', access: 'get; set', summary: 'Additional custom headers to add. Key = header name, Value = header value.' },
          ],
        }
      ],
    }
  ],
};
