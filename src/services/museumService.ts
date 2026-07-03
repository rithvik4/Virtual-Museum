import { museumOverview } from '@/data/museumData';
import type { Artwork, MuseumOverview, SearchFilters } from '@/types/museum';

const delay = async <T>(value: T) => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return value;
};

let museumOverviewPromise: Promise<MuseumOverview> | null = null;

export async function getMuseumOverview(): Promise<MuseumOverview> {
  museumOverviewPromise ??= Promise.resolve(museumOverview);
  return delay(await museumOverviewPromise);
}

export async function getArtworkById(artworkId: string): Promise<Artwork | undefined> {
  const overview = await getMuseumOverview();
  return delay(overview.artworks.find((artwork) => artwork.id === artworkId));
}

export async function searchArtworks(filters: SearchFilters): Promise<Artwork[]> {
  const overview = await getMuseumOverview();
  const normalizedQuery = filters.query.trim().toLowerCase();

  const results = overview.artworks.filter((artwork) => {
    const queryMatch =
      normalizedQuery.length === 0 ||
      [artwork.title, artwork.artist, artwork.country, artwork.period, artwork.style, artwork.collection]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    const periodMatch = filters.period === 'all' || artwork.period === filters.period;
    const countryMatch = filters.country === 'all' || artwork.country === filters.country;
    const collectionMatch = filters.collection === 'all' || artwork.collection === filters.collection;
    const roomMatch = filters.roomId === 'all' || artwork.roomId === filters.roomId;

    return queryMatch && periodMatch && countryMatch && collectionMatch && roomMatch;
  });

  return delay(results);
}