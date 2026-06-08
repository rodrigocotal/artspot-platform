'use client';

import { Input, Button } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

type FooterLink = { label: string; href: string };
type FooterNav = Record<string, FooterLink[]>;

const GROUPS: { key: string; label: string }[] = [
  { key: 'explore', label: 'Explore' },
  { key: 'artists', label: 'Artists' },
  { key: 'services', label: 'Services' },
  { key: 'company', label: 'Company' },
];

interface FooterNavEditorProps {
  value: FooterNav | null | undefined;
  onChange: (value: FooterNav) => void;
}

/**
 * Editor for the footer's grouped navigation columns. Stores an object of
 * { explore, artists, services, company } → array of { label, href }.
 */
export function FooterNavEditor({ value, onChange }: FooterNavEditorProps) {
  const nav: FooterNav = value ?? {};

  const setGroup = (groupKey: string, items: FooterLink[]) => {
    onChange({ ...nav, [groupKey]: items });
  };

  const updateLink = (groupKey: string, index: number, patch: Partial<FooterLink>) => {
    const items = [...(nav[groupKey] ?? [])];
    items[index] = { ...items[index], ...patch };
    setGroup(groupKey, items);
  };

  const addLink = (groupKey: string) => {
    setGroup(groupKey, [...(nav[groupKey] ?? []), { label: '', href: '' }]);
  };

  const removeLink = (groupKey: string, index: number) => {
    setGroup(groupKey, (nav[groupKey] ?? []).filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {GROUPS.map((group) => {
        const items = nav[group.key] ?? [];
        return (
          <div key={group.key} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-neutral-800">{group.label}</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => addLink(group.key)}>
                <Plus className="w-4 h-4 mr-1" />
                Add link
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-neutral-400">No links yet.</p>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item.label}
                      placeholder="Label"
                      onChange={(e) => updateLink(group.key, index, { label: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      value={item.href}
                      placeholder="/path"
                      onChange={(e) => updateLink(group.key, index, { href: e.target.value })}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(group.key, index)}
                      className="p-2 text-neutral-400 hover:text-error-600 transition-colors"
                      aria-label="Remove link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
