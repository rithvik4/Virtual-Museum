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
import { getArtworkArtForm } from '@/utils/artworkArtForm';

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({ query: '', period: 'all', country: 'all', collection: 'all', roomId: 'all', artForm: 'all' });
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
          description="Use free text, room, collection, period, and art-form filters to move across the archive quickly."
        />
        <GlassCard className="mt-10 p-6">
          <div className="grid gap-3 md:grid-cols-[1.3fr_repeat(5,minmax(0,1fr))]">
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
              value={filters.artForm}
              onChange={(artForm) => setFilters({ ...filters, artForm })}
              options={[
                { value: 'all', label: 'All forms' },
                ...[...new Set((overview?.artworks ?? []).map((artwork) => getArtworkArtForm(artwork)))].map((artForm) => ({ value: artForm, label: artForm })),
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

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilters((current) => ({ ...current, artForm: 'all' }))}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${filters.artForm === 'all' ? 'border-museum-gold/40 bg-museum-gold/20 text-museum-gold' : 'border-white/12 bg-white/5 text-white/75 hover:bg-white/10'}`}
            >
              All Forms
            </button>
            {[...new Set((overview?.artworks ?? []).map((artwork) => getArtworkArtForm(artwork)))].map((artForm) => (
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