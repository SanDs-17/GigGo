'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music2, ChevronLeft, ArrowRight, Check } from 'lucide-react';

const roles = [
  {
    id: 'customer',
    icon: '🎉',
    title: 'I want to book talent',
    subtitle: 'Customer',
    features: [
      'Browse verified artists & venues',
      'Pay 25% to lock the date',
      'Review after the event',
    ],
  },
  {
    id: 'provider',
    icon: '🎸',
    title: 'I am a Venue / Artist',
    subtitle: 'Provider',
    features: [
      'List packages for free',
      'Manage requests & payouts',
      'Grow with verified reviews',
    ],
  },
];

export default function OnboardingRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const proceed = () => {
    if (!selected) return;
    if (selected === 'provider') {
      router.push('/onboarding/provider-setup');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', background: 'var(--bg)' }}>
      {/* Bg orb */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '640px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2.5rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
          <ChevronLeft size={16} /> Back to GigGo
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Music2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            How do you want to use GigGo?
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>You can switch roles later from your settings.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          {roles.map(r => (
            <div key={r.id} onClick={() => setSelected(r.id)}
              style={{ padding: '2rem', borderRadius: '1.25rem', border: `2px solid ${selected === r.id ? 'var(--primary)' : 'var(--border)'}`, background: selected === r.id ? 'rgba(168,85,247,0.08)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.25s', boxShadow: selected === r.id ? '0 0 32px var(--primary-glow)' : 'none', position: 'relative' }}>
              {selected === r.id && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
              <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{r.icon}</div>
              <div className="badge badge-purple" style={{ marginBottom: '0.625rem' }}>{r.subtitle}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', lineHeight: 1.3 }}>{r.title}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {r.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-2)' }}>
                    <Check size={13} color="var(--success)" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button onClick={proceed} disabled={!selected} className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>

      <style>{`@media(max-width:560px){ [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
