import { useCallback, useEffect, useRef, useState } from 'react';

type RoomProfile = {
  baseFrequency: number;
  harmonicFrequency: number;
  wave: OscillatorType;
  filterFrequency: number;
  gain: number;
};

const roomSoundProfiles: Record<string, RoomProfile> = {
  ancientIndia: { baseFrequency: 130.81, harmonicFrequency: 196, wave: 'triangle', filterFrequency: 920, gain: 0.028 },
  courtlyIndia: { baseFrequency: 146.83, harmonicFrequency: 220, wave: 'sine', filterFrequency: 1180, gain: 0.024 },
  modernIndia: { baseFrequency: 164.81, harmonicFrequency: 246.94, wave: 'sawtooth', filterFrequency: 760, gain: 0.022 },
  peopleIndia: { baseFrequency: 110, harmonicFrequency: 174.61, wave: 'triangle', filterFrequency: 980, gain: 0.02 },
  digitalIndia: { baseFrequency: 196, harmonicFrequency: 311.13, wave: 'square', filterFrequency: 1420, gain: 0.018 },
};

export function useAmbientRoomSound(roomId: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const roomRef = useRef(roomId);
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const sourcesRef = useRef<OscillatorNode[]>([]);
  const supported = typeof window !== 'undefined' && (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    if (!contextRef.current) {
      contextRef.current = new AudioContextCtor();
    }

    return contextRef.current;
  }, []);

  const clearOscillators = useCallback(() => {
    const context = contextRef.current;
    if (!context) {
      return;
    }

    sourcesRef.current.forEach((oscillator) => {
      try {
        oscillator.stop(context.currentTime + 0.08);
      } catch {
        // No-op when oscillator was already stopped.
      }
      oscillator.disconnect();
    });
    sourcesRef.current = [];
  }, []);

  const stop = useCallback(() => {
    const context = contextRef.current;
    const gainNode = masterGainRef.current;

    if (context && gainNode) {
      gainNode.gain.cancelScheduledValues(context.currentTime);
      gainNode.gain.setTargetAtTime(0.0001, context.currentTime, 0.08);
    }

    clearOscillators();
    setIsPlaying(false);
  }, [clearOscillators]);

  const start = useCallback(async (targetRoomId: string) => {
    const context = getContext();
    if (!context) {
      return;
    }

    await context.resume();
    clearOscillators();

    const profile = roomSoundProfiles[targetRoomId] ?? roomSoundProfiles.ancientIndia;

    if (!filterRef.current) {
      const filterNode = context.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.Q.value = 1.4;
      filterNode.connect(context.destination);
      filterRef.current = filterNode;
    }

    if (!masterGainRef.current) {
      const masterGain = context.createGain();
      masterGain.gain.value = 0.0001;
      masterGain.connect(filterRef.current);
      masterGainRef.current = masterGain;
    }

    const masterGain = masterGainRef.current;
    const filterNode = filterRef.current;
    if (!masterGain || !filterNode) {
      return;
    }

    filterNode.frequency.setTargetAtTime(profile.filterFrequency, context.currentTime, 0.25);

    const drone = context.createOscillator();
    drone.type = profile.wave;
    drone.frequency.value = profile.baseFrequency;

    const harmonic = context.createOscillator();
    harmonic.type = 'sine';
    harmonic.frequency.value = profile.harmonicFrequency;

    const shimmer = context.createOscillator();
    shimmer.type = 'triangle';
    shimmer.frequency.value = profile.baseFrequency * 2.01;

    const tremolo = context.createOscillator();
    tremolo.type = 'sine';
    tremolo.frequency.value = 0.12;
    const tremoloDepth = context.createGain();
    tremoloDepth.gain.value = profile.gain * 0.2;

    drone.connect(masterGain);
    harmonic.connect(masterGain);
    shimmer.connect(masterGain);
    tremolo.connect(tremoloDepth);
    tremoloDepth.connect(masterGain.gain);

    masterGain.gain.cancelScheduledValues(context.currentTime);
    masterGain.gain.setTargetAtTime(profile.gain, context.currentTime, 0.18);

    drone.start();
    harmonic.start();
    shimmer.start();
    tremolo.start();

    sourcesRef.current = [drone, harmonic, shimmer, tremolo];
    setIsPlaying(true);
  }, [clearOscillators, getContext]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      stop();
      return;
    }

    await start(roomRef.current);
  }, [isPlaying, start, stop]);

  useEffect(() => {
    roomRef.current = roomId;
    if (isPlaying) {
      void start(roomId);
    }
  }, [isPlaying, roomId, start]);

  useEffect(() => () => {
    stop();
  }, [stop]);

  return { isPlaying, toggle, stop, supported: Boolean(supported) };
}
