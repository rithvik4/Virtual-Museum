import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { HiArrowDown, HiOutlineSparkles } from 'react-icons/hi2';

import { MuseumLinkButton } from '@/buttons/MuseumButton';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

type NewsletterFormValues = {
  email: string;
};

export function LandingPage() {
  const { data } = useMuseumOverview();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm<NewsletterFormValues>({ defaultValues: { email: '' } });

  const featuredCollections = data?.collections.slice(0, 3) ?? [];

  const onSubmit = handleSubmit(() => {
    setSubmitted(true);
    reset();
  });

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
              Scroll for featured collections, exhibitions, and Bharat curator notes
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

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Latest Exhibition</p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">{data?.events[0]?.title ?? 'Late Light Curator Tour'}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/68">{data?.events[0]?.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm uppercase tracking-[0.18em] text-white/55">
            <span>{data?.events[0]?.date}</span>
            <span>·</span>
            <span>{data?.events[0]?.location}</span>
          </div>
        </GlassCard>
        <GlassCard className="p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Curator's Note</p>
          <p className="mt-5 font-display text-3xl leading-tight text-white">
            We designed this museum to feel less like clicking through pages and more like walking through India’s moods, eras, and shared ways of seeing.
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-white/55">Aarohi Menon, Bharat Digital Curator</p>
        </GlassCard>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Awards & Sponsors</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm uppercase tracking-[0.18em] text-white/65 sm:grid-cols-4">
              {['Awwwards Honoree', 'Design Archive', 'Culture Grid', 'Studio Meridian'].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-5 text-center">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Newsletter</p>
            <h2 className="mt-4 font-display text-4xl text-white">Receive new exhibition stories and curator notes.</h2>
            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
              <input
                {...register('email', { required: true })}
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-white outline-none placeholder:text-white/35 focus:border-museum-gold/35"
              />
              <button type="submit" className="rounded-full bg-museum-gold px-6 py-3 font-semibold text-black">
                Join
              </button>
            </form>
            <p className="mt-4 text-sm text-white/60">{submitted ? 'You are on the curator list.' : 'Monthly dispatches only. No clutter.'}</p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}