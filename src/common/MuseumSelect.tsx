import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      // Don't close if clicking on the trigger button
      if (rootRef.current.contains(event.target as Node)) {
        return;
      }

      // Don't close if clicking on the dropdown portal
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleWindowScroll = () => {
      if (rootRef.current && dropdownRef.current) {
        const rect = rootRef.current.getBoundingClientRect();
        setDropdownStyle((prev) => ({
          ...prev,
          top: rect.bottom + 8,
          left: rect.left,
        }));
      }
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [open]);

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

      {open
        ? createPortal(
            <div
              ref={dropdownRef}
              style={dropdownStyle}
              className="max-h-72 overflow-auto rounded-2xl border border-white/15 bg-[#0f1116] p-1 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            >
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}