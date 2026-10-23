import type { LibraryDoc } from '../types';

export const recurrenceLibrary: LibraryDoc = {
  slug: 'recurrence',
  name: 'StangaNetLib.Recurrence',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Recurring calendar rules with idempotent occurrence materialization',
  description:
    'Recurring rule engine with idempotent occurrence materialization to a configurable horizon. Calendar logic only — scheduling stays in StangaNetLib.Jobs or the host.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Recurrence',
  namespaces: [
    {
      name: 'StangaNetLib.Recurrence.Abstractions',
      summary: 'Types in StangaNetLib.Recurrence.Abstractions.',
      types: [
        {
          slug: 'i-occurrence-store',
          name: 'IOccurrenceStore',
          displayName: 'IOccurrenceStore',
          kind: 'interface',
          namespace: 'StangaNetLib.Recurrence.Abstractions',
          summary: 'interface IOccurrenceStore.',
          signature: 'public interface IOccurrenceStore',
        },
        {
          slug: 'i-recurrence-materializer',
          name: 'IRecurrenceMaterializer',
          displayName: 'IRecurrenceMaterializer',
          kind: 'interface',
          namespace: 'StangaNetLib.Recurrence.Abstractions',
          summary: 'Materializes recurrence occurrences up to a horizon and exposes query/skip/deactivate APIs. This is not a job runner — pair with StangaNetLib.Jobs (or the host) for periodic calls.',
          signature: 'public interface IRecurrenceMaterializer',
        },
        {
          slug: 'i-recurrence-rule-store',
          name: 'IRecurrenceRuleStore',
          displayName: 'IRecurrenceRuleStore',
          kind: 'interface',
          namespace: 'StangaNetLib.Recurrence.Abstractions',
          summary: 'interface IRecurrenceRuleStore.',
          signature: 'public interface IRecurrenceRuleStore',
        }
      ],
    },
    {
      name: 'StangaNetLib.Recurrence.Extensions',
      summary: 'Types in StangaNetLib.Recurrence.Extensions.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Extensions',
          summary: 'class ServiceCollectionExtensions.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibRecurrence', signature: 'public static IServiceCollection AddStangaNetLibRecurrence( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers the materializer and binds RecurrenceSettings. The consumer must also register IRecurrenceRuleStore and IOccurrenceStore. Optionally register IKeyedLock (via Concurrency) for in-process materialize locking.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibRecurrence', signature: 'public static IServiceCollection AddStangaNetLibRecurrence(this IServiceCollection services)', summary: 'Registers the materializer with default settings. The consumer must register rule/occurrence stores.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibRecurrenceInMemory', signature: 'public static IServiceCollection AddStangaNetLibRecurrenceInMemory( this IServiceCollection services, IConfiguration? configuration = null)', summary: 'Registers materializer plus in-memory rule and occurrence stores (tests / local dev).', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration?', description: 'configuration', optional: true }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Recurrence.Implementations',
      summary: 'Types in StangaNetLib.Recurrence.Implementations.',
      types: [
        {
          slug: 'in-memory-occurrence-store',
          name: 'InMemoryOccurrenceStore',
          displayName: 'InMemoryOccurrenceStore',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Implementations',
          summary: 'class InMemoryOccurrenceStore.',
          signature: 'public sealed class InMemoryOccurrenceStore : IOccurrenceStore',
          implements: ['IOccurrenceStore'],
          methods: [
            { name: 'GetByNaturalKeyAsync', signature: 'public Task<Occurrence?> GetByNaturalKeyAsync( string naturalKey, CancellationToken cancellationToken = default)', summary: 'GetByNaturalKeyAsync', parameters: [{ name: 'naturalKey', type: 'string', description: 'naturalKey' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Occurrence?>', isAsync: true },
            { name: 'SaveAsync', signature: 'public Task<Result> SaveAsync(Occurrence occurrence, CancellationToken cancellationToken = default)', summary: 'SaveAsync', parameters: [{ name: 'occurrence', type: 'Occurrence', description: 'occurrence' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
            { name: 'ListInRangeAsync', signature: 'public Task<IReadOnlyList<Occurrence>> ListInRangeAsync( DateOnly from, DateOnly to, string? ruleId = null, CancellationToken cancellationToken = default)', summary: 'ListInRangeAsync', parameters: [{ name: 'from', type: 'DateOnly', description: 'from' }, { name: 'to', type: 'DateOnly', description: 'to' }, { name: 'ruleId', type: 'string?', description: 'ruleId', optional: true }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<IReadOnlyList<Occurrence>>', isAsync: true },
          ],
        },
        {
          slug: 'in-memory-recurrence-rule-store',
          name: 'InMemoryRecurrenceRuleStore',
          displayName: 'InMemoryRecurrenceRuleStore',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Implementations',
          summary: 'class InMemoryRecurrenceRuleStore.',
          signature: 'public sealed class InMemoryRecurrenceRuleStore : IRecurrenceRuleStore',
          implements: ['IRecurrenceRuleStore'],
          methods: [
            { name: 'GetAsync', signature: 'public Task<RecurrenceRule?> GetAsync(string ruleId, CancellationToken cancellationToken = default)', summary: 'GetAsync', parameters: [{ name: 'ruleId', type: 'string', description: 'ruleId' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<RecurrenceRule?>', isAsync: true },
            { name: 'ListActiveAsync', signature: 'public Task<IReadOnlyList<RecurrenceRule>> ListActiveAsync(CancellationToken cancellationToken = default)', summary: 'ListActiveAsync', parameters: [{ name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<IReadOnlyList<RecurrenceRule>>', isAsync: true },
            { name: 'SaveAsync', signature: 'public Task<Result> SaveAsync(RecurrenceRule rule, CancellationToken cancellationToken = default)', summary: 'SaveAsync', parameters: [{ name: 'rule', type: 'RecurrenceRule', description: 'rule' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
          ],
        },
        {
          slug: 'recurrence-materializer',
          name: 'RecurrenceMaterializer',
          displayName: 'RecurrenceMaterializer',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Implementations',
          summary: 'class RecurrenceMaterializer.',
          signature: 'public sealed class RecurrenceMaterializer : IRecurrenceMaterializer',
          implements: ['IRecurrenceMaterializer'],
          methods: [
            { name: 'MaterializeAsync', signature: 'public async Task<Result<int>> MaterializeAsync( int? horizonDays = null, CancellationToken cancellationToken = default)', summary: 'MaterializeAsync', parameters: [{ name: 'horizonDays', type: 'int?', description: 'horizonDays', optional: true }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<int>>', isAsync: true },
            { name: 'GetNextAsync', signature: 'public async Task<Result<Occurrence?>> GetNextAsync( string ruleId, DateOnly? from = null, CancellationToken cancellationToken = default)', summary: 'GetNextAsync', parameters: [{ name: 'ruleId', type: 'string', description: 'ruleId' }, { name: 'from', type: 'DateOnly?', description: 'from', optional: true }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<Occurrence?>>', isAsync: true },
            { name: 'GetOccurrencesInRangeAsync', signature: 'public async Task<Result<IReadOnlyList<Occurrence>>> GetOccurrencesInRangeAsync( DateOnly from, DateOnly to, string? ruleId = null, CancellationToken cancellationToken = default)', summary: 'GetOccurrencesInRangeAsync', parameters: [{ name: 'from', type: 'DateOnly', description: 'from' }, { name: 'to', type: 'DateOnly', description: 'to' }, { name: 'ruleId', type: 'string?', description: 'ruleId', optional: true }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result<IReadOnlyList<Occurrence>>>', isAsync: true },
            { name: 'SkipOccurrenceAsync', signature: 'public async Task<Result> SkipOccurrenceAsync( string naturalKey, CancellationToken cancellationToken = default)', summary: 'SkipOccurrenceAsync', parameters: [{ name: 'naturalKey', type: 'string', description: 'naturalKey' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
            { name: 'DeactivateRuleAsync', signature: 'public async Task<Result> DeactivateRuleAsync( string ruleId, CancellationToken cancellationToken = default)', summary: 'DeactivateRuleAsync', parameters: [{ name: 'ruleId', type: 'string', description: 'ruleId' }, { name: 'cancellationToken', type: 'CancellationToken', description: 'cancellationToken', optional: true }], returns: 'Task<Result>', isAsync: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Recurrence.Models',
      summary: 'Types in StangaNetLib.Recurrence.Models.',
      types: [
        {
          slug: 'occurrence',
          name: 'Occurrence',
          displayName: 'Occurrence',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Models',
          summary: 'class Occurrence.',
          signature: 'public sealed class Occurrence',
          properties: [
            { name: 'Id', type: 'string', access: 'get; init', summary: 'Id' },
            { name: 'RuleId', type: 'string', access: 'get; init', summary: 'RuleId' },
            { name: 'DueDate', type: 'DateOnly', access: 'get; init', summary: 'DueDate' },
            { name: 'Status', type: 'OccurrenceStatus', access: 'get; set', summary: 'Status' },
            { name: 'NaturalKey', type: 'string', access: 'get; init', summary: 'Anti-duplicate key: {ruleId}:{due:yyyy-MM-dd}.' },
          ],
          methods: [
            { name: 'BuildNaturalKey', signature: 'public static string BuildNaturalKey(string ruleId, DateOnly dueDate)', summary: 'BuildNaturalKey', parameters: [{ name: 'ruleId', type: 'string', description: 'ruleId' }, { name: 'dueDate', type: 'DateOnly', description: 'dueDate' }], returns: 'string', isStatic: true },
          ],
        },
        {
          slug: 'occurrence-status',
          name: 'OccurrenceStatus',
          displayName: 'OccurrenceStatus',
          kind: 'enum',
          namespace: 'StangaNetLib.Recurrence.Models',
          summary: 'enum OccurrenceStatus.',
          signature: 'public enum OccurrenceStatus',
          enumValues: [
            { name: 'Planned', value: 0, summary: 'Planned' },
            { name: 'Skipped', value: 1, summary: 'Skipped' },
          ],
        },
        {
          slug: 'recurrence-frequency',
          name: 'RecurrenceFrequency',
          displayName: 'RecurrenceFrequency',
          kind: 'enum',
          namespace: 'StangaNetLib.Recurrence.Models',
          summary: 'enum RecurrenceFrequency.',
          signature: 'public enum RecurrenceFrequency',
          enumValues: [
            { name: 'Daily', value: 0, summary: 'Daily' },
            { name: 'Weekly', value: 1, summary: 'Weekly' },
            { name: 'Monthly', value: 2, summary: 'Monthly' },
            { name: 'Yearly', value: 3, summary: 'Yearly' },
          ],
        },
        {
          slug: 'recurrence-rule',
          name: 'RecurrenceRule',
          displayName: 'RecurrenceRule',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Models',
          summary: 'A recurring calendar rule. Operates on DateOnly values interpreted in TimeZoneId (default UTC).',
          signature: 'public sealed class RecurrenceRule',
          properties: [
            { name: 'Id', type: 'string', access: 'get; init', summary: 'Id' },
            { name: 'Frequency', type: 'RecurrenceFrequency', access: 'get; init', summary: 'Frequency' },
            { name: 'Interval', type: 'int', access: 'get; init', summary: 'Interval' },
            { name: 'DayOfMonth', type: 'int?', access: 'get; init', summary: 'Day of month for Monthly (1–31). When the month is shorter, the last day of that month is used.' },
            { name: 'Start', type: 'DateOnly', access: 'get; init', summary: 'Start' },
            { name: 'End', type: 'DateOnly?', access: 'get; init', summary: 'End' },
            { name: 'TimeZoneId', type: 'string', access: 'get; init', summary: 'IANA or Windows time-zone id used to compute "today" for horizon materialization. Defaults to UTC.' },
            { name: 'IsActive', type: 'bool', access: 'get; set', summary: 'IsActive' },
            { name: 'Metadata', type: 'string?', access: 'get; init', summary: 'Metadata' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.Recurrence.Settings',
      summary: 'Types in StangaNetLib.Recurrence.Settings.',
      types: [
        {
          slug: 'recurrence-settings',
          name: 'RecurrenceSettings',
          displayName: 'RecurrenceSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Settings',
          summary: 'class RecurrenceSettings.',
          signature: 'public sealed class RecurrenceSettings',
          properties: [
            { name: 'HorizonDays', type: 'int', access: 'get; set', summary: 'HorizonDays' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"RecurrenceSettings"' },
          ],
        },
        {
          slug: 'recurrence-settings-validator',
          name: 'RecurrenceSettingsValidator',
          displayName: 'RecurrenceSettingsValidator',
          kind: 'class',
          namespace: 'StangaNetLib.Recurrence.Settings',
          summary: 'class RecurrenceSettingsValidator.',
          signature: 'public sealed class RecurrenceSettingsValidator : IValidateOptions<RecurrenceSettings>',
          implements: ['IValidateOptions<RecurrenceSettings>'],
          methods: [
            { name: 'Validate', signature: 'public ValidateOptionsResult Validate(string? name, RecurrenceSettings options)', summary: 'Validate', parameters: [{ name: 'name', type: 'string?', description: 'name' }, { name: 'options', type: 'RecurrenceSettings', description: 'options' }], returns: 'ValidateOptionsResult' },
          ],
        }
      ],
    }
  ],
};
