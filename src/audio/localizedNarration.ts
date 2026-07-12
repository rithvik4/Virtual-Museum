import type { Artwork } from '@/types/museum';

function roomLabelFromId(roomId: string) {
  const map: Record<string, string> = {
    ancientIndia: 'Indus and Early Sacred Arts',
    courtlyIndia: 'Classical and Courtly India',
    modernIndia: 'Modern Indian Movements',
    peopleIndia: 'People and Places of India',
    digitalIndia: 'Digital India Futures',
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
