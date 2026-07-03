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

export function ArtworkVisual({ title, artist, palette, imageUrl, className }: ArtworkVisualProps) {
  const identityHash = hashArtworkIdentity(title, artist);
  const objectPositionX = 40 + (identityHash % 21) * 3;
  const objectPositionY = 30 + ((identityHash >> 3) % 21) * 3;
  const imageFilter = `saturate(${1.02 + ((identityHash >> 5) % 6) * 0.03}) contrast(${1.02 + ((identityHash >> 7) % 4) * 0.02})`;

  return (
    <div
      className={cn('relative overflow-hidden rounded-[1.75rem] border border-white/8', className)}
      style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})` }}
      aria-label={`${title} by ${artist}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${title} by ${artist}`}
          className="block h-full w-full object-cover"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ objectPosition: `${objectPositionX}% ${objectPositionY}%`, filter: imageFilter }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_0_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_0_30%)]" />
      <div className="absolute inset-x-8 bottom-8 rounded-[1.5rem] border border-white/15 bg-black/18 p-4 backdrop-blur-md">
        <p className="font-display text-2xl text-white">{title}</p>
        <p className="mt-1 text-sm uppercase tracking-[0.22em] text-white/70">{artist}</p>
      </div>
    </div>
  );
}