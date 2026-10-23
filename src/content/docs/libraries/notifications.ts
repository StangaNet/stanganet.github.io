import type { LibraryDoc } from '../types';

export const notificationsLibrary: LibraryDoc = {
  slug: 'notifications',
  name: 'StangaNetLib.Notifications',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Multi-channel notification dispatch and templates',
  description:
    'Notification channels, templates, and dispatch services for email and other providers.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Notifications',
  namespaces: [
    {
      name: 'StangaNetLib.Notifications.Abstractions',
      summary: 'Types in StangaNetLib.Notifications.Abstractions.',
      types: [
        {
          slug: 'i-notification-channel-provider',
          name: 'INotificationChannelProvider',
          displayName: 'INotificationChannelProvider',
          kind: 'interface',
          namespace: 'StangaNetLib.Notifications.Abstractions',
          summary: 'Handles the actual delivery of a notification to a specific channel. Implement this interface for each supported channel (email, push, in-app) and register each implementation with the DI container.',
          signature: 'public interface INotificationChannelProvider',
        },
        {
          slug: 'i-notification-repository',
          name: 'INotificationRepository',
          displayName: 'INotificationRepository',
          kind: 'interface',
          namespace: 'StangaNetLib.Notifications.Abstractions',
          summary: 'Persists and queries NotificationRecord instances for delivery tracking. Provide a project-specific implementation (e.g. EF Core) and register it in place of the default in-memory store.',
          signature: 'public interface INotificationRepository',
        },
        {
          slug: 'i-notification-sender',
          name: 'INotificationSender',
          displayName: 'INotificationSender',
          kind: 'interface',
          namespace: 'StangaNetLib.Notifications.Abstractions',
          summary: 'Dispatches notifications across registered channel providers with template rendering, retry, and delivery tracking.',
          signature: 'public interface INotificationSender',
        },
        {
          slug: 'i-notification-template-engine',
          name: 'INotificationTemplateEngine',
          displayName: 'INotificationTemplateEngine',
          kind: 'interface',
          namespace: 'StangaNetLib.Notifications.Abstractions',
          summary: 'Manages notification templates: registration, resolution by ID and channel, and rendering with data substitution.',
          signature: 'public interface INotificationTemplateEngine',
        },
        {
          slug: 'smtp-email-provider',
          name: 'SmtpEmailProvider',
          displayName: 'SmtpEmailProvider',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Abstractions',
          summary: 'Handles the actual delivery of a notification to a specific channel. Implement this interface for each supported channel (email, push, in-app) and register each implementation with the DI container.',
          signature: 'public sealed class SmtpEmailProvider : INotificationChannelProvider',
          implements: ['INotificationChannelProvider'],
        }
      ],
    },
    {
      name: 'StangaNetLib.Notifications.Extensions',
      summary: 'Types in StangaNetLib.Notifications.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Notifications services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibNotifications', signature: 'public static IServiceCollection AddStangaNetLibNotifications( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.Notifications with the built-in in-memory repository. Uses configuration from the NotificationsSettings section of configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibNotifications', signature: 'public static IServiceCollection AddStangaNetLibNotifications(this IServiceCollection services)', summary: 'Registers StangaNetLib.Notifications with the built-in in-memory repository using default settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Notifications.Implementations',
      summary: 'Types in StangaNetLib.Notifications.Implementations.',
      types: [
        {
          slug: 'in-memory-notification-channel-provider',
          name: 'InMemoryNotificationChannelProvider',
          displayName: 'InMemoryNotificationChannelProvider',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Implementations',
          summary: 'An in-memory INotificationChannelProvider that records sent notifications without performing real delivery. Suitable for testing and development environments.',
          signature: 'public sealed class InMemoryNotificationChannelProvider : INotificationChannelProvider',
          implements: ['INotificationChannelProvider'],
          properties: [
            { name: 'Channel', type: 'NotificationChannel', access: 'get', summary: 'Channel' },
            { name: 'SentNotifications', type: 'IReadOnlyList<NotificationRecord>', access: 'get', summary: 'SentNotifications' },
          ],
          methods: [
            { name: 'SendAsync', signature: 'public Task<Result> SendAsync(NotificationRecord record, CancellationToken cancellationToken = default)', summary: 'SendAsync', parameters: [{ name: 'record', type: 'NotificationRecord', description: 'record' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Notifications.Models',
      summary: 'Types in StangaNetLib.Notifications.Models.',
      types: [
        {
          slug: 'notification-channel',
          name: 'NotificationChannel',
          displayName: 'NotificationChannel',
          kind: 'enum',
          namespace: 'StangaNetLib.Notifications.Models',
          summary: 'Identifies the delivery channel for a notification.',
          signature: 'public enum NotificationChannel',
          enumValues: [
            { name: 'Email', value: 0, summary: 'Email' },
            { name: 'InApp', value: 1, summary: 'InApp' },
            { name: 'Push', value: 2, summary: 'Push' },
          ],
        },
        {
          slug: 'notification-record',
          name: 'NotificationRecord',
          displayName: 'NotificationRecord',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Models',
          summary: 'Persisted record of a dispatched notification, including delivery status and attempt tracking. Consumed by INotificationRepository and INotificationChannelProvider.',
          signature: 'public sealed class NotificationRecord',
          properties: [
            { name: 'Id', type: 'string', access: 'get; init', summary: 'Id' },
            { name: 'RecipientId', type: 'string', access: 'get; init', summary: 'RecipientId' },
            { name: 'RecipientAddress', type: 'string', access: 'get; init', summary: 'RecipientAddress' },
            { name: 'Channel', type: 'NotificationChannel', access: 'get; init', summary: 'Channel' },
            { name: 'Status', type: 'NotificationStatus', access: 'get; set', summary: 'Status' },
            { name: 'Subject', type: 'string?', access: 'get; init', summary: 'Subject' },
            { name: 'Body', type: 'string', access: 'get; init', summary: 'Body' },
            { name: 'AttemptCount', type: 'int', access: 'get; set', summary: 'AttemptCount' },
            { name: 'CreatedAt', type: 'DateTimeOffset', access: 'get; init', summary: 'CreatedAt' },
            { name: 'SentAt', type: 'DateTimeOffset?', access: 'get; set', summary: 'SentAt' },
            { name: 'FailureReason', type: 'string?', access: 'get; set', summary: 'FailureReason' },
            { name: 'CorrelationId', type: 'string?', access: 'get; init', summary: 'CorrelationId' },
            { name: 'UpdatedAt', type: 'DateTimeOffset?', access: 'get; set', summary: 'UpdatedAt' },
          ],
        },
        {
          slug: 'notification-request',
          name: 'NotificationRequest',
          displayName: 'NotificationRequest',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Models',
          summary: 'Describes a notification to be dispatched by INotificationSender. Supply either TemplateId (for template-based rendering) or Body (for raw content).',
          signature: 'public sealed class NotificationRequest',
          properties: [
            { name: 'RecipientId', type: 'string', access: 'get; init', summary: 'RecipientId' },
            { name: 'RecipientAddress', type: 'string', access: 'get; init', summary: 'Channel-specific recipient address: email address for Email, device token for Push, user ID for InApp.' },
            { name: 'Channel', type: 'NotificationChannel', access: 'get; init', summary: 'Channel' },
            { name: 'TemplateId', type: 'string?', access: 'get; init', summary: 'TemplateId' },
            { name: 'Subject', type: 'string?', access: 'get; init', summary: 'Subject' },
            { name: 'Body', type: 'string?', access: 'get; init', summary: 'Body' },
            { name: 'Data', type: 'IReadOnlyDictionary<string, string>', access: 'get; init', summary: 'Data' },
            { name: 'CorrelationId', type: 'string?', access: 'get; init', summary: 'CorrelationId' },
            { name: 'ExpiresAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'Optional UTC expiry time. If set and the current time exceeds this value, the dispatcher returns Notifications.Expired without contacting any provider.' },
          ],
        },
        {
          slug: 'notification-status',
          name: 'NotificationStatus',
          displayName: 'NotificationStatus',
          kind: 'enum',
          namespace: 'StangaNetLib.Notifications.Models',
          summary: 'Lifecycle status of a dispatched notification.',
          signature: 'public enum NotificationStatus',
          enumValues: [
            { name: 'Pending', value: 0, summary: 'Pending' },
            { name: 'Sent', value: 1, summary: 'Sent' },
            { name: 'Delivered', value: 2, summary: 'Delivered' },
            { name: 'Failed', value: 3, summary: 'Failed' },
          ],
        },
        {
          slug: 'notification-template',
          name: 'NotificationTemplate',
          displayName: 'NotificationTemplate',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Models',
          summary: 'A named template registered with INotificationTemplateEngine. Placeholders use double-brace syntax: {{Key}}.',
          signature: 'public sealed class NotificationTemplate',
          properties: [
            { name: 'TemplateId', type: 'string', access: 'get; init', summary: 'TemplateId' },
            { name: 'Channel', type: 'NotificationChannel', access: 'get; init', summary: 'Channel' },
            { name: 'SubjectTemplate', type: 'string?', access: 'get; init', summary: 'SubjectTemplate' },
            { name: 'BodyTemplate', type: 'string', access: 'get; init', summary: 'BodyTemplate' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Notifications.Settings',
      summary: 'Types in StangaNetLib.Notifications.Settings.',
      types: [
        {
          slug: 'notifications-settings',
          name: 'NotificationsSettings',
          displayName: 'NotificationsSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Notifications.Settings',
          summary: 'class NotificationsSettings.',
          signature: 'public sealed class NotificationsSettings',
          properties: [
            { name: 'MaxRetryCount', type: 'int', access: 'get; set', summary: 'Maximum number of retry attempts after the first send failure. A value of 0 means no retries (one attempt total). Defaults to 3.' },
            { name: 'RetryDelay', type: 'TimeSpan', access: 'get; set', summary: 'Base delay for the first retry attempt. When UseExponentialBackoff is true, subsequent delays double up to MaxRetryDelay. Defaults to 5 seconds.' },
            { name: 'MaxRetryDelay', type: 'TimeSpan', access: 'get; set', summary: 'Upper cap for exponential backoff delays. Ignored when UseExponentialBackoff is false. Defaults to 60 seconds.' },
            { name: 'UseExponentialBackoff', type: 'bool', access: 'get; set', summary: 'When true, retry delays follow an exponential backoff strategy: RetryDelay * 2^attempt, capped at MaxRetryDelay. When false, a fixed RetryDelay is used. Defaults to true.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"NotificationsSettings"' },
          ],
        }
      ],
    }
  ],
};
