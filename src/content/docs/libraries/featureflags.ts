import type { LibraryDoc } from '../types';

export const featureFlagsLibrary: LibraryDoc = {
  slug: 'featureflags',
  name: 'StangaNetLib.FeatureFlags',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Feature flag evaluation and providers',
  description:
    'Feature flag service abstractions and in-memory/config providers for toggling behavior safely.',
  repository: 'https://github.com/StangaNet/StangaNetLib.FeatureFlags',
  namespaces: [
    {
      name: 'StangaNetLib.FeatureFlags.Abstractions',
      summary: 'Types in StangaNetLib.FeatureFlags.Abstractions.',
      types: [
        {
          slug: 'i-feature-flag-service',
          name: 'IFeatureFlagService',
          displayName: 'IFeatureFlagService',
          kind: 'interface',
          namespace: 'StangaNetLib.FeatureFlags.Abstractions',
          summary: 'Evaluates feature flags for conditional feature activation. Supports per-user rollout percentages and per-tenant activation.',
          signature: 'public interface IFeatureFlagService',
        },
        {
          slug: 'i-feature-flag-store',
          name: 'IFeatureFlagStore',
          displayName: 'IFeatureFlagStore',
          kind: 'interface',
          namespace: 'StangaNetLib.FeatureFlags.Abstractions',
          summary: 'Persistence abstraction for feature flag definitions. Implementations provide storage backends such as in-memory or configuration-backed stores.',
          signature: 'public interface IFeatureFlagStore',
        }
      ],
    },
    {
      name: 'StangaNetLib.FeatureFlags.Extensions',
      summary: 'Types in StangaNetLib.FeatureFlags.Extensions.',
      types: [
        {
          slug: 'my-service',
          name: 'MyService',
          displayName: 'MyService',
          kind: 'class',
          namespace: 'StangaNetLib.FeatureFlags.Extensions',
          summary: 'Extension methods for registering StangaNetLib.FeatureFlags services.',
          signature: 'public class MyService(IFeatureFlagService flags)',
          methods: [
            { name: 'DoWorkAsync', signature: 'public async Task DoWorkAsync(string userId, string tenantId)', summary: 'DoWorkAsync', parameters: [{ name: 'userId', type: 'string', description: 'userId' }, { name: 'tenantId', type: 'string', description: 'tenantId' }], returns: 'Task', isAsync: true },
          ],
        },
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.FeatureFlags.Extensions',
          summary: 'Extension methods for registering StangaNetLib.FeatureFlags services.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            { name: 'AddStangaNetLibFeatureFlags', signature: 'public static IServiceCollection AddStangaNetLibFeatureFlags( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.FeatureFlags with the in-memory backend seeded from the FeatureFlagsSettings section of configuration. Flags can be overridden at runtime via IFeatureFlagStore.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibFeatureFlags', signature: 'public static IServiceCollection AddStangaNetLibFeatureFlags(this IServiceCollection services)', summary: 'Registers StangaNetLib.FeatureFlags with an empty in-memory backend using default settings. Flags must be added programmatically via IFeatureFlagStore.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }], returns: 'IServiceCollection', isStatic: true },
            { name: 'AddStangaNetLibFeatureFlagsFromConfiguration', signature: 'public static IServiceCollection AddStangaNetLibFeatureFlagsFromConfiguration( this IServiceCollection services, IConfiguration configuration)', summary: 'Registers StangaNetLib.FeatureFlags with the configuration-backed backend. Reads flags from FeatureFlagsSettings section of configuration and reflects live appsettings changes via IOptionsMonitor{TOptions}. SetAsync and RemoveAsync are no-ops on this backend.', parameters: [{ name: 'services', type: 'IServiceCollection', description: 'services' }, { name: 'configuration', type: 'IConfiguration', description: 'configuration' }], returns: 'IServiceCollection', isStatic: true },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.FeatureFlags.Models',
      summary: 'Types in StangaNetLib.FeatureFlags.Models.',
      types: [
        {
          slug: 'feature-flag-definition',
          name: 'FeatureFlagDefinition',
          displayName: 'FeatureFlagDefinition',
          kind: 'class',
          namespace: 'StangaNetLib.FeatureFlags.Models',
          summary: 'Describes a feature flag and its activation rules.',
          signature: 'public sealed class FeatureFlagDefinition',
          properties: [
            { name: 'Name', type: 'string', access: 'get; init', summary: 'Name' },
            { name: 'IsEnabled', type: 'bool', access: 'get; init', summary: 'IsEnabled' },
            { name: 'RolloutPercentage', type: 'int?', access: 'get; init', summary: 'Percentage of callers (0–100) who receive this feature when it is enabled. null means the flag applies to 100% of callers (same as 100). Uses a deterministic hash of userId + flag name so the same user always gets the same outcome for a given flag.' },
            { name: 'AllowedTenantIds', type: 'IReadOnlyList<string>?', access: 'get; init', summary: 'When non-null, restricts activation to callers whose tenantId matches one of these values. An empty list means no tenant is allowed. null means all tenants are allowed.' },
            { name: 'Description', type: 'string?', access: 'get; init', summary: 'Description' },
          ],
        }
      ],
    },
    {
      name: 'StangaNetLib.FeatureFlags.Settings',
      summary: 'Types in StangaNetLib.FeatureFlags.Settings.',
      types: [
        {
          slug: 'feature-flag-entry',
          name: 'FeatureFlagEntry',
          displayName: 'FeatureFlagEntry',
          kind: 'class',
          namespace: 'StangaNetLib.FeatureFlags.Settings',
          summary: 'class FeatureFlagEntry.',
          signature: 'public sealed class FeatureFlagEntry',
          properties: [
            { name: 'IsEnabled', type: 'bool', access: 'get; set', summary: 'IsEnabled' },
            { name: 'RolloutPercentage', type: 'int?', access: 'get; set', summary: 'Percentage of callers (0–100) who receive this feature. null applies the flag to all callers when enabled.' },
            { name: 'AllowedTenantIds', type: 'List<string>?', access: 'get; set', summary: 'Tenant IDs allowed to activate this flag. null allows all tenants.' },
            { name: 'Description', type: 'string?', access: 'get; set', summary: 'Description' },
          ],
        },
        {
          slug: 'feature-flags-settings',
          name: 'FeatureFlagsSettings',
          displayName: 'FeatureFlagsSettings',
          kind: 'class',
          namespace: 'StangaNetLib.FeatureFlags.Settings',
          summary: 'class FeatureFlagsSettings.',
          signature: 'public sealed class FeatureFlagsSettings',
          properties: [
            { name: 'Flags', type: 'Dictionary<string, FeatureFlagEntry>', access: 'get; set', summary: 'Named flag definitions. Dictionary key is the flag name.' },
            { name: 'DefaultValue', type: 'bool', access: 'get; set', summary: 'Value returned by IsEnabledAsync when the requested flag is not found in the store. Defaults to false (safe-off by default).' },
          ],
          fields: [
            { name: 'SectionName', type: 'string', summary: 'SectionName', value: '"FeatureFlagsSettings"' },
          ],
        }
      ],
    }
  ],
};
