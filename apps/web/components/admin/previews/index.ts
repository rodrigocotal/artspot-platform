import { HomePreview } from './home-preview';
import { ContactPreview } from './contact-preview';
import { SiteSettingsPreview } from './site-settings-preview';
import { GenericPreview } from './generic-preview';

type PreviewFC = (props: { content: Record<string, any> }) => React.JSX.Element;

export const PREVIEW_COMPONENTS: Record<string, PreviewFC> = {
  home: HomePreview,
  contact: ContactPreview,
  'site-settings': SiteSettingsPreview,
};

export const DEFAULT_PREVIEW: PreviewFC = GenericPreview;

export { HomePreview, ContactPreview, SiteSettingsPreview, GenericPreview };
