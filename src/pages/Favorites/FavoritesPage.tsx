import { Helmet } from 'react-helmet-async';

import { ArtworkCard } from '@/cards/ArtworkCard';
import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useProfileStore } from '@/store/profileStore';

export function FavoritesPage() {
  const { data } = useMuseumOverview();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const { tier, xp, achievements, visitedRoomIds } = useProfileStore();

  const favoriteWorks = data?.artworks.filter((artwork) => favoriteIds.includes(artwork.id)) ?? [];
  const completion = data ? Math.round((visitedRoomIds.length / data.rooms.length) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Favorites | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Visitor Profile"
          title="Your museum memory, progress, and saved works."
          description="This surface combines favorites with light gamification so repeat visits feel cumulative."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Membership</p>
            <h3 className="mt-4 font-display text-4xl text-white">{tier}</h3>
            <p className="mt-4 text-white/68">XP {xp} · Completion {completion}%</p>
          </GlassCard>
          <GlassCard className="p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] text-museum-gold">Achievements</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {achievements.map((achievement) => (
                <span key={achievement} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  {achievement}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoriteWorks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              isFavorite
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
    </>
  );
}