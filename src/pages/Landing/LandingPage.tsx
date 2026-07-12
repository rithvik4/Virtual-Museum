import { Helmet } from 'react-helmet-async';
import { HiArrowDown, HiOutlineSparkles } from 'react-icons/hi2';

import { MuseumLinkButton } from '@/buttons/MuseumButton';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

export function LandingPage() {
  const { data } = useMuseumOverview();

  const featuredCollections = data?.collections.slice(0, 3) ?? [];

  return (
    <>
      <Helmet>
        <title>Bharat Virtual Museum | Immersive Indian Exhibitions</title>
      </Helmet>
      <section className="relative overflow-hidden px-6 pb-14 pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.2),transparent_24%),radial-gradient(circle_at_85%_25%,rgba(139,92,246,0.16),transparent_20%),linear-gradient(180deg,rgba(9,9,9,0.1),rgba(9,9,9,0.88))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-8 py-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-museum-gold/25 bg-museum-gold/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-museum-gold">
              <HiOutlineSparkles />
              Award-worthy museum storytelling
            </span>
            <h1 className="max-w-5xl font-display text-6xl leading-[0.95] text-white sm:text-7xl lg:text-[7.5rem]">
              Enter a Bharat museum shaped by light, memory, and living Indian culture.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
              Explore curated Indian rooms, cinematic artwork detail, interactive chronology, saved collections, live narration, and a responsive digital lobby inspired by contemporary Indian cultural institutions.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <MuseumLinkButton to="/museum">Explore Museum</MuseumLinkButton>
              <MuseumLinkButton to="/gallery" variant="secondary">
                Browse Gallery
              </MuseumLinkButton>
            </div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-white/50">
              <HiArrowDown className="text-museum-gold" />
              Scroll for featured collections and Indian gallery highlights
            </div>
          </div>
          <div className="grid gap-4">
            {data?.stats.map((stat) => (
              <GlassCard key={stat.label} className="p-6">
                <p className="font-mono text-3xl text-museum-gold">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/60">{stat.label}</p>
                <p className="mt-3 text-sm leading-7 text-white/65">{stat.detail}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18">
        <SectionHeading
          eyebrow="Featured Collections"
          title="Curated rails with Indian editorial rhythm."
          description="Each collection is arranged like a gallery essay, balancing iconic Indian works with quieter discoveries."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredCollections.map((collection) => (
            <GlassCard key={collection.id} className="p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">{collection.name}</p>
              <h3 className="mt-4 font-display text-3xl text-white">{collection.artworkIds.length} works</h3>
              <p className="mt-4 text-white/68">{collection.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

    </>
  );
}