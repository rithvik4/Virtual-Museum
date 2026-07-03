import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { HiMiniMicrophone, HiMiniStop } from 'react-icons/hi2';

import { ArtworkCard } from '@/cards/ArtworkCard';
import { GlassCard } from '@/cards/GlassCard';
import { MuseumSelect } from '@/common/MuseumSelect';
import { SectionHeading } from '@/common/SectionHeading';
import { useArtworkSearch, useMuseumOverview } from '@/hooks/useMuseumData';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { SearchFilters } from '@/types/museum';

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({ query: '', period: 'all', country: 'all', collection: 'all', roomId: 'all' });
  const { data: overview } = useMuseumOverview();
  const { data: results = [] } = useArtworkSearch(filters);
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const voice = useVoiceSearch((query) => setFilters((current) => ({ ...current, query })));

  return (
    <>
      <Helmet>
        <title>Search | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Search"
          title="Global discovery with voice-assisted exploration."
          description="Use free text, room, collection, and period filters to move across the archive quickly."
        />
        <GlassCard className="mt-10 p-6">
          <div className="grid gap-3 md:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
              <input
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                placeholder="Search artwork, artist, country"
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/35"
              />
              {voice.supported ? (
                <button type="button" onClick={voice.listening ? voice.stop : voice.start} className="text-museum-gold">
                  {voice.listening ? <HiMiniStop className="text-xl" /> : <HiMiniMicrophone className="text-xl" />}
                </button>
              ) : null}
            </div>
            <MuseumSelect
              value={filters.period}
              onChange={(period) => setFilters({ ...filters, period })}
              options={[
                { value: 'all', label: 'All periods' },
                ...[...new Set(overview?.artworks.map((artwork) => artwork.period) ?? [])].map((period) => ({ value: period, label: period })),
              ]}
            />
            <MuseumSelect
              value={filters.country}
              onChange={(country) => setFilters({ ...filters, country })}
              options={[
                { value: 'all', label: 'All countries' },
                ...[...new Set(overview?.artworks.map((artwork) => artwork.country) ?? [])].map((country) => ({ value: country, label: country })),
              ]}
            />
            <MuseumSelect
              value={filters.collection}
              onChange={(collection) => setFilters({ ...filters, collection })}
              options={[
                { value: 'all', label: 'All collections' },
                ...[...new Set(overview?.artworks.map((artwork) => artwork.collection) ?? [])].map((collection) => ({ value: collection, label: collection })),
              ]}
            />
            <MuseumSelect
              value={filters.roomId}
              onChange={(roomId) => setFilters({ ...filters, roomId })}
              options={[
                { value: 'all', label: 'All rooms' },
                ...(overview?.rooms ?? []).map((room) => ({ value: room.id, label: room.name })),
              ]}
            />
          </div>
        </GlassCard>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((artwork) => (
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