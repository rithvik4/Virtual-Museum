import { Helmet } from 'react-helmet-async';

import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { TimelineRail } from '@/common/TimelineRail';
import { useMuseumOverview } from '@/hooks/useMuseumData';

export function TimelinePage() {
  const { data } = useMuseumOverview();

  return (
    <>
      <Helmet>
        <title>Timeline | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Timeline"
          title="A continuous story from sacred symbol to responsive media."
          description="The timeline is organized like a horizontal exhibition rail so the visitor reads history as connected visual shifts rather than isolated dates."
        />
        {data ? <TimelineRail eras={data.timeline} /> : null}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {(data?.timeline ?? []).slice(0, 3).map((era) => (
            <GlassCard key={era.id} className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">{era.years}</p>
              <h3 className="mt-4 font-display text-3xl text-white">{era.label}</h3>
              <p className="mt-4 text-white/66">{era.highlight}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}