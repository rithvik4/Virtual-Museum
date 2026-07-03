import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { HiMiniMicrophone, HiMiniStop } from 'react-icons/hi2';

import { ArtworkCard } from '@/cards/ArtworkCard';
import { GlassCard } from '@/cards/GlassCard';
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
            <select value={filters.period} onChange={(event) => setFilters({ ...filters, period: event.target.value })} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="all">All periods</option>
              {[...new Set(overview?.artworks.map((artwork) => artwork.period) ?? [])].map((period) => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <select value={filters.country} onChange={(event) => setFilters({ ...filters, country: event.target.value })} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="all">All countries</option>
              {[...new Set(overview?.artworks.map((artwork) => artwork.country) ?? [])].map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <select value={filters.collection} onChange={(event) => setFilters({ ...filters, collection: event.target.value })} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="all">All collections</option>
              {[...new Set(overview?.artworks.map((artwork) => artwork.collection) ?? [])].map((collection) => (
                <option key={collection} value={collection}>{collection}</option>
              ))}
            </select>
            <select value={filters.roomId} onChange={(event) => setFilters({ ...filters, roomId: event.target.value })} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="all">All rooms</option>
              {(overview?.rooms ?? []).map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
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