import type { LibraryDoc } from '../types';

export const eventBusLibrary: LibraryDoc = {
  slug: 'eventbus',
  name: 'StangaNetLib.EventBus',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Pub/sub messaging with in-memory and broker backends',
  description:
    'Event bus abstractions with in-memory and RabbitMQ-style providers, integrated with Jobs where needed.',
  repository: 'https://github.com/StangaNet/StangaNetLib.EventBus',
  namespaces: [
    {
      name: 'StangaNetLib.EventBus.Abstractions',
      summary: 'Types in StangaNetLib.EventBus.Abstractions.',
      types: [
        {
          slug: 'i-event-bus',
          name: 'IEventBus',
          displayName: 'IEventBus',
          kind: 'interface',
          namespace: 'StangaNetLib.EventBus.Abstractions',
          summary: 'Publish/subscribe integration event bus. Publish an event to dispatch it to all registered handlers; use Subscribe{TEvent,THandler} to register handler types before publishing.',
          signature: 'public interface IEventBus',
        },
        {
          slug: 'i-event-bus-subscription-manager',
          name: 'IEventBusSubscriptionManager',
          displayName: 'IEventBusSubscriptionManager',
          kind: 'interface',
          namespace: 'StangaNetLib.EventBus.Abstractions',
          summary: 'Tracks event handler subscriptions on behalf of an IEventBus implementation. The subscription manager is the source of truth for which handler types are registered per event type.',
          signature: 'public interface IEventBusSubscriptionManager',
        },
        {
          slug: 'i-event-handler-t-event',
          name: 'IEventHandler',
          displayName: 'IEventHandler<TEvent>',
          kind: 'interface',
          namespace: 'StangaNetLib.EventBus.Abstractions',
          summary: 'Handles a specific type of integration event dispatched through the IEventBus.',
          signature: 'public interface IEventHandler<in TEvent> where TEvent : IntegrationEvent',
          inherits: 'IntegrationEvent',
          typeParameters: [
            { name: 'TEvent', constraint: 'IntegrationEvent', description: 'Type parameter TEvent.' },
          ],
        },
        {
          slug: 'i-event-triggered-job-handler-t-event',
          name: 'IEventTriggeredJobHandler',
          displayName: 'IEventTriggeredJobHandler<TEvent>',
          kind: 'interface',
          namespace: 'StangaNetLib.EventBus.Abstractions',
          summary: 'Marker interface identifying an IEventHandler{TEvent} that responds to an integration event by enqueuing a background job. Use AddEventTriggeredJob&lt;TEvent, TJob, TArgs&gt; to register implementations automatically via DI.',
          signature: 'public interface IEventTriggeredJobHandler<TEvent> where TEvent : IntegrationEvent',
          inherits: 'IntegrationEvent',
          typeParameters: [
            { name: 'TEvent', constraint: 'IntegrationEvent', description: 'Type parameter TEvent.' },
          ],
        },
        {
          slug: 'order-placed-handler',
          name: 'OrderPlacedHandler',
          displayName: 'OrderPlacedHandler',
          kind: 'class',
          namespace: 'StangaNetLib.EventBus.Abstractions',
          summary: 'Handles a specific type of integration event dispatched through the IEventBus.',
          signature: 'public sealed class OrderPlacedHandler : IEventHandler&lt;OrderPlacedEvent&gt;',
          implements: ['IEventHandler&lt;OrderPlacedEvent&gt;'],
        }
      ],
    },
    {
      name: 'StangaNetLib.EventBus.Errors',
      summary: 'Types in StangaNetLib.EventBus.Errors.',
      types: [
        {
          slug: 'event-bus-errors',
          name: 'EventBusErrors',
          displayName: 'EventBusErrors',
          kind: 'class',
          namespace: 'StangaNetLib.EventBus.Errors',
          summary: 'Well-known Error instances for StangaNetLib.EventBus operations.',
          signature: 'public static class EventBusErrors',
          methods: [
            { name: 'HandlersFailed', signature: 'public static Error HandlersFailed(int failureCount, int totalCount)', summary: 'One or more handlers returned a failure result when processing the event.', parameters: [{ name: 'failureCount', type: 'int', description: 'failureCount' }, { name: 'totalCount', type: 'int', description: 'totalCount' }], returns: 'Error', isStatic: true },
          ],
          fields: [
            { name: 'NoHandlers', type: 'Error', summary: 'No handlers are registered for the published event type. Returned by PublishAsync{TEvent} when the subscription manager has no entries for the event.', value: 'new( "EventBus.NoHandlers", "No handlers are registered for this event type.", ErrorType.Validation)...' },
            { name: 'NotConnected', type: 'Error', summary: 'The RabbitMQ event bus has not been started yet or is not connected. Ensure IHostedService.StartAsync has completed before publishing.', value: 'new( "EventBus.NotConnected", "The event bus transport is not connected. Ensure the host has started.", ErrorType.Intern...' },
            { name: 'SerializationFailed', type: 'Error', summary: 'SerializationFailed', value: 'new( "EventBus.SerializationFailed", "Failed to serialize the event for transport.", ErrorType.Internal)...' },
            { name: 'PublishFailed', type: 'Error', summary: 'PublishFailed', value: 'new( "EventBus.PublishFailed", "Failed to publish the event to the transport layer.", ErrorType.Internal)...' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.EventBus.Events',
      summary: 'Types in StangaNetLib.EventBus.Events.',
      types: [
        {
          slug: 'integration-event',
          name: 'IntegrationEvent',
          displayName: 'IntegrationEvent',
          kind: 'class',
          namespace: 'StangaNetLib.EventBus.Events',
          summary: 'Base class for all integration events published through the IEventBus. Subclass this to define domain events (e.g. OrderPlacedEvent, UserRegisteredEvent).',
          signature: 'public abstract class IntegrationEvent',
          properties: [
            { name: 'EventId', type: 'Guid', access: 'get', summary: 'EventId' },
            { name: 'OccurredAt', type: 'DateTimeOffset', access: 'get; set', summary: 'OccurredAt' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.EventBus.Extensions',
      summary: 'Types in StangaNetLib.EventBus.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.EventBus.Extensions',
          summary: 'Extension methods for registering StangaNetLib.EventBus services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibEventBus', signature: 'public static IServiceCollection AddStangaNetLibEventBus( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.EventBus with the built-in in-memory backend. Uses configuration from the EventBusSettings section of configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibEventBus', signature: 'public static IServiceCollection AddStangaNetLibEventBus(this IServiceCollection services)', summary: 'Registers StangaNetLib.EventBus with the built-in in-memory backend using default settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibEventBusWithRabbitMq', signature: 'public static IServiceCollection AddStangaNetLibEventBusWithRabbitMq( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.EventBus with the RabbitMQ transport backend. The RabbitMqEventBus is registered as both IEventBus (singleton) and IHostedService, so the broker connection is opened when the host starts and closed when it stops. Uses configuration from the RabbitMqSettings section of configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibEventBusWithRabbitMq', signature: 'public static IServiceCollection AddStangaNetLibEventBusWithRabbitMq(this IServiceCollection services)', summary: 'Registers StangaNetLib.EventBus with the RabbitMQ transport backend using default settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddEventTriggeredJob', signature: 'public static IServiceCollection AddEventTriggeredJob<TEvent, TJob, TArgs>( this IServiceCollection services, Func<TEvent, TArgs> argsFactory)', summary: 'Registers an event-triggered job that fires immediately when TEvent is published. At host startup the dispatcher is automatically subscribed to the IEventBus; no manual Subscribe call is required.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'argsFactory', type: 'Func<TEvent, TArgs>', description: 'argsFactory' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddEventTriggeredJob', signature: 'public static IServiceCollection AddEventTriggeredJob<TEvent, TJob, TArgs>( this IServiceCollection services, Func<TEvent, TArgs> argsFactory, TimeSpan delay)', summary: 'Registers an event-triggered job that is scheduled to run after delay when TEvent is published. At host startup the dispatcher is automatically subscribed to the IEventBus; no manual Subscribe call is required.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'argsFactory', type: 'Func<TEvent, TArgs>', description: 'argsFactory' }, { name: 'delay', type: 'TimeSpan', description: 'delay' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.EventBus.Settings',
      summary: 'Types in StangaNetLib.EventBus.Settings.',
      types: [
        {
          slug: 'event-bus-settings',
          name: 'EventBusSettings',
          displayName: 'EventBusSettings',
          kind: 'class',
          namespace: 'StangaNetLib.EventBus.Settings',
          summary: 'class EventBusSettings.',
          signature: 'public class EventBusSettings',
          properties: [
            { name: 'PropagateHandlerExceptions', type: 'bool', access: 'get; set', summary: 'When true, the first handler failure stops dispatch immediately and returns that failure result without invoking remaining handlers. When false (default), all handlers are always invoked and any failures are aggregated into a single EventBus.HandlersFailed error.' },
            { name: 'MaxConcurrentHandlers', type: 'int', access: 'get; set', summary: 'Maximum number of handlers dispatched in parallel for a single PublishAsync{TEvent} call. A value of 1 (default) dispatches handlers sequentially. Must be at least 1.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"EventBusSettings"' },
          ],
        },
        {
          slug: 'rabbit-mq-settings',
          name: 'RabbitMqSettings',
          displayName: 'RabbitMqSettings',
          kind: 'class',
          namespace: 'StangaNetLib.EventBus.Settings',
          summary: 'class RabbitMqSettings.',
          signature: 'public sealed class RabbitMqSettings : EventBusSettings',
          inherits: 'EventBusSettings',
          properties: [
            { name: 'HostName', type: 'string', access: 'get; set', summary: 'HostName' },
            { name: 'Port', type: 'int', access: 'get; set', summary: 'Port' },
            { name: 'UserName', type: 'string', access: 'get; set', summary: 'UserName' },
            { name: 'Password', type: 'string', access: 'get; set', summary: 'Password' },
            { name: 'VirtualHost', type: 'string', access: 'get; set', summary: 'VirtualHost' },
            { name: 'ExchangeName', type: 'string', access: 'get; set', summary: 'Name of the direct exchange used to route published events. Defaults to "stanganetlib_eventbus".' },
            { name: 'QueueName', type: 'string', access: 'get; set', summary: 'Name of the queue used to consume events. Defaults to "stanganetlib_eventbus_queue".' },
            { name: 'Durable', type: 'bool', access: 'get; set', summary: 'When true, the exchange and queue survive broker restarts. Defaults to true.' },
            { name: 'AutoDelete', type: 'bool', access: 'get; set', summary: 'When true, the exchange and queue are deleted when they have no more consumers or bindings. Defaults to false.' },
          ],
        }
      ],
    }
  ],
};
