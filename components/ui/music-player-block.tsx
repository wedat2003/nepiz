'use client';

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Headphones,
  Plus,
  X,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  currentTime: string;
  progress: number;
  spotifyUrl: string;
  embedUrl: string;
}

const defaultPlaylist: Track[] = [
  {
    id: "5L2ELXkO17Iu9J8hwMktVJ",
    title: "Helaf El Amar",
    artist: "George Wassouf",
    album: "El Hawa Sultan",
    duration: "6:40",
    currentTime: "01:12",
    progress: 35,
    spotifyUrl: "https://open.spotify.com/track/5L2ELXkO17Iu9J8hwMktVJ",
    embedUrl:
      "https://open.spotify.com/embed/track/5L2ELXkO17Iu9J8hwMktVJ?utm_source=generator",
  },
  {
    id: "2Z8WuEywRWYTKe1NybPQEW",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    currentTime: "00:48",
    progress: 22,
    spotifyUrl: "https://open.spotify.com/track/2Z8WuEywRWYTKe1NybPQEW",
    embedUrl:
      "https://open.spotify.com/embed/track/2Z8WuEywRWYTKe1NybPQEW?utm_source=generator",
  },
  {
    id: "02MWAaffLxlfxAUY7c5dvx",
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    currentTime: "02:41",
    progress: 68,
    spotifyUrl: "https://open.spotify.com/track/02MWAaffLxlfxAUY7c5dvx",
    embedUrl:
      "https://open.spotify.com/embed/track/02MWAaffLxlfxAUY7c5dvx?utm_source=generator",
  },
  {
    id: "4ZtFanR9U6ndgddUvNcjcG",
    title: "good 4 u",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    currentTime: "00:36",
    progress: 20,
    spotifyUrl: "https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG",
    embedUrl:
      "https://open.spotify.com/embed/track/4ZtFanR9U6ndgddUvNcjcG?utm_source=generator",
  },
];

export function MusicPlayerBlock() {
  const nextTrackNonce = useRef(0);
  const [playlist, setPlaylist] = useState<Track[]>(() => {
    if (typeof window === "undefined") {
      return defaultPlaylist;
    }

    const saved = window.localStorage.getItem("playlist");

    if (!saved) {
      return defaultPlaylist;
    }

    try {
      const loaded = JSON.parse(saved) as Track[];
      return loaded.length > 0 ? loaded : defaultPlaylist;
    } catch {
      return defaultPlaylist;
    }
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [spotifyInput, setSpotifyInput] = useState("");

  // Save playlist to storage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("playlist", JSON.stringify(playlist));
    }
  }, [playlist]);

  const safeActiveIndex =
    playlist.length === 0 ? -1 : Math.min(Math.max(activeIndex, 0), playlist.length - 1);
  const activeTrack = safeActiveIndex >= 0 ? playlist[safeActiveIndex] : null;

  const extractSpotifyTrackId = (url: string): string | null => {
    try {
      const trimmedUrl = url.trim();

      if (trimmedUrl.startsWith("spotify:track:")) {
        const [, , trackId] = trimmedUrl.split(":");
        return trackId || null;
      }

      const parsedUrl = new URL(trimmedUrl);
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      const trackSegmentIndex = pathSegments.findIndex((segment) => segment === "track");

      if (trackSegmentIndex === -1) {
        return null;
      }

      const trackId = pathSegments[trackSegmentIndex + 1];
      return trackId ? trackId.split("?")[0] : null;
    } catch {
      return null;
    }
  };

  const fetchSpotifyTrackMeta = async (spotifyUrl: string) => {
    try {
      const response = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`,
      );
      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { title?: string; author_name?: string };

      return {
        title: data.title?.trim() || null,
        artist: data.author_name?.trim() || null,
      };
    } catch {
      return null;
    }
  };

  // Add song from Spotify URL
  const addSongFromSpotify = async () => {
    const trackId = extractSpotifyTrackId(spotifyInput);
    
    if (!trackId) {
      alert("Invalid Spotify URL. Please use a valid track link (e.g., https://open.spotify.com/track/...)");
      return;
    }

    const spotifyUrl = `https://open.spotify.com/track/${trackId}`;
    const metadata = await fetchSpotifyTrackMeta(spotifyUrl);
    const uniqueId = nextTrackNonce.current;
    nextTrackNonce.current += 1;

    const newTrack: Track = {
      id: `spotify-${trackId}-${uniqueId}`,
      title: metadata?.title || "Spotify Track",
      artist: metadata?.artist || "From Spotify",
      album: "",
      duration: "3:30",
      currentTime: "00:00",
      progress: 0,
      spotifyUrl,
      embedUrl: `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`,
    };

    const wasEmpty = playlist.length === 0;
    setPlaylist([...playlist, newTrack]);
    
    // Auto-select if it was empty
    if (wasEmpty) {
      setActiveIndex(0);
    }

    // Reset form
    clearForm();
  };

  const clearForm = () => {
    setSpotifyInput("");
    setShowForm(false);
  };

  const removeSong = (indexToRemove: number) => {
    const newPlaylist = playlist.filter((_, idx) => idx !== indexToRemove);
    setPlaylist(newPlaylist);

    if (newPlaylist.length === 0) {
      setActiveIndex(-1);
    } else if (indexToRemove === activeIndex) {
      // If we removed the active song, switch to previous or first
      setActiveIndex(Math.max(0, indexToRemove - 1));
    } else if (activeIndex > indexToRemove) {
      // Adjust if the removed song was before active
      setActiveIndex(activeIndex - 1);
    }
  };

  const validSpotifyUrl = spotifyInput.trim() && extractSpotifyTrackId(spotifyInput);

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
        <div className="space-y-8 rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white/70"
              >
                Music
              </Badge>
              <h2 className="font-[var(--font-playfair)] text-4xl leading-tight text-white md:text-5xl">
                Shared Playlist
              </h2>
            </div>
            <Button
              onClick={() => setShowForm((value) => !value)}
              variant="outline"
              className="h-12 min-w-[11rem] rounded-full border-white/15 bg-white/8 px-8 text-sm text-white hover:bg-white/12"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Song
            </Button>
          </div>

          {showForm ? (
            <Card className="rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
                <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.16em] text-white/65">
                    Spotify URL
                  </label>
                  <input
                    type="text"
                    value={spotifyInput}
                    onChange={(e) => setSpotifyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && validSpotifyUrl) {
                        e.preventDefault();
                        void addSongFromSpotify();
                      }
                    }}
                    placeholder="Paste Spotify track URL"
                    className="h-14 w-full rounded-xl border border-white/25 bg-transparent px-4 text-white outline-none transition placeholder:text-white/45 focus:border-white/45"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Button
                    onClick={addSongFromSpotify}
                    disabled={!validSpotifyUrl}
                    className="h-12 min-w-[11rem] rounded-full border-0 bg-[linear-gradient(135deg,#6da8ff,#4f82e8)] px-8 text-sm font-medium text-white shadow-[0_14px_32px_rgba(54,96,180,0.35)] disabled:opacity-60"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => setSpotifyInput("")}
                    variant="outline"
                    className="h-12 min-w-[11rem] rounded-full border-white/20 bg-white/8 px-8 text-sm text-white hover:bg-white/12"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={clearForm}
                    variant="outline"
                    className="h-12 min-w-[11rem] rounded-full border-white/20 bg-white/8 px-8 text-sm text-white hover:bg-white/12"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}

          {playlist.length === 0 ? (
            <div className="grid min-h-[18rem] place-items-center rounded-2xl border border-transparent px-8 py-12 text-center">
              <div className="space-y-4">
                <Headphones className="mx-auto h-8 w-8 text-white/60" />
                <p className="text-base leading-relaxed text-white/75">No songs yet</p>
              </div>
            </div>
          ) : null}

          {activeTrack ? (
            <Card className="rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-transparent bg-transparent">
                  <iframe
                    className="h-[152px] w-full"
                    src={activeTrack.embedUrl}
                    title={`${activeTrack.title} - Spotify`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-white/20 bg-white/8 px-8 text-sm text-white hover:bg-white/12"
                  asChild
                >
                  <a href={activeTrack.spotifyUrl} target="_blank" rel="noreferrer">
                    <Headphones className="mr-2 h-4 w-4" />
                    Open in Spotify
                  </a>
                </Button>
              </div>
            </Card>
          ) : null}

          {playlist.length > 0 ? (
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/65">Playlist ({playlist.length})</p>
              <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                {playlist.map((track, index) => {
                  const isActive = index === safeActiveIndex;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      className={`group flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition ${
                        isActive
                          ? "border-transparent bg-white/10"
                          : "border-transparent bg-transparent hover:border-transparent hover:bg-white/8"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed text-white">{track.title}</p>
                        <p className="text-xs leading-relaxed text-white/65">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/55">{track.duration}</span>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSong(index);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full border border-transparent bg-white/8 text-white/70 opacity-0 transition hover:border-transparent hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
