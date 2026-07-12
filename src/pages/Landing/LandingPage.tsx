import { Helmet } from 'react-helmet-async';
import { HiArrowDown, HiOutlineSparkles } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

import { MuseumLinkButton } from '@/buttons/MuseumButton';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

export function LandingPage() {
  const { data } = useMuseumOverview();

  const featuredCollections = data?.collections.slice(0, 3) ?? [];
  const allRooms = data?.rooms ?? [];

  return (
    <>
      <Helmet>
        <title>Bharat Virtual Museum | Immersive Indian Exhibitions</title>
      </Helmet>
      <section className="relative h-[calc(100vh-90px)] overflow-hidden px-6 py-4 lg:py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.2),transparent_24%),radial-gradient(circle_at_85%_25%,rgba(139,92,246,0.16),transparent_20%),linear-gradient(180deg,rgba(9,9,9,0.1),rgba(9,9,9,0.88))]" />
        <div className="relative mx-auto grid h-full max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-4 py-2 lg:py-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-museum-gold/25 bg-museum-gold/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-museum-gold">
              <HiOutlineSparkles />
              Immersive Indian museum storytelling
            </span>
            <h1 className="max-w-5xl font-display text-[clamp(2.9rem,7.2vw,5.5rem)] leading-[0.9] text-white">
              Enter a Bharat museum shaped by light, memory, and living Indian culture.
            </h1>
            <p className="max-w-2xl text-[15px] leading-6 text-white/68 sm:text-base">
              Explore curated Indian rooms, cinematic artwork detail, interactive chronology, saved collections, and live narration in one cultural museum journey.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <MuseumLinkButton to="/museum">Explore Museum</MuseumLinkButton>
              <MuseumLinkButton to="/gallery" variant="secondary">
                Browse Gallery
              </MuseumLinkButton>
            </div>
            <div className="hidden items-center gap-3 text-sm uppercase tracking-[0.22em] text-white/50 xl:flex">
              <HiArrowDown className="text-museum-gold" />
              Scroll for featured collections and Indian gallery highlights
            </div>
          </div>
          <div className="grid gap-4 lg:max-h-full">
            <GlassCard className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Collection Snapshot</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[1rem] border border-white/10 bg-white/5 p-3 text-center">
                  <p className="font-display text-3xl text-white">{data?.artworks.length ?? 0}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">Artworks</p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-white/5 p-3 text-center">
                  <p className="font-display text-3xl text-white">{data?.rooms.length ?? 0}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">Rooms</p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-white/5 p-3 text-center">
                  <p className="font-display text-3xl text-white">{data?.artists.length ?? 0}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">Artists</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 lg:min-h-0">
              <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Explore All Rooms</p>
              <div className="mt-4 space-y-3 lg:max-h-[42vh] lg:overflow-y-auto lg:pr-1">
                {allRooms.map((room) => (
                  <Link
                    key={room.id}
                    to={`/museum?room=${room.id}`}
                    className="block rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 transition hover:border-museum-gold/35 hover:bg-white/8"
                  >
                    <p className="text-sm uppercase tracking-[0.18em] text-white/55">{room.name}</p>
                    <p className="mt-1 text-sm text-white/70">{room.theme}</p>
                  </Link>
                ))}
              </div>
            </GlassCard>
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