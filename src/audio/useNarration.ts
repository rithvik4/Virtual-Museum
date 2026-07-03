import { useEffect, useMemo, useRef, useState } from 'react';

type NarrationOptions = {
  text: string;
  language: string;
};

export function useNarration({ text, language }: NarrationOptions) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const available = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, []);

  const play = () => {
    if (!available) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
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