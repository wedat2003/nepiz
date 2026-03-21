// Storage utilities for client-side data persistence

export const LS_KEYS = {
  media: 'media',
  journey: 'journey',
  counters: 'counters',
  wishlist: 'wishlist',
  mapPlaces: 'mapPlaces',
  wheelItems: 'wheelItems',
  polaroids: 'polaroids',
  loginSession: 'loginSession',
};

export type StorageKey = keyof typeof LS_KEYS;

export function loadFromStorage<T>(key: StorageKey, defaultValue: T[] = []): T[] {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(LS_KEYS[key]);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: StorageKey, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEYS[key], JSON.stringify(data));
    window.dispatchEvent(new Event('local-storage'));
  } catch (e) {
    console.error(`Failed to save to storage: ${key}`, e);
  }
}

export function loadValueFromStorage<T>(key: StorageKey, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(LS_KEYS[key]);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveValueToStorage<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEYS[key], JSON.stringify(value));
    window.dispatchEvent(new Event('local-storage'));
  } catch (e) {
    console.error(`Failed to save value to storage: ${key}`, e);
  }
}

export function removeFromStorage(key: StorageKey): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LS_KEYS[key]);
    window.dispatchEvent(new Event('local-storage'));
  } catch (e) {
    console.error(`Failed to remove from storage: ${key}`, e);
  }
}

export async function hydrateLocalStorageFromCloud() {
  // GitHub Pages uses static export (no server/API routes).
  // Keep this async function as a no-op so existing callers remain valid.
  return;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function escapeHtml(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

// Type definitions
export interface Media {
  id: string;
  type: 'image' | 'video';
  data: string; // base64 or blob url
  name: string;
  width?: number;
  height?: number;
  createdAt: number;
}

export interface JourneyEntry {
  id: string;
  title: string;
  date: string;
  text: string;
  placeId?: string;
  location?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  imageUrl?: string;
  createdAt: number;
}

export interface Counter {
  id: string;
  title: string;
  targetLocal: string;
  mode: 'countdown' | 'countup';
  createdAt: number;
}

export interface Wish {
  id: string;
  title: string;
  note?: string;
  done: boolean;
  createdAt: number;
}

export interface WheelItem {
  id: string;
  text: string;
  createdAt: number;
}

export interface MapPlace {
  id: string;
  name: string;
  note?: string;
  lat: number;
  lng: number;
  createdAt: number;
}

export interface Polaroid {
  id: string;
  image: string;
  text: string;
  rotation: number;
  createdAt: number;
}
