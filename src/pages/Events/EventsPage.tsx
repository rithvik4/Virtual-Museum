import { Helmet } from 'react-helmet-async';

import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

export function EventsPage() {
  const { data } = useMuseumOverview();

  return (
    <>
      <Helmet>
        <title>Events | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Events"
          title="Programs that extend the exhibition into conversation."
          description="Tours, workshops, and family experiences designed to make the museum feel lived in rather than merely browsed."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {data?.events.map((event) => (
            <GlassCard key={event.id} className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">{event.category}</p>
              <h2 className="mt-4 font-display text-3xl text-white">{event.title}</h2>
              <p className="mt-4 text-white/70">{event.summary}</p>
              <div className="mt-6 text-sm uppercase tracking-[0.18em] text-white/55">
                <p>{event.date}</p>
                <p className="mt-2">{event.location}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}