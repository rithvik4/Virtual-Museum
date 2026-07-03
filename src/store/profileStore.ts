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
      visitedRoomIds: ['egypt', 'renaissance'],
      xp: 1240,
      achievements: ['Curator Circle', 'First Audio Tour', 'Digital Explorer'],
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