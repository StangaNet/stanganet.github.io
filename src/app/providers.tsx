import type { ReactNode } from 'react';
import { ThemeProvider } from '@/shared/theme/theme';

export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
