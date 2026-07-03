import { motion } from 'framer-motion';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

import { ArtworkVisual } from '@/common/ArtworkVisual';
import { GlassCard } from '@/cards/GlassCard';
import type { Artwork } from '@/types/museum';

type ArtworkCardProps = {
  artwork: Artwork;
  isFavorite: boolean;
  onToggleFavorite: (artworkId: string) => void;
};

export function ArtworkCard({ artwork, isFavorite, onToggleFavorite }: ArtworkCardProps) {
  return (
    <motion.div layout whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <GlassCard className="overflow-hidden p-4">
        <Link to={`/painting/${artwork.id}`} className="block">
          <ArtworkVisual title={artwork.title} artist={artwork.artist} palette={artwork.palette} imageUrl={artwork.thumbnailUrl ?? artwork.imageUrl} className="h-72" />
        </Link>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-white">{artwork.title}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/60">
              {artwork.artist} · {artwork.year}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(artwork.id)}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white/80 transition hover:border-museum-gold/35 hover:text-museum-gold"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <HiHeart className="text-lg text-museum-gold" /> : <HiOutlineHeart className="text-lg" />}
          </button>
        </div>
        <p className="mt-3 text-sm leading-7 text-white/65">{artwork.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-white/55">
          <span>{artwork.period}</span>
          <span>·</span>
          <span>{artwork.country}</span>
          <span>·</span>
          <span>{artwork.collection}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}