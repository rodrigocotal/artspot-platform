'use client';

import { Button, Input } from '@/components/ui';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

interface NavEditorProps {
  value: NavItem[];
  onChange: (value: NavItem[]) => void;
}

export function NavEditor({ value, onChange }: NavEditorProps) {
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    onChange([...items, { label: '', href: '' }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, val: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  };

  const addDropdownItem = (navIndex: number) => {
    onChange(
      items.map((item, i) =>
        i === navIndex
          ? { ...item, dropdown: [...(item.dropdown || []), { label: '', href: '' }] }
          : item
      )
    );
  };

  const removeDropdownItem = (navIndex: number, dropIndex: number) => {
    onChange(
      items.map((item, i) => {
        if (i !== navIndex) return item;
        const dropdown = (item.dropdown || []).filter((_, j) => j !== dropIndex);
        return dropdown.length > 0 ? { ...item, dropdown } : { label: item.label, href: item.href };
      })
    );
  };

  const updateDropdownItem = (navIndex: number, dropIndex: number, field: string, val: string) => {
    onChange(
      items.map((item, i) => {
        if (i !== navIndex) return item;
        const dropdown = (item.dropdown || []).map((d, j) =>
          j === dropIndex ? { ...d, [field]: val } : d
        );
        return { ...item, dropdown };
      })
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nav Item {index + 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-error-500 hover:text-error-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Label</label>
              <Input value={item.label} onChange={(e) => updateItem(index, 'label', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Href</label>
              <Input value={item.href} onChange={(e) => updateItem(index, 'href', e.target.value)} />
            </div>
          </div>

          {/* Dropdown sub-items */}
          {item.dropdown && item.dropdown.length > 0 && (
            <div className="pl-4 border-l-2 border-neutral-300 space-y-2">
              <span className="text-xs font-medium text-neutral-500">Dropdown Items</span>
              {item.dropdown.map((sub, dropIndex) => (
                <div key={dropIndex} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-500 mb-1">Label</label>
                    <Input
                      value={sub.label}
                      onChange={(e) => updateDropdownItem(index, dropIndex, 'label', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-500 mb-1">Href</label>
                    <Input
                      value={sub.href}
                      onChange={(e) => updateDropdownItem(index, dropIndex, 'href', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDropdownItem(index, dropIndex)}
                    className="p-2 text-error-500 hover:text-error-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button type="button" variant="outline" size="sm" onClick={() => addDropdownItem(index)}>
            <Plus className="w-4 h-4" />
            Add Dropdown Item
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="w-4 h-4" />
        Add Nav Item
      </Button>
    </div>
  );
}
