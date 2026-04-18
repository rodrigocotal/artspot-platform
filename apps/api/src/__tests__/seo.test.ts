import { resolveSeo } from '../lib/seo';
import type { SeoInput } from '../lib/seo';

describe('resolveSeo', () => {
  const siteSettings: SeoInput = {
    _seo: {
      siteName: 'ArtAldo',
      defaultTitle: 'ArtAldo — Museum-Quality Art',
      defaultDescription: 'Default desc',
      defaultImage: { url: 'https://cdn/default.jpg', publicId: 'cms/default', alt: 'Default' },
    },
  };

  it('uses page._seo.title when present', () => {
    const page: SeoInput = { _seo: { title: 'Page Title' } };
    const out = resolveSeo(page, siteSettings);
    expect(out.title).toBe('Page Title');
  });

  it('falls back to page.heroHeadline', () => {
    const page: SeoInput = { heroHeadline: 'Hero Head' };
    const out = resolveSeo(page, siteSettings);
    expect(out.title).toBe('Hero Head');
  });

  it('falls back to page.headline when heroHeadline missing', () => {
    const page: SeoInput = { headline: 'Plain Head' };
    const out = resolveSeo(page, siteSettings);
    expect(out.title).toBe('Plain Head');
  });

  it('falls back to site defaultTitle', () => {
    const page: SeoInput = {};
    const out = resolveSeo(page, siteSettings);
    expect(out.title).toBe('ArtAldo — Museum-Quality Art');
  });

  it('falls back to hardcoded "ArtAldo" when site settings null', () => {
    const out = resolveSeo({}, null);
    expect(out.title).toBe('ArtAldo');
  });

  it('treats empty string title as missing and falls through', () => {
    const page: SeoInput = { _seo: { title: '' }, heroHeadline: 'Hero Head' };
    const out = resolveSeo(page, siteSettings);
    expect(out.title).toBe('Hero Head');
  });

  it('resolves description from heroSubtitle → subtitle → site default', () => {
    expect(resolveSeo({ _seo: { description: 'D' } }, siteSettings).description).toBe('D');
    expect(resolveSeo({ heroSubtitle: 'H' }, siteSettings).description).toBe('H');
    expect(resolveSeo({ subtitle: 'S' }, siteSettings).description).toBe('S');
    expect(resolveSeo({}, siteSettings).description).toBe('Default desc');
    expect(resolveSeo({}, null).description).toBe('');
  });

  it('resolves image from page._seo.image → site defaultImage → undefined', () => {
    const pageImg = { url: 'https://cdn/page.jpg', publicId: 'cms/p', alt: 'P' };
    expect(resolveSeo({ _seo: { image: pageImg } }, siteSettings).image).toEqual(pageImg);
    expect(resolveSeo({}, siteSettings).image).toEqual(siteSettings._seo!.defaultImage);
    expect(resolveSeo({}, null).image).toBeUndefined();
  });

  it('returns siteName from site settings', () => {
    expect(resolveSeo({}, siteSettings).siteName).toBe('ArtAldo');
    expect(resolveSeo({}, null).siteName).toBe('ArtAldo');
  });
});
