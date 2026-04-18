import { resolveSeo } from '../seo';
import type { SeoInput } from '../seo';

describe('web resolveSeo', () => {
  const siteSettings: SeoInput = {
    _seo: {
      siteName: 'ArtAldo',
      defaultTitle: 'ArtAldo — Museum-Quality Art',
      defaultDescription: 'Default desc',
      defaultImage: { url: 'https://cdn/default.jpg', publicId: 'cms/default', alt: 'Default' },
    },
  };

  it('uses page._seo.title when present', () => {
    expect(resolveSeo({ _seo: { title: 'X' } }, siteSettings).title).toBe('X');
  });

  it('falls back through heroHeadline → headline → site default → hardcoded', () => {
    expect(resolveSeo({ heroHeadline: 'H' }, siteSettings).title).toBe('H');
    expect(resolveSeo({ headline: 'P' }, siteSettings).title).toBe('P');
    expect(resolveSeo({}, siteSettings).title).toBe('ArtAldo — Museum-Quality Art');
    expect(resolveSeo({}, null).title).toBe('ArtAldo');
  });

  it('resolves description and image with the same chain', () => {
    expect(resolveSeo({ heroSubtitle: 'S' }, siteSettings).description).toBe('S');
    expect(resolveSeo({}, siteSettings).image?.url).toBe('https://cdn/default.jpg');
    expect(resolveSeo({}, null).image).toBeUndefined();
  });

  it('treats empty strings as missing', () => {
    expect(resolveSeo({ _seo: { title: '' }, heroHeadline: 'H' }, siteSettings).title).toBe('H');
  });
});
