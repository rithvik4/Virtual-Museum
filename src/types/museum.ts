export type ArtworkAnnotation = {
  id: string;
  title: string;
  body: string;
};

export type ArtworkFact = {
  label: string;
  value: string;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  artistId: string;
  artist: string;
  year: string;
  country: string;
  period: string;
  style: string;
  roomId: string;
  collection: string;
  description: string;
  historicalImportance: string;
  technique: string;
  medium: string;
  dimensions: string;
  location: string;
  audioScript: string;
  relatedIds: string[];
  annotations: ArtworkAnnotation[];
  facts: ArtworkFact[];
  palette: [string, string];
  popularity: number;
  spotlight: boolean;
  sourceName?: string;
  sourceUrl?: string;
  isPublicDomain?: boolean;
};

export type MuseumRoom = {
  id: string;
  name: string;
  theme: string;
  lighting: string;
  floor: string;
  ambience: string;
  music: string;
  description: string;
  highlight: string;
  color: string;
};

export type Artist = {
  id: string;
  name: string;
  country: string;
  period: string;
  biography: string;
  specialties: string[];
};

export type TimelineEra = {
  id: string;
  label: string;
  years: string;
  summary: string;
  highlight: string;
  color: string;
};

export type MuseumEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  category: string;
};

export type CollectionRail = {
  id: string;
  name: string;
  description: string;
  artworkIds: string[];
};

export type MuseumStat = {
  label: string;
  value: string;
  detail: string;
};

export type MuseumDashboardSeries = {
  labels: string[];
  visitors: number[];
  popularity: number[];
  roomTraffic: number[];
};

export type MuseumOverview = {
  artworks: Artwork[];
  rooms: MuseumRoom[];
  artists: Artist[];
  timeline: TimelineEra[];
  collections: CollectionRail[];
  events: MuseumEvent[];
  stats: MuseumStat[];
  dashboard: MuseumDashboardSeries;
};

export type SearchFilters = {
  query: string;
  period: string;
  country: string;
  collection: string;
  roomId: string;
  artForm: string;
};

export type AccessibilitySettings = {
  reduceMotion: boolean;
  highContrast: boolean;
  textScale: 'default' | 'large';
};