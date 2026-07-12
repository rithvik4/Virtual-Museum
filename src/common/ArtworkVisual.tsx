import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils/cn';

type ArtworkVisualProps = {
  title: string;
  artist: string;
  palette: [string, string];
  imageUrl?: string;
  className?: string;
};

function hashArtworkIdentity(title: string, artist: string) {
  return `${title}|${artist}`.split('').reduce((hash, character, index) => {
    const nextHash = (hash * 33 + character.charCodeAt(0) + index) % 1000003;
    return nextHash;
  }, 7);
}

function buildFallbackDataUrl(title: string, artist: string, palette: [string, string], identityHash: number): string {
  const safeTitle = title.replace(/[&<>"']/g, '').slice(0, 44);
  const safeArtist = artist.replace(/[&<>"']/g, '').slice(0, 30);
  const accentHue = identityHash % 360;
  const accent = `hsl(${accentHue}, 62%, 60%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960" role="img" aria-label="${safeTitle} by ${safeArtist}">
  <defs>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette[0]}"/>
      <stop offset="100%" stop-color="${palette[1]}"/>
    </linearGradient>
  </defs>
  <rect width="720" height="960" fill="url(#card)"/>
  <circle cx="564" cy="186" r="128" fill="${accent}" fill-opacity="0.3"/>
  <rect x="56" y="76" width="608" height="808" rx="40" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="6"/>
  <text x="84" y="824" fill="white" font-size="44" font-family="Georgia, serif" font-weight="700">${safeTitle}</text>
  <text x="84" y="874" fill="rgba(255,255,255,0.88)" font-size="28" font-family="Arial, sans-serif">${safeArtist}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeImageUrl(value: string | undefined): string {
  const raw = (value ?? '').trim();
  if (!raw) {
    return '';
  }

  if (raw.startsWith('//')) {
    return encodeURI(`https:${raw}`);
  }

  if (/^https?:\/\//i.test(raw)) {
    return encodeURI(raw);
  }

  return encodeURI(`https://${raw}`);
}

function buildProxyImageUrl(value: string): string {
  if (!value) {
    return '';
  }

  const withoutProtocol = value.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(withoutProtocol)}&w=960&h=1280&fit=cover`;
}

export function ArtworkVisual({ title, artist, palette, imageUrl, className }: ArtworkVisualProps) {
  const identityHash = hashArtworkIdentity(title, artist);
  const objectPositionX = 40 + (identityHash % 21) * 3;
  const objectPositionY = 30 + ((identityHash >> 3) % 21) * 3;
  const imageFilter = `saturate(${1.02 + ((identityHash >> 5) % 6) * 0.03}) contrast(${1.02 + ((identityHash >> 7) % 4) * 0.02})`;
  const fallbackImageUrl = useMemo(() => buildFallbackDataUrl(title, artist, palette, identityHash), [title, artist, palette, identityHash]);
  const normalizedPrimaryUrl = useMemo(() => normalizeImageUrl(imageUrl), [imageUrl]);
  const proxyUrl = useMemo(() => buildProxyImageUrl(normalizedPrimaryUrl), [normalizedPrimaryUrl]);
  const attemptUrls = useMemo(() => {
    const urls = [proxyUrl, normalizedPrimaryUrl, fallbackImageUrl].filter(Boolean);
    return [...new Set(urls)];
  }, [normalizedPrimaryUrl, proxyUrl, fallbackImageUrl]);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const resolvedImageUrl = attemptUrls[Math.min(attemptIndex, Math.max(0, attemptUrls.length - 1))] ?? fallbackImageUrl;

  useEffect(() => {
    setAttemptIndex(0);
  }, [attemptUrls]);

  return (
    <div
      className={cn('relative overflow-hidden rounded-[1.75rem] border border-white/8', className)}
      style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})` }}
      aria-label={`${title} by ${artist}`}
    >
      {resolvedImageUrl ? (
        <img
          src={resolvedImageUrl}
          alt={`${title} by ${artist}`}
          className="block h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ objectPosition: `${objectPositionX}% ${objectPositionY}%`, filter: imageFilter }}
          onError={() => {
            setAttemptIndex((currentIndex) => Math.min(currentIndex + 1, Math.max(0, attemptUrls.length - 1)));
          }}
        />
      ) : null}
    </div>
  );
}