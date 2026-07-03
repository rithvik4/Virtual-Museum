import { Outlet } from 'react-router-dom';

import { GlobalShell } from '@/components/navigation/GlobalShell';

export function RootLayout() {
  return (
    <GlobalShell>
      <Outlet />
    </GlobalShell>
  );
}