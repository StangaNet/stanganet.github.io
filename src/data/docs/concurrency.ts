import type { LibraryDoc } from './types';

export const concurrencyLibrary: LibraryDoc = {
  slug: 'concurrency',
  name: 'StangaNetLib.Concurrency',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0'],
  tagline: 'Keyed locks, throttling, work queues, debouncing, and atomic counters',
  description:
    'Simplified threading and concurrent data-access utilities for .NET: per-key async locks, semaphore throttling, bounded producer-consumer queues, per-key debouncing, and lock-free atomic counters. Expected failures (timeouts, full queue) surface as Result; depends on StangaNetLib.Core.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Concurrency',
  namespaces: [
    {
      name: 'StangaNetLib.Concurrency.Locking',
      summary: 'Per-resource async mutual exclusion.',
      types: [
        {
          slug: 'ikeyed-lock',
          name: 'IKeyedLock',
          displayName: 'IKeyedLock',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Locking',
          summary:
            'Provides per-key async mutual exclusion. Serializes operations that share the same logical resource (e.g. the same entity ID) without blocking unrelated keys.',
          signature: 'public interface IKeyedLock',
          methods: [
            {
              name: 'AcquireAsync',
              signature:
                'Task<IAsyncDisposable> AcquireAsync(string key, CancellationToken cancellationToken = default)',
              summary:
                'Waits until the lock for the key is acquired; dispose the handle to release.',
              isAsync: true,
              parameters: [
                {
                  name: 'key',
                  type: 'string',
                  description: 'Resource key to lock on.',
                },
                {
                  name: 'cancellationToken',
                  type: 'CancellationToken',
                  description: 'Cancels the wait.',
                  optional: true,
                },
              ],
            },
            {
              name: 'TryAcquireAsync',
              signature:
                'Task<Result<IAsyncDisposable>> TryAcquireAsync(string key, TimeSpan timeout, CancellationToken cancellationToken = default)',
              summary:
                'Attempts to acquire within timeout; fails with ConcurrencyErrors.LockTimeout if not acquired.',
              isAsync: true,
              parameters: [
                {
                  name: 'key',
                  type: 'string',
                  description: 'Resource key to lock on.',
                },
                {
                  name: 'timeout',
                  type: 'TimeSpan',
                  description: 'Maximum time to wait.',
                },
                {
                  name: 'cancellationToken',
                  type: 'CancellationToken',
                  description: 'Cancels the wait.',
                  optional: true,
                },
              ],
            },
          ],
          example: {
            title: 'Serialize per-order work',
            code: `public class OrderService(IKeyedLock keyedLock)
{
    public async Task ProcessOrderAsync(string orderId)
    {
        await using var _ = await keyedLock.AcquireAsync(orderId);
        // Only one concurrent operation for this orderId
    }
}`,
          },
        },
        {
          slug: 'ikeyed-lock-factory',
          name: 'IKeyedLockFactory',
          displayName: 'IKeyedLockFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Locking',
          summary:
            'Creates independent IKeyedLock instances with isolated per-key semaphore pools (e.g. cache locks vs business locks).',
          signature: 'public interface IKeyedLockFactory',
          methods: [
            {
              name: 'Create',
              signature: 'IKeyedLock Create()',
              summary: 'New IKeyedLock with an empty independent semaphore pool.',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Throttling',
      summary: 'Semaphore-based concurrency limiter.',
      types: [
        {
          slug: 'iasync-throttle',
          name: 'IAsyncThrottle',
          displayName: 'IAsyncThrottle',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Throttling',
          summary:
            'Limits how many operations can run concurrently. Await WaitAsync to enter; dispose the handle to release the slot.',
          signature: 'public interface IAsyncThrottle',
          properties: [
            {
              name: 'MaxConcurrency',
              type: 'int',
              access: 'get',
              summary: 'Maximum concurrent operations allowed.',
            },
            {
              name: 'AvailableSlots',
              type: 'int',
              access: 'get',
              summary: 'Slots free at this instant.',
            },
          ],
          methods: [
            {
              name: 'WaitAsync',
              signature:
                'Task<IAsyncDisposable> WaitAsync(CancellationToken cancellationToken = default)',
              summary: 'Waits for a slot; dispose the handle to release.',
              isAsync: true,
            },
            {
              name: 'TryWaitAsync',
              signature:
                'Task<Result<IAsyncDisposable>> TryWaitAsync(TimeSpan timeout, CancellationToken cancellationToken = default)',
              summary:
                'Tries to acquire a slot within timeout; fails with ConcurrencyErrors.ThrottleTimeout.',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'iasync-throttle-factory',
          name: 'IAsyncThrottleFactory',
          displayName: 'IAsyncThrottleFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Throttling',
          summary: 'Creates independent IAsyncThrottle instances with a chosen max concurrency.',
          signature: 'public interface IAsyncThrottleFactory',
          methods: [
            {
              name: 'Create',
              signature: 'IAsyncThrottle Create(int maxConcurrency)',
              summary: 'New throttle limited to maxConcurrency slots (must be ≥ 1).',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Synchronization',
      summary: 'Bounded work queues and lock-free atomic counters.',
      types: [
        {
          slug: 'iwork-queue-t',
          name: 'IWorkQueue',
          displayName: 'IWorkQueue<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary:
            'Bounded async producer-consumer queue backed by Channel<T>. Producers enqueue; consumers iterate ConsumeAllAsync.',
          signature: 'public interface IWorkQueue<T>',
          typeParameters: [
            {
              name: 'T',
              description: 'Item type stored in the queue.',
            },
          ],
          properties: [
            {
              name: 'Count',
              type: 'int',
              access: 'get',
              summary: 'Items currently in the queue.',
            },
            {
              name: 'IsCompleted',
              type: 'bool',
              access: 'get',
              summary: 'True after Complete and all items have been consumed.',
            },
          ],
          methods: [
            {
              name: 'EnqueueAsync',
              signature:
                'ValueTask EnqueueAsync(T item, CancellationToken cancellationToken = default)',
              summary:
                'Writes an item; when full and FullMode is Wait, waits for capacity.',
              isAsync: true,
            },
            {
              name: 'TryEnqueue',
              signature: 'Result<T> TryEnqueue(T item)',
              summary:
                'Non-blocking enqueue; fails with QueueFull or QueueCompleted.',
            },
            {
              name: 'Complete',
              signature: 'void Complete()',
              summary: 'No more items will be produced; consumers drain then finish.',
            },
            {
              name: 'ConsumeAllAsync',
              signature:
                'IAsyncEnumerable<T> ConsumeAllAsync(CancellationToken cancellationToken = default)',
              summary: 'Yields items as enqueued; completes after Complete and drain.',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'iwork-queue-factory',
          name: 'IWorkQueueFactory',
          displayName: 'IWorkQueueFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary:
            'Creates independent IWorkQueue<T> instances with custom capacity and overflow policy.',
          signature: 'public interface IWorkQueueFactory',
          methods: [
            {
              name: 'Create',
              signature:
                'IWorkQueue<T> Create<T>(int capacity, BoundedChannelFullMode fullMode = BoundedChannelFullMode.Wait)',
              summary: 'New bounded queue; capacity must be ≥ 1.',
            },
          ],
        },
        {
          slug: 'iatomic-counter',
          name: 'IAtomicCounter',
          displayName: 'IAtomicCounter',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary:
            'Thread-safe 64-bit counter via Interlocked. Lock-free and safe under high contention.',
          signature: 'public interface IAtomicCounter',
          properties: [
            {
              name: 'Value',
              type: 'long',
              access: 'get',
              summary: 'Current value read atomically.',
            },
          ],
          methods: [
            {
              name: 'Increment',
              signature: 'long Increment()',
              summary: 'Atomically add 1; returns the new value.',
            },
            {
              name: 'Decrement',
              signature: 'long Decrement()',
              summary: 'Atomically subtract 1; returns the new value.',
            },
            {
              name: 'Add',
              signature: 'long Add(long delta)',
              summary: 'Atomically add delta (may be negative); returns the new value.',
            },
            {
              name: 'Reset',
              signature: 'long Reset(long value = 0)',
              summary: 'Atomically set value; returns the previous value.',
            },
            {
              name: 'TryUpdate',
              signature: 'bool TryUpdate(long expectedValue, long newValue)',
              summary: 'CAS: set newValue only if current equals expectedValue.',
            },
          ],
        },
        {
          slug: 'iatomic-counter-factory',
          name: 'IAtomicCounterFactory',
          displayName: 'IAtomicCounterFactory',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Synchronization',
          summary:
            'Creates private counters or shared named counters via GetOrCreate.',
          signature: 'public interface IAtomicCounterFactory',
          methods: [
            {
              name: 'Create',
              signature: 'IAtomicCounter Create(long initialValue = 0)',
              summary: 'Untracked counter starting at initialValue.',
            },
            {
              name: 'GetOrCreate',
              signature: 'IAtomicCounter GetOrCreate(string name, long initialValue = 0)',
              summary: 'Shared counter by name; initialValue used only on first create.',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Scheduling',
      summary: 'Per-key debouncing of async actions.',
      types: [
        {
          slug: 'idebouncer',
          name: 'IDebouncer',
          displayName: 'IDebouncer',
          kind: 'interface',
          namespace: 'StangaNetLib.Concurrency.Scheduling',
          summary:
            'Debounces high-frequency triggers so the action runs only after a quiet period per key. Useful for search-as-you-type or file-watcher coalescing.',
          signature: 'public interface IDebouncer : IDisposable',
          methods: [
            {
              name: 'Debounce',
              signature:
                'void Debounce(string key, Func<CancellationToken, Task> action, TimeSpan delay)',
              summary:
                'Schedule action after delay; same key again resets the timer.',
            },
            {
              name: 'Cancel',
              signature: 'bool Cancel(string key)',
              summary:
                'Cancel pending work for key; true if something was cancelled.',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Core',
      summary: 'Typed Error constants for concurrency failures.',
      types: [
        {
          slug: 'concurrency-errors',
          name: 'ConcurrencyErrors',
          displayName: 'ConcurrencyErrors',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Core',
          summary: 'Well-known Error instances for StangaNetLib.Concurrency.',
          signature: 'public static class ConcurrencyErrors',
          fields: [
            {
              name: 'LockTimeout',
              type: 'Error',
              summary: 'Keyed lock not acquired within the requested timeout.',
              value: 'Concurrency.LockTimeout',
            },
            {
              name: 'QueueFull',
              type: 'Error',
              summary: 'Work queue is full and cannot accept new items.',
              value: 'Concurrency.QueueFull',
            },
            {
              name: 'QueueCompleted',
              type: 'Error',
              summary: 'Work queue completed; no more enqueues allowed.',
              value: 'Concurrency.QueueCompleted',
            },
            {
              name: 'ThrottleTimeout',
              type: 'Error',
              summary: 'Throttle slot not acquired within the requested timeout.',
              value: 'Concurrency.ThrottleTimeout',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Configuration',
      summary: 'Options bound from appsettings.',
      types: [
        {
          slug: 'concurrency-settings',
          name: 'ConcurrencySettings',
          displayName: 'ConcurrencySettings',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Configuration',
          summary: 'Configuration for StangaNetLib.Concurrency services (section ConcurrencySettings).',
          signature: 'public sealed class ConcurrencySettings',
          fields: [
            {
              name: 'SectionName',
              type: 'string',
              summary: 'appsettings section key.',
              value: '"ConcurrencySettings"',
            },
          ],
          properties: [
            {
              name: 'DefaultThrottleMaxConcurrency',
              type: 'int',
              access: 'get; set',
              summary: 'Max slots for the default IAsyncThrottle in DI (default 10).',
            },
            {
              name: 'WorkQueueCapacity',
              type: 'int',
              access: 'get; set',
              summary: 'Capacity of the default IWorkQueue<T> in DI (default 1000).',
            },
            {
              name: 'WorkQueueFullMode',
              type: 'BoundedChannelFullMode',
              access: 'get; set',
              summary: 'Overflow policy when the work queue is full (default Wait).',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Concurrency.Extensions',
      summary: 'Dependency injection registration.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Concurrency.Extensions',
          summary:
            'Registers keyed locks, throttles, work queues, debouncer, and atomic counter factory.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            {
              name: 'AddStangaNetLibConcurrency',
              signature:
                'public static IServiceCollection AddStangaNetLibConcurrency(this IServiceCollection services, IConfiguration configuration)',
              summary: 'Bind ConcurrencySettings from configuration and register all services.',
              isStatic: true,
            },
            {
              name: 'AddStangaNetLibConcurrency',
              signature:
                'public static IServiceCollection AddStangaNetLibConcurrency(this IServiceCollection services)',
              summary: 'Register all services with default ConcurrencySettings.',
              isStatic: true,
            },
          ],
          example: {
            title: 'Register from appsettings',
            code: `// Program.cs
builder.Services.AddStangaNetLibConcurrency(builder.Configuration);

// appsettings.json
{
  "ConcurrencySettings": {
    "DefaultThrottleMaxConcurrency": 10,
    "WorkQueueCapacity": 1000,
    "WorkQueueFullMode": "Wait"
  }
}`,
          },
        },
      ],
    },
  ],
};
