import {
  ARTALDO_HOME_DEFAULTS,
  ARTALDO_HOME_IMAGES,
  ARTALDO_SITE_SETTINGS,
  ARTALDO_WORKS,
} from '../artaldo-reference';

describe('ArtAldo reference content', () => {
  it('matches the Manus hero copy and calls to action', () => {
    expect(ARTALDO_HOME_DEFAULTS.heroHeadline).toBe('Modern & Contemporary Art —');
    expect(ARTALDO_HOME_DEFAULTS.heroAccent).toBe('Now Online');
    expect(ARTALDO_HOME_DEFAULTS.heroSubtitle).toBe(
      'Aldo Castillo | Art Dealer & Curatorial Director'
    );
    expect(ARTALDO_HOME_DEFAULTS.heroCtaText).toBe('Explore Artworks');
    expect(ARTALDO_HOME_DEFAULTS.heroSecondaryCtaText).toBe(
      'Schedule a Private Art Consultation'
    );
  });

  it('keeps the reference artwork set available for homepage fallback cards', () => {
    expect(ARTALDO_WORKS).toHaveLength(6);
    expect(ARTALDO_WORKS[0]).toMatchObject({
      artistName: 'Julio Emilio Neira Milian',
      title: 'The Great Catch (La Gran Cojida)',
      year: '2015',
      price: '$9,500',
    });
    expect(ARTALDO_WORKS[5]).toMatchObject({
      artistName: 'Lluís Barba',
      price: '$28,000',
    });
  });

  it('uses the Manus navigation labels and footer brand copy', () => {
    expect(ARTALDO_SITE_SETTINGS.logoText).toBe('ArtAldo');
    expect(ARTALDO_SITE_SETTINGS.navigation.items.map((item) => item.label)).toEqual([
      'Artworks',
      'Artists',
      'Collections',
      'Advisory',
      'About',
      'Contact',
    ]);
    expect(ARTALDO_SITE_SETTINGS.footerBrandDescription).toBe(
      'Curated contemporary art, selected with decades of expertise and personal guidance.'
    );
  });

  it('uses local asset paths for reference imagery', () => {
    expect(ARTALDO_HOME_IMAGES.logo).toBe('/artaldo/artaldo-logo.png');
    expect(ARTALDO_HOME_IMAGES.hero).toBe('/artaldo/art-basel-booth.jpeg');
    for (const work of ARTALDO_WORKS) {
      expect(work.imageUrl).toMatch(/^\/artaldo\//);
    }
  });
});
