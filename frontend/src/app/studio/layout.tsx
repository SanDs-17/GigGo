'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, CalendarDays, Package, Image, Building2, Settings, ChevronRight, BadgeCheck } from 'lucide-react';

const navItems = [
  { href: '/studio', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/studio/profile', label: 'Profile', icon: User },
  { href: '/studio/bookings', label: 'Bookings & Requests', icon: CalendarDays },
  { href: '/studio/packages', label: 'Packages & Pricing', icon: Package },
  { href: '/studio/media', label: 'Media Gallery', icon: Image },
  { href: '/studio/facilities', label: 'Facilities', icon: Building2, forVenueOnly: true },
  { href: '/studio/settings', label: 'Settings', icon: Settings },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const providerCategory = 'live_band'; // TODO: Fetch from actual provider state

  const visibleNavItems = navItems.filter(item => 
    !item.forVenueOnly || providerCategory === 'venue'
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Provider Studio</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Manage your listings, bookings, packages and payouts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <aside>
          {/* Provider badge */}
          <div style={{ padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.07)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BadgeCheck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)' }}>Midnight Echo</div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.72rem' }}>Live Band · Verified</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {visibleNavItems.map(item => {
              const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`sidebar-link ${active ? 'active' : ''}`}>
                  <item.icon size={16} />
                  {item.label}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => {
                // Dispatch logout action or handle logout
                window.location.href = '/';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-3)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* Content */}
        <div>{children}</div>
      </div>

      <style>{`@media(max-width:768px){ [style*="grid-template-columns: 220px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
