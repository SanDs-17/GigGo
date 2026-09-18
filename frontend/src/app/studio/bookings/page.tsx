'use client';
import { useEffect, useState } from 'react';
import { studioApi, bookingsApi, Booking, formatINR, statusLabel } from '@/lib/api';
import { CheckCircle, Clock, XCircle, CalendarDays } from 'lucide-react';

function statusClass(status: string) {
  const map: Record<string, string> = {
    requested: 'status-requested', confirmed: 'status-confirmed',
    completed: 'status-completed', settled: 'status-settled', cancelled: 'status-cancelled',
  };
  return map[status] || 'badge badge-gray';
}

export default function StudioBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    studioApi.bookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = ['all', 'requested', 'confirmed', 'completed', 'settled'];
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const handleStatus = async (ref: string, status: any) => {
    try {
      await bookingsApi.updateStatus(ref, status);
      setBookings(prev => prev.map(b => b.booking_ref === ref ? { ...b, status } : b));
    } catch {}
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '0.875rem' }} />)}
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', border: '1px solid', borderColor: filter === t ? 'var(--primary)' : 'var(--border)', background: filter === t ? 'var(--primary)' : 'transparent', color: filter === t ? '#fff' : 'var(--text-2)', fontWeight: 500, fontSize: '0.825rem', cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize', transition: 'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
          <CalendarDays size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(b => (
            <div key={b.id} style={{ padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--accent)' }}>
                      {b.customer?.name?.[0] || '?'}
                    </div>
                    <h3 style={{ fontWeight: 700 }}>{b.customer?.name || 'Customer'}</h3>
                  </div>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                    {b.package?.name} · {new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · #{b.booking_ref}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ fontWeight: 700 }}>{formatINR(b.total_amount)}</span>
                  <span className={statusClass(b.status)}>{statusLabel[b.status]}</span>
                </div>
              </div>
              {b.status === 'requested' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleStatus(b.booking_ref, 'confirmed')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
                    <CheckCircle size={13} /> Accept
                  </button>
                  <button onClick={() => handleStatus(b.booking_ref, 'cancelled')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
                    <XCircle size={13} /> Decline
                  </button>
                </div>
              )}
              {b.status === 'confirmed' && (
                <button onClick={() => handleStatus(b.booking_ref, 'completed')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
                  <Clock size={13} /> Mark complete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
