import { Helmet } from 'react-helmet-async';
import { HiOutlineArrowsPointingOut, HiOutlineBookmark, HiOutlineSpeakerWave } from 'react-icons/hi2';
import { Link, useParams } from 'react-router-dom';

import { useMemo, useState } from 'react';

import { getLocalizedNarrationText } from '@/audio/localizedNarration';
import { useNarration } from '@/audio/useNarration';
import { MuseumButton } from '@/buttons/MuseumButton';
import { GlassCard } from '@/cards/GlassCard';
import { ArtworkVisual } from '@/common/ArtworkVisual';
import { MuseumSelect } from '@/common/MuseumSelect';
import { ArtworkViewerDialog } from '@/dialogs/ArtworkViewerDialog';
import { useArtwork, useMuseumOverview } from '@/hooks/useMuseumData';
import { useFavoritesStore } from '@/store/favoritesStore';

export function PaintingPage() {
  const { paintingId } = useParams();
  const { data: artwork } = useArtwork(paintingId ?? '');
  const { data: overview } = useMuseumOverview();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const [language, setLanguage] = useState('en-US');
  const [viewerOpen, setViewerOpen] = useState(false);
  const narrationText = useMemo(() => getLocalizedNarrationText(artwork, language), [artwork, language]);
  const narration = useNarration({ text: narrationText, language });

  const relatedArtworks = overview?.artworks.filter((entry) => artwork?.relatedIds.includes(entry.id)) ?? [];

  if (!artwork) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Painting Details | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-6">
            <ArtworkVisual title={artwork.title} artist={artwork.artist} palette={artwork.palette} imageUrl={artwork.imageUrl ?? artwork.thumbnailUrl} className="h-[620px]" />
          </GlassCard>
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-museum-gold">Painting Details</p>
            <h1 className="mt-4 font-display text-5xl text-white">{artwork.title}</h1>
            <Link to={`/artist/${artwork.artistId}`} className="mt-3 inline-flex text-sm uppercase tracking-[0.2em] text-white/70 underline">
              {artwork.artist}
            </Link>
            <p className="mt-6 text-lg leading-8 text-white/68">{artwork.description}</p>
            <div className="mt-8 grid gap-3 text-sm text-white/65 sm:grid-cols-2">
              {artwork.facts.map((fact) => (
                <div key={fact.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">{fact.label}</p>
                  <p className="mt-2 text-white">{fact.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <MuseumButton onClick={() => toggleFavorite(artwork.id)}>
                <HiOutlineBookmark className="mr-2" />
                {favoriteIds.includes(artwork.id) ? 'Saved' : 'Save'}
              </MuseumButton>
              <MuseumButton variant="secondary" onClick={() => setViewerOpen(true)} disabled={!artwork.imageUrl && !artwork.thumbnailUrl}>
                <HiOutlineArrowsPointingOut className="mr-2" />
                HD Viewer
              </MuseumButton>
              <MuseumButton variant="secondary" onClick={narration.play}>
                <HiOutlineSpeakerWave className="mr-2" />
                Listen
              </MuseumButton>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <label className="text-sm text-white/60">Narration language</label>
              <MuseumSelect
                value={language}
                onChange={setLanguage}
                className="min-w-44 rounded-full border border-white/10 bg-white/5 text-sm text-white"
                options={[
                  { value: 'en-US', label: 'English' },
                  { value: 'fr-FR', label: 'French' },
                  { value: 'hi-IN', label: 'Hindi' },
                ]}
              />
            </div>
            {artwork.sourceUrl ? (
              <p className="mt-6 text-sm text-white/55">
                Source: <a href={artwork.sourceUrl} target="_blank" rel="noreferrer" className="text-museum-gold underline">{artwork.sourceName ?? 'External collection'}</a>
              </p>
            ) : null}
          </GlassCard>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Historical Importance</p>
            <p className="mt-4 text-lg leading-8 text-white/68">{artwork.historicalImportance}</p>
            <div className="mt-8 grid gap-3 text-white/65">
              <p><span className="text-white">Technique:</span> {artwork.technique}</p>
              <p><span className="text-white">Medium:</span> {artwork.medium}</p>
              <p><span className="text-white">Dimensions:</span> {artwork.dimensions}</p>
              <p><span className="text-white">Location:</span> {artwork.location}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Annotations</p>
            <div className="mt-5 space-y-4">
              {artwork.annotations.map((annotation) => (
                <div key={annotation.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{annotation.title}</p>
                  <p className="mt-2 text-white/66">{annotation.body}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-4xl text-white">Related artworks</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedArtworks.map((related) => (
              <Link key={related.id} to={`/painting/${related.id}`} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8">
                <ArtworkVisual title={related.title} artist={related.artist} palette={related.palette} imageUrl={related.thumbnailUrl ?? related.imageUrl} className="h-56" />
              </Link>
            ))}
          </div>
        </section>
      </section>
      <ArtworkViewerDialog open={viewerOpen} artwork={artwork} onClose={() => setViewerOpen(false)} />
    </>
  );
}