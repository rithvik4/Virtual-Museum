import { metOpenAccessCurations } from '@/data/metOpenAccess';
import { museumOverview } from '@/data/museumData';
import type { Artwork, MuseumOverview, SearchFilters } from '@/types/museum';

const delay = async <T,>(value: T) => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return value;
};

type MetObjectResponse = {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  department: string;
  title: string;
  artistDisplayName: string;
  artistNationality: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  country: string;
  objectURL: string;
  repository: string;
  classification: string;
  culture: string;
  period: string;
  tags?: Array<{ term: string }>;
};

const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

let museumOverviewPromise: Promise<MuseumOverview> | null = null;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildArtistId(name: string, objectId: number) {
  return name ? `met-artist-${slugify(name)}` : `met-artist-${objectId}`;
}

function normalizeCollectionName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function buildMetArtwork(meta: MetObjectResponse, curation: (typeof metOpenAccessCurations)[number], relatedIds: string[]): Artwork {
  const artistName = meta.artistDisplayName || 'Unknown artist';
  const year = meta.objectDate || 'Date unknown';
  const country = meta.country || meta.artistNationality || meta.culture || 'Unknown origin';
  const tags = meta.tags?.slice(0, 3).map((tag) => tag.term) ?? [];

  return {
    id: `met-${meta.objectID}`,
    slug: slugify(meta.title || `met-object-${meta.objectID}`),
    title: meta.title,
    imageUrl: meta.primaryImage || meta.primaryImageSmall,
    thumbnailUrl: meta.primaryImageSmall || meta.primaryImage,
    artistId: buildArtistId(artistName, meta.objectID),
    artist: artistName,
    year,
    country,
    period: curation.period || meta.period || 'Historical',
    style: curation.style || meta.classification || 'Museum object',
    roomId: curation.roomId,
    collection: curation.collection,
    description: curation.description,
    historicalImportance: curation.historicalImportance,
    technique: meta.classification || meta.medium || 'Unknown technique',
    medium: meta.medium || 'Unknown medium',
    dimensions: meta.dimensions || 'Dimensions unavailable',
    location: curation.location,
    audioScript: `${meta.title} by ${artistName}. This public-domain work is presented from The Met Open Access collection. Observe the material, composition, and historical context carried through ${meta.medium?.toLowerCase() ?? 'its surface'}.`,
    relatedIds,
    annotations: [
      {
        id: `met-${meta.objectID}-source`,
        title: 'Open access source',
        body: `This artwork is sourced from ${meta.repository} and exposed through The Met Collection API as public-domain media.`,
      },
      {
        id: `met-${meta.objectID}-tags`,
        title: 'Catalog tags',
        body: tags.length > 0 ? tags.join(', ') : 'Catalog tags are limited for this object, so the museum experience focuses on its formal and historical reading.',
      },
    ],
    facts: [
      { label: 'Repository', value: meta.repository || 'The Met' },
      { label: 'Department', value: meta.department || 'Met Collection' },
      { label: 'Public Domain', value: meta.isPublicDomain ? 'Yes' : 'Unknown' },
      { label: 'Object ID', value: String(meta.objectID) },
    ],
    palette: curation.palette,
    popularity: curation.popularity,
    spotlight: curation.spotlight,
    sourceName: 'The Metropolitan Museum of Art',
    sourceUrl: meta.objectURL,
    isPublicDomain: meta.isPublicDomain,
  };
}

async function fetchMetOpenAccessArtworks(): Promise<Artwork[]> {
  const responses = await Promise.all(
    metOpenAccessCurations.map(async (curation) => {
      const response = await fetch(`${MET_API_BASE}/${curation.objectId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Met object ${curation.objectId}`);
      }

      return { curation, object: (await response.json()) as MetObjectResponse };
    }),
  );

  return responses
    .filter(({ object }) => Boolean(object.primaryImage || object.primaryImageSmall))
    .map(({ object, curation }, index, items) => {
      const sameRoomIds = items
        .filter((candidate, candidateIndex) => candidateIndex !== index && candidate.curation.roomId === curation.roomId)
        .slice(0, 2)
        .map((candidate) => `met-${candidate.object.objectID}`);

      return buildMetArtwork(object, curation, sameRoomIds);
    });
}

function mergeMuseumOverview(realArtworks: Artwork[]): MuseumOverview {
  const generatedArtists = realArtworks.map((artwork) => ({
    id: artwork.artistId,
    name: artwork.artist,
    country: artwork.country,
    period: artwork.period,
    biography: `${artwork.artist} is represented here through a public-domain object from The Metropolitan Museum of Art Open Access collection.`,
    specialties: [artwork.style, artwork.medium, artwork.collection],
  }));

  const artistMap = new Map([...museumOverview.artists, ...generatedArtists].map((artist) => [artist.id, artist]));
  const collections = museumOverview.collections.map((collection) => ({ ...collection, artworkIds: [...collection.artworkIds] }));

  const metRoomCounts = new Map<string, number>();
  realArtworks.forEach((artwork) => {
    metRoomCounts.set(artwork.roomId, (metRoomCounts.get(artwork.roomId) ?? 0) + 1);
  });

  const replacementBudget = new Map<string, number>();
  metRoomCounts.forEach((count, roomId) => {
    replacementBudget.set(roomId, Math.max(1, Math.floor(count / 2)));
  });

  const replacedLocalArtworks = museumOverview.artworks.filter((artwork) => {
    const budget = replacementBudget.get(artwork.roomId) ?? 0;
    if (budget <= 0) {
      return true;
    }

    replacementBudget.set(artwork.roomId, budget - 1);
    return false;
  });

  const metCollectionIds = realArtworks.map((artwork) => artwork.id);
  const existingMetCollection = collections.find((collection) => collection.id === 'met-open-access');

  if (existingMetCollection) {
    existingMetCollection.artworkIds = metCollectionIds;
  } else {
    collections.unshift({
      id: 'met-open-access',
      name: 'Met Open Access',
      description: 'Legally reusable public-domain works sourced from The Metropolitan Museum of Art Collection API.',
      artworkIds: metCollectionIds,
    });
  }

  const collectionsByName = new Map(collections.map((collection) => [normalizeCollectionName(collection.name), collection]));

  realArtworks.forEach((artwork) => {
    const normalized = normalizeCollectionName(artwork.collection);
    const collection = collectionsByName.get(normalized);

    if (collection && !collection.artworkIds.includes(artwork.id)) {
      collection.artworkIds.unshift(artwork.id);
    }
  });

  return {
    ...museumOverview,
    artworks: [...realArtworks, ...replacedLocalArtworks],
    artists: [...artistMap.values()],
    collections,
  };
}

async function buildMuseumOverview(): Promise<MuseumOverview> {
  try {
    const realArtworks = await fetchMetOpenAccessArtworks();
    return mergeMuseumOverview(realArtworks);
  } catch {
    return museumOverview;
  }
}

export async function getMuseumOverview(): Promise<MuseumOverview> {
  museumOverviewPromise ??= buildMuseumOverview();
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