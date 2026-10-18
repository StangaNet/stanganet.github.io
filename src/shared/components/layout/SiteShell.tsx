import { Outlet } from 'react-router-dom';
import { SiteFooter, type SiteFooterVariant } from '@/shared/components/layout/SiteFooter';
import { SiteHeader, type SiteHeaderVariant } from '@/shared/components/layout/SiteHeader';

type SiteShellProps = {
  variant: Extract<SiteHeaderVariant, 'marketing' | 'about'>;
};

export function SiteShell({ variant }: SiteShellProps) {
  const footerVariant: SiteFooterVariant = variant;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant={variant} />
      <Outlet />
      <SiteFooter variant={footerVariant} />
    </div>
  );
}
