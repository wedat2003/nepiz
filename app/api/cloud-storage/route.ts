import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { LS_KEYS, type StorageKey } from '@/lib/storage';

type CloudDoc = {
  version: 1;
  data: Partial<Record<StorageKey, unknown>>;
};

const CLOUD_DIR = path.join(process.cwd(), '.data');
const CLOUD_FILE = path.join(CLOUD_DIR, 'cloud-storage.json');

function isStorageKey(value: string): value is StorageKey {
  return Object.prototype.hasOwnProperty.call(LS_KEYS, value);
}

async function readCloudDoc(): Promise<CloudDoc> {
  try {
    const raw = await fs.readFile(CLOUD_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as CloudDoc;
    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      return { version: 1, data: {} };
    }
    return parsed;
  } catch {
    return { version: 1, data: {} };
  }
}

async function writeCloudDoc(doc: CloudDoc) {
  await fs.mkdir(CLOUD_DIR, { recursive: true });
  await fs.writeFile(CLOUD_FILE, JSON.stringify(doc), 'utf-8');
}

export async function GET() {
  const doc = await readCloudDoc();
  return NextResponse.json({ data: doc.data });
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as { key?: string; value?: unknown };
  const key = payload?.key;

  if (!key || !isStorageKey(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  const doc = await readCloudDoc();
  doc.data[key] = payload.value;
  await writeCloudDoc(doc);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  if (!key || !isStorageKey(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  const doc = await readCloudDoc();
  delete doc.data[key];
  await writeCloudDoc(doc);

  return NextResponse.json({ ok: true });
}

