import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { GlassCard } from '@/cards/GlassCard';
import { SectionHeading } from '@/common/SectionHeading';
import { useMuseumOverview } from '@/hooks/useMuseumData';
import { MuseumScene } from '@/museum/MuseumScene';
import { useProfileStore } from '@/store/profileStore';

export function MuseumPage() {
  const { data } = useMuseumOverview();
  const [activeRoomId, setActiveRoomId] = useState('egypt');
  const markRoomVisited = useProfileStore((state) => state.markRoomVisited);

  const activeRoom = data?.rooms.find((room) => room.id === activeRoomId) ?? data?.rooms[0];
  const roomWorks = data?.artworks.filter((artwork) => artwork.roomId === activeRoomId).slice(0, 2) ?? [];

  useEffect(() => {
    if (activeRoomId) {
      markRoomVisited(activeRoomId);
    }
  }, [activeRoomId, markRoomVisited]);

  return (
    <>
      <Helmet>
        <title>Museum Lobby | Virtual Museum</title>
      </Helmet>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Museum Lobby"
          title="A spatial lobby with room portals, atmospheric lighting, and guided discovery."
          description="Orbit the central rotunda, select rooms, and use the side panel as your digital guide. This is a web-friendly interpretation of the full museum navigation system."
        />

        {data ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <MuseumScene rooms={data.rooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
            <GlassCard className="p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-museum-gold">Active Room</p>
              <h2 className="mt-4 font-display text-4xl text-white">{activeRoom?.name}</h2>
              <p className="mt-4 text-white/68">{activeRoom?.description}</p>
              <div className="mt-6 grid gap-3 text-sm text-white/65">
                <p><span className="text-white">Lighting:</span> {activeRoom?.lighting}</p>
                <p><span className="text-white">Floor:</span> {activeRoom?.floor}</p>
                <p><span className="text-white">Ambience:</span> {activeRoom?.ambience}</p>
                <p><span className="text-white">Music:</span> {activeRoom?.music}</p>
                <p><span className="text-white">Highlight:</span> {activeRoom?.highlight}</p>
              </div>
              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">NPC Guide</p>
                <p className="mt-4 text-white/72">
                  Recommendation: begin with {roomWorks[0]?.title ?? 'the signature piece'} and end with {roomWorks[1]?.title ?? 'the experiential installation'} for a balanced narrative arc.
                </p>
              </div>
            </GlassCard>
          </div>
        ) : null}

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
        </div>
      </section>
    </>
  );
}