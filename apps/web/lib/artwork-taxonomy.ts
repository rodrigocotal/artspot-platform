export const ARTWORK_CATEGORIES = [
  { id: 'LATIN_AMERICAN_ART', label: 'Latin American Art' },
  { id: 'KINETIC_ART', label: 'Kinetic Art' },
  { id: 'OTHER', label: 'Other' },
] as const;

export function formatTaxonomyLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
