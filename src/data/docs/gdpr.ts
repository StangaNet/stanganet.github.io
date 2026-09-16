import type { LibraryDoc } from './types';

export const gdprLibrary: LibraryDoc = {
  slug: 'gdpr',
  name: 'StangaNetLib.Gdpr',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0'],
  tagline: 'GDPR compliance toolkit for ASP.NET Core',
  description:
    'Domain-driven GDPR toolkit for ASP.NET Core: consent management, DSAR workflows, objection and processing restriction, RoPA and breach notification, and AES-256-GCM pseudonymization. Expected compliance outcomes use Result from StangaNetLib.Core.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Gdpr',
  namespaces: [
    {
      name: 'StangaNetLib.Gdpr.Consent.Abstractions',
      summary: 'Consent persistence contracts (Art. 6/7).',
      types: [
        {
          slug: 'iconsent-repository',
          name: 'IConsentRepository',
          displayName: 'IConsentRepository',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Consent.Abstractions',
          summary:
            'CRUD contract for user consent records with full history. The host app provides persistence (e.g. EF Core).',
          signature: 'public interface IConsentRepository',
          methods: [
            {
              name: 'GetAsync',
              signature:
                'Task<Result<ConsentRecord>> GetAsync(string userId, string consentType, CancellationToken ct = default)',
              summary: 'Latest consent decision for a type, or NotFound if none.',
              isAsync: true,
            },
            {
              name: 'GetAllAsync',
              signature:
                'Task<IReadOnlyList<ConsentRecord>> GetAllAsync(string userId, CancellationToken ct = default)',
              summary: 'Latest record per consent type the user has interacted with.',
              isAsync: true,
            },
            {
              name: 'GetHistoryAsync',
              signature:
                'Task<IReadOnlyList<ConsentRecord>> GetHistoryAsync(string userId, string consentType, CancellationToken ct = default)',
              summary: 'Full history for a consent type, newest first.',
              isAsync: true,
            },
            {
              name: 'GrantAsync',
              signature:
                'Task<Result<ConsentRecord>> GrantAsync(string userId, string consentType, string policyVersion, LawfulBasis lawfulBasis = LawfulBasis.Consent, CancellationToken ct = default)',
              summary: 'Records a consent grant (new history entry with IsGranted = true).',
              isAsync: true,
            },
            {
              name: 'WithdrawAsync',
              signature:
                'Task<Result<ConsentRecord>> WithdrawAsync(string userId, string consentType, CancellationToken ct = default)',
              summary: 'Records a consent withdrawal (new history entry with IsGranted = false).',
              isAsync: true,
            },
            {
              name: 'HasConsentAsync',
              signature:
                'Task<bool> HasConsentAsync(string userId, string consentType, CancellationToken ct = default)',
              summary: 'True when the latest decision for the type is a grant.',
              isAsync: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Consent.Models',
      summary: 'Consent domain models and lawful basis.',
      types: [
        {
          slug: 'consent-record',
          name: 'ConsentRecord',
          displayName: 'ConsentRecord',
          kind: 'record',
          namespace: 'StangaNetLib.Gdpr.Consent.Models',
          summary: 'Immutable consent decision for a user and consent type.',
          signature: 'public sealed record ConsentRecord',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get', summary: 'Record identifier.' },
            { name: 'UserId', type: 'string', access: 'get', summary: 'Data subject id.' },
            { name: 'ConsentType', type: 'string', access: 'get', summary: 'Consent category (e.g. Marketing).' },
            { name: 'IsGranted', type: 'bool', access: 'get', summary: 'True if granted; false if withdrawn.' },
            { name: 'GrantedAt', type: 'DateTimeOffset', access: 'get', summary: 'UTC time of the decision.' },
            { name: 'PolicyVersion', type: 'string', access: 'get', summary: 'Privacy policy version accepted.' },
            { name: 'LawfulBasis', type: 'LawfulBasis', access: 'get', summary: 'Art. 6 lawful basis for processing.' },
          ],
        },
        {
          slug: 'lawful-basis',
          name: 'LawfulBasis',
          displayName: 'LawfulBasis',
          kind: 'enum',
          namespace: 'StangaNetLib.Gdpr.Consent.Models',
          summary: 'Lawful bases for processing under GDPR Art. 6.',
          signature: 'public enum LawfulBasis',
          enumValues: [
            { name: 'Consent', value: 1, summary: 'Art. 6(1)(a) — consent of the data subject.' },
            { name: 'Contract', value: 2, summary: 'Art. 6(1)(b) — performance of a contract.' },
            { name: 'LegalObligation', value: 3, summary: 'Art. 6(1)(c) — legal obligation.' },
            { name: 'VitalInterests', value: 4, summary: 'Art. 6(1)(d) — vital interests.' },
            { name: 'PublicTask', value: 5, summary: 'Art. 6(1)(e) — public task / official authority.' },
            { name: 'LegitimateInterests', value: 6, summary: 'Art. 6(1)(f) — legitimate interests.' },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Consent.Attributes',
      summary: 'Endpoint metadata for consent enforcement.',
      types: [
        {
          slug: 'require-consent-attribute',
          name: 'RequireConsentAttribute',
          displayName: 'RequireConsentAttribute',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Consent.Attributes',
          summary:
            'Marks an endpoint as requiring a granted consent type. ConsentValidationMiddleware returns HTTP 403 when missing.',
          signature: 'public sealed class RequireConsentAttribute : Attribute',
          properties: [
            {
              name: 'ConsentType',
              type: 'string',
              access: 'get',
              summary: 'Required consent category (e.g. Marketing).',
            },
          ],
          example: {
            title: 'Protect an endpoint',
            code: `[RequireConsent("Marketing")]
public async Task<Result> SendNewsletter(string userId)
{
    return await _newsletterService.SendAsync(userId);
}`,
          },
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Dsar.Abstractions',
      summary: 'Data subject request workflows (Art. 12/15/17/20).',
      types: [
        {
          slug: 'idsar-service',
          name: 'IDsarService',
          displayName: 'IDsarService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Dsar.Abstractions',
          summary: 'Tracks DSAR lifecycle, deadlines, and status transitions (Art. 12).',
          signature: 'public interface IDsarService',
          methods: [
            {
              name: 'SubmitAsync',
              signature:
                'Task<Result<DsarRecord>> SubmitAsync(string userId, DsarType type, CancellationToken ct = default)',
              summary: 'Opens a new DSAR and sets the Art. 12(3) one-month deadline.',
              isAsync: true,
            },
            {
              name: 'GetAsync',
              signature: 'Task<Result<DsarRecord>> GetAsync(Guid id, CancellationToken ct = default)',
              summary: 'Load a DSAR by id.',
              isAsync: true,
            },
            {
              name: 'ListByUserAsync',
              signature:
                'Task<IReadOnlyList<DsarRecord>> ListByUserAsync(string userId, CancellationToken ct = default)',
              summary: 'All DSARs for a data subject.',
              isAsync: true,
            },
            {
              name: 'CompleteAsync',
              signature: 'Task<Result<DsarRecord>> CompleteAsync(Guid id, CancellationToken ct = default)',
              summary: 'Mark a DSAR as completed.',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'idata-export-service',
          name: 'IDataExportService',
          displayName: 'IDataExportService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Dsar.Abstractions',
          summary: 'Application-specific export / portability of personal data (Art. 15/20). Host implements.',
          signature: 'public interface IDataExportService',
          methods: [
            {
              name: 'ExportUserDataAsync',
              signature:
                'Task<Result<DataExportResult>> ExportUserDataAsync(string userId, CancellationToken ct = default)',
              summary: 'Produce a structured export of the subject’s personal data.',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'idata-deletion-service',
          name: 'IDataDeletionService',
          displayName: 'IDataDeletionService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Dsar.Abstractions',
          summary: 'Application-specific erasure or pseudonymization (Art. 17). Host implements.',
          signature: 'public interface IDataDeletionService',
          methods: [
            {
              name: 'DeleteUserDataAsync',
              signature: 'Task<Result> DeleteUserDataAsync(string userId, CancellationToken ct = default)',
              summary: 'Erase personal data for the subject where legally required.',
              isAsync: true,
            },
            {
              name: 'PseudonymizeUserDataAsync',
              signature:
                'Task<Result> PseudonymizeUserDataAsync(string userId, CancellationToken ct = default)',
              summary: 'Replace identifying data with pseudonyms when full erasure is not possible.',
              isAsync: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Dsar.Models',
      summary: 'DSAR records, types, and export results.',
      types: [
        {
          slug: 'dsar-record',
          name: 'DsarRecord',
          displayName: 'DsarRecord',
          kind: 'record',
          namespace: 'StangaNetLib.Gdpr.Dsar.Models',
          summary: 'Tracked data subject access request with deadline and status.',
          signature: 'public sealed record DsarRecord',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get', summary: 'Request id.' },
            { name: 'UserId', type: 'string', access: 'get', summary: 'Data subject id.' },
            { name: 'Type', type: 'DsarType', access: 'get', summary: 'Kind of request (access, erasure, …).' },
            { name: 'Status', type: 'DsarStatus', access: 'get', summary: 'Lifecycle status.' },
            { name: 'ReceivedAt', type: 'DateTimeOffset', access: 'get', summary: 'When the request was received.' },
            { name: 'DeadlineAt', type: 'DateTimeOffset', access: 'get', summary: 'Art. 12 response deadline.' },
          ],
        },
        {
          slug: 'dsar-type',
          name: 'DsarType',
          displayName: 'DsarType',
          kind: 'enum',
          namespace: 'StangaNetLib.Gdpr.Dsar.Models',
          summary: 'Categories of data subject requests.',
          signature: 'public enum DsarType',
          enumValues: [
            { name: 'Access', value: 1, summary: 'Right of access (Art. 15).' },
            { name: 'Rectification', value: 2, summary: 'Right to rectification (Art. 16).' },
            { name: 'Erasure', value: 3, summary: 'Right to erasure (Art. 17).' },
            { name: 'RestrictionOfProcessing', value: 4, summary: 'Restriction of processing (Art. 18).' },
            { name: 'DataPortability', value: 5, summary: 'Data portability (Art. 20).' },
            { name: 'Objection', value: 6, summary: 'Right to object (Art. 21).' },
            { name: 'AutomatedDecision', value: 7, summary: 'Automated decision-making (Art. 22).' },
          ],
        },
        {
          slug: 'dsar-status',
          name: 'DsarStatus',
          displayName: 'DsarStatus',
          kind: 'enum',
          namespace: 'StangaNetLib.Gdpr.Dsar.Models',
          summary: 'Lifecycle status of a DSAR.',
          signature: 'public enum DsarStatus',
          enumValues: [
            { name: 'Pending', value: 1, summary: 'Received, not yet in progress.' },
            { name: 'InProgress', value: 2, summary: 'Being processed.' },
            { name: 'Completed', value: 3, summary: 'Fulfilled.' },
            { name: 'Rejected', value: 4, summary: 'Refused with grounds.' },
            { name: 'Extended', value: 5, summary: 'Deadline extended under Art. 12(3).' },
          ],
        },
        {
          slug: 'data-export-result',
          name: 'DataExportResult',
          displayName: 'DataExportResult',
          kind: 'record',
          namespace: 'StangaNetLib.Gdpr.Dsar.Models',
          summary: 'Structured export payload produced by IDataExportService.',
          signature: 'public sealed record DataExportResult',
          properties: [
            { name: 'UserId', type: 'string', access: 'get', summary: 'Data subject id.' },
            { name: 'GeneratedAt', type: 'DateTimeOffset', access: 'get', summary: 'UTC generation time.' },
            { name: 'Format', type: 'string', access: 'get', summary: 'Export format (e.g. json, zip).' },
            { name: 'Payload', type: 'object', access: 'get', summary: 'Application-specific exported data.' },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Objection.Abstractions',
      summary: 'Objection, restriction, and rectification services (Art. 16/18/21).',
      types: [
        {
          slug: 'idata-processing-objection-service',
          name: 'IDataProcessingObjectionService',
          displayName: 'IDataProcessingObjectionService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Objection.Abstractions',
          summary: 'Records and queries objections to processing (Art. 21). Direct marketing objections are absolute.',
          signature: 'public interface IDataProcessingObjectionService',
          methods: [
            {
              name: 'ObjectAsync',
              signature:
                'Task<Result<DataProcessingObjection>> ObjectAsync(string userId, string processingPurpose, bool isDirectMarketing = false, CancellationToken ct = default)',
              summary: 'Register an objection for a processing purpose.',
              isAsync: true,
            },
            {
              name: 'HasActiveObjectionAsync',
              signature:
                'Task<bool> HasActiveObjectionAsync(string userId, string processingPurpose, CancellationToken ct = default)',
              summary: 'True when an active objection exists for the purpose.',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'iprocessing-restriction-service',
          name: 'IProcessingRestrictionService',
          displayName: 'IProcessingRestrictionService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Objection.Abstractions',
          summary: 'Manages Art. 18 processing restrictions. Required by ProcessingRestrictionMiddleware.',
          signature: 'public interface IProcessingRestrictionService',
          methods: [
            {
              name: 'RestrictAsync',
              signature:
                'Task<Result<ProcessingRestriction>> RestrictAsync(string userId, string reason, string scope = "*", CancellationToken ct = default)',
              summary: 'Activate a processing restriction for the subject.',
              isAsync: true,
            },
            {
              name: 'IsRestrictedAsync',
              signature:
                'Task<bool> IsRestrictedAsync(string userId, string scope = "*", CancellationToken ct = default)',
              summary: 'True when an active restriction covers the scope.',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'idata-rectification-service',
          name: 'IDataRectificationService',
          displayName: 'IDataRectificationService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Objection.Abstractions',
          summary: 'Tracks rectification requests (Art. 16).',
          signature: 'public interface IDataRectificationService',
          methods: [
            {
              name: 'RequestAsync',
              signature:
                'Task<Result<RectificationRequest>> RequestAsync(string userId, string field, string requestedChange, CancellationToken ct = default)',
              summary: 'Open a rectification request for a field.',
              isAsync: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Objection.Attributes',
      summary: 'Endpoint metadata for restriction enforcement.',
      types: [
        {
          slug: 'require-no-restriction-attribute',
          name: 'RequireNoRestrictionAttribute',
          displayName: 'RequireNoRestrictionAttribute',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Objection.Attributes',
          summary:
            'Marks an endpoint blocked when the user has an active processing restriction. Middleware returns HTTP 451.',
          signature: 'public sealed class RequireNoRestrictionAttribute : Attribute',
          properties: [
            {
              name: 'Scope',
              type: 'string',
              access: 'get',
              summary: 'Restriction scope to check (default *).',
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Audit.Abstractions',
      summary: 'Breach notification and RoPA (Art. 30/33/34).',
      types: [
        {
          slug: 'idata-breach-service',
          name: 'IDataBreachService',
          displayName: 'IDataBreachService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Audit.Abstractions',
          summary:
            'Personal data breach lifecycle: record discovery, 72-hour authority deadline, and subject notification tracking.',
          signature: 'public interface IDataBreachService',
          methods: [
            {
              name: 'ReportAsync',
              signature:
                'Task<Result<DataBreachRecord>> ReportAsync(DataBreachSeverity severity, string description, IReadOnlyList<string> dataCategories, int affectedSubjectsCount = -1, string? remediationMeasures = null, DateTimeOffset? detectedAt = null, CancellationToken ct = default)',
              summary: 'Record a breach and set NotificationDeadlineAt to 72 hours from detection.',
              isAsync: true,
            },
            {
              name: 'MarkAuthorityNotifiedAsync',
              signature:
                'Task<Result<DataBreachRecord>> MarkAuthorityNotifiedAsync(Guid breachId, CancellationToken ct = default)',
              summary: 'Record that the supervisory authority was notified (Art. 33).',
              isAsync: true,
            },
            {
              name: 'MarkSubjectsNotifiedAsync',
              signature:
                'Task<Result<DataBreachRecord>> MarkSubjectsNotifiedAsync(Guid breachId, CancellationToken ct = default)',
              summary: 'Record that affected subjects were informed (Art. 34).',
              isAsync: true,
            },
          ],
        },
        {
          slug: 'iprocessing-activity-registry',
          name: 'IProcessingActivityRegistry',
          displayName: 'IProcessingActivityRegistry',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Audit.Abstractions',
          summary: 'Record of Processing Activities (RoPA) under Art. 30.',
          signature: 'public interface IProcessingActivityRegistry',
          methods: [
            {
              name: 'AddAsync',
              signature:
                'Task<Result<ProcessingActivity>> AddAsync(ProcessingActivity activity, CancellationToken ct = default)',
              summary: 'Register a processing activity.',
              isAsync: true,
            },
            {
              name: 'ListAsync',
              signature: 'Task<IReadOnlyList<ProcessingActivity>> ListAsync(CancellationToken ct = default)',
              summary: 'All registered activities.',
              isAsync: true,
            },
            {
              name: 'RemoveAsync',
              signature: 'Task<Result> RemoveAsync(Guid activityId, CancellationToken ct = default)',
              summary: 'Remove an activity from the register.',
              isAsync: true,
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Audit.Models',
      summary: 'Breach and processing-activity models.',
      types: [
        {
          slug: 'data-breach-record',
          name: 'DataBreachRecord',
          displayName: 'DataBreachRecord',
          kind: 'record',
          namespace: 'StangaNetLib.Gdpr.Audit.Models',
          summary: 'Tracks a breach from discovery through notification obligations.',
          signature: 'public sealed record DataBreachRecord',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get', summary: 'Breach id.' },
            { name: 'DetectedAt', type: 'DateTimeOffset', access: 'get', summary: 'UTC discovery time.' },
            { name: 'NotificationDeadlineAt', type: 'DateTimeOffset', access: 'get', summary: '72-hour Art. 33 deadline.' },
            { name: 'Severity', type: 'DataBreachSeverity', access: 'get', summary: 'Risk classification.' },
            { name: 'Description', type: 'string', access: 'get', summary: 'Nature and scope of the breach.' },
            { name: 'DataCategories', type: 'IReadOnlyList<string>', access: 'get', summary: 'Categories of data involved.' },
            { name: 'AffectedSubjectsCount', type: 'int', access: 'get', summary: 'Approximate subjects affected (−1 if unknown).' },
          ],
        },
        {
          slug: 'data-breach-severity',
          name: 'DataBreachSeverity',
          displayName: 'DataBreachSeverity',
          kind: 'enum',
          namespace: 'StangaNetLib.Gdpr.Audit.Models',
          summary: 'Risk-based severity for Art. 33/34 notification duties.',
          signature: 'public enum DataBreachSeverity',
          enumValues: [
            { name: 'Low', value: 1, summary: 'Unlikely to result in risk to rights and freedoms.' },
            { name: 'Medium', value: 2, summary: 'Risk requiring authority notification (Art. 33).' },
            { name: 'High', value: 3, summary: 'High risk requiring authority and subject notification (Art. 33/34).' },
          ],
        },
        {
          slug: 'processing-activity',
          name: 'ProcessingActivity',
          displayName: 'ProcessingActivity',
          kind: 'record',
          namespace: 'StangaNetLib.Gdpr.Audit.Models',
          summary: 'RoPA entry: purpose, lawful basis, categories, recipients, retention.',
          signature: 'public sealed record ProcessingActivity',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get', summary: 'Activity id.' },
            { name: 'Name', type: 'string', access: 'get', summary: 'Short name of the processing.' },
            { name: 'Purpose', type: 'string', access: 'get', summary: 'Purpose of processing.' },
            { name: 'LawfulBasis', type: 'LawfulBasis', access: 'get', summary: 'Art. 6 basis.' },
            { name: 'DataSubjectCategories', type: 'IReadOnlyList<string>', access: 'get', summary: 'Categories of data subjects.' },
            { name: 'DataCategories', type: 'IReadOnlyList<string>', access: 'get', summary: 'Categories of personal data.' },
            { name: 'Recipients', type: 'IReadOnlyList<string>', access: 'get', summary: 'Recipients / categories of recipients.' },
            { name: 'RetentionPolicy', type: 'string', access: 'get', summary: 'Retention description or period.' },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Pseudonymization',
      summary: 'AES-256-GCM pseudonymization and SHA-256 anonymization.',
      types: [
        {
          slug: 'ipseudonymization-service',
          name: 'IPseudonymizationService',
          displayName: 'IPseudonymizationService',
          kind: 'interface',
          namespace: 'StangaNetLib.Gdpr.Pseudonymization.Abstractions',
          summary: 'Reversible pseudonymization and irreversible anonymization helpers.',
          signature: 'public interface IPseudonymizationService',
          methods: [
            {
              name: 'Encrypt',
              signature: 'string Encrypt(string plaintext)',
              summary: 'AES-256-GCM encrypt; returns base64 (nonce | tag | ciphertext).',
            },
            {
              name: 'Decrypt',
              signature: 'string Decrypt(string ciphertext)',
              summary: 'Decrypt a value produced by Encrypt.',
            },
            {
              name: 'Anonymize',
              signature: 'string Anonymize(string value)',
              summary: 'Irreversible SHA-256 hex digest of the value.',
            },
          ],
        },
        {
          slug: 'pseudonymization-service',
          name: 'PseudonymizationService',
          displayName: 'PseudonymizationService',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Pseudonymization',
          summary:
            'Default IPseudonymizationService. Requires GdprSettings.PseudonymizationKey as base64 of exactly 32 bytes.',
          signature: 'public sealed class PseudonymizationService : IPseudonymizationService',
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Configuration',
      summary: 'Options bound from appsettings.',
      types: [
        {
          slug: 'gdpr-settings',
          name: 'GdprSettings',
          displayName: 'GdprSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Configuration',
          summary: 'Controller identity and cryptographic key (section GdprSettings).',
          signature: 'public sealed class GdprSettings',
          fields: [
            {
              name: 'SectionName',
              type: 'string',
              summary: 'appsettings section key.',
              value: '"GdprSettings"',
            },
          ],
          properties: [
            { name: 'DataControllerName', type: 'string', access: 'get; set', summary: 'Name of the data controller.' },
            { name: 'DpoEmail', type: 'string', access: 'get; set', summary: 'Data Protection Officer contact email.' },
            { name: 'SupervisoryAuthorityName', type: 'string', access: 'get; set', summary: 'Competent supervisory authority name.' },
            { name: 'SupervisoryAuthorityUrl', type: 'string', access: 'get; set', summary: 'Authority information URL.' },
            { name: 'PseudonymizationKey', type: 'string', access: 'get; set', summary: 'Base64 32-byte key for AES-256-GCM.' },
          ],
        },
        {
          slug: 'data-retention-settings',
          name: 'DataRetentionSettings',
          displayName: 'DataRetentionSettings',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Configuration',
          summary: 'Retention periods for scheduled cleanup jobs (section DataRetentionSettings).',
          signature: 'public sealed class DataRetentionSettings',
          properties: [
            { name: 'InactiveUserDays', type: 'int', access: 'get; set', summary: 'Days before inactive users are cleaned up.' },
            { name: 'DeletedUserDays', type: 'int', access: 'get; set', summary: 'Days to retain soft-deleted user rows.' },
            { name: 'MessageDays', type: 'int', access: 'get; set', summary: 'Days to retain messages / communications.' },
            { name: 'AuditLogDays', type: 'int', access: 'get; set', summary: 'Days to retain audit log entries.' },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Gdpr.Infrastructure.Extensions',
      summary: 'DI and middleware registration.',
      types: [
        {
          slug: 'service-collection-extensions',
          name: 'ServiceCollectionExtensions',
          displayName: 'ServiceCollectionExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Infrastructure.Extensions',
          summary:
            'Binds GdprSettings / DataRetentionSettings and registers PseudonymizationService. Host must register domain service implementations.',
          signature: 'public static class ServiceCollectionExtensions',
          methods: [
            {
              name: 'AddStangaNetLibGdpr',
              signature:
                'public static IServiceCollection AddStangaNetLibGdpr(this IServiceCollection services, IConfiguration configuration)',
              summary: 'Configure options and register the default pseudonymization service.',
              isStatic: true,
            },
          ],
          example: {
            title: 'Register and add middleware',
            code: `builder.Services.AddStangaNetLibGdpr(builder.Configuration);
// Register host implementations: IConsentRepository, IDsarService, …

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseStangaNetLibGdpr();              // ConsentValidationMiddleware
app.UseStangaNetLibGdprRestrictions();  // ProcessingRestrictionMiddleware`,
          },
        },
        {
          slug: 'application-builder-extensions',
          name: 'ApplicationBuilderExtensions',
          displayName: 'ApplicationBuilderExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Gdpr.Infrastructure.Extensions',
          summary: 'Adds GDPR middleware after routing and authentication.',
          signature: 'public static class ApplicationBuilderExtensions',
          methods: [
            {
              name: 'UseStangaNetLibGdpr',
              signature:
                'public static IApplicationBuilder UseStangaNetLibGdpr(this IApplicationBuilder app)',
              summary: 'ConsentValidationMiddleware for RequireConsentAttribute (HTTP 403).',
              isStatic: true,
            },
            {
              name: 'UseStangaNetLibGdprRestrictions',
              signature:
                'public static IApplicationBuilder UseStangaNetLibGdprRestrictions(this IApplicationBuilder app)',
              summary: 'ProcessingRestrictionMiddleware for RequireNoRestrictionAttribute (HTTP 451).',
              isStatic: true,
            },
          ],
        },
      ],
    },
  ],
};
