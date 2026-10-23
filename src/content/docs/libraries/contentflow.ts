import type { LibraryDoc } from '../types';

export const contentFlowLibrary: LibraryDoc = {
  slug: 'contentflow',
  name: 'StangaNetLib.ContentFlow',
  version: '1.1.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Content lifecycle workflow with Result-based transitions',
  description:
    'Immutable content items and workflow services for Draft → Pending → Approved → Published with review trails.',
  repository: 'https://github.com/StangaNet/StangaNetLib.ContentFlow',
  namespaces: [
    {
      name: 'StangaNetLib.ContentFlow.Auditing',
      summary: 'Types in StangaNetLib.ContentFlow.Auditing.',
      types: [
        {
          slug: 'content-review-log',
          name: 'ContentReviewLog',
          displayName: 'ContentReviewLog',
          kind: 'record',
          namespace: 'StangaNetLib.ContentFlow.Auditing',
          summary: 'An immutable audit-trail entry recording a single state transition (or scheduling action) on a content item.',
          signature: 'public sealed record ContentReviewLog',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get; init', summary: 'Id' },
            { name: 'ContentId', type: 'Guid', access: 'get; init', summary: 'ContentId' },
            { name: 'FromState', type: 'ContentState', access: 'get; init', summary: 'FromState' },
            { name: 'ToState', type: 'ContentState', access: 'get; init', summary: 'State after the transition. Equal to FromState for scheduling actions that do not change state.' },
            { name: 'Actor', type: 'string', access: 'get; init', summary: 'Actor' },
            { name: 'Note', type: 'string?', access: 'get; init', summary: 'Note' },
            { name: 'OccurredAt', type: 'DateTimeOffset', access: 'get; init', summary: 'OccurredAt' },
          ],
        },
        {
          slug: 'i-content-review-log-repository',
          name: 'IContentReviewLogRepository',
          displayName: 'IContentReviewLogRepository',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Auditing',
          summary: 'Persistence abstraction for the immutable audit trail of content lifecycle transitions. Entries are append-only; the repository never deletes or modifies records.',
          signature: 'public interface IContentReviewLogRepository',
        }
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Configuration',
      summary: 'Types in StangaNetLib.ContentFlow.Configuration.',
      types: [
        {
          slug: 'content-flow-settings',
          name: 'ContentFlowSettings',
          displayName: 'ContentFlowSettings',
          kind: 'class',
          namespace: 'StangaNetLib.ContentFlow.Configuration',
          summary: 'class ContentFlowSettings.',
          signature: 'public sealed class ContentFlowSettings',
          properties: [
            { name: 'ScheduleCheckInterval', type: 'TimeSpan', access: 'get; set', summary: 'How often the background scheduler checks for items due for automatic publish or expiry. Defaults to 30 seconds.' },
            { name: 'SchedulerActorName', type: 'string', access: 'get; set', summary: 'Actor name written into review log entries created by the background scheduler. Defaults to "system".' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"ContentFlowSettings"' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Content',
      summary: 'Types in StangaNetLib.ContentFlow.Content.',
      types: [
        {
          slug: 'content-item-t',
          name: 'ContentItem',
          displayName: 'ContentItem<T>',
          kind: 'record',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary: 'A managed content item tracked through the lifecycle state machine. Instances are immutable; the workflow service produces updated copies via with expressions.',
          signature: 'public sealed record ContentItem<T>',
          typeParameters: [
            { name: 'T', description: 'Type parameter T.' },
          ],
          properties: [
            { name: 'Id', type: 'Guid', access: 'get; init', summary: 'Id' },
            { name: 'State', type: 'ContentState', access: 'get; init', summary: 'State' },
            { name: 'Payload', type: 'T', access: 'get; init', summary: 'Payload' },
            { name: 'CreatedAt', type: 'DateTimeOffset', access: 'get; init', summary: 'CreatedAt' },
            { name: 'UpdatedAt', type: 'DateTimeOffset', access: 'get; init', summary: 'UpdatedAt' },
            { name: 'ScheduledPublishAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'UTC time at which this item should be automatically published. Non-null only when State is Approved and a scheduled publish has been requested via SchedulePublishAsync.' },
            { name: 'ExpiresAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'UTC time at which this published item should be automatically revoked. Non-null only when State is Published and an expiry was specified at publish time.' },
          ],
        },
        {
          slug: 'content-state',
          name: 'ContentState',
          displayName: 'ContentState',
          kind: 'enum',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary: 'Represents the lifecycle state of a content item.',
          signature: 'public enum ContentState',
          enumValues: [
            { name: 'Draft', value: 0, summary: 'Draft' },
            { name: 'Pending', value: 1, summary: 'Pending' },
            { name: 'Approved', value: 2, summary: 'Approved' },
            { name: 'Published', value: 3, summary: 'Published' },
            { name: 'Revoked', value: 4, summary: 'Revoked' },
          ],
        },
        {
          slug: 'i-content-repository-t',
          name: 'IContentRepository',
          displayName: 'IContentRepository<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary: 'Persistence abstraction for content items of type T. The consuming application provides the concrete implementation (e.g. EF Core). A default in-memory implementation is registered automatically via AddStangaNetLibContentFlow.',
          signature: 'public interface IContentRepository<T>',
          typeParameters: [
            { name: 'T', description: 'Type parameter T.' },
          ],
        },
        {
          slug: 'i-content-unit-of-work',
          name: 'IContentUnitOfWork',
          displayName: 'IContentUnitOfWork',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Content',
          summary: 'Optional commit boundary after a batch of content mutations (e.g. a scheduler tick). Default is a no-op; replace with a Scoped implementation when using a unit-of-work store (EF Core, etc.).',
          signature: 'public interface IContentUnitOfWork',
        }
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Exceptions',
      summary: 'Types in StangaNetLib.ContentFlow.Exceptions.',
      types: [
        {
          slug: 'content-flow-errors',
          name: 'ContentFlowErrors',
          displayName: 'ContentFlowErrors',
          kind: 'class',
          namespace: 'StangaNetLib.ContentFlow.Exceptions',
          summary: 'class ContentFlowErrors.',
          signature: 'public static class ContentFlowErrors',
          methods: [
            { name: 'ContentNotFound', signature: 'public static Error ContentNotFound(Guid contentId)', summary: 'ContentNotFound', parameters: [{ name: 'contentId', type: 'Guid', description: 'contentId' }], returns: 'Error', isStatic: true },
            { name: 'InvalidTransition', signature: 'public static Error InvalidTransition(ContentState from, ContentState to)', summary: 'InvalidTransition', parameters: [{ name: 'from', type: 'ContentState', description: 'from' }, { name: 'to', type: 'ContentState', description: 'to' }], returns: 'Error', isStatic: true },
            { name: 'SchedulePublishRequiresApproved', signature: 'public static Error SchedulePublishRequiresApproved(ContentState actual)', summary: 'SchedulePublishRequiresApproved', parameters: [{ name: 'actual', type: 'ContentState', description: 'actual' }], returns: 'Error', isStatic: true },
            { name: 'ScheduledTimeInThePast', signature: 'public static Error ScheduledTimeInThePast(DateTimeOffset scheduledAt)', summary: 'ScheduledTimeInThePast', parameters: [{ name: 'scheduledAt', type: 'DateTimeOffset', description: 'scheduledAt' }], returns: 'Error', isStatic: true },
            { name: 'ExpiryInThePast', signature: 'public static Error ExpiryInThePast(DateTimeOffset expiresAt)', summary: 'ExpiryInThePast', parameters: [{ name: 'expiresAt', type: 'DateTimeOffset', description: 'expiresAt' }], returns: 'Error', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Extensions',
      summary: 'Types in StangaNetLib.ContentFlow.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.ContentFlow.Extensions',
          summary: 'Extension methods for registering StangaNetLib.ContentFlow services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibContentFlow', signature: 'public static IServiceCollection AddStangaNetLibContentFlow( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.ContentFlow core services: settings validation, the open-generic workflow service, the default in-memory repositories, and the background scheduler. Uses configuration from the ContentFlowSettings section of configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibContentFlow', signature: 'public static IServiceCollection AddStangaNetLibContentFlow(this IServiceCollection services)', summary: 'Registers StangaNetLib.ContentFlow core services with default settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibContentFlowType', signature: 'public static IServiceCollection AddStangaNetLibContentFlowType<T>(this IServiceCollection services)', summary: 'Registers a background schedule processor for content type T. Must be called after AddStangaNetLibContentFlow(IServiceCollection, IConfiguration) or AddStangaNetLibContentFlow(IServiceCollection). The processor runs inside the shared ContentSchedulerService hosted service and handles automatic publish and expiry revocation for items of type T. Resolved from a DI scope on each tick, so Scoped IContentRepository{T} registrations are supported.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.ContentFlow.Workflow',
      summary: 'Types in StangaNetLib.ContentFlow.Workflow.',
      types: [
        {
          slug: 'i-content-workflow-service-t',
          name: 'IContentWorkflowService',
          displayName: 'IContentWorkflowService<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.ContentFlow.Workflow',
          summary: 'Orchestrates lifecycle transitions for content items of type T. All mutating operations produce a new immutable ContentItem{T} and append an entry to the audit trail.',
          signature: 'public interface IContentWorkflowService<T>',
          typeParameters: [
            { name: 'T', description: 'Type parameter T.' },
          ],
        }
      ],
    }
  ],
};
