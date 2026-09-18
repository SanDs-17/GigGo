'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Star, MapPin, Music2, CheckCircle, Shield, TrendingUp, Search, ChevronRight } from 'lucide-react';
import { categoryLabel, formatINR } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { providerService, Provider } from '@/services/providerService';
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.round(rating) ? '#f59e0b' : '#334155'} />
      ))}
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', marginLeft: '0.25rem' }}>{rating}</span>
    </div>
  );
}

function ProviderCard({ p }: { p: Provider }) {
  const pkgs = p.packages || [];
  const minPrice = pkgs.length ? Math.min(...pkgs.map(pkg => pkg.price)) : 0;
  return (
    <Link href={`/provider/${p.slug}`} style={{ textDecoration: 'none', flexShrink: 0, width: '300px' }}>
      <div className="glass card-hover provider-card" style={{ border: '1px solid rgba(255,255,255,0.05)', width: '300px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
          {p.coverImage ? (
            <img src={p.coverImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music2 size={40} color="rgba(255,255,255,0.4)" />
            </div>
          )}
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{p.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b' }}>{p.rating}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {categoryLabel[p.category as keyof typeof categoryLabel]} · {p.city}
          </p>
          {minPrice > 0 && (
            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
              from <span style={{ color: '#fff', fontWeight: 700 }}>{formatINR(minPrice)}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

const steps = [
  { icon: Search, title: 'Discover', desc: 'Browse verified artists, bands, DJs and venues with real reviews and transparent pricing.' },
  { icon: Shield, title: 'Book with 25% advance', desc: 'Lock your date the moment the provider accepts. Only a quarter upfront, held safely.' },
  { icon: CheckCircle, title: 'Pay final on event day', desc: 'Release the remaining 75% once the event is marked complete. No surprises.' },
];

const benefits = [
  { icon: TrendingUp, title: 'Zero listing fees', desc: 'List your packages, gallery and facilities for free. You only pay when you get booked.' },
  { icon: Star, title: 'Verified reviews', desc: 'Ratings come only from customers with a settled booking — no fake stars.' },
  { icon: Shield, title: 'Milestone protection', desc: 'Advance is confirmed before you block the date, and the balance is guaranteed on delivery.' },
];


export default function HomePage() {
  const { data: providers = [], isLoading: loading } = useQuery({
    queryKey: ['featuredProviders'],
    queryFn: providerService.getFeatured,
  });

  const doubled = [...providers, ...providers]; // for infinite scroll

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '8rem 0 6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Background Image & Gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=2000") center/cover', opacity: 0.2, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(9,10,15,0.2) 0%, rgba(9,10,15,1) 100%)' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>
          <div className="badge animate-fade-up" style={{ marginBottom: '2rem', display: 'inline-flex', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-2)', padding: '0.4rem 1rem' }}>
            ✨ 4,800+ events powered this season
          </div>
          <h1 className="animate-fade-up-delay-1" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#fff' }}>
            Book the <span className="gradient-text">Perfect Vibe</span>
          </h1>
          <p className="animate-fade-up-delay-2" style={{ fontSize: '1.25rem', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            India's premium entertainment marketplace — verified artists, bands and venues, booked with milestone-protected payments.
          </p>
          <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap' }}>
            <Link href="/marketplace" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Explore Marketplace <ArrowRight size={18} />
            </Link>
            <Link href="/onboarding/role" className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Join as a Provider
            </Link>
          </div>
          
          {/* Floating search bar */}
          <div className="glass animate-fade-up-delay-3" style={{ margin: '0 auto', maxWidth: '700px', borderRadius: '999px', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 2, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} color="var(--text-3)" style={{ position: 'absolute', left: '1.25rem' }} />
              <input placeholder="Artist, band, DJ or venue" style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '0.75rem 1.25rem 0.75rem 3.25rem', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ flex: 1 }}>
              <input placeholder="City" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: '#fff', padding: '0.75rem 1.25rem', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <Link href="/marketplace" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Search</Link>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem', color: '#fff' }}>
              How GigGo works
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1.1rem' }}>
              Three steps from browsing to a booked, protected event.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {steps.map((s, i) => (
              <div key={s.title} className="glass" style={{ padding: '2.5rem 2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '3.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.03)', lineHeight: 1 }}>
                  0{i + 1}
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                  <s.icon size={22} color="#c084fc" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem', color: '#fff' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){ .how-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── Featured Providers ────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#fff' }}>Featured talent</h2>
              <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', margin: 0 }}>Top rated this month across India.</p>
            </div>
            <Link href="/marketplace" className="btn-ghost" style={{ color: '#fff', marginBottom: '0.2rem' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div style={{ overflow: 'hidden', paddingBottom: '1rem' }}>
          {loading ? (
            <div style={{ display: 'flex', gap: '1.5rem', padding: '0 1.5rem' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ width: '300px', height: '240px', flexShrink: 0, borderRadius: '24px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', padding: '0.5rem 1.5rem' }}>
              <div className="marquee-track">
                {doubled.map((p, i) => <ProviderCard key={`${p.id}-${i}`} p={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Provider CTA ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="glass" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' }}>
            <div style={{ padding: '4rem 3rem' }}>
              <div style={{ color: '#22d3ee', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>For providers</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.2, color: '#fff' }}>
                Turn your calendar into<br />
                <span className="gradient-text">predictable revenue</span>
              </h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                Venues, bands, DJs and solo artists run their whole business from the GigGo studio — requests, packages, media and payouts in one place.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/onboarding/provider-setup" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>Start listing free</Link>
                <Link href="/studio" className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>See the studio</Link>
              </div>
            </div>
            
            <div style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {benefits.map((b) => (
                <div key={b.title} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <b.icon size={20} color="#22d3ee" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem', color: '#fff' }}>{b.title}</h4>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.6 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '1rem', border: '1px solid rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#c084fc', fontWeight: 500, fontSize: '0.95rem' }}>
                <CheckCircle size={18} /> Payouts within 48 hours of settlement.
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
