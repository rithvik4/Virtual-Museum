import { Helmet } from 'react-helmet-async';

import { Link } from 'react-router-dom';

import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

export function CollectionsPage() {
  const { data } = useMuseumOverview();

  return (
    <>
      <Helmet>
        <title>Collections | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Collections"
          title="Editorial rails for different ways of exploring the museum."
          description="From hidden treasures to family-friendly pathways, each collection reframes the same archive through a different curatorial lens."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {data?.collections.map((collection) => (
            <GlassCard key={collection.id} className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">{collection.name}</p>
              <h2 className="mt-4 font-display text-3xl text-white">{collection.artworkIds.length} highlights</h2>
              <p className="mt-4 text-white/68">{collection.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {collection.artworkIds.map((artworkId) => (
                  <Link key={artworkId} to={`/painting/${artworkId}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70">
                    {artworkId.replaceAll('-', ' ')}
                  </Link>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}