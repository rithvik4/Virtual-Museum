import type { ReactNode } from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

type RouteErrorBoundaryProps = {
  children: ReactNode;
};

type RouteErrorBoundaryState = {
  hasError: boolean;
};

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep errors visible in devtools while avoiding full route failure.
    console.error('RouteErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-16">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-museum-gold">Museum Recover</p>
            <h1 className="mt-3 font-display text-4xl text-white">This room failed to load.</h1>
            <p className="mt-4 text-white/70">Open the museum lobby again or continue exploring from gallery.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/museum" className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/85">Retry Museum</Link>
              <Link to="/gallery" className="rounded-full bg-museum-gold px-5 py-2 text-sm text-black">Go to Gallery</Link>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}