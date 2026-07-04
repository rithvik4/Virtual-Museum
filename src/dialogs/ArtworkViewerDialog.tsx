import { useEffect, useMemo, useRef, useState } from 'react';
import { HiOutlineArrowsPointingOut, HiOutlineMinus, HiOutlinePlus, HiOutlineXMark } from 'react-icons/hi2';

import type { Artwork } from '@/types/museum';

type ArtworkViewerDialogProps = {
  open: boolean;
  artwork: Artwork;
  onClose: () => void;
};

export function ArtworkViewerDialog({ open, artwork, onClose }: ArtworkViewerDialogProps) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fallbackImageUrl = useMemo(() => {
    const safeTitle = artwork.title.replace(/[&<>"']/g, '').slice(0, 48);
    const safeArtist = artwork.artist.replace(/[&<>"']/g, '').slice(0, 30);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${safeTitle} by ${safeArtist}">
  <defs>
    <linearGradient id="viewer-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${artwork.palette[0]}"/>
      <stop offset="100%" stop-color="${artwork.palette[1]}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#viewer-bg)"/>
  <circle cx="960" cy="180" r="180" fill="rgba(255,255,255,0.24)"/>
  <rect x="64" y="64" width="1072" height="772" rx="42" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="6"/>
  <text x="110" y="760" fill="white" font-size="56" font-family="Georgia, serif" font-weight="700">${safeTitle}</text>
  <text x="110" y="822" fill="rgba(255,255,255,0.88)" font-size="34" font-family="Arial, sans-serif">${safeArtist}</text>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, [artwork.artist, artwork.palette, artwork.title]);

  const imageUrl = useMemo(() => artwork.imageUrl ?? artwork.thumbnailUrl ?? fallbackImageUrl, [artwork.imageUrl, artwork.thumbnailUrl, fallbackImageUrl]);
  const [resolvedImageUrl, setResolvedImageUrl] = useState(imageUrl);

  useEffect(() => {
    setResolvedImageUrl(imageUrl);
  }, [imageUrl]);

  if (!open) {
    return null;
  }

  const requestFullscreen = async () => {
    if (containerRef.current && document.fullscreenElement === null) {
      await containerRef.current.requestFullscreen();
    }
  };

  const increaseZoom = () => setZoom((value) => Math.min(4, Number((value + 0.25).toFixed(2))));
  const decreaseZoom = () => setZoom((value) => Math.max(1, Number((value - 0.25).toFixed(2))));

  return (
    <div className="fixed inset-0 z-[90] bg-black/85 px-4 py-4 backdrop-blur-lg">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col rounded-[2rem] border border-white/12 bg-[#0e0e0e] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-museum-gold">HD Viewer</p>
            <h2 className="mt-2 font-display text-3xl text-white">{artwork.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={decreaseZoom} className="rounded-full border border-white/10 bg-white/5 p-3 text-white/75">
              <HiOutlineMinus />
            </button>
            <span className="min-w-[70px] text-center text-sm text-white/70">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={increaseZoom} className="rounded-full border border-white/10 bg-white/5 p-3 text-white/75">
              <HiOutlinePlus />
            </button>
            <button type="button" onClick={requestFullscreen} className="rounded-full border border-white/10 bg-white/5 p-3 text-white/75">
              <HiOutlineArrowsPointingOut />
            </button>
            <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-3 text-white/75">
              <HiOutlineXMark />
            </button>
          </div>
        </div>
        <div ref={containerRef} className="mt-4 flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-[1.5rem] border border-white/10 bg-black/45 p-4">
          <img
            src={resolvedImageUrl}
            alt={`${artwork.title} by ${artwork.artist}`}
            className="max-h-full max-w-full object-contain transition"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => {
              setResolvedImageUrl((currentUrl) => (currentUrl === fallbackImageUrl ? currentUrl : fallbackImageUrl));
            }}
          />
        </div>
      </div>
    </div>
  );
}