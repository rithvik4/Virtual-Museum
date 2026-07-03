import { useQuery } from '@tanstack/react-query';

import { getArtworkById, getMuseumOverview, searchArtworks } from '@/services/museumService';
import type { SearchFilters } from '@/types/museum';

export function useMuseumOverview() {
  return useQuery({
    queryKey: ['museum-overview'],
    queryFn: getMuseumOverview,
  });
}

export function useArtwork(artworkId: string) {
  return useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: () => getArtworkById(artworkId),
    enabled: Boolean(artworkId),
  });
}

export function useArtworkSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ['artwork-search', filters],
    queryFn: () => searchArtworks(filters),
  });
}