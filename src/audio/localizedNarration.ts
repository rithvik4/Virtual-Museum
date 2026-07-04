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

function roomLabelFromIdTelugu(roomId: string) {
  const map: Record<string, string> = {
    ancientIndia: 'ప్రాచీన భారత కళల విభాగం',
    courtlyIndia: 'రాజసభ భారత కళల విభాగం',
    modernIndia: 'ఆధునిక భారత కళా ఉద్యమాల విభాగం',
    peopleIndia: 'భారత ప్రజలు మరియు ప్రాంతాల విభాగం',
    digitalIndia: 'డిజిటల్ ఇండియా ఫ్యూచర్స్ విభాగం',
  };

  return map[roomId] ?? 'భారత కళా విభాగం';
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

  if (language.toLowerCase().startsWith('te')) {
    const teluguRoomLabel = roomLabelFromIdTelugu(artwork.roomId);
    return `${artwork.title} కృతిని ${artwork.artist} రూపొందించారు. ఈ కళాకృతి ${artwork.year} కాలానికి చెందినది. `
      + `ఇది ${teluguRoomLabel} లో ప్రదర్శించబడుతోంది. ఈ కృతికి సంబంధించిన చారిత్రక ప్రాధాన్యం: ${artwork.historicalImportance}`;
  }

  return artwork.audioScript;
}
