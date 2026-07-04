import type { Artwork } from '@/types/museum';

export const ART_FORM_OPTIONS = [
  'Painting',
  'Writing & Manuscript',
  'Sculpture',
  'Photography',
  'Jewelry',
  'Metalwork',
  'Textile',
  'Digital & Installation',
  'Decorative Object',
] as const;

export type ArtworkArtForm = typeof ART_FORM_OPTIONS[number];

export function getArtworkArtForm(artwork: Artwork): ArtworkArtForm {
  const haystack = [artwork.title, artwork.style, artwork.medium, artwork.technique, artwork.description]
    .join(' ')
    .toLowerCase();

  if (/manuscript|folio|calligraphy|script|writing|text|inscription|ledger/.test(haystack)) {
    return 'Writing & Manuscript';
  }

  if (/painting|pichhwai|ragamala|miniature|tempera|canvas|pigment|wasli/.test(haystack)) {
    return 'Painting';
  }

  if (/photograph|photography|photo|gelatin|daguerreotype|archival print/.test(haystack)) {
    return 'Photography';
  }

  if (/interactive|installation|projection|digital|data sculpture|generative|spatial/.test(haystack)) {
    return 'Digital & Installation';
  }

  if (/jewelry|ornament|diadem|ear ornaments|kundala/.test(haystack)) {
    return 'Jewelry';
  }

  if (/metalwork|copper|bronze|jade|dagger|saber|sword|tool|harpoon|ax blade/.test(haystack)) {
    return 'Metalwork';
  }

  if (/textile|fabric|woven|printed cloth/.test(haystack)) {
    return 'Textile';
  }

  if (/sculpture|stone|ivory|buddha|vishnu|parvati|yaksha|relief|figure|statue|shrine/.test(haystack)) {
    return 'Sculpture';
  }

  return 'Decorative Object';
}