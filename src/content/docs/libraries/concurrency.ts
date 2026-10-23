import type { LibraryDoc } from '../types';

export const concurrencyLibrary: LibraryDoc = {
  slug: 'concurrency',
  name: 'StangaNetLib.Concurrency',
  version: '1.0.1',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Keyed locks, throttles, work queues, and debouncing',
  description:
    'Async concurrency primitives: keyed locks, semaphore throttles, bounded work queues, and per-key debouncers.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Concurrency',
  namespaces: [
    {
      name: 'StangaNetLib.Concurrency.Configuration',
      summary: 'Types in StangaNetLib.Concurrency.Configuration.',
      types: [
        {
          slug: 'concurrency-settings',
          name: 'ConcurrencySettings',
          displayName: 'ConcurrencySettings',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Configuration',
          summary: 'class ConcurrencySettings.',
          signature: 'public sealed class ConcurrencySettings',
          properties: [
            { name: 'DefaultThrottleMaxConcurrency', type: 'int', access: 'get; set', summary: 'Maximum concurrent slots for the default IAsyncThrottle registered in DI. Defaults to 10.' },
            { name: 'WorkQueueCapacity', type: 'int', access: 'get; set', summary: 'Maximum capacity of the default IWorkQueue{T} registered in DI. Defaults to 1000.' },
            { name: 'WorkQueueFullMode', type: 'BoundedChannelFullMode', access: 'get; set', summary: 'Behaviour when the work queue is full and a producer calls EnqueueAsync. Defaults to Wait.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"ConcurrencySettings"' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Core',
      summary: 'Types in StangaNetLib.Concurrency.Core.',
      types: [
        {
          slug: 'concurrency-errors',
          name: 'ConcurrencyErrors',
          displayName: 'ConcurrencyErrors',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Core',
          summary: 'class ConcurrencyErrors.',
          signature: 'public static class ConcurrencyErrors',
          fields: [
            { name: 'LockTimeout', type: 'Error', summary: 'LockTimeout', value: 'new("Concurrency.LockTimeout", "Could not acquire the lock within the specified timeout.")' },
            { name: 'QueueFull', type: 'Error', summary: 'QueueFull', value: 'new("Concurrency.QueueFull", "The work queue is full and cannot accept new items.")' },
            { name: 'QueueCompleted', type: 'Error', summary: 'QueueCompleted', value: 'new("Concurrency.QueueCompleted", "The work queue has been completed and does not accept new items.")' },
            { name: 'ThrottleTimeout', type: 'Error', summary: 'ThrottleTimeout', value: 'new("Concurrency.ThrottleTimeout", "Could not acquire a throttle slot within the specified timeout.")' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Extensions',
      summary: 'Types in StangaNetLib.Concurrency.Extensions.',
      types: [
        {
          slug: 'keyed-lock-extensions',
          name: 'KeyedLockExtensions',
          displayName: 'KeyedLockExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Extensions',
          summary: 'Convenience extensions for IKeyedLock that acquire the lock, execute an action, and release the lock in a single call — eliminating await using boilerplate.',
          signature: 'public static class KeyedLockExtensions',
          methods: [
            { name: 'ExecuteAsync', signature: 'public static async Task<T> ExecuteAsync<T>( this IKeyedLock keyedLock, string key, Func<CancellationToken, Task<T>> action, CancellationToken cancellationToken = default)', summary: 'Acquires the lock for key, executes action, then releases the lock. Returns the value produced by action.', parameters: [{ name: 'keyedLock', type: 'IKeyedLock', description: 'keyedLock' }, { name: 'key', type: 'string', description: 'key' }, { name: 'action', type: 'Func<CancellationToken, Task<T>>', description: 'action' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<T>', isStatic: true, isAsync: true },
            { name: 'ExecuteAsync', signature: 'public static async Task ExecuteAsync( this IKeyedLock keyedLock, string key, Func<CancellationToken, Task> action, CancellationToken cancellationToken = default)', summary: 'Acquires the lock for key, executes action, then releases the lock.', parameters: [{ name: 'keyedLock', type: 'IKeyedLock', description: 'keyedLock' }, { name: 'key', type: 'string', description: 'key' }, { name: 'action', type: 'Func<CancellationToken, Task>', description: 'action' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task', isStatic: true, isAsync: true },
          ],
        },
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Concurrency services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibConcurrency', signature: 'public static IServiceCollection AddStangaNetLibConcurrency( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers all StangaNetLib.Concurrency services using configuration from the ConcurrencySettings section of configuration. Registers: IKeyedLock, IKeyedLockFactory, IAsyncThrottle, IAsyncThrottleFactory, IWorkQueue{T}, IWorkQueueFactory, IDebouncer, IAtomicCounterFactory.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibConcurrency', signature: 'public static IServiceCollection AddStangaNetLibConcurrency(this IServiceCollection services)', summary: 'Registers all StangaNetLib.Concurrency services using default settings. Registers: IKeyedLock, IKeyedLockFactory, IAsyncThrottle, IAsyncThrottleFactory, IWorkQueue{T}, IWorkQueueFactory, IDebouncer, IAtomicCounterFactory.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Locking',
      summary: 'Types in StangaNetLib.Concurrency.Locking.',
      types: [
        {
          slug: 'i-keyed-lock',
          name: 'IKeyedLock',
          displayName: 'IKeyedLock',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Locking',
          summary: 'Provides per-key async mutual exclusion. Useful for serializing operations that share the same logical resource (e.g., the same entity ID) without blocking unrelated resources.',
          signature: 'public interface IKeyedLock',
        },
        {
          slug: 'i-keyed-lock-factory',
          name: 'IKeyedLockFactory',
          displayName: 'IKeyedLockFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Locking',
          summary: 'Creates independent IKeyedLock instances with their own per-key semaphore pools. Use when multiple consumers need isolated lock namespaces — for example, a cache service that should not share its lock pool with application-level business logic.',
          signature: 'public interface IKeyedLockFactory',
        }
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Scheduling',
      summary: 'Types in StangaNetLib.Concurrency.Scheduling.',
      types: [
        {
          slug: 'i-debouncer',
          name: 'IDebouncer',
          displayName: 'IDebouncer',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Scheduling',
          summary: 'Debounces high-frequency triggers so that the underlying action executes only after the signal has been quiet for the configured delay. Each call resets the timer for that key. Useful for coalescing rapid events (e.g., search-as-you-type, file-watcher callbacks).',
          signature: 'public interface IDebouncer : IDisposable',
          implements: ['IDisposable'],
        }
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Synchronization',
      summary: 'Types in StangaNetLib.Concurrency.Synchronization.',
      types: [
        {
          slug: 'i-atomic-counter',
          name: 'IAtomicCounter',
          displayName: 'IAtomicCounter',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary: 'A thread-safe 64-bit integer counter backed by Interlocked operations. All methods are lock-free and safe to call from multiple threads simultaneously.',
          signature: 'public interface IAtomicCounter',
        },
        {
          slug: 'i-atomic-counter-factory',
          name: 'IAtomicCounterFactory',
          displayName: 'IAtomicCounterFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary: 'Creates and manages named IAtomicCounter instances. Use GetOrCreate to share a counter across components by name, or Create for a private counter that is not tracked.',
          signature: 'public interface IAtomicCounterFactory',
        },
        {
          slug: 'i-work-queue-t',
          name: 'IWorkQueue',
          displayName: 'IWorkQueue<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary: 'A bounded async producer-consumer queue backed by a Channel{T}. Producers call EnqueueAsync or TryEnqueue; consumers iterate ConsumeAllAsync which yields items as they arrive.',
          signature: 'public interface IWorkQueue<T>',
          typeParameters: [
            { name: 'T', description: 'Type parameter T.' },
          ],
        },
        {
          slug: 'i-work-queue-factory',
          name: 'IWorkQueueFactory',
          displayName: 'IWorkQueueFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary: 'Creates independent IWorkQueue{T} instances with custom capacity and overflow policies. Use when multiple consumers need isolated queues with different configurations.',
          signature: 'public interface IWorkQueueFactory',
        }
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Throttling',
      summary: 'Types in StangaNetLib.Concurrency.Throttling.',
      types: [
        {
          slug: 'i-async-throttle',
          name: 'IAsyncThrottle',
          displayName: 'IAsyncThrottle',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Throttling',
          summary: 'Limits the number of operations that can execute concurrently using a semaphore slot. Callers await WaitAsync() to enter, then dispose the returned handle to release the slot.',
          signature: 'public interface IAsyncThrottle',
        },
        {
          slug: 'i-async-throttle-factory',
          name: 'IAsyncThrottleFactory',
          displayName: 'IAsyncThrottleFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Throttling',
          summary: 'Creates independent IAsyncThrottle instances with custom concurrency limits. Use when you need multiple throttles with different caps within the same application.',
          signature: 'public interface IAsyncThrottleFactory',
        }
      ],
    }
  ],
};
