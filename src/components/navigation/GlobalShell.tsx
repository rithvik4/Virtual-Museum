import { PropsWithChildren, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineSparkles } from 'react-icons/hi2';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { HiOutlineEnvelope } from 'react-icons/hi2';

import { AccessibilityDialog } from '@/dialogs/AccessibilityDialog';
const navItems = [
  { to: '/museum', label: 'Museum' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/collections', label: 'Collections' },
  { to: '/favorites', label: 'Favorites' },
];

export function GlobalShell({ children }: PropsWithChildren) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-museum-bg text-white">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-museum-gold focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link to="/" className="font-display text-xl tracking-[0.24em] text-museum-gold uppercase">
            Bharat Virtual Museum
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm tracking-[0.18em] uppercase transition ${
                    isActive ? 'text-museum-gold' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-museum-gold/40 hover:text-white"
            >
              <HiOutlineSparkles className="text-base" />
              Accessibility
            </button>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-museum-gold/40 hover:text-white"
            >
              <HiOutlineMagnifyingGlass className="text-base" />
              Search
            </Link>
          </div>
        </div>
      </header>
      <main id="content">{children}</main>
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-white">Bharat Virtual Museum</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
              An India-first digital museum environment built around story, spatial discovery, and immersive cultural interaction.
            </p>
          </div>
          <div className="text-sm uppercase tracking-[0.18em] text-white/55">
            <p>Open experiences</p>
            <div className="mt-3 space-y-2 normal-case tracking-normal text-white/70">
              <Link to="/museum" className="block">Bharat museum lobby</Link>
              <Link to="/audio-guide" className="block">Audio guide</Link>
            </div>
          </div>
          <div className="text-sm leading-7 text-white/60">
            <p className="uppercase tracking-[0.18em] text-white/55">Current build</p>
            <p className="mt-3">Includes immersive landing, interactive lobby, collection discovery, voice-assisted search, narration, and saved favorites.</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-museum-gold/40 bg-museum-gold/15 px-4 py-2 shadow-[0_0_24px_rgba(212,175,55,0.2)]">
            <p className="text-xs uppercase tracking-[0.18em] text-museum-gold">Created by - Bura Rithvik Kumar</p>
            <div className="h-4 w-px bg-museum-gold/35" aria-hidden="true" />
            <div className="inline-flex items-center gap-2 text-museum-gold">
              <a
                href="https://www.linkedin.com/in/burarithvikkumar/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full p-1 transition hover:bg-museum-gold/20"
              >
                <FaLinkedin className="text-sm" />
              </a>
              <a
                href="https://github.com/rithvik4"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-full p-1 transition hover:bg-museum-gold/20"
              >
                <FaGithub className="text-sm" />
              </a>
              <a
                href="mailto:bura.rithvik@gmail.com"
                aria-label="Email"
                className="rounded-full p-1 transition hover:bg-museum-gold/20"
              >
                <HiOutlineEnvelope className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <AccessibilityDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}