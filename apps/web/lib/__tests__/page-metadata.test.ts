import { pageMetadata } from '../page-metadata';

describe('pageMetadata', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds Metadata with resolved title and description', async () => {
    const mock = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/pages/home')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: { content: { heroHeadline: 'H', heroSubtitle: 'S' } } }),
        });
      }
      if (url.endsWith('/pages/site-settings')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: { content: { _seo: { siteName: 'ArtAldo' } } },
          }),
        });
      }
      return Promise.resolve({ ok: false });
    });
    global.fetch = mock as any;

    const meta = await pageMetadata('home');
    expect(meta.title).toBe('H');
    expect(meta.description).toBe('S');
    expect(meta.openGraph?.siteName).toBe('ArtAldo');
    expect(meta.twitter && 'card' in meta.twitter && meta.twitter.card).toBe('summary_large_image');
  });

  it('falls back to hardcoded ArtAldo when everything is missing', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as any;

    const meta = await pageMetadata('home');
    expect(meta.title).toBe('ArtAldo');
    expect(meta.description).toBe('');
  });

  it('returns fallback when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as any;

    const meta = await pageMetadata('home');
    expect(meta.title).toBe('ArtAldo');
  });

  it('includes openGraph images when site default image present', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/pages/site-settings')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: {
              content: {
                _seo: {
                  defaultImage: { url: 'https://cdn/og.jpg', publicId: 'cms/og', alt: 'OG' },
                },
              },
            },
          }),
        });
      }
      return Promise.resolve({ ok: false });
    }) as any;

    const meta = await pageMetadata('any');
    const images = meta.openGraph?.images;
    expect(Array.isArray(images) ? images[0] : images).toMatchObject({ url: 'https://cdn/og.jpg' });
  });
});
