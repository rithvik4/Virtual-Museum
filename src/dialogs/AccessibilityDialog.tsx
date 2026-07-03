import { HiOutlineAdjustmentsHorizontal, HiOutlineMoon, HiOutlineSparkles } from 'react-icons/hi2';

import { GlassCard } from '@/cards/GlassCard';
import { usePreferencesStore } from '@/store/preferencesStore';

type AccessibilityDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AccessibilityDialog({ open, onClose }: AccessibilityDialogProps) {
  const { reduceMotion, highContrast, textScale, setReduceMotion, setHighContrast, setTextScale } = usePreferencesStore();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4 backdrop-blur-md">
      <GlassCard className="w-full max-w-xl p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-museum-gold">Accessibility</p>
            <h2 className="mt-3 font-display text-3xl text-white">Comfort and visibility controls</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/75">
            Close
          </button>
        </div>
        <div className="mt-8 grid gap-4">
          <label className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
            <span className="flex items-center gap-3 text-white">
              <HiOutlineSparkles className="text-museum-gold" />
              Reduce motion
            </span>
            <input type="checkbox" checked={reduceMotion} onChange={(event) => setReduceMotion(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
            <span className="flex items-center gap-3 text-white">
              <HiOutlineMoon className="text-museum-gold" />
              High contrast mode
            </span>
            <input type="checkbox" checked={highContrast} onChange={(event) => setHighContrast(event.target.checked)} />
          </label>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
            <p className="flex items-center gap-3 text-white">
              <HiOutlineAdjustmentsHorizontal className="text-museum-gold" />
              Text scale
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setTextScale('default')}
                className={`rounded-full px-4 py-2 text-sm ${textScale === 'default' ? 'bg-museum-gold text-black' : 'bg-white/8 text-white/75'}`}
              >
                Default
              </button>
              <button
                type="button"
                onClick={() => setTextScale('large')}
                className={`rounded-full px-4 py-2 text-sm ${textScale === 'large' ? 'bg-museum-gold text-black' : 'bg-white/8 text-white/75'}`}
              >
                Large
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}