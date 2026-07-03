import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { ArtworkCard } from '@/cards/ArtworkCard';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { GalleryFilters } from '@/gallery/GalleryFilters';
import { useMuseumOverview } from '@/hooks/useMuseumData';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { SearchFilters } from '@/types/museum';

export function GalleryPage() {
  const { data } = useMuseumOverview();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const [filters, setFilters] = useState<SearchFilters>({ query: '', period: 'all', country: 'all', collection: 'all', roomId: 'all' });

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.artworks.filter((artwork) => {
      const query = filters.query.trim().toLowerCase();
      const queryMatch =
        query.length === 0 ||
        [artwork.title, artwork.artist, artwork.period, artwork.country, artwork.collection, artwork.style]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return (
        queryMatch &&
        (filters.period === 'all' || artwork.period === filters.period) &&
        (filters.country === 'all' || artwork.country === filters.country) &&
        (filters.collection === 'all' || artwork.collection === filters.collection) &&
        (filters.roomId === 'all' || artwork.roomId === filters.roomId)
      );
    });
  }, [data, filters]);

  const periods = [...new Set(data?.artworks.map((artwork) => artwork.period) ?? [])];
  const countries = [...new Set(data?.artworks.map((artwork) => artwork.country) ?? [])];
  const collections = [...new Set(data?.artworks.map((artwork) => artwork.collection) ?? [])];

  return (
    <>
      <Helmet>
        <title>Gallery | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Gallery"
          title="Browse the collection through mood, place, and period."
          description="This gallery balances editorial curation with fast discovery tools so the museum remains explorable at scale."
        />
        <div className="mt-10">
          <GalleryFilters
            filters={filters}
            periods={periods}
            countries={countries}
            collections={collections}
            rooms={data?.rooms ?? []}
            onChange={setFilters}
          />
        </div>

        <GlassCard className="mt-8 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">{filtered.length} works available</p>
        </GlassCard>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((artwork) => (
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