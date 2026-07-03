import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import { ArtworkCard } from '@/cards/ArtworkCard';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';
import { useFavoritesStore } from '@/store/favoritesStore';

export function ArtistPage() {
  const { artistId } = useParams();
  const { data } = useMuseumOverview();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const artist = data?.artists.find((entry) => entry.id === artistId);
  const works = data?.artworks.filter((artwork) => artwork.artistId === artistId) ?? [];

  if (!artist) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-museum-gold">Artist</p>
        <h1 className="mt-4 font-display text-5xl text-white">Artist not found</h1>
        <Link to="/gallery" className="mt-6 inline-flex text-white/70 underline">
          Return to gallery
        </Link>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{artist.name} | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <GlassCard className="p-8 lg:p-12">
          <SectionHeading eyebrow="Artist Detail" title={artist.name} description={artist.biography} />
          <div className="mt-8 flex flex-wrap gap-3 text-sm uppercase tracking-[0.18em] text-white/55">
            <span>{artist.country}</span>
            <span>·</span>
            <span>{artist.period}</span>
            <span>·</span>
            <span>{artist.specialties.join(' · ')}</span>
          </div>
        </GlassCard>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {works.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              isFavorite={favoriteIds.includes(artwork.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
    </>
  );
}