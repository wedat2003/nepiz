'use client';

import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import InteractiveBentoGallery, {
  type MediaItemType,
} from '@/components/ui/interactive-bento-gallery';
import { deleteCloudMediaByPath, generateId, saveToStorage, type Media, uploadMediaFileToCloud } from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

const fallbackItems: MediaItemType[] = [
  {
    id: 1,
    type: 'image',
    title: 'Golden Hour Together',
    desc: 'A warm light and a quiet moment together.',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3',
  },
  {
    id: 2,
    type: 'video',
    title: 'Dog Puppy',
    desc: 'Adorable loyal companion.',
    url: 'https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4',
    span: 'md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2',
  },
  {
    id: 3,
    type: 'image',
    title: 'Forest Path',
    desc: 'Mystical forest trail',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3',
  },
  {
    id: 4,
    type: 'image',
    title: 'Falling Leaves',
    desc: 'Autumn scenery',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    span: 'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2',
  },
  {
    id: 5,
    type: 'video',
    title: 'Bird Parrot',
    desc: 'Vibrant feathered charm',
    url: 'https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4',
    span: 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3',
  },
  {
    id: 6,
    type: 'image',
    title: 'Beach Paradise',
    desc: 'Sunny tropical beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    span: 'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2',
  },
]

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

function getImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Image metadata unavailable for "${file.name}".`));
    };
    img.src = objectUrl;
  });
}

function getVideoSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(objectUrl);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Video metadata unavailable for "${file.name}".`));
    };
    video.src = objectUrl;
  });
}

function getSpan(type: Media['type'], width?: number, height?: number) {
  if (!width || !height) {
    return type === 'video'
      ? 'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2'
      : 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3';
  }

  const ratio = width / height;

  if (ratio >= 1.45) {
    return 'md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2';
  }

  if (ratio <= 0.8) {
    return 'md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-3';
  }

  return 'md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2';
}

export default function Media() {
  const storedMedia = useStoredCollection<Media>('media', []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const selectedSourceIds = new Set(
      galleryItems.filter((item) => selectedIds.includes(item.id) && item.sourceId).map((item) => item.sourceId as string),
    );
    const cloudPaths = storedMedia
      .filter((entry) => selectedSourceIds.has(entry.id) && entry.cloudPath)
      .map((entry) => entry.cloudPath as string);
    await Promise.all(cloudPaths.map((path) => deleteCloudMediaByPath(path)));

    const updated = storedMedia.filter((entry) => !selectedSourceIds.has(entry.id));
    saveToStorage('media', updated);
    setSelectedIds([]);
  };

  const handleDownloadItem = (item: MediaItemType) => {
    const link = document.createElement('a');
    const fallbackExt = item.type === 'video' ? 'mp4' : 'jpg';
    const safeName = (item.fileName || item.title || 'media')
      .replace(/[^\w.-]+/g, '_')
      .replace(/^_+|_+$/g, '');

    link.href = item.url;
    link.download = safeName.includes('.') ? safeName : `${safeName || 'media'}.${fallbackExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSelected = () => {
    if (selectedIds.length === 0) return;
    galleryItems
      .filter((item) => selectedIds.includes(item.id))
      .forEach((item) => handleDownloadItem(item));
  };

  const handleToggleSelect = (item: MediaItemType) => {
    setSelectedIds((current) =>
      current.includes(item.id)
        ? current.filter((id) => id !== item.id)
        : [...current, item.id],
    );
  };

  const galleryItems: MediaItemType[] =
    storedMedia.length > 0
      ? storedMedia
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((item, index) => ({
            id: item.id,
            type: item.type,
            title: item.name.replace(/\.[^/.]+$/, '') || `Memory ${index + 1}`,
            desc:
              item.type === 'video'
                ? 'Your video shown in a wider frame.'
                : 'Your image shown in a frame that fits.',
            url: item.data,
            span: getSpan(item.type, item.width, item.height),
            sourceId: item.id,
            canDelete: true,
            fileName: item.name,
          }))
      : fallbackItems;

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedResults = await Promise.allSettled(
        files.map(async (file) => {
          const type = file.type.startsWith('video/') ? 'video' : 'image';
          const cloudUpload = await uploadMediaFileToCloud(file, 'gallery');
          const data = cloudUpload?.url ?? (await readFileAsDataUrl(file));
          const size =
            type === 'video'
              ? await getVideoSize(file).catch(() => ({ width: 1920, height: 1080 }))
              : await getImageSize(file).catch(() => ({ width: 1200, height: 1200 }));

          return {
            id: generateId(),
            type,
            data,
            name: file.name,
            cloudPath: cloudUpload?.path,
            width: size.width,
            height: size.height,
            createdAt: Date.now() + Math.floor(Math.random() * 1000),
          } satisfies Media;
        }),
      );

      const uploaded = uploadedResults.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : [],
      );

      uploadedResults.forEach((result) => {
        if (result.status === 'rejected') {
          console.warn('Skipped file during upload:', result.reason);
        }
      });

      if (uploaded.length === 0) {
        event.target.value = '';
        return;
      }

      saveToStorage('media', [...uploaded, ...storedMedia]);
      event.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="pill mb-2">Gallery</div>
            <h1 className="text-4xl font-bold">Our Gallery</h1>
            <p className="mt-2 opacity-75">
              Add your own photos and videos. New moments get frames that fit
              automatically.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn min-w-[11rem] justify-center whitespace-nowrap">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <label
              htmlFor="gallery-upload-input"
              className={`btn btnPrimary relative flex min-w-[17rem] items-center justify-center gap-2 whitespace-nowrap px-8 ${
                isUploading ? 'pointer-events-none opacity-70' : ''
              }`}
            >
              <ImagePlus className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Add photos or videos'}
              <input
                id="gallery-upload-input"
                type="file"
                accept="image/*,video/*"
                multiple
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
            {!isSelecting ? (
              <button
                type="button"
                onClick={() => {
                  setIsSelecting(true);
                  setSelectedIds([]);
                }}
                className="btn min-w-[11rem] justify-center whitespace-nowrap"
              >
                Select
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDownloadSelected}
                  disabled={selectedIds.length === 0}
                  className="btn min-w-[11rem] justify-center whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Save Selected
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="btn min-w-[11rem] justify-center whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSelecting(false);
                    setSelectedIds([]);
                  }}
                  className="btn min-w-[11rem] justify-center whitespace-nowrap"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>

        <div className="hr" />
      </div>

      <InteractiveBentoGallery
        mediaItems={galleryItems}
        title="Gallery Shots Collection"
        description={
          storedMedia.length > 0
            ? 'Your uploaded photos and videos are shown centered in fitting frames.'
            : 'No uploads yet. Demo items stay visible until you add your own files.'
        }
        selectionMode={isSelecting}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
      />
    </main>
  );
}
