'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Music2, ChevronLeft, CheckCircle, Shield, Calendar, ArrowRight, BadgeCheck } from 'lucide-react';
import { providersApi, bookingsApi, authApi, Provider, Package, formatINR, categoryLabel } from '@/lib/api';
import toast from 'react-hot-toast';

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} color={i <= Math.round(rating) ? '#f59e0b' : '#334155'} />
      ))}
      <span style={{ fontWeight: 700, color: '#f59e0b' }}>{rating}</span>
      {count !== undefined && <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>({count} reviews)</span>}
    </div>
  );
}

const catBadgeClass: Record<string, string> = {
  live_band: 'badge-purple', solo_artist: 'badge-amber', dj: 'badge-green', venue: 'badge-gray',
};

export default function ProviderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  // Auth from context
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        import('@/lib/api').then(({ authApi }) => {
          authApi.me().then(setUser).catch(() => {});
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    providersApi.get(slug)
      .then(p => { setProvider(p); if (p.packages.length) setSelectedPkg(p.packages[0]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBook = async () => {
    if (!user) { router.push('/auth'); return; }
    if (!selectedPkg || !eventDate) { toast.error('Please select a package and event date'); return; }
    setBooking(true);
    try {
      const b = await bookingsApi.create({
        provider_id: provider!.id,
        package_id: selectedPkg.id,
        event_date: new Date(eventDate).toISOString(),
        notes,
      });
      toast.success(`Booking ${b.booking_ref} created!`);
      router.push(`/bookings/${b.booking_ref}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="skeleton" style={{ height: '300px', borderRadius: '1rem', marginBottom: '2rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        <div><div className="skeleton" style={{ height: '40px', marginBottom: '1rem', borderRadius: '0.5rem' }} /><div className="skeleton" style={{ height: '120px', borderRadius: '0.5rem' }} /></div>
        <div className="skeleton" style={{ height: '400px', borderRadius: '1rem' }} />
      </div>
    </div>
  );

  if (!provider) return (
    <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', color: 'var(--text-3)' }}>
      <Music2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
      <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Provider not found</h2>
      <Link href="/marketplace" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Back to Marketplace</Link>
    </div>
  );

  const advance = selectedPkg ? Math.round(selectedPkg.price * 0.25) : 0;
  const final = selectedPkg ? selectedPkg.price - advance : 0;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Back */}
      <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem', transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
        <ChevronLeft size={16} /> Back to marketplace
      </Link>

      {/* Cover */}
      <div style={{ height: '300px', borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '2.5rem', position: 'relative' }}>
        {provider.cover_image ? (
          <img src={provider.cover_image} alt={provider.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music2 size={72} color="rgba(255,255,255,0.2)" />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,15,0.8) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className={`badge ${catBadgeClass[provider.category] || 'badge-purple'}`}>{categoryLabel[provider.category]}</span>
            {provider.verified && <span className="badge badge-green"><BadgeCheck size={10} /> Verified</span>}
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>{provider.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <StarRating rating={provider.rating} count={provider.review_count} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              <MapPin size={13} /> {provider.city}
            </span>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left */}
        <div>
          {/* Tagline */}
          {provider.tagline && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '1rem' }}>
              {provider.tagline}
            </p>
          )}

          {/* About */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.875rem' }}>About</h2>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>{provider.bio}</p>
          </section>

          {/* Packages */}
          <section>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.25rem' }}>Packages</h2>
            {provider.packages && provider.packages.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {provider.packages.map(pkg => (
                  <div key={pkg.id} onClick={() => setSelectedPkg(pkg)}
                    style={{ padding: '1.5rem', borderRadius: '0.875rem', border: `2px solid ${selectedPkg?.id === pkg.id ? 'var(--primary)' : 'var(--border)'}`, background: selectedPkg?.id === pkg.id ? 'rgba(124,58,237,0.08)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: selectedPkg?.id === pkg.id ? '0 0 24px var(--primary-glow)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                      <h3 style={{ fontWeight: 700 }}>{pkg.name}</h3>
                      {selectedPkg?.id === pkg.id && <CheckCircle size={18} color="var(--primary)" />}
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginBottom: '1rem' }}>{pkg.duration}</p>
                    <p style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', marginBottom: '1rem' }}>{formatINR(pkg.price)}</p>
                    {pkg.features?.length > 0 && (
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {pkg.features.map((f, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-2)' }}>
                            <CheckCircle size={13} color="var(--success)" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem 0' }}>
                This provider hasn't created any packages yet.
              </p>
            )}
          </section>
        </div>

        {/* Booking widget */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div className="glass" style={{ border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.75rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.25rem' }}>Request booking</h3>

            {/* Package select */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.5rem' }}>Package</label>
              {provider.packages && provider.packages.length > 0 ? (
                <select className="select" value={selectedPkg?.id || ''} onChange={e => setSelectedPkg(provider.packages.find(p => p.id === Number(e.target.value)) || null)}>
                  {provider.packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name} — {formatINR(pkg.price)}</option>
                  ))}
                </select>
              ) : (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-3)', fontSize: '0.85rem' }}>
                  No packages available
                </div>
              )}
            </div>

            {/* Event date */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.5rem' }}>Event Date & Time</label>
              <input type="datetime-local" className="input" value={eventDate} onChange={e => setEventDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)} />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.5rem' }}>Notes (optional)</label>
              <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any special requirements..." style={{ resize: 'vertical' }} />
            </div>

            {/* Price breakdown */}
            {selectedPkg && (
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-2)' }}>Total</span>
                  <span style={{ fontWeight: 700 }}>{formatINR(selectedPkg.price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Shield size={12} /> 25% advance (now)</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>{formatINR(advance)}</span>
                </div>
                <div className="divider" style={{ margin: '0.625rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> 75% on event day</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>{formatINR(final)}</span>
                </div>
              </div>
            )}

            <button onClick={handleBook} disabled={booking || !provider.packages?.length} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', opacity: (!provider.packages?.length) ? 0.5 : 1, cursor: (!provider.packages?.length) ? 'not-allowed' : 'pointer' }}>
              {booking ? 'Submitting...' : <>Request booking <ArrowRight size={16} /></>}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.875rem', lineHeight: 1.6 }}>
              Pay only 25% ({selectedPkg ? formatINR(advance) : '—'}) once accepted.<br />75% released after the event is marked complete.
            </p>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){ [style*="grid-template-columns: 1fr 360px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
