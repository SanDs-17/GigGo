'use client';
import Link from 'next/link';
import { Music2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#07080b', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '5rem 0 3rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music2 size={16} color="#c084fc" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>EventHub</span>
          </Link>
          <p style={{ color: 'var(--text-3)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '300px' }}>
            The premium marketplace for artists, bands and venues — with milestone-protected payments on every booking.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>Marketplace</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/marketplace" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Browse talent</Link>
            <Link href="/marketplace?category=venue" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Venues</Link>
            <Link href="/dashboard" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>My bookings</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>For providers</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/onboarding/role" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Join EventHub</Link>
            <Link href="/studio" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Provider studio</Link>
            <Link href="/studio/packages" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Packages</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/auth" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Sign in</Link>
            <Link href="/dashboard/reviews" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Reviews</Link>
            <Link href="/dashboard/settings" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '0.95rem' }}>Settings</Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="divider" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer [style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
