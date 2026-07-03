import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-museum-bg px-6 text-center text-white">
      <div className="max-w-xl space-y-6">
        <p className="font-mono text-sm uppercase tracking-[0.4em] text-museum-gold">404</p>
        <h1 className="font-display text-5xl">The gallery you requested does not exist.</h1>
        <p className="text-white/70">Return to the main experience and continue exploring the collection.</p>
        <Link to="/" className="inline-flex rounded-full bg-museum-gold px-6 py-3 font-medium text-black">
          Return Home
        </Link>
      </div>
    </div>
  );
}