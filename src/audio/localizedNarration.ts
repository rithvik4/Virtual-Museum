import type { Artwork } from '@/types/museum';

function roomLabelFromId(roomId: string) {
  const map: Record<string, string> = {
    egypt: 'Ancient Egypt',
    renaissance: 'Renaissance',
    modern: 'Modern Art',
    photography: 'Photography',
    digital: 'Digital Art',
  };

  return map[roomId] ?? roomId;
}

export function getLocalizedNarrationText(artwork: Artwork | undefined, language: string) {
  if (!artwork) {
    return '';
  }

  const roomLabel = roomLabelFromId(artwork.roomId);

  if (language.toLowerCase().startsWith('hi')) {
    return `${artwork.title} कृति ${artwork.artist} द्वारा बनाई गई है। यह कृति ${artwork.year} की है और ${roomLabel} अनुभाग में प्रदर्शित है। `
      + `इसका माध्यम ${artwork.medium} है और शैली ${artwork.style} है। ${artwork.historicalImportance}`;
  }

  return artwork.audioScript;
}