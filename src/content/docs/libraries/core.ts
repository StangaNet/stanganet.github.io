import type { LibraryDoc } from '../types';

export const coreLibrary: LibraryDoc = {
  slug: 'core',
  name: 'StangaNetLib.Core',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Clean Architecture and DDD primitives for .NET domain layers',
  description:
    'Foundation library for domain-driven design and Clean Architecture: entities, aggregate roots, value objects, specifications, explicit Result types, guards, pagination, auditing, and domain events. Depends on Microsoft.Extensions.Options for settings validation via SettingsValidatorBase<TOptions>; all other building blocks avoid heavy infrastructure coupling.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Core',
  namespaces: [
    {
      name: 'StangaNetLib.Core.Common',
      summary: 'Entities, aggregate roots, structured errors, Result types, and unit-of-work abstraction.',
      types: [
        {
          slug: 'entity',
          name: 'Entity',
          displayName: 'Entity',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Common',
          summary:
            'Convenience base class for domain entities keyed by Guid. A new Guid is generated when using the parameterless constructor.',
          signature: 'public abstract class Entity : Entity<Guid>',
          inherits: 'Entity<Guid>',
          constructors: [
            {
              name: 'Entity',
              signature: 'protected Entity()',
              summary: 'Creates a new entity with a randomly generated Guid.',
            },
            {
              name: 'Entity',
              signature: 'protected Entity(Guid id)',
              summary: 'Creates an entity with a specific Guid (for example when rehydrating from persistence).',
              parameters: [{ name: 'id', type: 'Guid', description: 'The entity identifier.' }],
            },
          ],
          example: {
            title: 'Derive a Guid-keyed entity',
            code: 'public sealed class Customer : Entity\n{\n    public string Email { get; private set; }\n\n    public Customer(string email)\n    {\n        Email = Guard.Against.NullOrWhiteSpace(email, nameof(email));\n    }\n}',
          },
        },
        {
          slug: 'entity-tid',
          name: 'Entity',
          displayName: 'Entity<TId>',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Common',
          summary:
            'Base class for domain entities identified by TId. Provides Id, creation and update timestamps, and identity-based equality.',
          remarks:
            'For aggregate roots that raise domain events, derive from AggregateRoot<TId> instead of Entity<TId>.',
          signature: 'public abstract class Entity<TId> where TId : notnull',
          typeParameters: [
            { name: 'TId', constraint: 'notnull', description: "The type of the entity's identifier." },
          ],
          properties: [
            { name: 'Id', type: 'TId', access: 'get; protected set', summary: 'Entity identifier.' },
            {
              name: 'CreatedAt',
              type: 'DateTimeOffset',
              access: 'get; protected set',
              summary: 'UTC timestamp of creation.',
            },
            {
              name: 'UpdatedAt',
              type: 'DateTimeOffset?',
              access: 'get; protected set',
              summary: 'UTC timestamp of last update. Null until the first mutation.',
            },
          ],
          constructors: [
            {
              name: 'Entity',
              signature: 'protected Entity(TId id)',
              summary: 'Initialises the entity with the given identifier and sets CreatedAt to the current UTC time.',
              parameters: [{ name: 'id', type: 'TId', description: "The entity's identifier." }],
            },
          ],
          methods: [
            {
              name: 'MarkUpdated',
              signature: 'protected void MarkUpdated()',
              summary: 'Sets UpdatedAt to the current UTC time. Call at the end of mutating methods.',
            },
            {
              name: 'Equals',
              signature: 'public override bool Equals(object? obj)',
              summary:
                'Returns true when the other object is the same runtime type and shares the same Id.',
            },
            {
              name: 'GetHashCode',
              signature: 'public override int GetHashCode()',
              summary: 'Hash code derived from Id.',
            },
            {
              name: 'operator ==',
              signature: 'public static bool operator ==(Entity<TId>? left, Entity<TId>? right)',
              summary:
                'Returns true when both entities are null, or both are non-null and equal by type and Id.',
              isStatic: true,
            },
            {
              name: 'operator !=',
              signature: 'public static bool operator !=(Entity<TId>? left, Entity<TId>? right)',
              summary: 'Returns true when the two entities differ by type or identifier.',
              isStatic: true,
            },
          ],
        },
        {
          slug: 'aggregate-root',
          name: 'AggregateRoot',
          displayName: 'AggregateRoot',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Common',
          summary: 'Convenience base class for aggregate roots keyed by Guid.',
          signature: 'public abstract class AggregateRoot : AggregateRoot<Guid>',
          inherits: 'AggregateRoot<Guid>',
          constructors: [
            {
              name: 'AggregateRoot',
              signature: 'protected AggregateRoot()',
              summary: 'Creates a new aggregate root with a randomly generated Guid.',
            },
            {
              name: 'AggregateRoot',
              signature: 'protected AggregateRoot(Guid id)',
              summary: 'Creates an aggregate root with a specific Guid (for example when rehydrating from persistence).',
              parameters: [{ name: 'id', type: 'Guid', description: 'The aggregate identifier.' }],
            },
          ],
        },
        {
          slug: 'aggregate-root-tid',
          name: 'AggregateRoot',
          displayName: 'AggregateRoot<TId>',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Common',
          summary:
            'DDD aggregate root base. Extends Entity<TId> with a domain event collection. Only aggregate roots should raise and own domain events.',
          signature: 'public abstract class AggregateRoot<TId> : Entity<TId> where TId : notnull',
          inherits: 'Entity<TId>',
          typeParameters: [{ name: 'TId', constraint: 'notnull', description: 'Identifier type.' }],
          properties: [
            {
              name: 'DomainEvents',
              type: 'IReadOnlyCollection<DomainEvent>',
              access: 'get',
              summary: 'Domain events raised during this operation, to be dispatched after persistence.',
            },
          ],
          constructors: [
            {
              name: 'AggregateRoot',
              signature: 'protected AggregateRoot(TId id)',
              summary: 'Initialises a new aggregate root with the given identifier.',
              parameters: [{ name: 'id', type: 'TId', description: "The aggregate root's identifier." }],
            },
          ],
          methods: [
            {
              name: 'AddDomainEvent',
              signature: 'protected void AddDomainEvent(DomainEvent domainEvent)',
              summary: 'Raises a domain event to be dispatched after the operation completes.',
              parameters: [{ name: 'domainEvent', type: 'DomainEvent', description: 'The event to enqueue.' }],
            },
            {
              name: 'RemoveDomainEvent',
              signature: 'protected void RemoveDomainEvent(DomainEvent domainEvent)',
              summary:
                'Removes a specific domain event from the pending list (for example to cancel a side effect before persistence).',
              parameters: [{ name: 'domainEvent', type: 'DomainEvent', description: 'The event to remove.' }],
            },
            {
              name: 'ClearDomainEvents',
              signature: 'public void ClearDomainEvents()',
              summary: 'Clears all pending domain events (typically after the dispatcher has handled them).',
            },
          ],
          example: {
            title: 'Raise a domain event',
            code: 'public sealed class Order : AggregateRoot\n{\n    public void Confirm()\n    {\n        AddDomainEvent(new OrderConfirmed(Id));\n        MarkUpdated();\n    }\n}',
          },
        },
        {
          slug: 'error-type',
          name: 'ErrorType',
          displayName: 'ErrorType',
          kind: 'enum',
          namespace: 'StangaNetLib.Core.Common',
          summary:
            'Discriminates the category of an Error without string parsing. Consumers can map values to HTTP status codes or other outcomes.',
          signature: 'public enum ErrorType',
          enumValues: [
            { name: 'None', value: 0, summary: 'Used only by Error.None — not a real failure.' },
            { name: 'Validation', value: 1, summary: 'One or more input values did not pass domain validation.' },
            { name: 'NotFound', value: 2, summary: 'A requested resource was not found.' },
            { name: 'Conflict', value: 3, summary: 'The operation conflicts with existing state (for example a duplicate).' },
            { name: 'Unauthorized', value: 4, summary: 'The caller is not authenticated.' },
            { name: 'Forbidden', value: 5, summary: 'The caller is authenticated but does not have permission.' },
            { name: 'Internal', value: 6, summary: 'An unexpected internal error occurred.' },
          ],
        },
        {
          slug: 'error',
          name: 'Error',
          displayName: 'Error',
          kind: 'record',
          namespace: 'StangaNetLib.Core.Common',
          summary: 'Structured error with a machine-readable Code, a human-readable Description, and an ErrorType.',
          signature: 'public sealed record Error(string Code, string Description, ErrorType Type = ErrorType.None)',
          fields: [
            {
              name: 'None',
              type: 'Error',
              summary: 'Represents the absence of an error (used internally by successful Results).',
              value: 'static readonly',
            },
          ],
          methods: [
            {
              name: 'Validation',
              signature: 'public static Error Validation(string field, string description)',
              summary: 'Creates a validation error; code is Validation.{field}.',
              isStatic: true,
              parameters: [
                { name: 'field', type: 'string', description: 'The field name that failed validation.' },
                { name: 'description', type: 'string', description: 'Human-readable description of the failure.' },
              ],
            },
            {
              name: 'NotFound',
              signature: 'public static Error NotFound(string resource, object id)',
              summary: 'Creates a not-found error; code is {resource}.NotFound.',
              isStatic: true,
              parameters: [
                { name: 'resource', type: 'string', description: 'The resource type (for example User, Order).' },
                { name: 'id', type: 'object', description: 'The identifier that was looked up.' },
              ],
            },
            {
              name: 'Conflict',
              signature: 'public static Error Conflict(string code, string description)',
              summary: 'Creates a conflict error (for example duplicate entity).',
              isStatic: true,
              parameters: [
                { name: 'code', type: 'string', description: 'Machine-readable error code.' },
                { name: 'description', type: 'string', description: 'Human-readable description.' },
              ],
            },
            {
              name: 'Unauthorized',
              signature: 'public static Error Unauthorized(string description = "Unauthorized access.")',
              summary: 'Creates an unauthorized error with code Auth.Unauthorized.',
              isStatic: true,
              parameters: [
                {
                  name: 'description',
                  type: 'string',
                  description: 'Human-readable reason.',
                  optional: true,
                },
              ],
            },
            {
              name: 'Forbidden',
              signature: 'public static Error Forbidden(string description = "Access forbidden.")',
              summary: 'Creates a forbidden error with code Auth.Forbidden.',
              isStatic: true,
              parameters: [
                {
                  name: 'description',
                  type: 'string',
                  description: 'Human-readable reason.',
                  optional: true,
                },
              ],
            },
            {
              name: 'Internal',
              signature: 'public static Error Internal(string description)',
              summary: 'Creates a generic internal error with code Internal.Error.',
              isStatic: true,
              parameters: [{ name: 'description', type: 'string', description: 'Human-readable description.' }],
            },
            {
              name: 'ToString',
              signature: 'public override string ToString()',
              summary: 'Returns the error formatted as [Code] Description.',
            },
          ],
        },
        {
          slug: 'result-t',
          name: 'Result',
          displayName: 'Result<T>',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Common',
          summary:
            'Represents the outcome of an operation that returns a value. Use Success and Failure factory methods instead of throwing for expected failures.',
          signature: 'public sealed class Result<T>',
          typeParameters: [{ name: 'T', description: 'The success value type.' }],
          properties: [
            { name: 'IsSuccess', type: 'bool', access: 'get', summary: 'True when the operation completed without errors.' },
            {
              name: 'IsFailure',
              type: 'bool',
              access: 'get',
              summary: 'True when the operation produced one or more errors.',
            },
            {
              name: 'Value',
              type: 'T?',
              access: 'get',
              summary: 'The result value. Only access when IsSuccess is true.',
            },
            {
              name: 'Error',
              type: 'Error',
              access: 'get',
              summary: 'The primary error. Error.None when successful.',
            },
            {
              name: 'Errors',
              type: 'IReadOnlyCollection<Error>',
              access: 'get',
              summary: 'All errors when multiple validation failures occur.',
            },
          ],
          methods: [
            {
              name: 'Success',
              signature: 'public static Result<T> Success(T value)',
              summary: 'Creates a successful result carrying the given value.',
              isStatic: true,
              parameters: [{ name: 'value', type: 'T', description: 'The value produced by the operation.' }],
            },
            {
              name: 'Failure',
              signature: 'public static Result<T> Failure(Error error)',
              summary: 'Creates a failed result with a single error.',
              isStatic: true,
              parameters: [{ name: 'error', type: 'Error', description: 'The error that caused the failure.' }],
            },
            {
              name: 'Failure',
              signature: 'public static Result<T> Failure(IEnumerable<Error> errors)',
              summary: 'Creates a failed result from multiple errors. The first error becomes Error.',
              isStatic: true,
              parameters: [{ name: 'errors', type: 'IEnumerable<Error>', description: 'All errors that caused the failure.' }],
            },
            {
              name: 'Failure',
              signature: 'public static Result<T> Failure(string errorDescription)',
              summary: 'Convenience overload for plain-text errors (code defaults to "Error").',
              isStatic: true,
              parameters: [{ name: 'errorDescription', type: 'string', description: 'Plain-text description.' }],
            },
            {
              name: 'Match',
              signature: 'public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<Error, TResult> onFailure)',
              summary: 'Executes onSuccess if successful, onFailure with the primary error otherwise.',
              parameters: [
                { name: 'onSuccess', type: 'Func<T, TResult>', description: 'Invoked with the value on success.' },
                { name: 'onFailure', type: 'Func<Error, TResult>', description: 'Invoked with the primary error on failure.' },
              ],
            },
            {
              name: 'MatchAll',
              signature:
                'public TResult MatchAll<TResult>(Func<T, TResult> onSuccess, Func<IReadOnlyCollection<Error>, TResult> onFailure)',
              summary:
                'Like Match, but the failure branch receives the full error collection (for multiple validation errors).',
              parameters: [
                { name: 'onSuccess', type: 'Func<T, TResult>', description: 'Invoked with the value on success.' },
                {
                  name: 'onFailure',
                  type: 'Func<IReadOnlyCollection<Error>, TResult>',
                  description: 'Invoked with all errors on failure.',
                },
              ],
            },
            {
              name: 'Map',
              signature: 'public Result<TNext> Map<TNext>(Func<T, TNext> map)',
              summary: 'Transforms the value if successful; propagates failure otherwise.',
              parameters: [{ name: 'map', type: 'Func<T, TNext>', description: 'Projection applied to the success value.' }],
            },
            {
              name: 'MapAsync',
              signature: 'public Task<Result<TNext>> MapAsync<TNext>(Func<T, Task<TNext>> map)',
              summary: 'Asynchronously transforms the value if successful; propagates failure otherwise.',
              isAsync: true,
              parameters: [{ name: 'map', type: 'Func<T, Task<TNext>>', description: 'Async projection applied to the success value.' }],
            },
            {
              name: 'Bind',
              signature: 'public Result<TNext> Bind<TNext>(Func<T, Result<TNext>> bind)',
              summary: 'Chains another Result-returning operation if successful.',
              parameters: [{ name: 'bind', type: 'Func<T, Result<TNext>>', description: 'Operation to invoke with the success value.' }],
            },
            {
              name: 'BindAsync',
              signature: 'public Task<Result<TNext>> BindAsync<TNext>(Func<T, Task<Result<TNext>>> bind)',
              summary: 'Asynchronously chains another Result-returning operation if successful.',
              isAsync: true,
              parameters: [
                { name: 'bind', type: 'Func<T, Task<Result<TNext>>>', description: 'Async operation to invoke with the success value.' },
              ],
            },
            {
              name: 'Bind',
              signature: 'public Result Bind(Func<T, Result> bind)',
              summary: 'Chains a void Result-returning operation if successful.',
              parameters: [{ name: 'bind', type: 'Func<T, Result>', description: 'Void operation to invoke with the success value.' }],
            },
            {
              name: 'BindAsync',
              signature: 'public Task<Result> BindAsync(Func<T, Task<Result>> bind)',
              summary: 'Asynchronously chains a void Result-returning operation if successful.',
              isAsync: true,
              parameters: [{ name: 'bind', type: 'Func<T, Task<Result>>', description: 'Async void operation to invoke with the success value.' }],
            },
            {
              name: 'Ensure',
              signature: 'public Result<T> Ensure(Func<T, bool> predicate, Error error)',
              summary: 'Returns a failure if the predicate is false on the success value; otherwise returns this result unchanged.',
              parameters: [
                { name: 'predicate', type: 'Func<T, bool>', description: 'Condition the success value must satisfy.' },
                { name: 'error', type: 'Error', description: 'Error returned when the predicate is false.' },
              ],
            },
            {
              name: 'EnsureAsync',
              signature: 'public Task<Result<T>> EnsureAsync(Func<T, Task<bool>> predicate, Error error)',
              summary: 'Asynchronously evaluates the predicate on the success value; fails if it returns false.',
              isAsync: true,
              parameters: [
                { name: 'predicate', type: 'Func<T, Task<bool>>', description: 'Async condition the success value must satisfy.' },
                { name: 'error', type: 'Error', description: 'Error returned when the predicate is false.' },
              ],
            },
            {
              name: 'Tap',
              signature: 'public Result<T> Tap(Action<T> action)',
              summary: 'Executes a side effect on success without altering the result.',
              parameters: [{ name: 'action', type: 'Action<T>', description: 'Side effect to execute with the success value.' }],
            },
            {
              name: 'TapAsync',
              signature: 'public Task<Result<T>> TapAsync(Func<T, Task> action)',
              summary: 'Asynchronously executes a side effect on success without altering the result.',
              isAsync: true,
              parameters: [{ name: 'action', type: 'Func<T, Task>', description: 'Async side effect to execute with the success value.' }],
            },
            {
              name: 'TapError',
              signature: 'public Result<T> TapError(Action<Error> action)',
              summary: 'Executes a side effect on failure with the primary error without altering the result.',
              parameters: [{ name: 'action', type: 'Action<Error>', description: 'Side effect to execute with the primary error.' }],
            },
            {
              name: 'TapError',
              signature: 'public Result<T> TapError(Action<IReadOnlyCollection<Error>> action)',
              summary: 'Executes a side effect on failure with all errors without altering the result.',
              parameters: [
                {
                  name: 'action',
                  type: 'Action<IReadOnlyCollection<Error>>',
                  description: 'Side effect to execute with the full error collection.',
                },
              ],
            },
            {
              name: 'TapErrorAsync',
              signature: 'public Task<Result<T>> TapErrorAsync(Func<Error, Task> action)',
              summary: 'Asynchronously executes a side effect on failure with the primary error.',
              isAsync: true,
              parameters: [{ name: 'action', type: 'Func<Error, Task>', description: 'Async side effect to execute with the primary error.' }],
            },
            {
              name: 'MapError',
              signature: 'public Result<T> MapError(Func<Error, Error> mapError)',
              summary: 'Transforms the primary error if the result is a failure; propagates success unchanged.',
              parameters: [{ name: 'mapError', type: 'Func<Error, Error>', description: 'Projection applied to the primary error.' }],
            },
            {
              name: 'MapErrors',
              signature: 'public Result<T> MapErrors(Func<IReadOnlyCollection<Error>, IEnumerable<Error>> mapErrors)',
              summary: 'Transforms all errors if the result is a failure; propagates success unchanged.',
              parameters: [
                {
                  name: 'mapErrors',
                  type: 'Func<IReadOnlyCollection<Error>, IEnumerable<Error>>',
                  description: 'Projection applied to the full error collection.',
                },
              ],
            },
            {
              name: 'implicit operator Result<T>',
              signature: 'public static implicit operator Result<T>(T value)',
              summary: 'Allows returning a value directly where Result<T> is expected. Throws if value is null.',
              isStatic: true,
            },
            {
              name: 'implicit operator Result<T>',
              signature: 'public static implicit operator Result<T>(Error error)',
              summary: 'Allows returning an Error directly where Result<T> is expected.',
              isStatic: true,
            },
          ],
          example: {
            title: 'Compose typed results',
            code: 'Result<Order> result = await LoadOrderAsync(id)\n    .BindAsync(order => order.Confirm())\n    .TapAsync(o => _bus.PublishAsync(new OrderConfirmed(o.Id)));\n\nreturn result.Match(\n    onSuccess: o => Results.Ok(o.Id),\n    onFailure: e => Results.BadRequest(e.Description));',
          },
        },
        {
          slug: 'result',
          name: 'Result',
          displayName: 'Result',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Common',
          summary: 'Represents the outcome of an operation that does not return a value.',
          signature: 'public sealed class Result',
          properties: [
            { name: 'IsSuccess', type: 'bool', access: 'get', summary: 'True when the operation completed without errors.' },
            {
              name: 'IsFailure',
              type: 'bool',
              access: 'get',
              summary: 'True when the operation produced one or more errors.',
            },
            {
              name: 'Error',
              type: 'Error',
              access: 'get',
              summary: 'The primary error. Error.None when successful.',
            },
            {
              name: 'Errors',
              type: 'IReadOnlyCollection<Error>',
              access: 'get',
              summary: 'All errors when multiple validation failures occur.',
            },
          ],
          methods: [
            {
              name: 'Success',
              signature: 'public static Result Success()',
              summary: 'Creates a successful void result.',
              isStatic: true,
            },
            {
              name: 'Failure',
              signature: 'public static Result Failure(Error error)',
              summary: 'Creates a failed result with a single error.',
              isStatic: true,
              parameters: [{ name: 'error', type: 'Error', description: 'The error that caused the failure.' }],
            },
            {
              name: 'Failure',
              signature: 'public static Result Failure(IEnumerable<Error> errors)',
              summary: 'Creates a failed result from multiple errors. The first error becomes Error.',
              isStatic: true,
              parameters: [{ name: 'errors', type: 'IEnumerable<Error>', description: 'All errors that caused the failure.' }],
            },
            {
              name: 'Failure',
              signature: 'public static Result Failure(string errorDescription)',
              summary: 'Convenience overload for plain-text errors (code defaults to "Error").',
              isStatic: true,
              parameters: [{ name: 'errorDescription', type: 'string', description: 'Plain-text description.' }],
            },
            {
              name: 'Match',
              signature: 'public TResult Match<TResult>(Func<TResult> onSuccess, Func<Error, TResult> onFailure)',
              summary: 'Executes onSuccess if successful, onFailure with the primary error otherwise.',
              parameters: [
                { name: 'onSuccess', type: 'Func<TResult>', description: 'Invoked on success.' },
                { name: 'onFailure', type: 'Func<Error, TResult>', description: 'Invoked with the primary error on failure.' },
              ],
            },
            {
              name: 'MatchAll',
              signature:
                'public TResult MatchAll<TResult>(Func<TResult> onSuccess, Func<IReadOnlyCollection<Error>, TResult> onFailure)',
              summary: 'Like Match, but the failure branch receives the full error collection.',
              parameters: [
                { name: 'onSuccess', type: 'Func<TResult>', description: 'Invoked on success.' },
                {
                  name: 'onFailure',
                  type: 'Func<IReadOnlyCollection<Error>, TResult>',
                  description: 'Invoked with all errors on failure.',
                },
              ],
            },
            {
              name: 'AsResult',
              signature: 'public Result<T> AsResult<T>(T value)',
              summary: 'Wraps this Result into a typed Result with the given value on success.',
              parameters: [{ name: 'value', type: 'T', description: 'The value to wrap on success.' }],
            },
            {
              name: 'implicit operator Result',
              signature: 'public static implicit operator Result(Error error)',
              summary: 'Allows returning an Error directly where Result is expected.',
              isStatic: true,
            },
            {
              name: 'Tap',
              signature: 'public Result Tap(Action action)',
              summary: 'Executes a side effect on success without altering the result.',
              parameters: [{ name: 'action', type: 'Action', description: 'Side effect to execute on success.' }],
            },
            {
              name: 'TapAsync',
              signature: 'public Task<Result> TapAsync(Func<Task> action)',
              summary: 'Asynchronously executes a side effect on success without altering the result.',
              isAsync: true,
              parameters: [{ name: 'action', type: 'Func<Task>', description: 'Async side effect to execute on success.' }],
            },
            {
              name: 'TapError',
              signature: 'public Result TapError(Action<Error> action)',
              summary: 'Executes a side effect on failure with the primary error without altering the result.',
              parameters: [{ name: 'action', type: 'Action<Error>', description: 'Side effect to execute with the primary error.' }],
            },
            {
              name: 'TapError',
              signature: 'public Result TapError(Action<IReadOnlyCollection<Error>> action)',
              summary: 'Executes a side effect on failure with all errors without altering the result.',
              parameters: [
                {
                  name: 'action',
                  type: 'Action<IReadOnlyCollection<Error>>',
                  description: 'Side effect to execute with the full error collection.',
                },
              ],
            },
            {
              name: 'TapErrorAsync',
              signature: 'public Task<Result> TapErrorAsync(Func<Error, Task> action)',
              summary: 'Asynchronously executes a side effect on failure with the primary error.',
              isAsync: true,
              parameters: [{ name: 'action', type: 'Func<Error, Task>', description: 'Async side effect with the primary error.' }],
            },
            {
              name: 'Bind',
              signature: 'public Result Bind(Func<Result> bind)',
              summary: 'Chains another void Result-returning operation if successful.',
              parameters: [{ name: 'bind', type: 'Func<Result>', description: 'Operation to invoke on success.' }],
            },
            {
              name: 'BindAsync',
              signature: 'public Task<Result> BindAsync(Func<Task<Result>> bind)',
              summary: 'Asynchronously chains another void Result-returning operation if successful.',
              isAsync: true,
              parameters: [{ name: 'bind', type: 'Func<Task<Result>>', description: 'Async operation to invoke on success.' }],
            },
            {
              name: 'Combine',
              signature: 'public static Result Combine(params Result[] results)',
              summary: 'Combines multiple void results. Succeeds only when all inputs succeed; otherwise aggregates every error.',
              isStatic: true,
              parameters: [{ name: 'results', type: 'Result[]', description: 'The results to combine.' }],
            },
            {
              name: 'Combine',
              signature: 'public static Result<IReadOnlyList<T>> Combine<T>(params Result<T>[] results)',
              summary: 'Combines multiple typed results into Result<IReadOnlyList<T>> with all values or all collected errors.',
              isStatic: true,
              parameters: [{ name: 'results', type: 'Result<T>[]', description: 'The typed results to combine.' }],
            },
          ],
        },
        {
          slug: 'iunit-of-work',
          name: 'IUnitOfWork',
          displayName: 'IUnitOfWork',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Common',
          summary:
            'Abstracts database transaction management. Implement in the Infrastructure layer (for example wrapping EF Core DbContext transactions).',
          signature: 'public interface IUnitOfWork',
          methods: [
            {
              name: 'SaveChangesAsync',
              signature: 'Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)',
              summary: 'Persists all pending changes to the underlying store.',
              isAsync: true,
              returns: 'The number of state entries written to the store.',
              parameters: [
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'BeginTransactionAsync',
              signature: 'Task BeginTransactionAsync(CancellationToken cancellationToken = default)',
              summary: 'Begins an explicit transaction.',
              isAsync: true,
              parameters: [
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'CommitTransactionAsync',
              signature: 'Task CommitTransactionAsync(CancellationToken cancellationToken = default)',
              summary: 'Commits the current transaction.',
              isAsync: true,
              parameters: [
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'RollbackTransactionAsync',
              signature: 'Task RollbackTransactionAsync(CancellationToken cancellationToken = default)',
              summary: 'Rolls back the current transaction.',
              isAsync: true,
              parameters: [
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Events',
      summary: 'Domain events and dispatch/handler contracts for post-persistence side effects.',
      types: [
        {
          slug: 'domain-event',
          name: 'DomainEvent',
          displayName: 'DomainEvent',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Events',
          summary: 'Base class for all domain events. Each instance receives a unique EventId and OccurredOn timestamp on creation.',
          signature: 'public abstract class DomainEvent',
          properties: [
            { name: 'EventId', type: 'Guid', access: 'get', summary: 'Unique identifier of this event instance.' },
            { name: 'OccurredOn', type: 'DateTime', access: 'get', summary: 'UTC timestamp when the event occurred.' },
          ],
          example: {
            title: 'Define a domain event',
            code: 'public sealed class OrderConfirmed : DomainEvent\n{\n    public Guid OrderId { get; }\n\n    public OrderConfirmed(Guid orderId) => OrderId = orderId;\n}',
          },
        },
        {
          slug: 'idomain-event-handler',
          name: 'IDomainEventHandler',
          displayName: 'IDomainEventHandler<TEvent>',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Events',
          summary:
            'Handles a specific domain event type. Register implementations in DI; the dispatcher resolves and invokes them.',
          signature: 'public interface IDomainEventHandler<TEvent> where TEvent : DomainEvent',
          typeParameters: [{ name: 'TEvent', constraint: 'DomainEvent', description: 'The domain event type this handler processes.' }],
          methods: [
            {
              name: 'HandleAsync',
              signature: 'Task HandleAsync(TEvent domainEvent, CancellationToken cancellationToken = default)',
              summary: 'Handles the domain event.',
              isAsync: true,
              parameters: [
                { name: 'domainEvent', type: 'TEvent', description: 'The event to handle.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
          ],
        },
        {
          slug: 'idomain-event-dispatcher',
          name: 'IDomainEventDispatcher',
          displayName: 'IDomainEventDispatcher',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Events',
          summary: 'Dispatches domain events to their registered handlers. Implement in the Infrastructure layer.',
          signature: 'public interface IDomainEventDispatcher',
          methods: [
            {
              name: 'DispatchAsync',
              signature: 'Task DispatchAsync<TEvent>(TEvent domainEvent, CancellationToken cancellationToken = default) where TEvent : DomainEvent',
              summary: 'Dispatches a single typed event to all registered handlers.',
              isAsync: true,
              parameters: [
                { name: 'domainEvent', type: 'TEvent', description: 'The event to dispatch.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'DispatchManyAsync',
              signature: 'Task DispatchManyAsync(IEnumerable<DomainEvent> domainEvents, CancellationToken cancellationToken = default)',
              summary: 'Dispatches a collection of events (for example all events raised by an aggregate).',
              isAsync: true,
              parameters: [
                { name: 'domainEvents', type: 'IEnumerable<DomainEvent>', description: 'The events to dispatch in order.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Exceptions',
      summary: 'Domain-level exception base type.',
      types: [
        {
          slug: 'domain-exception',
          name: 'DomainException',
          displayName: 'DomainException',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Exceptions',
          summary: 'Base class for all domain exceptions. Derive project-specific exceptions from this type.',
          signature: 'public abstract class DomainException : Exception',
          inherits: 'Exception',
          constructors: [
            {
              name: 'DomainException',
              signature: 'protected DomainException(string message)',
              summary: 'Initialises a new domain exception with a descriptive message.',
              parameters: [{ name: 'message', type: 'string', description: 'Human-readable description of the domain rule violation.' }],
            },
            {
              name: 'DomainException',
              signature: 'protected DomainException(string message, Exception innerException)',
              summary: 'Initialises a new domain exception wrapping an inner exception.',
              parameters: [
                { name: 'message', type: 'string', description: 'Human-readable description of the domain rule violation.' },
                { name: 'innerException', type: 'Exception', description: 'The underlying exception that caused this domain error.' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Guards',
      summary: 'Defensive guard clauses for method arguments and invariants at API boundaries.',
      types: [
        {
          slug: 'guard',
          name: 'Guard',
          displayName: 'Guard',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Guards',
          summary: 'Provides guard clauses for defensive programming. Usage: Guard.Against.Null(value, nameof(value));',
          remarks:
            'All guard methods are defined on the nested static class Guard.Against. Each method returns the validated value for fluent assignment.',
          signature: 'public static class Guard',
          methods: [
            {
              name: 'Against.Null',
              signature: 'public static T Null<T>(T? value, string parameterName) where T : class',
              summary: 'Throws ArgumentNullException if value is null.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'T?', description: 'The value to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
              returns: 'The non-null value.',
            },
            {
              name: 'Against.Null',
              signature: 'public static T Null<T>(T? value, string parameterName) where T : struct',
              summary: 'Throws ArgumentNullException if the nullable struct has no value.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'T?', description: 'The nullable struct to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
              returns: 'The unwrapped value.',
            },
            {
              name: 'Against.NullOrEmpty',
              signature: 'public static string NullOrEmpty(string? value, string parameterName)',
              summary: 'Throws ArgumentException if the string is null or empty.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'string?', description: 'The string to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.NullOrWhiteSpace',
              signature: 'public static string NullOrWhiteSpace(string? value, string parameterName)',
              summary: 'Throws ArgumentException if the string is null, empty, or whitespace-only.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'string?', description: 'The string to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.Default',
              signature: 'public static T Default<T>(T value, string parameterName) where T : struct',
              summary: 'Throws ArgumentException if value equals default(T) (for example 0 for int or Guid.Empty).',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'T', description: 'The value to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.EmptyGuid',
              signature: 'public static Guid EmptyGuid(Guid value, string parameterName)',
              summary: 'Throws ArgumentException if value is Guid.Empty.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'Guid', description: 'The Guid to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.Negative',
              signature: 'public static T Negative<T>(T value, string parameterName) where T : INumber<T>',
              summary: 'Throws ArgumentOutOfRangeException if value is negative.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'T', description: 'The numeric value to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.NegativeOrZero',
              signature: 'public static T NegativeOrZero<T>(T value, string parameterName) where T : INumber<T>',
              summary: 'Throws ArgumentOutOfRangeException if value is zero or negative.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'T', description: 'The numeric value to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.OutOfRange',
              signature: 'public static T OutOfRange<T>(T value, string parameterName, T min, T max) where T : IComparable<T>',
              summary: 'Throws ArgumentOutOfRangeException if value is outside the inclusive [min, max] range.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'T', description: 'The value to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
                { name: 'min', type: 'T', description: 'Inclusive lower bound.' },
                { name: 'max', type: 'T', description: 'Inclusive upper bound.' },
              ],
            },
            {
              name: 'Against.NullOrEmpty',
              signature: 'public static IReadOnlyList<T> NullOrEmpty<T>(IEnumerable<T>? value, string parameterName)',
              summary:
                'Throws ArgumentException if the collection is null or empty. Materializes the sequence to avoid double enumeration.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'IEnumerable<T>?', description: 'The collection to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.TooLong',
              signature: 'public static string TooLong(string value, string parameterName, int maxLength)',
              summary: 'Throws ArgumentException if the string exceeds maxLength characters.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'string', description: 'The string to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
                { name: 'maxLength', type: 'int', description: 'Maximum allowed length (inclusive).' },
              ],
            },
            {
              name: 'Against.TooShort',
              signature: 'public static string TooShort(string value, string parameterName, int minLength)',
              summary: 'Throws ArgumentException if the string is shorter than minLength characters.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'string', description: 'The string to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
                { name: 'minLength', type: 'int', description: 'Minimum required length (inclusive).' },
              ],
            },
            {
              name: 'Against.Matches',
              signature: 'public static string Matches(string value, string parameterName, Regex pattern)',
              summary:
                'Throws ArgumentException if the string does not match pattern. Prefer a pre-compiled Regex instance.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'string', description: 'The string to check (must not be null or whitespace).' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
                { name: 'pattern', type: 'Regex', description: 'The compiled regex the value must match.' },
              ],
            },
            {
              name: 'Against.InvalidEnum',
              signature: 'public static TEnum InvalidEnum<TEnum>(TEnum value, string parameterName) where TEnum : struct, Enum',
              summary: 'Throws ArgumentOutOfRangeException if value is not a defined member of TEnum.',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'TEnum', description: 'The enum value to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
              ],
            },
            {
              name: 'Against.LengthBetween',
              signature: 'public static string LengthBetween(string value, string parameterName, int minLength, int maxLength)',
              summary: 'Throws ArgumentException if the string length is outside [minLength, maxLength].',
              isStatic: true,
              parameters: [
                { name: 'value', type: 'string', description: 'The string to check.' },
                { name: 'parameterName', type: 'string', description: 'Parameter name used in the exception message.' },
                { name: 'minLength', type: 'int', description: 'Minimum required length (inclusive).' },
                { name: 'maxLength', type: 'int', description: 'Maximum allowed length (inclusive).' },
              ],
            },
          ],
          example: {
            title: 'Validate arguments at the boundary',
            code: 'public void PlaceOrder(string customerId, IReadOnlyList<OrderLine> lines)\n{\n    customerId = Guard.Against.NullOrWhiteSpace(customerId, nameof(customerId));\n    lines = Guard.Against.NullOrEmpty(lines, nameof(lines));\n}',
          },
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Specifications',
      summary: 'Specification pattern for encapsulating query criteria, includes, ordering, and paging.',
      types: [
        {
          slug: 'ispecification',
          name: 'ISpecification',
          displayName: 'ISpecification<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Specifications',
          summary:
            'Encapsulates a query criterion that can be applied to a collection of T, with optional includes, ordering, and paging.',
          signature: 'public interface ISpecification<T>',
          typeParameters: [{ name: 'T', description: 'The entity type being queried.' }],
          properties: [
            { name: 'Criteria', type: 'Expression<Func<T, bool>>', access: 'get', summary: 'The filter expression to apply to the query.' },
            {
              name: 'Includes',
              type: 'IReadOnlyList<Expression<Func<T, object>>>',
              access: 'get',
              summary: 'Navigation properties to eager-load.',
            },
            {
              name: 'OrderBy',
              type: 'Expression<Func<T, object>>?',
              access: 'get',
              summary: 'Ascending ordering expression, or null if none.',
            },
            {
              name: 'OrderByDescending',
              type: 'Expression<Func<T, object>>?',
              access: 'get',
              summary: 'Descending ordering expression, or null if none.',
            },
            { name: 'Take', type: 'int', access: 'get', summary: 'Number of items to take when paging is enabled.' },
            { name: 'Skip', type: 'int', access: 'get', summary: 'Number of items to skip when paging is enabled.' },
            { name: 'IsPagingEnabled', type: 'bool', access: 'get', summary: 'True when paging parameters have been applied.' },
          ],
          methods: [
            {
              name: 'IsSatisfiedBy',
              signature: 'bool IsSatisfiedBy(T entity)',
              summary: 'Evaluates the specification against an in-memory entity (for unit testing).',
              parameters: [{ name: 'entity', type: 'T', description: 'The entity to evaluate.' }],
              returns: 'True when the entity satisfies the criteria.',
            },
          ],
        },
        {
          slug: 'base-specification',
          name: 'BaseSpecification',
          displayName: 'BaseSpecification<T>',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Specifications',
          summary: 'Base implementation of ISpecification<T>. Derive concrete specifications in the Domain layer.',
          signature: 'public abstract class BaseSpecification<T> : ISpecification<T>',
          implements: ['ISpecification<T>'],
          typeParameters: [{ name: 'T', description: 'The entity type this specification filters.' }],
          constructors: [
            {
              name: 'BaseSpecification',
              signature: 'protected BaseSpecification(Expression<Func<T, bool>> criteria)',
              summary: 'Initialises the specification with the given filter expression.',
              parameters: [{ name: 'criteria', type: 'Expression<Func<T, bool>>', description: 'The LINQ predicate entities must satisfy.' }],
            },
          ],
          methods: [
            {
              name: 'AddInclude',
              signature: 'protected void AddInclude(Expression<Func<T, object>> includeExpression)',
              summary: 'Adds an eager-load navigation expression to Includes.',
              parameters: [{ name: 'includeExpression', type: 'Expression<Func<T, object>>', description: 'Navigation property to include.' }],
            },
            {
              name: 'ApplyOrderBy',
              signature: 'protected void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)',
              summary: 'Sets ascending ordering and clears any descending order.',
              parameters: [{ name: 'orderByExpression', type: 'Expression<Func<T, object>>', description: 'Property to order by ascending.' }],
            },
            {
              name: 'ApplyOrderByDescending',
              signature: 'protected void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescExpression)',
              summary: 'Sets descending ordering and clears any ascending order.',
              parameters: [{ name: 'orderByDescExpression', type: 'Expression<Func<T, object>>', description: 'Property to order by descending.' }],
            },
            {
              name: 'ApplyPaging',
              signature: 'protected void ApplyPaging(int skip, int take)',
              summary: 'Enables paging and sets the skip/take window.',
              parameters: [
                { name: 'skip', type: 'int', description: 'Number of items to skip.' },
                { name: 'take', type: 'int', description: 'Number of items to return.' },
              ],
            },
            {
              name: 'IsSatisfiedBy',
              signature: 'public bool IsSatisfiedBy(T entity)',
              summary: 'Evaluates the specification in memory; compiles and caches the criteria expression.',
              parameters: [{ name: 'entity', type: 'T', description: 'The entity to evaluate.' }],
            },
          ],
          example: {
            title: 'Build a domain specification',
            code: 'public sealed class ActiveCustomers : BaseSpecification<Customer>\n{\n    public ActiveCustomers() : base(c => c.IsActive)\n    {\n        ApplyOrderBy(c => c.CreatedAt);\n    }\n}',
          },
        },
        {
          slug: 'specification-extensions',
          name: 'SpecificationExtensions',
          displayName: 'SpecificationExtensions',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Specifications',
          summary:
            'Extension methods for composing specifications with Boolean operators. Combined specs carry filter criteria only; includes, ordering, and paging are not inherited.',
          signature: 'public static class SpecificationExtensions',
          methods: [
            {
              name: 'And',
              signature: 'public static ISpecification<T> And<T>(this ISpecification<T> left, ISpecification<T> right)',
              summary: 'Returns a specification satisfied when both left and right are satisfied (EF Core-translatable AND).',
              isStatic: true,
              parameters: [
                { name: 'left', type: 'ISpecification<T>', description: 'The first specification.' },
                { name: 'right', type: 'ISpecification<T>', description: 'The second specification.' },
              ],
            },
            {
              name: 'Or',
              signature: 'public static ISpecification<T> Or<T>(this ISpecification<T> left, ISpecification<T> right)',
              summary: 'Returns a specification satisfied when either left or right is satisfied (EF Core-translatable OR).',
              isStatic: true,
              parameters: [
                { name: 'left', type: 'ISpecification<T>', description: 'The first specification.' },
                { name: 'right', type: 'ISpecification<T>', description: 'The second specification.' },
              ],
            },
            {
              name: 'Not',
              signature: 'public static ISpecification<T> Not<T>(this ISpecification<T> spec)',
              summary: 'Returns a specification satisfied when spec is not satisfied (EF Core-translatable NOT).',
              isStatic: true,
              parameters: [{ name: 'spec', type: 'ISpecification<T>', description: 'The specification to negate.' }],
            },
          ],
          example: {
            title: 'Combine specifications',
            code: 'var spec = new ActiveCustomers()\n    .And(new CreatedAfter(DateTimeOffset.UtcNow.AddDays(-30)));',
          },
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Repositories',
      summary: 'Generic repository contracts for entities keyed by TId or Guid.',
      types: [
        {
          slug: 'irepository',
          name: 'IRepository',
          displayName: 'IRepository<T, TId>',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Repositories',
          summary:
            'Generic repository contract for entities keyed by TId. Extend in the Domain layer to add domain-specific query methods.',
          signature: 'public interface IRepository<T, TId> where T : Entity<TId> where TId : notnull',
          typeParameters: [
            { name: 'T', constraint: 'Entity<TId>', description: 'The entity type managed by this repository.' },
            { name: 'TId', constraint: 'notnull', description: "The type of the entity's identifier." },
          ],
          methods: [
            {
              name: 'GetByIdAsync',
              signature: 'Task<T?> GetByIdAsync(TId id, CancellationToken cancellationToken = default)',
              summary: 'Retrieves an entity by its identifier, or null if not found.',
              isAsync: true,
              parameters: [
                { name: 'id', type: 'TId', description: 'The identifier to look up.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'GetAllAsync',
              signature: 'Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)',
              summary: 'Retrieves all entities. Use with caution on large collections.',
              isAsync: true,
              parameters: [
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'FindAsync',
              signature: 'Task<IEnumerable<T>> FindAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)',
              summary: 'Returns all entities that satisfy the specification.',
              isAsync: true,
              parameters: [
                { name: 'spec', type: 'ISpecification<T>', description: 'Filter, includes, and ordering.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'FindOneAsync',
              signature: 'Task<T?> FindOneAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)',
              summary: 'Returns the first entity that satisfies the specification, or null.',
              isAsync: true,
              parameters: [
                { name: 'spec', type: 'ISpecification<T>', description: 'The filter criteria.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'CountAsync',
              signature: 'Task<int> CountAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)',
              summary: 'Returns the total number of entities that satisfy the specification.',
              isAsync: true,
              parameters: [
                { name: 'spec', type: 'ISpecification<T>', description: 'The filter criteria.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'AddAsync',
              signature: 'Task AddAsync(T entity, CancellationToken cancellationToken = default)',
              summary: 'Adds a new entity (does not persist until SaveChanges).',
              isAsync: true,
              parameters: [
                { name: 'entity', type: 'T', description: 'The entity to add.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'UpdateAsync',
              signature: 'Task UpdateAsync(T entity, CancellationToken cancellationToken = default)',
              summary: 'Marks an entity as modified (does not persist until SaveChanges).',
              isAsync: true,
              parameters: [
                { name: 'entity', type: 'T', description: 'The entity with updated values.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'DeleteAsync',
              signature: 'Task DeleteAsync(T entity, CancellationToken cancellationToken = default)',
              summary: 'Removes an entity (does not persist until SaveChanges).',
              isAsync: true,
              parameters: [
                { name: 'entity', type: 'T', description: 'The entity to remove.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'ExistsAsync',
              signature: 'Task<bool> ExistsAsync(TId id, CancellationToken cancellationToken = default)',
              summary: 'Returns true if an entity with the given id exists.',
              isAsync: true,
              parameters: [
                { name: 'id', type: 'TId', description: 'The identifier to check.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'ExistsBySpecAsync',
              signature: 'Task<bool> ExistsBySpecAsync(ISpecification<T> spec, CancellationToken cancellationToken = default)',
              summary: 'Returns true if at least one entity satisfies the specification.',
              isAsync: true,
              parameters: [
                { name: 'spec', type: 'ISpecification<T>', description: 'The filter criteria.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'AddRangeAsync',
              signature: 'Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)',
              summary: 'Adds multiple entities in bulk (does not persist until SaveChanges).',
              isAsync: true,
              parameters: [
                { name: 'entities', type: 'IEnumerable<T>', description: 'The entities to add.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'DeleteRangeAsync',
              signature: 'Task DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)',
              summary: 'Removes multiple entities in bulk (does not persist until SaveChanges).',
              isAsync: true,
              parameters: [
                { name: 'entities', type: 'IEnumerable<T>', description: 'The entities to remove.' },
                { name: 'cancellationToken', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
          ],
        },
        {
          slug: 'irepository-t',
          name: 'IRepository',
          displayName: 'IRepository<T>',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Repositories',
          summary: 'Convenience alias for repositories whose entities are keyed by Guid and derive from Entity.',
          signature: 'public interface IRepository<T> : IRepository<T, Guid> where T : Entity',
          implements: ['IRepository<T, Guid>'],
          typeParameters: [{ name: 'T', constraint: 'Entity', description: 'The Guid-keyed entity type.' }],
          seeAlso: ['irepository'],
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Pagination',
      summary: 'Paging input parameters and a paged result wrapper with navigation metadata.',
      types: [
        {
          slug: 'pagination-params',
          name: 'PaginationParams',
          displayName: 'PaginationParams',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Pagination',
          summary: 'Input parameters for paginated queries. PageSize is automatically capped at MaxPageSize.',
          signature: 'public sealed class PaginationParams',
          fields: [
            {
              name: 'DefaultPageSize',
              type: 'int',
              summary: 'Default number of items per page when none is specified.',
              value: '20',
            },
            {
              name: 'MaxPageSize',
              type: 'int',
              summary: 'Maximum number of items per page that will be honoured.',
              value: '100',
            },
          ],
          properties: [
            {
              name: 'Page',
              type: 'int',
              access: 'get; set',
              summary: '1-based page number. Values below 1 are clamped to 1.',
            },
            {
              name: 'PageSize',
              type: 'int',
              access: 'get; set',
              summary: 'Number of items per page. Values are clamped to [1, MaxPageSize].',
            },
            {
              name: 'Skip',
              type: 'int',
              access: 'get',
              summary: 'Number of items to skip, derived from Page and PageSize.',
            },
          ],
        },
        {
          slug: 'paged-result',
          name: 'PagedResult',
          displayName: 'PagedResult<T>',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Pagination',
          summary: 'Wraps a paginated collection of items with page metadata.',
          signature: 'public sealed class PagedResult<T>',
          typeParameters: [{ name: 'T', description: 'The item type.' }],
          properties: [
            { name: 'Items', type: 'IReadOnlyCollection<T>', access: 'get', summary: 'The items in the current page.' },
            { name: 'Page', type: 'int', access: 'get', summary: 'Current page number (1-based).' },
            { name: 'PageSize', type: 'int', access: 'get', summary: 'Number of items per page.' },
            { name: 'TotalCount', type: 'int', access: 'get', summary: 'Total number of items across all pages.' },
            {
              name: 'TotalPages',
              type: 'int',
              access: 'get',
              summary: 'Total number of pages, derived from TotalCount and PageSize.',
            },
            { name: 'HasPreviousPage', type: 'bool', access: 'get', summary: 'True when Page is greater than 1.' },
            { name: 'HasNextPage', type: 'bool', access: 'get', summary: 'True when Page is less than TotalPages.' },
          ],
          constructors: [
            {
              name: 'PagedResult',
              signature: 'public PagedResult(IEnumerable<T> items, int page, int pageSize, int totalCount)',
              summary: 'Initialises a new paged result.',
              parameters: [
                { name: 'items', type: 'IEnumerable<T>', description: 'The items for the current page.' },
                { name: 'page', type: 'int', description: 'The current page number (1-based).' },
                { name: 'pageSize', type: 'int', description: 'The number of items per page.' },
                { name: 'totalCount', type: 'int', description: 'The total number of items across all pages.' },
              ],
            },
          ],
          methods: [
            {
              name: 'Empty',
              signature: 'public static PagedResult<T> Empty(int page = 1, int pageSize = PaginationParams.DefaultPageSize)',
              summary: 'Returns an empty paged result with TotalCount zero.',
              isStatic: true,
              parameters: [
                { name: 'page', type: 'int', description: 'The page number to record.', optional: true },
                { name: 'pageSize', type: 'int', description: 'The page size to record.', optional: true },
              ],
            },
            {
              name: 'Map',
              signature: 'public PagedResult<TTarget> Map<TTarget>(Func<T, TTarget> map)',
              summary: 'Projects each item to a new type while preserving pagination metadata.',
              parameters: [{ name: 'map', type: 'Func<T, TTarget>', description: 'Projection applied to each item.' }],
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.ValueObjects',
      summary: 'Value object base type with component-based equality.',
      types: [
        {
          slug: 'value-object',
          name: 'ValueObject',
          displayName: 'ValueObject',
          kind: 'class',
          namespace: 'StangaNetLib.Core.ValueObjects',
          summary:
            'Base class for DDD value objects. Equality is based on GetEqualityComponents(), not object reference.',
          signature: 'public abstract class ValueObject',
          methods: [
            {
              name: 'GetEqualityComponents',
              signature: 'protected abstract IEnumerable<object?> GetEqualityComponents()',
              summary: 'Returns all components that define equality (for example Amount and Currency for Money).',
            },
            {
              name: 'Equals',
              signature: 'public override bool Equals(object? obj)',
              summary: 'Structural equality by comparing equality components in order.',
            },
            {
              name: 'GetHashCode',
              signature: 'public override int GetHashCode()',
              summary: 'Hash code combining all equality components.',
            },
            {
              name: 'operator ==',
              signature: 'public static bool operator ==(ValueObject? left, ValueObject? right)',
              summary: 'Returns true when both value objects are equal by components, or both are null.',
              isStatic: true,
            },
            {
              name: 'operator !=',
              signature: 'public static bool operator !=(ValueObject? left, ValueObject? right)',
              summary: 'Returns true when the two value objects differ by at least one component.',
              isStatic: true,
            },
          ],
          example: {
            title: 'Money value object',
            code: 'public sealed class Money : ValueObject\n{\n    public decimal Amount { get; }\n    public string Currency { get; }\n\n    public Money(decimal amount, string currency)\n    {\n        Amount = amount;\n        Currency = Guard.Against.NullOrWhiteSpace(currency, nameof(currency));\n    }\n\n    protected override IEnumerable<object?> GetEqualityComponents()\n    {\n        yield return Amount;\n        yield return Currency;\n    }\n}',
          },
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Validators',
      summary: 'Domain validation results and Microsoft.Extensions.Options validators.',
      types: [
        {
          slug: 'validation-result',
          name: 'ValidationResult',
          displayName: 'ValidationResult',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Validators',
          summary:
            'Outcome of domain-level validation (not FluentValidation). Errors align with Result<T>.Errors.',
          signature: 'public sealed class ValidationResult',
          properties: [
            { name: 'IsSuccess', type: 'bool', access: 'get', summary: 'True when validation passed with no errors.' },
            {
              name: 'IsFailure',
              type: 'bool',
              access: 'get',
              summary: 'True when at least one validation error was recorded.',
            },
            {
              name: 'Errors',
              type: 'IReadOnlyCollection<Error>',
              access: 'get',
              summary: 'Structured errors consistent with Result<T>.Errors.',
            },
          ],
          methods: [
            {
              name: 'Success',
              signature: 'public static ValidationResult Success()',
              summary: 'Creates a successful validation result with no errors.',
              isStatic: true,
            },
            {
              name: 'Failure',
              signature: 'public static ValidationResult Failure(Error error)',
              summary: 'Creates a failure with a single structured error.',
              isStatic: true,
              parameters: [{ name: 'error', type: 'Error', description: 'The structured error.' }],
            },
            {
              name: 'Failure',
              signature: 'public static ValidationResult Failure(IEnumerable<Error> errors)',
              summary: 'Creates a failure from multiple structured errors.',
              isStatic: true,
              parameters: [{ name: 'errors', type: 'IEnumerable<Error>', description: 'All structured errors.' }],
            },
            {
              name: 'Failure',
              signature: 'public static ValidationResult Failure(string description)',
              summary: 'Creates a validation failure from a plain description (code defaults to "Validation").',
              isStatic: true,
              parameters: [{ name: 'description', type: 'string', description: 'Human-readable failure description.' }],
            },
            {
              name: 'Failure',
              signature: 'public static ValidationResult Failure(IEnumerable<string> descriptions)',
              summary: 'Creates a validation failure from multiple plain descriptions.',
              isStatic: true,
              parameters: [{ name: 'descriptions', type: 'IEnumerable<string>', description: 'Human-readable descriptions.' }],
            },
            {
              name: 'Combine',
              signature: 'public static ValidationResult Combine(params ValidationResult[] results)',
              summary: 'Combines multiple validation results. Succeeds only when all inputs succeed.',
              isStatic: true,
              parameters: [{ name: 'results', type: 'ValidationResult[]', description: 'Results to combine.' }],
            },
            {
              name: 'GetErrorMessage',
              signature: 'public string GetErrorMessage()',
              summary: 'Joins all error descriptions into a single semicolon-separated string.',
            },
            {
              name: 'ToResult',
              signature: 'public Result ToResult()',
              summary: 'Converts to a void Result for use in application use cases.',
            },
            {
              name: 'ToResult',
              signature: 'public Result<T> ToResult<T>()',
              summary: 'Converts to Result<T> on the failure path; throws InvalidOperationException on success.',
              exceptions: [
                {
                  type: 'InvalidOperationException',
                  when: 'This validation result is successful (a value is required for typed success).',
                },
              ],
            },
          ],
        },
        {
          slug: 'settings-validator-base',
          name: 'SettingsValidatorBase',
          displayName: 'SettingsValidatorBase<TOptions>',
          kind: 'class',
          namespace: 'StangaNetLib.Core.Validators',
          summary:
            'Base class for IValidateOptions<TOptions> implementations. Subclasses implement ValidateCore and append messages to the provided error list.',
          signature: 'public abstract class SettingsValidatorBase<TOptions> : IValidateOptions<TOptions> where TOptions : class',
          implements: ['IValidateOptions<TOptions>'],
          typeParameters: [{ name: 'TOptions', constraint: 'class', description: 'The options type being validated.' }],
          methods: [
            {
              name: 'Validate',
              signature: 'public ValidateOptionsResult Validate(string? name, TOptions options)',
              summary: 'Runs ValidateCore and returns ValidateOptionsResult.Success or Fail.',
              parameters: [
                { name: 'name', type: 'string?', description: 'Options name (may be null).' },
                { name: 'options', type: 'TOptions', description: 'The options instance to validate.' },
              ],
            },
            {
              name: 'ValidateCore',
              signature: 'protected abstract void ValidateCore(TOptions options, List<string> errors)',
              summary:
                'Override to add domain-specific validation rules. Append messages to errors; all rules are evaluated.',
              parameters: [
                { name: 'options', type: 'TOptions', description: 'The options instance to validate.' },
                { name: 'errors', type: 'List<string>', description: 'Collector for validation failure messages.' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'StangaNetLib.Core.Auditing',
      summary: 'Immutable audit trail entries and persistence contract.',
      types: [
        {
          slug: 'audit-entry',
          name: 'AuditEntry',
          displayName: 'AuditEntry',
          kind: 'record',
          namespace: 'StangaNetLib.Core.Auditing',
          summary: 'Single entry in an audit trail. Immutable once created.',
          signature: 'public sealed record AuditEntry',
          properties: [
            { name: 'Id', type: 'Guid', access: 'get; init', summary: 'Unique identifier of this audit entry (auto-generated).' },
            { name: 'UserId', type: 'string', access: 'get; init', summary: 'Subject of the action (user whose data was processed).' },
            {
              name: 'Action',
              type: 'string',
              access: 'get; init',
              summary: 'Action performed in dot-notation (for example data.export, consent.grant).',
            },
            {
              name: 'EntityType',
              type: 'string?',
              access: 'get; init',
              summary: 'Type of entity involved (for example User, Order), or null for generic actions.',
            },
            {
              name: 'EntityId',
              type: 'string?',
              access: 'get; init',
              summary: 'Identifier of the entity involved, or null for generic actions.',
            },
            { name: 'Details', type: 'string?', access: 'get; init', summary: 'Additional context in free-text or JSON format.' },
            { name: 'IpAddress', type: 'string?', access: 'get; init', summary: 'IP address of the actor who performed the action.' },
            { name: 'UserAgent', type: 'string?', access: 'get; init', summary: 'User-Agent of the actor.' },
            {
              name: 'OccurredAt',
              type: 'DateTimeOffset',
              access: 'get; init',
              summary: 'UTC timestamp when the action was performed (defaults to UtcNow at construction).',
            },
          ],
        },
        {
          slug: 'iaudit-service',
          name: 'IAuditService',
          displayName: 'IAuditService',
          kind: 'interface',
          namespace: 'StangaNetLib.Core.Auditing',
          summary:
            'Immutable audit trail for recording significant application events. The consuming project provides persistence (for example EF Core).',
          signature: 'public interface IAuditService',
          methods: [
            {
              name: 'LogAsync',
              signature:
                'Task LogAsync(string userId, string action, string? entityType = null, string? entityId = null, string? details = null, string? ipAddress = null, string? userAgent = null, CancellationToken ct = default)',
              summary: 'Appends a new entry to the audit log.',
              isAsync: true,
              parameters: [
                { name: 'userId', type: 'string', description: 'Identifier of the user whose data or action is recorded.' },
                { name: 'action', type: 'string', description: 'Dot-notation action name.' },
                { name: 'entityType', type: 'string?', description: 'Type of entity involved, if any.', optional: true },
                { name: 'entityId', type: 'string?', description: 'String identifier of the entity, if any.', optional: true },
                { name: 'details', type: 'string?', description: 'Additional context.', optional: true },
                { name: 'ipAddress', type: 'string?', description: 'Actor IP address.', optional: true },
                { name: 'userAgent', type: 'string?', description: 'Actor User-Agent.', optional: true },
                { name: 'ct', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'GetLogAsync',
              signature:
                'Task<IReadOnlyList<AuditEntry>> GetLogAsync(string userId, DateTimeOffset? from = null, DateTimeOffset? to = null, string? action = null, CancellationToken ct = default)',
              summary:
                'Retrieves audit entries for a user with optional date range and action prefix filter, ordered by OccurredAt descending.',
              isAsync: true,
              parameters: [
                { name: 'userId', type: 'string', description: 'User whose audit entries to retrieve.' },
                { name: 'from', type: 'DateTimeOffset?', description: 'Inclusive lower bound on OccurredAt.', optional: true },
                { name: 'to', type: 'DateTimeOffset?', description: 'Inclusive upper bound on OccurredAt.', optional: true },
                { name: 'action', type: 'string?', description: 'Prefix filter on Action.', optional: true },
                { name: 'ct', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
            {
              name: 'DeleteExpiredAsync',
              signature: 'Task<int> DeleteExpiredAsync(int retentionDays, CancellationToken ct = default)',
              summary: 'Deletes audit entries older than retentionDays for scheduled retention cleanup.',
              isAsync: true,
              returns: 'The number of deleted entries.',
              parameters: [
                { name: 'retentionDays', type: 'int', description: 'Entries older than this many days are deleted.' },
                { name: 'ct', type: 'CancellationToken', description: 'Token to cancel the operation.', optional: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
