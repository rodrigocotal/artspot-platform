export type EditableSlugItem = string | { slug?: string; value?: string };

export function editableSlugList(
  value: EditableSlugItem[] | undefined,
  fallback: string[] = []
): string[] {
  const slugs = Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? item : item.slug || item.value || ''))
        .map((slug) => slug.trim())
        .filter(Boolean)
    : [];

  return slugs.length > 0 ? slugs : fallback;
}

export function orderBySlug<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  const itemBySlug = new Map(items.map((item) => [item.slug, item]));
  return slugs.map((slug) => itemBySlug.get(slug)).filter((item): item is T => Boolean(item));
}
