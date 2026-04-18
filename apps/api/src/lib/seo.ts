export interface ImageFieldValue {
  url: string;
  publicId?: string;
  alt?: string;
  caption?: string;
  linkUrl?: string;
  visible?: boolean;
  width?: number;
  height?: number;
}

export interface PageSeoContent {
  title?: string;
  description?: string;
  image?: ImageFieldValue;
}

export interface SiteSeoContent {
  siteName?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultImage?: ImageFieldValue;
}

export interface SeoInput {
  _seo?: PageSeoContent & SiteSeoContent;
  heroHeadline?: string;
  heroSubtitle?: string;
  headline?: string;
  subtitle?: string;
  [key: string]: unknown;
}

export interface ResolvedSeo {
  title: string;
  description: string;
  image: ImageFieldValue | undefined;
  siteName: string;
}

const firstNonEmpty = (...vals: Array<string | undefined | null>): string | undefined => {
  for (const v of vals) if (typeof v === 'string' && v.trim() !== '') return v;
  return undefined;
};

export function resolveSeo(
  page: SeoInput | null | undefined,
  siteSettings: SeoInput | null | undefined,
): ResolvedSeo {
  const pageSeo = page?._seo ?? {};
  const siteSeo = siteSettings?._seo ?? {};

  const title =
    firstNonEmpty(pageSeo.title, page?.heroHeadline, page?.headline, siteSeo.defaultTitle) ??
    'ArtAldo';

  const description =
    firstNonEmpty(pageSeo.description, page?.heroSubtitle, page?.subtitle, siteSeo.defaultDescription) ??
    '';

  const image = pageSeo.image?.url ? pageSeo.image : siteSeo.defaultImage?.url ? siteSeo.defaultImage : undefined;

  const siteName = firstNonEmpty(siteSeo.siteName) ?? 'ArtAldo';

  return { title, description, image, siteName };
}
