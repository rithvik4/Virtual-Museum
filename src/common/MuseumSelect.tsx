import { useEffect, useMemo, useRef, useState } from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type MuseumSelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export function MuseumSelect({ value, options, onChange, className, disabled = false }: MuseumSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const wrapperClass = className ?? 'rounded-full border border-white/10 bg-white/5 text-sm text-white';

  return (
    <div ref={rootRef} className={`relative ${wrapperClass}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-full px-4 py-3 text-left text-white outline-none transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label ?? 'Select'}</span>
        <span className={`text-white/60 transition ${open ? 'rotate-180' : ''}`}>v</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-auto rounded-2xl border border-white/15 bg-[#0f1116] p-1 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${isSelected ? 'bg-museum-gold/20 text-museum-gold' : 'text-white/85 hover:bg-white/10'}`}
                role="option"
                aria-selected={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}