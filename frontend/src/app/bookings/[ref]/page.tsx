'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Shield, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { bookingsApi, Booking, formatINR, statusLabel } from '@/lib/api';

function statusClass(status: string) {
  const map: Record<string, string> = {
    requested: 'status-requested', confirmed: 'status-confirmed',
    completed: 'status-completed', settled: 'status-settled', cancelled: 'status-cancelled',
  };
  return map[status] || 'badge badge-gray';
}

const statusSteps = ['requested', 'confirmed', 'completed', 'settled'];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ref = params?.ref as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) return;
    bookingsApi.get(ref)
      .then(setBooking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ref]);

  if (loading) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="skeleton" style={{ height: '400px', borderRadius: '1rem' }} />
    </div>
  );

  if (!booking) return (
    <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', color: 'var(--text-3)' }}>
      <h2 style={{ fontWeight: 700 }}>Booking not found</h2>
      <Link href="/dashboard" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Back to Dashboard</Link>
    </div>
  );

  const eventDate = new Date(booking.event_date);
  const stepIndex = statusSteps.indexOf(booking.status);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '760px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-3)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem' }}>
        <ChevronLeft size={16} /> Back to dashboard
      </Link>

      {/* Header */}
      <div style={{ padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Booking reference</p>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>#{booking.booking_ref}</h1>
          </div>
          <span className={statusClass(booking.status)} style={{ fontSize: '0.8rem', padding: '0.375rem 0.875rem' }}>
            {statusLabel[booking.status]}
          </span>
        </div>

        {/* Progress stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem', position: 'relative' }}>
          {statusSteps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < statusSteps.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', zIndex: 1 }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i <= stepIndex ? 'var(--primary)' : 'var(--border)', border: `2px solid ${i <= stepIndex ? 'var(--primary)' : 'var(--border-2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {i < stepIndex ? <CheckCircle size={14} color="#fff" /> : <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === stepIndex ? '#fff' : 'var(--text-3)' }} />}
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 500, color: i <= stepIndex ? 'var(--accent)' : 'var(--text-3)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < statusSteps.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: i < stepIndex ? 'var(--primary)' : 'var(--border)', margin: '0 0.25rem', marginBottom: '1.25rem', transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.375rem' }}>Provider</p>
            <p style={{ fontWeight: 700 }}>{booking.provider?.name || '—'}</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{booking.provider?.city}</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.375rem' }}>Package</p>
            <p style={{ fontWeight: 700 }}>{booking.package?.name || '—'}</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{booking.package?.duration}</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.375rem' }}>Event Date</p>
            <p style={{ fontWeight: 700 }}>{eventDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.375rem' }}>Booked on</p>
            <p style={{ fontWeight: 700 }}>{new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Payment breakdown */}
      <div style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Payment breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.875rem' }}>
              <Shield size={15} color="var(--text-3)" /> Total booking value
            </div>
            <span style={{ fontWeight: 700 }}>{formatINR(booking.total_amount)}</span>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.875rem' }}>
              <CheckCircle size={15} color="var(--success)" /> 25% advance (paid)
            </div>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatINR(booking.advance_amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.875rem' }}>
              <Clock size={15} color="#f59e0b" /> 75% on event day (pending)
            </div>
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>{formatINR(booking.final_amount)}</span>
          </div>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '1.25rem', lineHeight: 1.6 }}>
          The final 75% is released to the provider only after the event is marked complete. You are protected until delivery.
        </p>
      </div>
    </div>
  );
}
