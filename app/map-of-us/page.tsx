'use client';

import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { LayerGroup, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateId, saveToStorage, type MapPlace } from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

type LeafletModule = typeof import('leaflet');

export default function MapOfUsPage() {
  const places = useStoredCollection<MapPlace>('mapPlaces', []);
  const [city, setCity] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [isPickMode, setIsPickMode] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [isResolvingCity, setIsResolvingCity] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const pickModeRef = useRef(false);

  const sortedPlaces = useMemo(
    () => [...places].sort((a, b) => b.createdAt - a.createdAt),
    [places],
  );

  const activePlace = sortedPlaces.find((place) => place.id === activeId) ?? sortedPlaces[0];

  const resolveCityFromCoords = async (nextLat: number, nextLng: number) => {
    try {
      setIsResolvingCity(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nextLat}&lon=${nextLng}&zoom=10&addressdetails=1`,
      );
      if (!response.ok) throw new Error('Reverse geocoding failed');
      const data = await response.json();
      const address = data?.address ?? {};
      const detectedCity =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        address.state ||
        address.country ||
        'Picked location';
      setCity(String(detectedCity));
    } catch {
      setCity('Picked location');
    } finally {
      setIsResolvingCity(false);
    }
  };

  useEffect(() => {
    pickModeRef.current = isPickMode;
  }, [isPickMode]);

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;
      const L = await import('leaflet');
      if (cancelled || !mapContainerRef.current) return;

      leafletRef.current = L;
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        worldCopyJump: true,
      }).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);

      map.on('click', (event: LeafletMouseEvent) => {
        if (!pickModeRef.current) return;
        const normalizedLat = Number(event.latlng.lat.toFixed(4));
        const normalizedLng = Number(event.latlng.lng.toFixed(4));
        setSelectedPoint({ lat: normalizedLat, lng: normalizedLng });
        setLat(String(normalizedLat));
        setLng(String(normalizedLng));
        void resolveCityFromCoords(normalizedLat, normalizedLng);
        setIsPickMode(false);
      });

      mapRef.current = map;
    };

    void initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const markersLayer = markersLayerRef.current;
    if (!L || !markersLayer) return;

    markersLayer.clearLayers();

    sortedPlaces.forEach((place) => {
      const isActive = activePlace?.id === place.id;
      const marker = L.circleMarker([place.lat, place.lng], {
        radius: 7,
        color: isActive ? '#93c5fd' : '#ffffff',
        fillColor: isActive ? '#93c5fd' : '#ffffff',
        fillOpacity: 0.9,
        weight: 2,
      });
      marker.on('click', () => setActiveId(place.id));
      marker.addTo(markersLayer);
    });

    if (selectedPoint) {
      L.circleMarker([selectedPoint.lat, selectedPoint.lng], {
        radius: 8,
        color: '#60a5fa',
        fillColor: '#60a5fa',
        fillOpacity: 0.95,
        weight: 2,
      }).addTo(markersLayer);
    }
  }, [sortedPlaces, activePlace?.id, selectedPoint]);

  const handleAddPlace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    const normalizedNote = dateLabel.replace(/\r\n/g, '\n');
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!trimmedCity || Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) return;
    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) return;

    const next: MapPlace = {
      id: generateId(),
      name: trimmedCity,
      note: normalizedNote.length > 0 ? normalizedNote : undefined,
      lat: parsedLat,
      lng: parsedLng,
      createdAt: Date.now(),
    };

    saveToStorage('mapPlaces', [next, ...places]);
    setCity('');
    setDateLabel('');
    setLat('');
    setLng('');
    setSelectedPoint(null);
    setIsPickMode(false);
    setActiveId(next.id);
  };

  const handleDelete = (id: string) => {
    saveToStorage(
      'mapPlaces',
      places.filter((place) => place.id !== id),
    );
    if (activeId === id) setActiveId(null);
    if (selectedPlace?.id === id) setSelectedPlace(null);
  };

  const handleNotesEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();

    const target = event.currentTarget;
    const start = target.selectionStart ?? dateLabel.length;
    const end = target.selectionEnd ?? dateLabel.length;
    const nextValue = `${dateLabel.slice(0, start)}\n${dateLabel.slice(end)}`;
    setDateLabel(nextValue);

    requestAnimationFrame(() => {
      target.selectionStart = start + 1;
      target.selectionEnd = start + 1;
    });
  };

  return (
    <main className="page-shell max-w-6xl mx-auto px-6 py-20 space-y-16">
      <section className="space-y-10 pb-12 md:pb-16">
        <div className="pill w-fit">Map of Us</div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="max-w-4xl font-[var(--font-playfair)] text-5xl leading-[1.04] tracking-tight text-white md:text-7xl">
            Places that matter to us
          </h1>
          <Button
            asChild
            variant="outline"
            className="h-12 min-w-[11rem] rounded-full border-white/10 bg-white/5 px-8 text-sm font-medium text-white hover:bg-white/10"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>
      </section>

      <section className="flex min-h-[72vh] items-start justify-center">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="grid gap-10 xl:grid-cols-2">
          <article className="w-full rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
            <div className="grid min-h-[46rem] rounded-2xl border border-transparent bg-transparent p-8 md:p-10">
              <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-transparent">
                  <div ref={mapContainerRef} className="h-[24rem] w-full" />
                </div>

                <div className="flex w-full flex-col items-center gap-4 text-center">
                  <Button
                    type="button"
                    onClick={() => setIsPickMode((value) => !value)}
                    className="h-11 min-w-[12rem] rounded-full border border-white/20 bg-white/10 px-8 text-xs uppercase tracking-[0.12em] text-white hover:bg-white/15"
                  >
                    {isPickMode ? 'Cancel pick mode' : 'Pick point on map'}
                  </Button>
                  <p className="text-xs leading-relaxed text-white/65">
                    {isPickMode ? 'Selection mode on' : 'Zoom and pan remain available'}
                  </p>
                </div>

              </div>
            </div>
          </article>

          <article className="w-full rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
            <div className="grid min-h-[46rem] rounded-2xl border border-transparent bg-transparent p-8 md:p-10">
              <div className="flex h-full w-full items-center justify-center">
                <form onSubmit={handleAddPlace} className="flex w-full max-w-md flex-col items-center space-y-10">
                  <div className="mx-auto w-full max-w-sm space-y-3">
                    <p className="text-center text-xs uppercase tracking-[0.16em] text-white/60">City</p>
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder={isPickMode ? 'Pick a point on map...' : 'City appears after map pick'}
                      className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-center text-white outline-none transition placeholder:text-white/42 focus:border-white/50"
                    />
                  </div>
                  <div className="mx-auto w-full max-w-sm space-y-3">
                    <p className="text-center text-xs uppercase tracking-[0.16em] text-white/60">Additional Notes</p>
                    <textarea
                      value={dateLabel}
                      onChange={(event) => setDateLabel(event.target.value)}
                      onKeyDown={handleNotesEnter}
                      placeholder="Additional notes..."
                      rows={4}
                      className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-4 text-center text-white outline-none transition placeholder:text-white/42 focus:border-white/50"
                    />
                  </div>
                  <div className="mx-auto w-full max-w-sm rounded-xl border border-transparent bg-transparent px-4 py-4">
                    <p className="text-center text-xs uppercase tracking-[0.16em] text-white/60">Selected location</p>
                    <p className="mt-2 text-center text-sm leading-relaxed text-white/78">
                      {isResolvingCity ? 'Resolving city...' : city || 'Pick point on map'}
                    </p>
                  </div>
                  <div className="flex h-28 w-full items-center justify-center">
                    <Button
                      type="submit"
                      disabled={!lat || !lng || !city || isResolvingCity}
                      className="h-12 min-w-[11rem] rounded-full border-0 bg-[linear-gradient(135deg,#6da8ff,#4f82e8)] px-8 text-sm font-medium text-white shadow-[0_14px_32px_rgba(54,96,180,0.35)]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Place
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </article>
          </div>

          <article className="w-full rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
            <div className="grid min-h-[20rem] rounded-2xl border border-transparent bg-transparent p-8 md:p-10">
              <div className="flex h-full w-full flex-col items-center gap-8">
                <p className="text-center text-xs uppercase tracking-[0.18em] text-white/78">Places List</p>
                <div className="mx-auto w-full max-w-md">
                  <div className="space-y-5 px-2">
                    {sortedPlaces.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => {
                          setActiveId(place.id);
                          setSelectedPlace(place);
                        }}
                        className="flex h-12 cursor-pointer items-center justify-between rounded-xl border border-white/20 bg-transparent px-5"
                      >
                        <p className="flex-1 text-sm leading-none text-white/95">{`\u00A0\u00A0\u00A0${place.name}`}</p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(place.id);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-white/75 transition hover:bg-red-500/20 hover:text-red-300"
                          aria-label={`Delete ${place.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {sortedPlaces.length === 0 ? (
                      <div className="rounded-xl border border-white/12 bg-transparent px-4 py-4 text-center text-sm text-white/70">
                        No places yet
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {selectedPlace ? (
        <div
          className="fixed inset-0 z-[3000] grid place-items-center bg-[#090312]/95 px-6 backdrop-blur-md"
          onClick={() => setSelectedPlace(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-transparent bg-transparent p-10 md:p-12"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="max-h-[78vh] w-full overflow-y-auto rounded-3xl border border-transparent bg-transparent p-8 md:p-10">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-white/85 transition hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="space-y-6 px-2 pb-10 pt-10 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/78">Place Details</p>
                  <h2 className="max-w-full break-words break-all font-[var(--font-playfair)] text-3xl leading-tight text-white md:text-4xl">
                    {selectedPlace.name}
                  </h2>
                  <div className="flex justify-center">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-transparent bg-transparent px-6 text-left md:px-8">
                      <p className="max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-white/88 md:text-base">
                        {selectedPlace.note && selectedPlace.note.length > 0 ? selectedPlace.note : 'No additional notes yet.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
