import { useEffect, useMemo, useState } from 'react';

export function useVoiceSearch(onTranscript: (value: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  const recognition = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const Constructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    return Constructor ? new Constructor() : null;
  }, []);

  useEffect(() => {
    if (!recognition) {
      return;
    }

    setSupported(true);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
  }, [onTranscript, recognition]);

  return {
    listening,
    supported,
    start: () => {
      recognition?.start();
      setListening(true);
    },
    stop: () => {
      recognition?.stop();
      setListening(false);
    },
  };
}