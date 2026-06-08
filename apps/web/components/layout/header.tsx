import { fetchCmsPage } from '@/lib/page-metadata';
import { HeaderClient } from './header-client';
import { DEFAULT_LOGO_TEXT, DEFAULT_NAV, type NavItem } from './header-nav';

interface HeaderProps {
  className?: string;
}

// Server component: fetches CMS site-settings server-side (SSR + ISR with
// on-publish revalidation via the 'cms' tag) so the logo and navigation are in
// the initial HTML — better SEO and no client-side flash of defaults.
export async function Header({ className }: HeaderProps) {
  const content = (await fetchCmsPage('site-settings')) as Record<string, any> | null;

  const logoText = content?.logoText || DEFAULT_LOGO_TEXT;
  const navItems: NavItem[] =
    content?.navigation?.items && Array.isArray(content.navigation.items)
      ? content.navigation.items
      : DEFAULT_NAV;

  return <HeaderClient logoText={logoText} navItems={navItems} className={className} />;
}
