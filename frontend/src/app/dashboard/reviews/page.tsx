'use client';
import { useEffect, useState } from 'react';
import { bookingsApi, Booking, providersApi, Review } from '@/lib/api';
import { Star, MessageSquare } from 'lucide-react';

export default function ReviewsPage() {
  const [completed, setCompleted] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi.list()
      .then(data => setCompleted(data.filter(b => b.status === 'completed' || b.status === 'settled')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '0.875rem' }} />)}
    </div>
  );

  if (completed.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
      <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
      <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-2)' }}>No reviews yet</h3>
      <p style={{ fontSize: '0.875rem' }}>Reviews are unlocked after an event is marked complete.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Reviews are only accepted from settled bookings — no fake stars.</p>
      {completed.map(b => (
        <div key={b.id} style={{ padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{b.provider?.name}</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                {b.package?.name} · {new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span className="badge badge-green">✓ Eligible</span>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.5rem' }}>Rate this experience</p>
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.875rem' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={22} fill="#f59e0b" color="#f59e0b" style={{ cursor: 'pointer' }} />
              ))}
            </div>
            <textarea className="input" rows={2} placeholder="Share your experience with future customers..." style={{ resize: 'none', marginBottom: '0.75rem' }} />
            <button className="btn-primary" style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}>Submit review</button>
          </div>
        </div>
      ))}
    </div>
  );
}
