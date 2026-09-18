'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Music2 } from 'lucide-react';
import { bookingsApi, Booking, formatINR, statusLabel } from '@/lib/api';

function statusClass(status: string) {
  const map: Record<string, string> = {
    requested: 'status-requested', confirmed: 'status-confirmed',
    completed: 'status-completed', settled: 'status-settled', cancelled: 'status-cancelled',
  };
  return map[status] || 'badge badge-gray';
}

function BookingCard({ booking }: { booking: Booking }) {
  const eventDate = new Date(booking.event_date);
  return (
    <div style={{ padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'border-color 0.2s', marginBottom: '0.75rem' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
      {/* Date box */}
      <div style={{ width: '52px', height: '52px', borderRadius: '0.75rem', background: 'var(--accent-soft)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{eventDate.getDate()}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{eventDate.toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {booking.provider?.name || 'Provider'}
          </h3>
          <span className={statusClass(booking.status)}>{statusLabel[booking.status]}</span>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          {booking.package?.name} · {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>#{booking.booking_ref}</p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{formatINR(booking.total_amount)}</p>
        <Link href={`/bookings/${booking.booking_ref}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
          View details <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi.list()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const active = bookings.filter(b => new Date(b.event_date) >= now || ['requested', 'confirmed'].includes(b.status));
  const past = bookings.filter(b => new Date(b.event_date) < now && !['requested', 'confirmed'].includes(b.status));

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '88px', borderRadius: '0.875rem' }} />)}
    </div>
  );

  if (bookings.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
      <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
      <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-2)' }}>No bookings yet</h3>
      <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Browse the marketplace to find your perfect entertainment.</p>
      <Link href="/marketplace" className="btn-primary">Explore Marketplace</Link>
    </div>
  );

  return (
    <div>
      {active.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Active events</h2>
          {active.map(b => <BookingCard key={b.id} booking={b} />)}
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Past events</h2>
          {past.map(b => <BookingCard key={b.id} booking={b} />)}
        </section>
      )}
    </div>
  );
}
