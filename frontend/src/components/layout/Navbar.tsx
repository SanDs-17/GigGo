'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Music2, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logout());
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/dashboard', label: 'My Bookings' },
    { href: '/studio', label: 'Provider Studio' },
  ];

  return (
    <header style={{ paddingTop: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', zIndex: 50, marginBottom: '2rem' }}>
      <div className="container glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', borderRadius: '999px', padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music2 size={16} color="#c084fc" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>EventHub</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`btn-ghost ${pathname?.startsWith(l.href) ? 'active-nav' : ''}`}
              style={{ color: pathname?.startsWith(l.href) ? 'var(--accent)' : 'var(--text-2)' }}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hidden-mobile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border-2)', background: 'var(--surface-2)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={12} color="#fff" />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-2)' }}>{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost" style={{ color: 'var(--text-3)', padding: '0.375rem 0.5rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth" className="btn-ghost">Sign in</Link>
              <Link href="/onboarding/role" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.125rem' }}>Get started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }} className="show-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', background: 'var(--surface)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          {user ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="btn-secondary" style={{ width: '100%' }}>
              <LogOut size={16} /> Sign out
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/auth" className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setOpen(false)}>Sign in</Link>
              <Link href="/onboarding/role" className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => setOpen(false)}>Get started</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
