import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesState = {
  favoriteIds: string[];
  toggleFavorite: (artworkId: string) => void;
  isFavorite: (artworkId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (artworkId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(artworkId)
            ? state.favoriteIds.filter((id) => id !== artworkId)
            : [...state.favoriteIds, artworkId],
        })),
      isFavorite: (artworkId) => get().favoriteIds.includes(artworkId),
    }),
    { name: 'virtual-museum-favorites' },
  ),
);