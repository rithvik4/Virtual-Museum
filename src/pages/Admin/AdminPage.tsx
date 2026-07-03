import { Helmet } from 'react-helmet-async';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export function AdminPage() {
  const { data } = useMuseumOverview();

  const chartData = {
    labels: data?.dashboard.labels ?? [],
    datasets: [
      {
        label: 'Visitors',
        data: data?.dashboard.visitors ?? [],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        tension: 0.35,
      },
      {
        label: 'Room popularity',
        data: data?.dashboard.roomTraffic ?? [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.16)',
        tension: 0.35,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Admin | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Admin Dashboard"
          title="Operational visibility for collections, visitors, and engagement."
          description="This is a front-end simulation of the museum control room, combining stats, charting, and collection management entry points."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {data?.stats.map((stat) => (
            <GlassCard key={stat.label} className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">{stat.label}</p>
              <h3 className="mt-4 font-display text-4xl text-white">{stat.value}</h3>
              <p className="mt-3 text-white/65">{stat.detail}</p>
            </GlassCard>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="p-6">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { labels: { color: '#ffffff' } } },
                scales: {
                  x: { ticks: { color: '#B5B5B5' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                  y: { ticks: { color: '#B5B5B5' }, grid: { color: 'rgba(255,255,255,0.06)' } },
                },
              }}
            />
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Content operations</p>
            <div className="mt-5 space-y-3 text-white/70">
              {['Manage artists', 'Upload paintings', 'Edit audio guides', 'Monitor events', 'Review analytics'].map((task) => (
                <div key={task} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                  {task}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}