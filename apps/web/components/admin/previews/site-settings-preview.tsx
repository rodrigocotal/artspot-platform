'use client';

import { ChevronDown } from 'lucide-react';

interface SiteSettingsPreviewProps {
  content: Record<string, any>;
}

export function SiteSettingsPreview({ content }: SiteSettingsPreviewProps) {
  const navItems = content.navigation?.items ?? (Array.isArray(content.navigation) ? content.navigation : []);

  return (
    <div className="bg-white min-h-[200px] font-sans text-sm">
      <div className="border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
        <span className="text-base font-serif font-bold text-neutral-900">
          {content.logoText || 'Logo'}
        </span>
        <nav className="flex items-center gap-4">
          {navItems.map((item: any, i: number) => (
            <span key={i} className="text-xs text-neutral-600 flex items-center gap-0.5">
              {item.label}
              {item.dropdown && item.dropdown.length > 0 && (
                <ChevronDown className="w-3 h-3" />
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="p-6 space-y-3">
        <div className="h-32 bg-neutral-50 rounded-lg flex items-center justify-center">
          <span className="text-xs text-neutral-400">Page content area</span>
        </div>
      </div>
    </div>
  );
}
