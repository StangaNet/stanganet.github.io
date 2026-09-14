import type { LibraryDoc } from './types';

export const contentFlowLibrary: LibraryDoc = {
  slug: 'contentflow',
  name: 'StangaNetLib.ContentFlow',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0'],
  tagline: 'Domain-driven content lifecycle with scheduling and audit',
  description:
    'A domain-driven content lifecycle engine with explicit state transitions (Draft → Pending → Approved → Published → Revoked), scheduled publish/expiry, and an immutable review trail. Built on StangaNetLib.Core Result types.',
  repository: 'https://github.com/StangaNet/StangaNetLib.ContentFlow',
  namespaces: [
    {
      name: 'StangaNetLib.ContentFlow.Content',
      summary: 'Content items, lifecycle states, and repository contract.',
      types: [
        {
          slug: 'content-state',
          name: 'ContentState',
          displayName: 'ContentState',
          kind: 'enum',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary: 'Lifecycle state of a content item.',
          remarks:
            'Valid transitions: Draft→Pending|Revoked; Pending→Approved|Draft|Revoked; Approved→Published|Draft|Revoked; Published→Revoked; Revoked is terminal.',
          signature: 'public enum ContentState',
          enumValues: [
            { name: 'Draft', value: 0, summary: 'Being authored; not yet visible.' },
            { name: 'Pending', value: 1, summary: 'Submitted for review.' },
            { name: 'Approved', value: 2, summary: 'Approved; ready to publish or schedule.' },
            { name: 'Published', value: 3, summary: 'Live / visible.' },
            { name: 'Revoked', value: 4, summary: 'Terminal withdrawn state.' },
          ],
        },
        {
          slug: 'content-item',
          name: 'ContentItem',
          displayName: 'ContentItem<T>',
          kind: 'record',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary:
            'Immutable content item tracked through the lifecycle state machine. The workflow service produces updated copies via with-expressions.',
          signature: 'public sealed record ContentItem<T>',
          typeParameters: [{ name: 'T', description: 'Payload type for the content data.' }],
          properties: [
            { name: 'Id', type: 'Guid', access: 'get; init', summary: 'Unique identifier.' },
            { name: 'State', type: 'ContentState', access: 'get; init', summary: 'Current lifecycle state.' },
            { name: 'Payload', type: 'T', access: 'get; init', summary: 'Caller-supplied content data.' },
            { name: 'CreatedAt', type: 'DateTimeOffset', access: 'get; init', summary: 'UTC creation time.' },
            { name: 'UpdatedAt', type: 'DateTimeOffset', access: 'get; init', summary: 'UTC time of last state change.' },
            {
              name: 'ScheduledPublishAt',
              type: 'DateTimeOffset?',
              access: 'get; init',
              summary: 'When set and State is Approved, automatic publish time.',
            },
            {
              name: 'ExpiresAt',
              type: 'DateTimeOffset?',
              access: 'get; init',
              summary: 'When set and State is Published, automatic revoke time.',
            },
          ],
        },
        {
          slug: 'icontent-repository',
          name: 'IContentRepository',
          displayName: 'IContentRepository<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary:
            'Persistence contract for content items of payload type T. Default in-memory implementation is registered by DI extensions.',
          signature: 'public interface IContentRepository<T>',
          typeParameters: [{ name: 'T', description: 'Payload type.' }],
          methods: [
            {
              name: 'FindByIdAsync',
              signature: 'Task<ContentItem<T>?> FindByIdAsync(Guid id, CancellationToken ct = default)',
              summary: 'Find by id.',
              isAsync: true,
            },
            {
              name: 'FindByStateAsync',
              signature: 'Task<IReadOnlyList<ContentItem<T>>> FindByStateAsync(ContentState state, CancellationToken ct = default)',
              summary: 'List by state.',
              isAsync: true,
            },
            {
              name: 'FindScheduledForPublishAsync',
              signature: 'Task<IReadOnlyList<ContentItem<T>>> FindScheduledForPublishAsync(DateTimeOffset asOf, CancellationToken ct = default)',
              summary: 'Items due for scheduled publish.',
              isAsync: true,
            },
            {
              name: 'FindExpiredAsync',
              signature: 'Task<IReadOnlyList<ContentItem<T>>> FindExpiredAsync(DateTimeOffset asOf, CancellationToken ct = default)',
              summary: 'Published items past expiry.',
              isAsync: true,
            },
            {
              name: 'AddAsync',
              signature: 'Task<ContentItem<T>> AddAsync(ContentItem<T> item, CancellationToken ct = default)',
              summary: 'Insert item.',
              isAsync: true,
            },
            {
              name: 'UpdateAsync',
              signature: 'Task<ContentItem<T>> UpdateAsync(ContentItem<T> item, CancellationToken ct = default)',
              summary: 'Update item.',
              isAsync: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Workflow',
      summary: 'Workflow service for lifecycle transitions.',
      types: [
        {
          slug: 'icontent-workflow-service',
          name: 'IContentWorkflowService',
          displayName: 'IContentWorkflowService<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Workflow',
          summary:
            'Orchestrates lifecycle transitions for content of type T. Mutating operations return a new ContentItem and append an audit entry.',
          signature: 'public interface IContentWorkflowService<T>',
          typeParameters: [{ name: 'T', description: 'Payload type.' }],
          methods: [
            {
              name: 'CreateAsync',
              signature: 'Task<Result<ContentItem<T>>> CreateAsync(T payload, CancellationToken ct = default)',
              summary: 'Creates a new item in Draft state.',
              isAsync: true,
              parameters: [
                { name: 'payload', type: 'T', description: 'Content data (must not be null).' },
                { name: 'ct', type: 'CancellationToken', description: 'Cancellation token.', optional: true },
              ],
            },
            {
              name: 'SubmitForReviewAsync',
              signature:
                'Task<Result<ContentItem<T>>> SubmitForReviewAsync(Guid contentId, string actor, string? note = null, CancellationToken ct = default)',
              summary: 'Draft → Pending.',
              isAsync: true,
            },
            {
              name: 'ApproveAsync',
              signature:
                'Task<Result<ContentItem<T>>> ApproveAsync(Guid contentId, string actor, string? note = null, CancellationToken ct = default)',
              summary: 'Pending → Approved.',
              isAsync: true,
            },
            {
              name: 'RequestRevisionAsync',
              signature:
                'Task<Result<ContentItem<T>>> RequestRevisionAsync(Guid contentId, string actor, string? note = null, CancellationToken ct = default)',
              summary: 'Pending or Approved → Draft.',
              isAsync: true,
            },
            {
              name: 'PublishAsync',
              signature:
                'Task<Result<ContentItem<T>>> PublishAsync(Guid contentId, string actor, DateTimeOffset? expiresAt = null, string? note = null, CancellationToken ct = default)',
              summary: 'Approved → Published; optional expiry.',
              isAsync: true,
            },
            {
              name: 'SchedulePublishAsync',
              signature:
                'Task<Result<ContentItem<T>>> SchedulePublishAsync(Guid contentId, string actor, DateTimeOffset scheduledPublishAt, string? note = null, CancellationToken ct = default)',
              summary: 'Schedule automatic publish for an Approved item (time must be in the future).',
              isAsync: true,
            },
            {
              name: 'RevokeAsync',
              signature:
                'Task<Result<ContentItem<T>>> RevokeAsync(Guid contentId, string actor, string? note = null, CancellationToken ct = default)',
              summary: 'Transition to Revoked from an allowed state.',
              isAsync: true,
            },
            {
              name: 'GetByIdAsync',
              signature: 'Task<Result<ContentItem<T>>> GetByIdAsync(Guid contentId, CancellationToken ct = default)',
              summary: 'Load by id.',
              isAsync: true,
            },
            {
              name: 'GetByStateAsync',
              signature:
                'Task<Result<IReadOnlyList<ContentItem<T>>>> GetByStateAsync(ContentState state, CancellationToken ct = default)',
              summary: 'List items in the given state.',
              isAsync: true,
            },
          ],
          example: {
            title: 'Create and publish',
            code: 'var wf = sp.GetRequiredService<IContentWorkflowService<Article>>();\n\nvar created = await wf.CreateAsync(article);\nvar pending = await created.BindAsync(c => wf.SubmitForReviewAsync(c.Id, "editor"));\nvar approved = await pending.BindAsync(c => wf.ApproveAsync(c.Id, "reviewer"));\nvar published = await approved.BindAsync(c => wf.PublishAsync(c.Id, "editor"));',
          },
        },
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Auditing',
      summary: 'Review log for content transitions.',
      types: [
        {
          slug: 'content-review-log',
          name: 'ContentReviewLog',
          displayName: 'ContentReviewLog',
          kind: 'record',
          namespace: 'StangaNetLib.ContentFlow.Auditing',
          summary: 'Immutable audit entry for a content state transition.',
          signature: 'public sealed record ContentReviewLog',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get; init', summary: 'Entry id.' },
            { name: 'ContentId', type: 'Guid', access: 'get; init', summary: 'Related content item.' },
            { name: 'FromState', type: 'ContentState?', access: 'get; init', summary: 'Previous state (null on create).' },
            { name: 'ToState', type: 'ContentState', access: 'get; init', summary: 'New state.' },
            { name: 'Actor', type: 'string', access: 'get; init', summary: 'User or system actor.' },
            { name: 'Note', type: 'string?', access: 'get; init', summary: 'Optional note.' },
            { name: 'OccurredAt', type: 'DateTimeOffset', access: 'get; init', summary: 'UTC timestamp.' },
          ],
        },
        {
          slug: 'icontent-review-log-repository',
          name: 'IContentReviewLogRepository',
          displayName: 'IContentReviewLogRepository',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Auditing',
          summary: 'Persistence for content review log entries.',
          signature: 'public interface IContentReviewLogRepository',
          methods: [
            {
              name: 'GetByContentIdAsync',
              signature: 'Task<IReadOnlyList<ContentReviewLog>> GetByContentIdAsync(Guid contentId, CancellationToken ct = default)',
              summary: 'History for a content id.',
              isAsync: true,
            },
            {
              name: 'AddAsync',
              signature: 'Task AddAsync(ContentReviewLog entry, CancellationToken ct = default)',
              summary: 'Append a log entry.',
              isAsync: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Configuration',
      summary: 'Options for the ContentFlow scheduler.',
      types: [
        {
          slug: 'content-flow-settings',
          name: 'ContentFlowSettings',
          displayName: 'ContentFlowSettings',
          kind: 'class',
          namespace: 'StangaNetLib.ContentFlow.Configuration',
          summary: 'Configuration for ContentFlow services (appsettings section ContentFlowSettings).',
          signature: 'public sealed class ContentFlowSettings',
          fields: [
            {
              name: 'SectionName',
              type: 'string',
              summary: 'appsettings section key.',
              value: '"ContentFlowSettings"',
            },
          ],
          properties: [
            {
              name: 'ScheduleCheckInterval',
              type: 'TimeSpan',
              access: 'get; set',
              summary: 'How often the background scheduler runs (default 30 seconds).',
            },
            {
              name: 'SchedulerActorName',
              type: 'string',
              access: 'get; set',
              summary: 'Actor name written into scheduler-produced review logs (default system).',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Exceptions',
      summary: 'Well-known ContentFlow errors as Core Error values.',
      types: [
        {
          slug: 'content-flow-errors',
          name: 'ContentFlowErrors',
          displayName: 'ContentFlowErrors',
          kind: 'class',
          namespace: 'StangaNetLib.ContentFlow.Exceptions',
          summary: 'Factory for well-known Errors produced by ContentFlow.',
          signature: 'public static class ContentFlowErrors',
          methods: [
            {
              name: 'ContentNotFound',
              signature: 'public static Error ContentNotFound(Guid contentId)',
              summary: 'Content item does not exist.',
              isStatic: true,
            },
            {
              name: 'InvalidTransition',
              signature: 'public static Error InvalidTransition(ContentState from, ContentState to)',
              summary: 'Illegal state transition.',
              isStatic: true,
            },
            {
              name: 'SchedulePublishRequiresApproved',
              signature: 'public static Error SchedulePublishRequiresApproved(ContentState actual)',
              summary: 'SchedulePublish requires Approved state.',
              isStatic: true,
            },
            {
              name: 'ScheduledTimeInThePast',
              signature: 'public static Error ScheduledTimeInThePast(DateTimeOffset scheduledAt)',
              summary: 'Scheduled publish time must be in the future.',
              isStatic: true,
            },
            {
              name: 'ExpiryInThePast',
              signature: 'public static Error ExpiryInThePast(DateTimeOffset expiresAt)',
              summary: 'Expiry must be in the future.',
              isStatic: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Extensions',
      summary: 'Dependency injection registration helpers.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.ContentFlow.Extensions',
          summary: 'Registers ContentFlow services, in-memory stores, and the background scheduler.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            {
              name: 'AddStangaNetLibContentFlow',
              signature:
                'public static IServiceCollection AddStangaNetLibContentFlow(this IServiceCollection services, IConfiguration configuration)',
              summary: 'Bind ContentFlowSettings from configuration and register core services.',
              isStatic: true,
            },
            {
              name: 'AddStangaNetLibContentFlow',
              signature: 'public static IServiceCollection AddStangaNetLibContentFlow(this IServiceCollection services)',
              summary: 'Register core services with default settings.',
              isStatic: true,
            },
            {
              name: 'AddStangaNetLibContentFlowType',
              signature: 'public static IServiceCollection AddStangaNetLibContentFlowType<T>(this IServiceCollection services)',
              summary: 'Register schedule processor for payload type T (auto publish / expiry).',
              isStatic: true,
            },
          ],
          example: {
            title: 'Register in Program.cs',
            code: 'builder.Services.AddStangaNetLibContentFlow(builder.Configuration);\nbuilder.Services.AddStangaNetLibContentFlowType<Article>();',
          },
        },
      ],
    },
  ],
};
