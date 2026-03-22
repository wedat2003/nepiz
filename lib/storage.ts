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
const CLOUD_SESSION_KEY = 'cloudSession';

type CloudSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
};

type CloudAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: {
    id?: string;
  };
};

function getCloudConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return {
    url: url.replace(/\/+$/, ''),
    anonKey,
  };
}

function loadCloudSession(): CloudSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CLOUD_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CloudSession;
  } catch {
    return null;
  }
}

function saveCloudSession(session: CloudSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(session));
}

export function hasCloudSession() {
  return Boolean(loadCloudSession());
}

async function refreshCloudSessionIfNeeded(session: CloudSession): Promise<CloudSession | null> {
  const config = getCloudConfig();
  if (!config) return null;

  if (Date.now() < session.expiresAt - 30_000) {
    return session;
  }

  try {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: session.refreshToken,
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as CloudAuthResponse;
    const nextSession: CloudSession = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      userId: data.user?.id ?? session.userId,
    };
    saveCloudSession(nextSession);
    return nextSession;
  } catch {
    return null;
  }
}

async function getValidCloudSession() {
  const current = loadCloudSession();
  if (!current) return null;
  return refreshCloudSessionIfNeeded(current);
}

export async function signInToCloud(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getCloudConfig();
  if (!config) {
    return { ok: false, error: 'Cloud sync not configured.' };
  }

  try {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { ok: false, error: 'Cloud login failed.' };
    }

    const data = (await response.json()) as CloudAuthResponse;
    if (!data.access_token || !data.refresh_token || !data.user?.id) {
      return { ok: false, error: 'Cloud login returned invalid session.' };
    }

    saveCloudSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      userId: data.user.id,
    });

    return { ok: true };
  } catch {
    return { ok: false, error: 'Cloud login network error.' };
  }
}

export function signOutCloud() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CLOUD_SESSION_KEY);
}

async function syncCloudValue<T>(key: StorageKey, value: T) {
  if (key === 'loginSession') return;
  const session = await getValidCloudSession();
  const config = getCloudConfig();
  if (!session || !config) return;

  try {
    await fetch(`${config.url}/rest/v1/couple_data?on_conflict=owner,data_key`, {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify([
        {
          owner: session.userId,
          data_key: key,
          payload: value,
        },
      ]),
    });
  } catch {
    // keep local mode when cloud sync fails
  }
}

async function deleteCloudValue(key: StorageKey) {
  if (key === 'loginSession') return;
  const session = await getValidCloudSession();
  const config = getCloudConfig();
  if (!session || !config) return;

  try {
    await fetch(`${config.url}/rest/v1/couple_data?data_key=eq.${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  } catch {
    // keep local mode when cloud sync fails
  }
}

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
    void syncCloudValue(key, data);
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
    void syncCloudValue(key, value);
  } catch (e) {
    console.error(`Failed to save value to storage: ${key}`, e);
  }
}

export function removeFromStorage(key: StorageKey): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LS_KEYS[key]);
    window.dispatchEvent(new Event('local-storage'));
    void deleteCloudValue(key);
  } catch (e) {
    console.error(`Failed to remove from storage: ${key}`, e);
  }
}

export async function hydrateLocalStorageFromCloud() {
  if (typeof window === 'undefined') return;
  const session = await getValidCloudSession();
  const config = getCloudConfig();
  if (!session || !config) return;

  try {
    const response = await fetch(`${config.url}/rest/v1/couple_data?select=data_key,payload`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!response.ok) return;

    const rows = (await response.json()) as Array<{ data_key: StorageKey; payload: unknown }>;
    rows.forEach((row) => {
      if (!(row.data_key in LS_KEYS)) return;
      localStorage.setItem(LS_KEYS[row.data_key], JSON.stringify(row.payload));
    });

    window.dispatchEvent(new Event('local-storage'));
  } catch {
    // keep local mode on cloud pull failure
  }
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
