import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/cards/GlassCard';
import { ArtworkVisual } from '@/common/ArtworkVisual';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';
import { ImmersiveRoomExperience } from '@/museum/ImmersiveRoomExperience';
import { MuseumScene } from '@/museum/MuseumScene';
import { useProfileStore } from '@/store/profileStore';

export function MuseumPage() {
  const { data } = useMuseumOverview();
  const [activeRoomId, setActiveRoomId] = useState('ancientIndia');
  const [immersiveMode, setImmersiveMode] = useState(false);
  const markRoomVisited = useProfileStore((state) => state.markRoomVisited);

  const activeRoom = data?.rooms.find((room) => room.id === activeRoomId) ?? data?.rooms[0];
  const activeRoomWorks = data?.artworks.filter((artwork) => artwork.roomId === activeRoomId) ?? [];
  const spotlightWorks = [...activeRoomWorks].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
  const routeWorks = [...activeRoomWorks].sort((a, b) => (b.spotlight ? 1 : 0) - (a.spotlight ? 1 : 0)).slice(0, 3);
  const roomArtistCount = new Set(activeRoomWorks.map((artwork) => artwork.artistId)).size;
  const roomCollectionCount = new Set(activeRoomWorks.map((artwork) => artwork.collection)).size;
  const roomAveragePopularity =
    activeRoomWorks.length > 0 ? Math.round(activeRoomWorks.reduce((sum, artwork) => sum + artwork.popularity, 0) / activeRoomWorks.length) : 0;

  useEffect(() => {
    if (activeRoomId) {
      markRoomVisited(activeRoomId);
    }
  }, [activeRoomId, markRoomVisited]);

  return (
    <>
      <Helmet>
        <title>Bharat Museum Lobby | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Bharat Museum Lobby"
          title="A living Indian cultural floor with curated room portals, regional stories, and real-time highlights."
          description="Orbit the rotunda, switch rooms, and follow an evolving route from sacred arts and court ateliers to modern movements and digital India futures."
        />

        {immersiveMode && activeRoom && data ? (
          <ImmersiveRoomExperience
            room={activeRoom}
            artworks={activeRoomWorks}
            rooms={data.rooms}
            onSwitchRoom={setActiveRoomId}
            onExit={() => setImmersiveMode(false)}
          />
        ) : null}

        {!immersiveMode ? (
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setImmersiveMode(true)}
              className="rounded-full border border-museum-gold/35 bg-museum-gold/12 px-5 py-2 text-sm uppercase tracking-[0.16em] text-museum-gold transition hover:bg-museum-gold/20"
            >
              Enter 360 Bharat Walkthrough
            </button>
          </div>
        ) : null}

        {!immersiveMode ? <AnimatePresence mode="wait">
          {activeRoom ? (
            <motion.div
              key={`metrics-${activeRoom.id}`}
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.985 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mt-8"
            >
              <GlassCard className="overflow-hidden">
                <div
                  className="grid gap-4 p-6 md:grid-cols-4"
                  style={{ background: `linear-gradient(120deg, ${activeRoom.color}26 0%, rgba(0,0,0,0) 62%)` }}
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Now Entering</p>
                    <p className="mt-2 font-display text-3xl text-white">{activeRoom.name}</p>
                    <p className="mt-2 text-sm text-white/70">{activeRoom.theme}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Works in Room</p>
                    <p className="mt-2 font-display text-3xl text-white">{activeRoomWorks.length}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Artists</p>
                    <p className="mt-2 font-display text-3xl text-white">{roomArtistCount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Avg Popularity</p>
                    <p className="mt-2 font-display text-3xl text-white">{roomAveragePopularity}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ) : null}
        </AnimatePresence> : null}

        {data && !immersiveMode ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <MuseumScene rooms={data.rooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`panel-${activeRoom?.id ?? 'none'}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <GlassCard className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-museum-gold">Active Room</p>
                      <h2 className="mt-4 font-display text-4xl text-white">{activeRoom?.name}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImmersiveMode(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-museum-gold/35 bg-museum-gold/12 px-4 py-2 text-sm uppercase tracking-[0.14em] text-museum-gold transition hover:bg-museum-gold/20"
                    >
                      Enter 360 Room
                    </button>
                  </div>
                  <p className="mt-4 text-white/68">{activeRoom?.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/50">Music cue: {activeRoom?.music}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/70">{roomCollectionCount} Collections</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/70">{activeRoomWorks.length} Works</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/70">Color Tone {activeRoom?.color}</span>
                  </div>
                  <div className="mt-6 grid gap-3 text-sm text-white/65">
                    <p><span className="text-white">Lighting:</span> {activeRoom?.lighting}</p>
                    <p><span className="text-white">Floor:</span> {activeRoom?.floor}</p>
                    <p><span className="text-white">Ambience:</span> {activeRoom?.ambience}</p>
                    <p><span className="text-white">Music:</span> {activeRoom?.music}</p>
                    <p><span className="text-white">Highlight:</span> {activeRoom?.highlight}</p>
                  </div>
                  <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Curator Route</p>
                    <div className="mt-4 space-y-3 text-sm text-white/75">
                      {routeWorks.map((work, index) => (
                        <p key={work.id}>
                          <span className="text-museum-gold">Stop {index + 1}:</span>{' '}
                          <Link to={`/painting/${work.id}`} className="underline decoration-white/35 underline-offset-4 hover:text-white">
                            {work.title}
                          </Link>
                        </p>
                      ))}
                      {routeWorks.length === 0 ? <p>Route will appear once room works are loaded.</p> : null}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}

        {!immersiveMode ? <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data?.rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => setActiveRoomId(room.id)}
              className={`rounded-[1.5rem] border px-5 py-5 text-left transition ${room.id === activeRoomId ? 'border-museum-gold/35 bg-museum-gold/10' : 'border-white/10 bg-white/4 hover:bg-white/7'}`}
            >
              <p className="font-display text-2xl text-white">{room.name}</p>
              <p className="mt-2 text-sm leading-7 text-white/62">{room.theme}</p>
            </button>
          ))}
        </div> : null}

        {!immersiveMode ? <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            key={`spotlight-${activeRoom?.id ?? 'none'}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Room Spotlight</p>
            <h3 className="mt-3 font-display text-3xl text-white">Top works in {activeRoom?.name}</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {spotlightWorks.map((work) => (
                <Link key={work.id} to={`/painting/${work.id}`} className="rounded-[1.2rem] border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                  <ArtworkVisual title={work.title} artist={work.artist} palette={work.palette} imageUrl={work.thumbnailUrl ?? work.imageUrl} className="h-44" />
                  <p className="mt-3 font-display text-xl text-white">{work.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">{work.artist}</p>
                </Link>
              ))}
            </div>
            {spotlightWorks.length === 0 ? <p className="mt-4 text-sm text-white/65">No spotlight works found for this room yet.</p> : null}
            </GlassCard>
          </motion.div>

          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Era Compass</p>
            <h3 className="mt-3 font-display text-3xl text-white">Timeline alignment</h3>
            <div className="mt-5 space-y-3">
              {data?.timeline.slice(0, 5).map((era) => (
                <div key={era.id} className="rounded-[1rem] border border-white/10 bg-white/5 p-3">
                  <p className="text-sm uppercase tracking-[0.16em] text-white/70">{era.label}</p>
                  <p className="mt-1 text-xs text-white/60">{era.years}</p>
                  <p className="mt-2 text-sm text-white/78">{era.highlight}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div> : null}
      </section>
    </>
  );
}
