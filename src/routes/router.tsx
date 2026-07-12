import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RootLayout } from '@/layouts/RootLayout';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { RouteErrorBoundary } from '@/routes/RouteErrorBoundary';

import { LandingPage } from '@/pages/Landing/LandingPage';
import { MuseumPage } from '@/pages/Museum/MuseumPage';
import { GalleryPage } from '@/pages/Gallery/GalleryPage';
import { PaintingPage } from '@/pages/Painting/PaintingPage';
import { TimelinePage } from '@/pages/Timeline/TimelinePage';
import { CollectionsPage } from '@/pages/Collections/CollectionsPage';
import { FavoritesPage } from '@/pages/Favorites/FavoritesPage';
import { SearchPage } from '@/pages/Search/SearchPage';
import { AudioGuidePage } from '@/pages/AudioGuide/AudioGuidePage';
import { ArtistPage } from '@/pages/Artist/ArtistPage';

function withLazyElement(Component: ComponentType) {
  return <Component />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withLazyElement(LandingPage) },
      {
        path: 'museum',
        element: (
          <RouteErrorBoundary>
            <MuseumPage />
          </RouteErrorBoundary>
        ),
      },
      { path: 'gallery', element: withLazyElement(GalleryPage) },
      { path: 'painting/:paintingId', element: withLazyElement(PaintingPage) },
      { path: 'timeline', element: withLazyElement(TimelinePage) },
      { path: 'collections', element: withLazyElement(CollectionsPage) },
      { path: 'favorites', element: withLazyElement(FavoritesPage) },
      { path: 'search', element: withLazyElement(SearchPage) },
      { path: 'audio-guide', element: withLazyElement(AudioGuidePage) },
      { path: 'artist/:artistId', element: withLazyElement(ArtistPage) },
    ],
  },
  {
    path: '/events',
    element: <Navigate to="/museum" replace />,
  },
  {
    path: '/event',
    element: <Navigate to="/museum" replace />,
  },
  {
    path: '/musem',
    element: <Navigate to="/museum" replace />,
  },
  {
    path: '/museam',
    element: <Navigate to="/museum" replace />,
  },
  {
    path: '/musuem',
    element: <Navigate to="/museum" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);