import type { LibraryDoc } from '../types';

export const moneyLibrary: LibraryDoc = {
  slug: 'money',
  name: 'StangaNetLib.Money',
  version: '1.0.0',
  targetFrameworks: ['net8.0', 'net9.0', 'net10.0'],
  tagline: 'Minor-unit Money value object with EUR-first arithmetic',
  description:
    'Safe monetary primitives for .NET: minor-unit (cents) Money value object with EUR-first arithmetic, allocate/split, parse/format. Depends on StangaNetLib.Core.',
  repository: 'https://github.com/StangaNet/StangaNetLib.Money',
  namespaces: [
    {
      name: 'StangaNetLib.Money.ValueObjects',
      summary: 'Types in StangaNetLib.Money.ValueObjects.',
      types: [
        {
          slug: 'money',
          name: 'Money',
          displayName: 'Money',
          kind: 'class',
          namespace: 'StangaNetLib.Money.ValueObjects',
          summary: 'Monetary amount stored as integer minor units (cents) plus an ISO 4217 currency code. Primary currency is EUR. Cross-currency arithmetic is rejected.',
          signature: 'public sealed class Money : ValueObject, IComparable<Money>',
          inherits: 'ValueObject',
          implements: ['IComparable<Money>'],
          properties: [
            { name: 'MinorUnits', type: 'long', access: 'get', summary: 'MinorUnits' },
            { name: 'CurrencyCode', type: 'string', access: 'get', summary: 'CurrencyCode' },
          ],
          methods: [
            { name: 'FromMinorUnits', signature: 'public static Result<Money> FromMinorUnits(long minorUnits, string currency = DefaultCurrency)', summary: 'FromMinorUnits', parameters: [{ name: 'minorUnits', type: 'long', description: 'minorUnits' }, { name: 'currency', type: 'string', description: 'currency', optional: true }], returns: 'Result<Money>', isStatic: true },
            { name: 'FromDecimal', signature: 'public static Result<Money> FromDecimal(decimal amount, string currency = DefaultCurrency)', summary: 'Creates money from a human decimal amount (e.g. 12.34 → 1234 cents). At most two fractional digits are allowed.', parameters: [{ name: 'amount', type: 'decimal', description: 'amount' }, { name: 'currency', type: 'string', description: 'currency', optional: true }], returns: 'Result<Money>', isStatic: true },
            { name: 'Parse', signature: 'public static Result<Money> Parse(string input, string? currency = null)', summary: 'Parses a human amount string. Accepts both 12,34 (IT) and 12.34 forms.', parameters: [{ name: 'input', type: 'string', description: 'input' }, { name: 'currency', type: 'string?', description: 'currency', optional: true }], returns: 'Result<Money>', isStatic: true },
            { name: 'ToMinorUnits', signature: 'public long ToMinorUnits()', summary: 'ToMinorUnits', returns: 'long' },
            { name: 'Add', signature: 'public Result<Money> Add(Money other)', summary: 'Add', parameters: [{ name: 'other', type: 'Money', description: 'other' }], returns: 'Result<Money>' },
            { name: 'Subtract', signature: 'public Result<Money> Subtract(Money other)', summary: 'Subtract', parameters: [{ name: 'other', type: 'Money', description: 'other' }], returns: 'Result<Money>' },
            { name: 'Multiply', signature: 'public Result<Money> Multiply(decimal factor)', summary: 'Multiplies by a decimal factor and rounds to the nearest minor unit using AwayFromZero.', parameters: [{ name: 'factor', type: 'decimal', description: 'factor' }], returns: 'Result<Money>' },
            { name: 'Allocate', signature: 'public Result<IReadOnlyList<Money>> Allocate(int parts)', summary: 'Splits this amount into parts equal shares. Remainder cents are assigned to the first shares so no cent is lost.', parameters: [{ name: 'parts', type: 'int', description: 'parts' }], returns: 'Result<IReadOnlyList<Money>>' },
            { name: 'Allocate', signature: 'public Result<IReadOnlyList<Money>> Allocate(IReadOnlyList<int> ratios)', summary: 'Splits this amount by positive integer ratios. Remainder cents go to the earliest shares.', parameters: [{ name: 'ratios', type: 'IReadOnlyList<int>', description: 'ratios' }], returns: 'Result<IReadOnlyList<Money>>' },
            { name: 'CompareTo', signature: 'public int CompareTo(Money? other)', summary: 'CompareTo', parameters: [{ name: 'other', type: 'Money?', description: 'other' }], returns: 'int' },
            { name: 'Format', signature: 'public string Format(CultureInfo? culture = null)', summary: 'Format', parameters: [{ name: 'culture', type: 'CultureInfo?', description: 'culture', optional: true }], returns: 'string' },
            { name: 'ToString', signature: 'public override string ToString()', summary: 'ToString', returns: 'string' },
            { name: 'GetEqualityComponents', signature: 'public override IEnumerable<object?> GetEqualityComponents()', summary: 'GetEqualityComponents', returns: 'IEnumerable<object?>' },
          ],
          fields: [
            { name: 'DefaultCurrency', type: 'string', summary: 'DefaultCurrency', value: '"EUR"' },
          ],
        }
      ],
    }
  ],
};
