'use client';

import { useSyncExternalStore } from 'react';
import { LS_KEYS, type StorageKey } from '@/lib/storage';

const collectionSnapshotCache = new Map<string, { raw: string | null; value: unknown[] }>();
const valueSnapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function subscribeToStorage(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();

  window.addEventListener('storage', handleChange);
  window.addEventListener('local-storage', handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener('local-storage', handleChange);
  };
}

function getCollectionSnapshot<T>(key: StorageKey, defaultValue: T[]) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const raw = window.localStorage.getItem(LS_KEYS[key]);
  const cached = collectionSnapshotCache.get(key);

  if (cached && cached.raw === raw) {
    return cached.value as T[];
  }

  let nextValue = defaultValue;

  if (raw) {
    try {
      nextValue = JSON.parse(raw) as T[];
    } catch {
      nextValue = defaultValue;
    }
  }

  collectionSnapshotCache.set(key, { raw, value: nextValue });
  return nextValue;
}

function getValueSnapshot<T>(key: StorageKey, defaultValue: T) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const raw = window.localStorage.getItem(LS_KEYS[key]);
  const cached = valueSnapshotCache.get(key);

  if (cached && cached.raw === raw) {
    return cached.value as T;
  }

  let nextValue = defaultValue;

  if (raw) {
    try {
      nextValue = JSON.parse(raw) as T;
    } catch {
      nextValue = defaultValue;
    }
  }

  valueSnapshotCache.set(key, { raw, value: nextValue });
  return nextValue;
}

export function useStoredCollection<T>(
  key: StorageKey,
  defaultValue: T[] = [],
  sort?: (a: T, b: T) => number,
) {
  const data = useSyncExternalStore(
    subscribeToStorage,
    () => getCollectionSnapshot<T>(key, defaultValue),
    () => defaultValue,
  );

  return sort ? [...data].sort(sort) : data;
}

export function useStoredValue<T>(key: StorageKey, defaultValue: T) {
  return useSyncExternalStore(
    subscribeToStorage,
    () => getValueSnapshot<T>(key, defaultValue),
    () => defaultValue,
  );
}
