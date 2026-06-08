/**
 * True if the value is a Prisma cuid() — `c` followed by 24 base-36 chars.
 * Used to disambiguate an :id-or-slug route param. A plain `startsWith('c')`
 * check is wrong because many slugs start with "c" (ceramic-vase, contemporary-…),
 * which would then be looked up by id and 404 a valid record.
 */
export const isCuid = (value: string): boolean => /^c[a-z0-9]{24}$/.test(value);
