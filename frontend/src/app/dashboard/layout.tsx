'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, CreditCard, Star, Settings, ChevronRight, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const navItems = [
  { href: '/dashboard', label: 'My Bookings', icon: CalendarDays },
  { href: '/dashboard/payments', label: 'Pending Payments', icon: CreditCard },
  { href: '/dashboard/reviews', label: 'My Reviews', icon: Star },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>My EventHub</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Track your bookings, payments and reviews.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <aside>
          {/* User card */}
          {user && (
            <div style={{ padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
          )}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`sidebar-link ${active ? 'active' : ''}`}>
                  <item.icon size={16} />
                  {item.label}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div>{children}</div>
      </div>

      <style>{`@media(max-width:768px){ [style*="grid-template-columns: 220px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
