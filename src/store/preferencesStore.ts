import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AccessibilitySettings } from '@/types/museum';

type PreferencesState = AccessibilitySettings & {
  setReduceMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setTextScale: (value: AccessibilitySettings['textScale']) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      reduceMotion: false,
      highContrast: false,
      textScale: 'default',
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setTextScale: (textScale) => set({ textScale }),
    }),
    { name: 'virtual-museum-preferences' },
  ),
);