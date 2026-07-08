import { formatTaxonomyLabel } from '../artwork-taxonomy';
import { editableSlugList, orderBySlug } from '../homepage-selections';

describe('homepage CMS selections', () => {
  it('normalizes CMS slug arrays from strings and editor objects', () => {
    expect(
      editableSlugList([
        'first-artwork',
        { slug: 'second-artwork' },
        { value: 'third-artwork' },
        { slug: ' ' },
      ])
    ).toEqual(['first-artwork', 'second-artwork', 'third-artwork']);
  });

  it('falls back when CMS slug array is empty', () => {
    expect(editableSlugList([], ['fallback-artwork'])).toEqual(['fallback-artwork']);
  });

  it('orders fetched records to match the CMS slug order', () => {
    const ordered = orderBySlug(
      [
        { slug: 'kinetic-art', title: 'Kinetic' },
        { slug: 'latin-american-art', title: 'Latin American' },
      ],
      ['latin-american-art', 'kinetic-art']
    );

    expect(ordered.map((item) => item.title)).toEqual(['Latin American', 'Kinetic']);
  });

  it('formats artwork taxonomy enum labels for display', () => {
    expect(formatTaxonomyLabel('LATIN_AMERICAN_ART')).toBe('Latin American Art');
  });
});
