import { useEffect, useMemo, useRef, useState } from 'react';

type NarrationOptions = {
  text: string;
  language: string;
};

export function useNarration({ text, language }: NarrationOptions) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  const available = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, []);

  const normalizeLang = (value: string) => value.toLowerCase().replace('_', '-').trim();

  const choosePreferredVoice = (voiceList: SpeechSynthesisVoice[], requestedLanguage: string) => {
    const requested = normalizeLang(requestedLanguage);
    const prefix = requested.split('-')[0];

    const byLang = voiceList.find((voice) => normalizeLang(voice.lang) === requested)
      ?? voiceList.find((voice) => normalizeLang(voice.lang).startsWith(`${prefix}-`))
      ?? voiceList.find((voice) => normalizeLang(voice.lang).startsWith(prefix));

    if (byLang) {
      return byLang;
    }

    // Some engines expose Indic voices with non-standard lang tags but descriptive names.
    if (prefix === 'te') {
      return voiceList.find((voice) => voice.name.toLowerCase().includes('telugu')) ?? null;
    }

    if (prefix === 'hi') {
      return voiceList.find((voice) => voice.name.toLowerCase().includes('hindi')) ?? null;
    }

    if (prefix === 'ta') {
      return voiceList.find((voice) => voice.name.toLowerCase().includes('tamil')) ?? null;
    }

    return null;
  };

  const play = () => {
    if (!available) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const currentVoices = window.speechSynthesis.getVoices();
    const voiceList = currentVoices.length > 0 ? currentVoices : voices;
    const preferredVoice = choosePreferredVoice(voiceList, language);

    utterance.lang = preferredVoice?.lang ?? language;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    utterance.rate = rate;
    utterance.onend = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setSpeaking(false);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setSpeaking(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { available, speaking, rate, setRate, play, pause, resume, stop };
}