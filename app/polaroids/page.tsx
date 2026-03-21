'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { saveToStorage, generateId, type Polaroid } from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

export default function Polaroids() {
  const polaroids = useStoredCollection<Polaroid>(
    'polaroids',
    [],
    (a, b) => a.createdAt - b.createdAt,
  );

  const handleDelete = (id: string) => {
    const updated = polaroids.filter(p => p.id !== id);
    saveToStorage('polaroids', updated);
  };

  const handleAdd = () => {
    const text = prompt('Text for polaroid:');
    const newPolaroid: Polaroid = {
      id: generateId(),
      image: '',
      text: text || '',
      rotation: Math.random() * 4 - 2,
      createdAt: Date.now(),
    };

    const updated = [...polaroids, newPolaroid];
    saveToStorage('polaroids', updated);
  };

  return (
    <main className="page-shell">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="pill mb-2">Memory Book</div>
          <h1 className="text-4xl font-bold">Memory Book</h1>
          <p className="mt-2 opacity-75">Polaroids of our memories</p>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polaroids.length === 0 ? (
          <div className="col-span-full muted">No polaroids yet.</div>
        ) : (
          polaroids.map(p => (
            <div
              key={p.id}
              className="relative bg-white/95 p-4 shadow-lg"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <div className="bg-gray-200 aspect-square flex items-center justify-center rounded">
                <span className="text-gray-400">Image placeholder</span>
              </div>
              <p className="mt-3 font-handwriting text-center text-sm text-gray-700">
                {p.text}
              </p>
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute right-2 top-2 p-1 opacity-0 transition-opacity hover:opacity-100"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
