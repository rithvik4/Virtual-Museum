import { type ComponentType, lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { RouteLoader } from '@/common/RouteLoader';
import { RootLayout } from '@/layouts/RootLayout';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

const LandingPage = lazy(() => import('@/pages/Landing/LandingPage').then((module) => ({ default: module.LandingPage })));
const MuseumPage = lazy(() => import('@/pages/Museum/MuseumPage').then((module) => ({ default: module.MuseumPage })));
const GalleryPage = lazy(() => import('@/pages/Gallery/GalleryPage').then((module) => ({ default: module.GalleryPage })));
const PaintingPage = lazy(() => import('@/pages/Painting/PaintingPage').then((module) => ({ default: module.PaintingPage })));
const TimelinePage = lazy(() => import('@/pages/Timeline/TimelinePage').then((module) => ({ default: module.TimelinePage })));
const CollectionsPage = lazy(() => import('@/pages/Collections/CollectionsPage').then((module) => ({ default: module.CollectionsPage })));
const FavoritesPage = lazy(() => import('@/pages/Favorites/FavoritesPage').then((module) => ({ default: module.FavoritesPage })));
const SearchPage = lazy(() => import('@/pages/Search/SearchPage').then((module) => ({ default: module.SearchPage })));
const AudioGuidePage = lazy(() => import('@/pages/AudioGuide/AudioGuidePage').then((module) => ({ default: module.AudioGuidePage })));
const EventsPage = lazy(() => import('@/pages/Events/EventsPage').then((module) => ({ default: module.EventsPage })));
const ArtistPage = lazy(() => import('@/pages/Artist/ArtistPage').then((module) => ({ default: module.ArtistPage })));
const AdminPage = lazy(() => import('@/pages/Admin/AdminPage').then((module) => ({ default: module.AdminPage })));

function withLazyElement(Component: ComponentType) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: withLazyElement(LandingPage) },
      { path: 'museum', element: withLazyElement(MuseumPage) },
      { path: 'gallery', element: withLazyElement(GalleryPage) },
      { path: 'painting/:paintingId', element: withLazyElement(PaintingPage) },
      { path: 'timeline', element: withLazyElement(TimelinePage) },
      { path: 'collections', element: withLazyElement(CollectionsPage) },
      { path: 'favorites', element: withLazyElement(FavoritesPage) },
      { path: 'search', element: withLazyElement(SearchPage) },
      { path: 'audio-guide', element: withLazyElement(AudioGuidePage) },
      { path: 'events', element: withLazyElement(EventsPage) },
      { path: 'artist/:artistId', element: withLazyElement(ArtistPage) },
      { path: 'admin', element: withLazyElement(AdminPage) },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);