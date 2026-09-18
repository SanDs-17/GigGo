'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Music2, ArrowRight, Plus, X } from 'lucide-react';
import { providersApi, authApi } from '@/lib/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const categories = [
  { value: 'live_band', label: 'Live Band', icon: '🎸' },
  { value: 'solo_artist', label: 'Solo Artist', icon: '🎤' },
  { value: 'dj', label: 'DJ', icon: '🎧' },
  { value: 'venue', label: 'Venue', icon: '🏛️' },
];

export default function ProviderSetupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [providerForm, setProviderForm] = useState({ name: '', category: '', city: '', tagline: '', bio: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register({
        email: authForm.email,
        name: authForm.name,
        password: authForm.password,
        role: 'provider',
      });
      if (typeof window !== 'undefined') localStorage.setItem('token', res.access_token);
      dispatch(setAuth(res.user));
      setStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerForm.category) { toast.error('Please select a category'); return; }
    setLoading(true);
    try {
      await providersApi.create({
        name: providerForm.name || authForm.name,
        category: providerForm.category as any,
        city: providerForm.city,
        tagline: providerForm.tagline,
        bio: providerForm.bio,
      });
      toast.success('Provider profile created!');
      router.push('/studio');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <Link href="/onboarding/role" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem' }}>
          <ChevronLeft size={16} /> Back
        </Link>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= s ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: step >= s ? '#fff' : 'var(--text-3)', transition: 'all 0.3s' }}>{s}</div>
              {s < 2 && <div style={{ width: '40px', height: '2px', background: step > s ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />}
            </div>
          ))}
          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            {step === 1 ? 'Create account' : 'Set up your listing'}
          </span>
        </div>

        {step === 1 && (
          <>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create your provider account</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '2rem' }}>List your act or venue for free. You only pay when you get booked.</p>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Full name</label>
                <input className="input" required type="text" placeholder="Your name"
                  value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Email</label>
                <input className="input" required type="email" placeholder="you@example.com"
                  value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Password</label>
                <input className="input" required type="password" placeholder="Min. 8 characters"
                  value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.75rem' }}>
                {loading ? 'Creating account...' : <>Next <ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Set up your listing</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '2rem' }}>Tell customers about your act or venue.</p>
            <form onSubmit={handleProvider} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.5rem' }}>Category *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                  {categories.map(c => (
                    <button key={c.value} type="button" onClick={() => setProviderForm(f => ({ ...f, category: c.value }))}
                      style={{ padding: '0.875rem', borderRadius: '0.75rem', border: `2px solid ${providerForm.category === c.value ? 'var(--primary)' : 'var(--border)'}`, background: providerForm.category === c.value ? 'rgba(124,58,237,0.1)' : 'var(--surface-2)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text)' }}>
                      <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Display name *</label>
                <input className="input" required type="text" placeholder="e.g. Midnight Echo or The Grand Atrium"
                  value={providerForm.name} onChange={e => setProviderForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>City *</label>
                <input className="input" required type="text" placeholder="e.g. Bengaluru, Mumbai, Delhi NCR"
                  value={providerForm.city} onChange={e => setProviderForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Tagline</label>
                <input className="input" type="text" placeholder="One-line description of your act"
                  value={providerForm.tagline} onChange={e => setProviderForm(f => ({ ...f, tagline: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Bio</label>
                <textarea className="input" rows={4} placeholder="Tell customers about your experience, style and what makes you unique..."
                  value={providerForm.bio} onChange={e => setProviderForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                {loading ? 'Creating listing...' : <>Create listing <ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
