import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';

import { usePreferencesStore } from '@/store/preferencesStore';

export function AppProviders({ children }: PropsWithChildren) {
  const { highContrast, reduceMotion, textScale } = usePreferencesStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    document.documentElement.dataset.motion = reduceMotion ? 'reduced' : 'default';
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'default';
    document.documentElement.dataset.scale = textScale;
  }, [highContrast, reduceMotion, textScale]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}