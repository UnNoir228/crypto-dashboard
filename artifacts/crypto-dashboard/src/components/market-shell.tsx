import { Activity, BarChart3, CircleHelp, Menu, Radio, Search, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';

export function MarketShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Primary navigation">
          <NavItem href="/" icon={BarChart3} label="Market overview" active={location === '/'} />
          <NavItem href="/" icon={Activity} label="Watchlist" active={false} />
        </nav>
        <div className="m-4 rounded-xl border border-sidebar-border bg-sidebar-accent p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-sidebar-foreground"><Radio size={13} className="text-primary" /> Live feed</div>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">Prices refresh when you ask. Built for a quick read, not a trading terminal.</p>
        </div>
        <div className="border-t border-sidebar-border px-4 py-4">
          <button type="button" data-testid="button-help" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><CircleHelp size={15} /> Data notes</button>
        </div>
      </aside>

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open navigation" data-testid="button-open-menu" onClick={() => setMenuOpen(true)} className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Menu size={20} /></button>
            <div className="lg:hidden"><Brand compact /></div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Markets <span className="text-border">/</span> <span className="text-foreground">{location === '/' ? 'Overview' : 'Asset detail'}</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground md:flex"><Search size={14} /><span>Search markets</span><kbd className="ml-5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">/</kbd></div>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Live</span>
          </div>
        </header>
        <main>{children}</main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="h-full w-[270px] bg-sidebar px-3 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><Brand /><button type="button" aria-label="Close navigation" data-testid="button-close-menu" onClick={() => setMenuOpen(false)} className="rounded-md p-2 text-muted-foreground hover:text-foreground"><X size={18} /></button></div>
            <nav className="mt-5 space-y-1"><NavItem href="/" icon={BarChart3} label="Market overview" active={location === '/'} /></nav>
          </aside>
        </div>
      )}
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" data-testid="link-brand" className={`flex items-center gap-2.5 text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${compact ? 'text-sm' : 'px-5 pt-6 text-base'}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
        <span className="absolute h-3.5 w-3.5 rounded-full border-[2px] border-current" /><span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="font-extrabold tracking-tight">signal<span className="text-primary">/</span>market</span>
    </Link>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: typeof BarChart3; label: string; active: boolean }) {
  return <Link href={href} data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}><Icon size={17} className={active ? 'text-primary' : ''} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}</Link>;
}
