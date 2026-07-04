import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { ArtworkCard } from '@/cards/ArtworkCard';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { GalleryFilters } from '@/gallery/GalleryFilters';
import { useMuseumOverview } from '@/hooks/useMuseumData';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { SearchFilters } from '@/types/museum';
import { getArtworkArtForm } from '@/utils/artworkArtForm';

function yearSortValue(yearLabel: string): number {
  const normalized = yearLabel.trim().toLowerCase();
  const match = normalized.match(/\d{1,4}/);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const value = Number(match[0]);
  return normalized.includes('bce') ? -value : value;
}

export function GalleryPage() {
  const { data } = useMuseumOverview();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const [filters, setFilters] = useState<SearchFilters>({ query: '', period: 'all', country: 'all', collection: 'all', roomId: 'all', artForm: 'all' });

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
        (filters.roomId === 'all' || artwork.roomId === filters.roomId) &&
        (filters.artForm === 'all' || getArtworkArtForm(artwork) === filters.artForm)
      );
    });
  }, [data, filters]);

  const visibleArtworks = useMemo(() => {
    return [...filtered].sort((left, right) => yearSortValue(left.year) - yearSortValue(right.year));
  }, [filtered]);

  const periods = [...new Set(data?.artworks.map((artwork) => artwork.period) ?? [])];
  const countries = [...new Set(data?.artworks.map((artwork) => artwork.country) ?? [])];
  const collections = [...new Set(data?.artworks.map((artwork) => artwork.collection) ?? [])];
  const artForms = [...new Set((data?.artworks ?? []).map((artwork) => getArtworkArtForm(artwork)))];

  return (
    <>
      <Helmet>
        <title>Bharat Gallery | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Bharat Gallery"
          title="Browse Indian collections through region, mood, and historical period."
          description="This gallery balances curation with fast discovery so Indian art traditions remain deeply explorable at scale."
        />
        <div className="mt-10">
          <GalleryFilters
            filters={filters}
            periods={periods}
            countries={countries}
            collections={collections}
            artForms={artForms}
            rooms={data?.rooms ?? []}
            onChange={setFilters}
          />
        </div>

        <GlassCard className="mt-8 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">{visibleArtworks.length} works available</p>
        </GlassCard>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilters((current) => ({ ...current, artForm: 'all' }))}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${filters.artForm === 'all' ? 'border-museum-gold/40 bg-museum-gold/20 text-museum-gold' : 'border-white/12 bg-white/5 text-white/75 hover:bg-white/10'}`}
          >
            All Forms
          </button>
          {artForms.map((artForm) => (
            <button
              key={artForm}
              type="button"
              onClick={() => setFilters((current) => ({ ...current, artForm }))}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${filters.artForm === artForm ? 'border-museum-gold/40 bg-museum-gold/20 text-museum-gold' : 'border-white/12 bg-white/5 text-white/75 hover:bg-white/10'}`}
            >
              {artForm}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArtworks.map((artwork) => (
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