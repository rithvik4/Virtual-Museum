import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProfileTier = 'Guest' | 'Member' | 'Premium';

type ProfileState = {
  tier: ProfileTier;
  visitedRoomIds: string[];
  xp: number;
  achievements: string[];
  markRoomVisited: (roomId: string) => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      tier: 'Premium',
      visitedRoomIds: ['ancientIndia', 'courtlyIndia'],
      xp: 1240,
      achievements: ['Bharat Curator Circle', 'First Audio Darshan', 'Digital India Explorer'],
      markRoomVisited: (roomId) =>
        set((state) => ({
          visitedRoomIds: state.visitedRoomIds.includes(roomId)
            ? state.visitedRoomIds
            : [...state.visitedRoomIds, roomId],
          xp: state.visitedRoomIds.includes(roomId) ? state.xp : state.xp + 120,
        })),
    }),
    { name: 'virtual-museum-profile' },
  ),
);
