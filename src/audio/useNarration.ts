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

  const play = () => {
    if (!available) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const requestedLanguage = language.toLowerCase();
    const languagePrefix = requestedLanguage.split('-')[0];
    const preferredVoice = voices.find((voice) => voice.lang.toLowerCase() === requestedLanguage)
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(`${languagePrefix}-`))
      ?? null;

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