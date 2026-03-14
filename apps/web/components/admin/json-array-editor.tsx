'use client';

import { Button, Input } from '@/components/ui';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea';
}

interface JsonArrayEditorProps {
  value: Record<string, any>[];
  onChange: (value: Record<string, any>[]) => void;
  itemFields: FieldConfig[];
  addLabel?: string;
}

export function JsonArrayEditor({ value, onChange, itemFields, addLabel = 'Add Item' }: JsonArrayEditorProps) {
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    const empty: Record<string, any> = {};
    itemFields.forEach((f) => (empty[f.key] = ''));
    onChange([...items, empty]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, val: string) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    onChange(updated);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Item {index + 1}
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
          {itemFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={item[field.key] || ''}
                  onChange={(e) => updateItem(index, field.key, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <Input
                  value={item[field.key] || ''}
                  onChange={(e) => updateItem(index, field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="w-4 h-4" />
        {addLabel}
      </Button>
    </div>
  );
}
