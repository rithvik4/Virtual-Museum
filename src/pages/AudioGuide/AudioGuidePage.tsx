import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
import { HiOutlinePause, HiOutlinePlay, HiOutlineStop } from 'react-icons/hi2';

import { getLocalizedNarrationText } from '@/audio/localizedNarration';
import { useNarration } from '@/audio/useNarration';
import { GlassCard } from '@/cards/GlassCard';
import { MuseumSelect } from '@/common/MuseumSelect';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

export function AudioGuidePage() {
  const { data } = useMuseumOverview();
  const [selectedId, setSelectedId] = useState('sun-mask');
  const [language, setLanguage] = useState('en-US');

  const selectedArtwork = useMemo(
    () => data?.artworks.find((artwork) => artwork.id === selectedId) ?? data?.artworks[0],
    [data, selectedId],
  );

  const narrationText = useMemo(() => getLocalizedNarrationText(selectedArtwork, language), [selectedArtwork, language]);
  const narration = useNarration({ text: narrationText, language });

  return (
    <>
      <Helmet>
        <title>Audio Guide | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Audio Guide"
          title="Narration, captions, and calm playback controls."
          description="This route uses the browser speech engine as a stand-in for produced audio tours, while preserving the playback model and language controls."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Tracks</p>
            <div className="mt-5 space-y-3">
              {data?.artworks.map((artwork) => (
                <button
                  key={artwork.id}
                  type="button"
                  onClick={() => setSelectedId(artwork.id)}
                  className={`w-full rounded-[1.25rem] border px-4 py-4 text-left ${selectedId === artwork.id ? 'border-museum-gold/35 bg-museum-gold/10' : 'border-white/10 bg-white/5'}`}
                >
                  <p className="font-display text-2xl text-white">{artwork.title}</p>
                  <p className="mt-2 text-sm text-white/60">{artwork.artist}</p>
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Now narrating</p>
            <h2 className="mt-4 font-display text-4xl text-white">{selectedArtwork?.title}</h2>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/55">{selectedArtwork?.artist}</p>
            <p className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-lg leading-8 text-white/68">
              {narrationText}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={narration.play} className="rounded-full bg-museum-gold p-3 text-black"><HiOutlinePlay /></button>
              <button type="button" onClick={narration.pause} className="rounded-full border border-white/10 bg-white/5 p-3 text-white"><HiOutlinePause /></button>
              <button type="button" onClick={narration.stop} className="rounded-full border border-white/10 bg-white/5 p-3 text-white"><HiOutlineStop /></button>
              <MuseumSelect
                value={language}
                onChange={setLanguage}
                className="min-w-40 rounded-full border border-white/10 bg-white/5 text-sm text-white"
                options={[
                  { value: 'en-US', label: 'English' },
                  { value: 'fr-FR', label: 'French' },
                  { value: 'hi-IN', label: 'Hindi' },
                  { value: 'ar-SA', label: 'Arabic' },
                ]}
              />
              <input type="range" min="0.75" max="1.5" step="0.05" value={narration.rate} onChange={(event) => narration.setRate(Number(event.target.value))} />
            </div>
            <p className="mt-5 text-sm text-white/58">Captions are shown directly in the transcription panel above. Background ambience and produced voice tracks can be swapped in later without changing the UI contract.</p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}