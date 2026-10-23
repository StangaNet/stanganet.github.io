import type { LibraryDoc } from '../types';

export const jobsLibrary: LibraryDoc = {
  slug: 'jobs',
  name: 'StangaNetLib.Jobs',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Background job scheduling and execution',
  description:
    'Job definitions, schedulers, and runners for reliable background work on top of Core concurrency primitives.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Jobs',
  namespaces: [
    {
      name: 'StangaNetLib.Jobs.Abstractions',
      summary: 'Types in StangaNetLib.Jobs.Abstractions.',
      types: [
        {
          slug: 'i-background-job-t-args',
          name: 'IBackgroundJob',
          displayName: 'IBackgroundJob<TArgs>',
          kind: 'interface',
          namespace: 'StangaNetLib.Jobs.Abstractions',
          summary: 'Defines a background job that accepts typed arguments. Implement this interface for each job type and register the implementation in the DI container.',
          signature: 'public interface IBackgroundJob<TArgs>',
          typeParameters: [
            { name: 'TArgs', description: 'Type parameter TArgs.' },
          ],
        },
        {
          slug: 'i-job-manager',
          name: 'IJobManager',
          displayName: 'IJobManager',
          kind: 'interface',
          namespace: 'StangaNetLib.Jobs.Abstractions',
          summary: 'Queries and manages existing background jobs.',
          signature: 'public interface IJobManager',
        },
        {
          slug: 'i-job-scheduler',
          name: 'IJobScheduler',
          displayName: 'IJobScheduler',
          kind: 'interface',
          namespace: 'StangaNetLib.Jobs.Abstractions',
          summary: 'Schedules fire-and-forget, delayed, and recurring background jobs.',
          signature: 'public interface IJobScheduler',
        },
        {
          slug: 'send-welcome-email-job',
          name: 'SendWelcomeEmailJob',
          displayName: 'SendWelcomeEmailJob',
          kind: 'class',
          namespace: 'StangaNetLib.Jobs.Abstractions',
          summary: 'Defines a background job that accepts typed arguments. Implement this interface for each job type and register the implementation in the DI container.',
          signature: 'public sealed class SendWelcomeEmailJob : IBackgroundJob&lt;SendWelcomeEmailArgs&gt;',
          implements: ['IBackgroundJob&lt;SendWelcomeEmailArgs&gt;'],
          methods: [
            { name: 'ExecuteAsync', signature: 'public async Task ExecuteAsync(SendWelcomeEmailArgs args, JobContext context, CancellationToken ct)', summary: 'ExecuteAsync', parameters: [{ name: 'args', type: 'SendWelcomeEmailArgs', description: 'args' }, { name: 'context', type: 'JobContext', description: 'context' }, { name: 'ct', type: 'CancellationToken', description: 'ct' }], returns: 'Task', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Jobs.Errors',
      summary: 'Types in StangaNetLib.Jobs.Errors.',
      types: [
        {
          slug: 'jobs-errors',
          name: 'JobsErrors',
          displayName: 'JobsErrors',
          kind: 'class',
          namespace: 'StangaNetLib.Jobs.Errors',
          summary: 'class JobsErrors.',
          signature: 'public static class JobsErrors',
          methods: [
            { name: 'JobNotFound', signature: 'public static Error JobNotFound(string jobId)', summary: 'JobNotFound', parameters: [{ name: 'jobId', type: 'string', description: 'jobId' }], returns: 'Error', isStatic: true },
            { name: 'InvalidCronExpression', signature: 'public static Error InvalidCronExpression(string expression)', summary: 'InvalidCronExpression', parameters: [{ name: 'expression', type: 'string', description: 'expression' }], returns: 'Error', isStatic: true },
            { name: 'InvalidDelay', signature: 'public static Error InvalidDelay(TimeSpan delay)', summary: 'InvalidDelay', parameters: [{ name: 'delay', type: 'TimeSpan', description: 'delay' }], returns: 'Error', isStatic: true },
            { name: 'BackendUnavailable', signature: 'public static Error BackendUnavailable(string detail)', summary: 'BackendUnavailable', parameters: [{ name: 'detail', type: 'string', description: 'detail' }], returns: 'Error', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Jobs.Extensions',
      summary: 'Types in StangaNetLib.Jobs.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Jobs.Extensions',
          summary: 'Extension methods for registering StangaNetLib.Jobs services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibJobs', signature: 'public static IServiceCollection AddStangaNetLibJobs( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.Jobs with the built-in in-memory backend. Suitable for development, testing, and single-instance deployments. Uses configuration from the JobsSettings section of configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibJobs', signature: 'public static IServiceCollection AddStangaNetLibJobs(this IServiceCollection services)', summary: 'Registers StangaNetLib.Jobs with the built-in in-memory backend using default settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibJobsWithHangfire', signature: 'public static IServiceCollection AddStangaNetLibJobsWithHangfire( this IServiceCollection services, IConfiguration configuration, Action<IGlobalConfiguration> configureHangfire)', summary: 'Registers StangaNetLib.Jobs with the Hangfire backend. Requires an active JobStorage — configure storage via configureHangfire (e.g. .UseInMemoryStorage(), .UseSqlServerStorage(connStr)). Uses configuration from the JobsSettings section of configuration.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }, { name: 'configureHangfire', type: 'Action<IGlobalConfiguration>', description: 'configureHangfire' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibJobsWithHangfire', signature: 'public static IServiceCollection AddStangaNetLibJobsWithHangfire( this IServiceCollection services, Action<IGlobalConfiguration> configureHangfire)', summary: 'Registers StangaNetLib.Jobs with the Hangfire backend using default settings.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configureHangfire', type: 'Action<IGlobalConfiguration>', description: 'configureHangfire' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Jobs.Models',
      summary: 'Types in StangaNetLib.Jobs.Models.',
      types: [
        {
          slug: 'job-context',
          name: 'JobContext',
          displayName: 'JobContext',
          kind: 'class',
          namespace: 'StangaNetLib.Jobs.Models',
          summary: 'Execution context passed to a job during ExecuteAsync.',
          signature: 'public sealed class JobContext',
          properties: [
            { name: 'JobId', type: 'string', access: 'get; init', summary: 'JobId' },
            { name: 'AttemptNumber', type: 'int', access: 'get; init', summary: 'The attempt number for this execution, starting at 1. Values greater than 1 indicate a retry.' },
            { name: 'ScheduledAt', type: 'DateTimeOffset', access: 'get; init', summary: 'ScheduledAt' },
          ],
        },
        {
          slug: 'job-info',
          name: 'JobInfo',
          displayName: 'JobInfo',
          kind: 'class',
          namespace: 'StangaNetLib.Jobs.Models',
          summary: 'class JobInfo.',
          signature: 'public sealed class JobInfo',
          properties: [
            { name: 'Id', type: 'string', access: 'get; init', summary: 'Id' },
            { name: 'JobType', type: 'string', access: 'get; init', summary: 'JobType' },
            { name: 'State', type: 'JobState', access: 'get; init', summary: 'State' },
            { name: 'CronExpression', type: 'string?', access: 'get; init', summary: 'CronExpression' },
            { name: 'ScheduledAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'ScheduledAt' },
            { name: 'StartedAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'StartedAt' },
            { name: 'CompletedAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'CompletedAt' },
            { name: 'NextRunAt', type: 'DateTimeOffset?', access: 'get; init', summary: 'NextRunAt' },
            { name: 'ErrorMessage', type: 'string?', access: 'get; init', summary: 'ErrorMessage' },
          ],
        },
        {
          slug: 'job-state',
          name: 'JobState',
          displayName: 'JobState',
          kind: 'enum',
          namespace: 'StangaNetLib.Jobs.Models',
          summary: 'enum JobState.',
          signature: 'public enum JobState',
          enumValues: [
            { name: 'Enqueued', value: 0, summary: 'Enqueued' },
            { name: 'Processing', value: 1, summary: 'Processing' },
            { name: 'Succeeded', value: 2, summary: 'Succeeded' },
            { name: 'Failed', value: 3, summary: 'Failed' },
            { name: 'Deleted', value: 4, summary: 'Deleted' },
            { name: 'Recurring', value: 5, summary: 'Recurring' },
            { name: 'Scheduled', value: 6, summary: 'Scheduled' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Jobs.Settings',
      summary: 'Types in StangaNetLib.Jobs.Settings.',
      types: [
        {
          slug: 'jobs-settings',
          name: 'JobsSettings',
          displayName: 'JobsSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Jobs.Settings',
          summary: 'class JobsSettings.',
          signature: 'public sealed class JobsSettings',
          properties: [
            { name: 'DefaultRetryCount', type: 'int', access: 'get; set', summary: 'Number of times a failed job is retried by the in-memory backend before being marked as Failed. Has no effect on the Hangfire backend (configure Hangfire\'s retry filters separately). Defaults to 3.' },
            { name: 'DefaultRetryDelay', type: 'TimeSpan', access: 'get; set', summary: 'Delay between retry attempts in the in-memory backend. Defaults to 5 seconds.' },
            { name: 'WorkerCount', type: 'int', access: 'get; set', summary: 'Number of concurrent workers processing the in-memory job queue. Defaults to 4.' },
            { name: 'RecurringCheckInterval', type: 'TimeSpan', access: 'get; set', summary: 'How often the in-memory recurring-job scheduler checks for due jobs. Defaults to 30 seconds.' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"JobsSettings"' },
          ],
        }
      ],
    }
  ],
};
