'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { bookingsApi, paymentsApi, Booking, formatINR, statusLabel } from '@/lib/api';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error: {
    description: string;
  };
}

interface RazorpayOptions {
  key?: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; };
  theme: { color: string; };
}

interface WindowWithRazorpay extends Window {
  Razorpay: new (options: RazorpayOptions) => {
    on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
    open: () => void;
  };
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    requested: 'status-requested', confirmed: 'status-confirmed',
    completed: 'status-completed', settled: 'status-settled', cancelled: 'status-cancelled',
  };
  return map[status] || 'badge badge-gray';
}

export default function PaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<number | null>(null);

  const handlePayment = async (booking: Booking) => {
    try {
      setPayingId(booking.id);
      const order = await paymentsApi.createOrder(booking.id);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EventHub",
        description: `Advance for ${booking.package?.name}`,
        order_id: order.razorpay_order_id,
        handler: async function (response: RazorpayResponse) {
          try {
            await paymentsApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert('Payment successful!');
            const data = await bookingsApi.list();
            setBookings(data.filter(b => b.status === 'confirmed'));
          } catch (err) {
            console.error(err);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: booking.customer?.name || '',
          email: booking.customer?.email || '',
        },
        theme: {
          color: "#f59e0b"
        }
      };
      
      const rzp = new (window as unknown as WindowWithRazorpay).Razorpay(options);
      rzp.on('payment.failed', function (response: RazorpayErrorResponse) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Could not initialize payment.');
    } finally {
      setPayingId(null);
    }
  };

  useEffect(() => {
    bookingsApi.list()
      .then(data => setBookings(data.filter(b => b.status === 'confirmed')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPending = bookings.reduce((sum, b) => sum + b.final_amount, 0);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '88px', borderRadius: '0.875rem' }} />)}
    </div>
  );

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {bookings.length > 0 && (
        <div style={{ padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#f59e0b' }}>Pending balance: {formatINR(totalPending)}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Released automatically when events are marked complete.</p>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-3)' }}>
          <CreditCard size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-2)' }}>No pending payments</h3>
          <p style={{ fontSize: '0.875rem' }}>Payments appear here once a booking is confirmed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookings.map(b => (
            <div key={b.id} style={{ padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid rgba(245,158,11,0.25)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{b.provider?.name}</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{b.package?.name} · {new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginTop: '0.125rem' }}>#{b.booking_ref}</p>
                </div>
                <span className={statusClass(b.status)}>{statusLabel[b.status]}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Total', value: formatINR(b.total_amount), color: 'var(--text)' },
                  { label: '25% Advance', value: formatINR(b.advance_amount), color: b.razorpay_payment_id ? 'var(--success)' : '#ef4444' },
                  { label: '75% Pending', value: formatINR(b.final_amount), color: '#f59e0b' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '0.75rem', borderRadius: '0.625rem', background: 'var(--surface-2)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                    <p style={{ fontWeight: 700, color: item.color, fontSize: '0.9rem' }}>{item.value}</p>
                  </div>
                ))}
              </div>
              
              {!b.razorpay_payment_id ? (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handlePayment(b)}
                    disabled={payingId === b.id}
                  >
                    {payingId === b.id ? 'Processing...' : 'Pay 25% Advance'}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Advance Paid</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
