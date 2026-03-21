'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { saveToStorage, generateId, type WheelItem } from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

export default function Wheel() {
  const items = useStoredCollection<WheelItem>('wheelItems', []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDelete = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    saveToStorage('wheelItems', updated);
  };

  const handleAdd = () => {
    const text = prompt('Item for the wheel:');
    if (!text) return;

    const newItem: WheelItem = {
      id: generateId(),
      text,
      createdAt: Date.now(),
    };

    const updated = [...items, newItem];
    saveToStorage('wheelItems', updated);
  };

  const handleSpin = () => {
    if (items.length === 0) return;
    const randomIndex = Math.floor(Math.random() * items.length);
    setSelectedIndex(randomIndex);
  };

  return (
    <main className="page-shell page-shell--narrow">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="pill mb-2">Wheel</div>
          <h1 className="text-4xl font-bold">Wheel</h1>
          <p className="mt-2 opacity-75">Let luck decide</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="btn">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button onClick={handleAdd} className="btn btnPrimary">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="hr" />

      {selectedIndex !== null && (
        <div className="mb-8 rounded-lg bg-green-500/20 p-6 text-center">
          <p className="text-lg font-bold text-green-300">Selected:</p>
          <p className="text-2xl font-bold">{items[selectedIndex].text}</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={items.length === 0}
        className="btn btnPrimary mb-8 w-full"
      >
        Spin
      </button>

      <div className="list">
        {items.length === 0 ? (
          <div className="muted">No items in the wheel. Add one!</div>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className={`item ${selectedIndex === idx ? 'border-green-500' : ''}`}>
              <div className="flex items-start justify-between">
                <p className="itemTitle">{item.text}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
