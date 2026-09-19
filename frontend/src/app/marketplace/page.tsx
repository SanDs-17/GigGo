'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, MapPin, Music2, ChevronRight, X } from 'lucide-react';
import { providersApi, Provider, categoryLabel, formatINR, ProviderCategory } from '@/lib/api';

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.round(rating) ? '#f59e0b' : '#334155'} />
      ))}
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b', marginLeft: '0.125rem' }}>{rating}</span>
    </div>
  );
}

const categories: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live_band', label: 'Live Band' },
  { value: 'solo_artist', label: 'Solo Artist' },
  { value: 'dj', label: 'DJ' },
  { value: 'venue', label: 'Venue' },
];

const catBadgeClass: Record<string, string> = {
  live_band: 'badge-purple', solo_artist: 'badge-amber', dj: 'badge-green', venue: 'badge-gray',
};

export default function MarketplacePage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [minRating, setMinRating] = useState(0);
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    providersApi.list({
      category: category === 'all' ? undefined : category,
      max_price: maxPrice < 300000 ? maxPrice : undefined,
      min_rating: minRating > 0 ? minRating : undefined,
      city: city || undefined,
    })
      .then(setProviders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, maxPrice, minRating, city]);

  const filtered = search
    ? providers.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        (p.tagline || '').toLowerCase().includes(search.toLowerCase())
      )
    : providers;

  const FiltersPanel = () => (
    <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', position: 'sticky', top: '80px', height: 'fit-content', minWidth: '240px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Filters</h3>
        <button onClick={() => { setCategory('all'); setMaxPrice(300000); setMinRating(0); setCity(''); }}
          style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Reset</button>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.625rem' }}>Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {categories.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', background: category === c.value ? 'var(--accent-soft)' : 'transparent', color: category === c.value ? 'var(--accent)' : 'var(--text-2)', fontWeight: category === c.value ? 600 : 400, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.5rem' }}>Max starting price</label>
        <input type="range" min={10000} max={300000} step={100} value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', marginBottom: '0.375rem' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>{formatINR(maxPrice)}</span>
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.625rem' }}>Rating</label>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {[0, 4, 4.5, 4.8].map(r => (
            <button key={r} onClick={() => setMinRating(r)}
              style={{ padding: '0.3rem 0.6rem', borderRadius: '999px', border: '1px solid', borderColor: minRating === r ? 'var(--primary)' : 'var(--border)', background: minRating === r ? 'var(--primary)' : 'transparent', color: minRating === r ? '#fff' : 'var(--text-2)', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', display: 'block', marginBottom: '0.5rem' }}>Location</label>
        <input className="input" placeholder="City or region..." value={city} onChange={e => setCity(e.target.value)} />
      </div>
    </aside>
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>Marketplace</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
          {loading ? 'Loading...' : `${filtered.length} verified provider${filtered.length !== 1 ? 's' : ''} ready for your date.`}
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input className="input" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search artists, bands, venues, cities..." style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category pills (mobile) */}
      <div className="mobile-categories" style={{ gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {categories.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', border: '1px solid', borderColor: category === c.value ? 'var(--primary)' : 'var(--border)', background: category === c.value ? 'var(--primary)' : 'transparent', color: category === c.value ? '#fff' : 'var(--text-2)', fontWeight: 500, fontSize: '0.825rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0 }}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <div className="desktop-sidebar">
          <FiltersPanel />
        </div>

        {/* Grid */}
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '1rem' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
              <Music2 size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>No providers found</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filtered.map(p => {
                const minPrice = p.packages.length ? Math.min(...p.packages.map(pk => pk.price)) : 0;
                return (
                  <Link key={p.id} href={`/provider/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="glass glass-hover provider-card" style={{ border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
                      <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                        {p.cover_image ? (
                          <img src={p.cover_image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Music2 size={48} color="rgba(255,255,255,0.3)" />
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                          <span className={`badge ${catBadgeClass[p.category] || 'badge-purple'}`}>{categoryLabel[p.category]}</span>
                        </div>
                        {p.verified && (
                          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓ Verified</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{p.name}</h2>
                          <StarRating rating={p.rating} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-3)', fontSize: '0.8rem', marginBottom: '0.625rem' }}>
                          <MapPin size={11} /><span>{p.city}</span>
                          <span style={{ marginLeft: '0.25rem', color: 'var(--text-3)', fontSize: '0.75rem' }}>({p.review_count})</span>
                        </div>
                        <p style={{ color: 'var(--text-2)', fontSize: '0.825rem', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.tagline}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {minPrice > 0 && (
                            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>from {formatINR(minPrice)}</span>
                          )}
                          <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: 'auto' }}>
                            View profile <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mobile-categories { display: none !important; }
        @media(max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          .mobile-categories { display: flex !important; }
          [style*="grid-template-columns: 240px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
