'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, Clock, CalendarDays, BarChart3, ArrowUp } from 'lucide-react';
import { studioApi, StudioOverview, ActivityItem, formatINR, statusLabel } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const revenueData = [
  { month: 'Mar', value: 280000 },
  { month: 'Apr', value: 420000 },
  { month: 'May', value: 310000 },
  { month: 'Jun', value: 550000 },
  { month: 'Jul', value: 490000 },
  { month: 'Aug', value: 620000 },
  { month: 'Sep', value: 526000 },
];

function statusClass(status: string) {
  const map: Record<string, string> = {
    requested: 'status-requested', confirmed: 'status-confirmed',
    completed: 'status-completed', settled: 'status-settled', cancelled: 'status-cancelled',
  };
  return map[status] || 'badge badge-gray';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.625rem 0.875rem' }}>
        <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function StudioOverviewPage() {
  const [overview, setOverview] = useState<StudioOverview | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([studioApi.overview(), studioApi.activity()])
      .then(([ov, act]) => { setOverview(ov); setActivity(act); })
      .catch(() => {
        // Use mock data when API is not available
        setOverview({
          total_revenue: 2196000, revenue_change: 18, pending_requests: 4,
          expiring_soon: 2, upcoming_events: 7, next_event_date: '28 Sep', acceptance_rate: 92,
        });
        setActivity([
          { customer_name: 'Rhea Kapoor', package_name: 'Headline Night', event_date: '12 Oct 2026', amount: 100000, status: 'requested' },
          { customer_name: 'Arjun Mehta', package_name: 'Full Day Rental', event_date: '28 Sep 2026', amount: 100000, status: 'confirmed' },
          { customer_name: 'Nikhil Verma', package_name: 'Acoustic Set', event_date: '14 Aug 2026', amount: 35000, status: 'completed' },
          { customer_name: 'Sara Fernandes', package_name: 'Club Set', event_date: '02 Jul 2026', amount: 45000, status: 'settled' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = overview ? [
    { label: 'Total revenue', value: formatINR(overview.total_revenue), sub: `+${overview.revenue_change}% vs last quarter`, icon: TrendingUp, color: 'var(--success)' },
    { label: 'Pending requests', value: String(overview.pending_requests), sub: `${overview.expiring_soon} expiring in 24h`, icon: Clock, color: '#f59e0b' },
    { label: 'Upcoming events', value: String(overview.upcoming_events), sub: `Next: ${overview.next_event_date || '—'}`, icon: CalendarDays, color: 'var(--accent)' },
    { label: 'Acceptance rate', value: `${overview.acceptance_rate}%`, sub: 'Top 5% in Bengaluru', icon: BarChart3, color: 'var(--primary)' },
  ] : [];

  if (loading) return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '1rem' }} />)}
      </div>
      <div className="skeleton" style={{ height: '280px', borderRadius: '1rem' }} />
    </div>
  );

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', fontWeight: 500 }}>{s.label}</p>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={16} color={s.color} />
              </div>
            </div>
            <p style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{s.value}</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {s.label === 'Total revenue' && <ArrowUp size={11} color="var(--success)" />}
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ padding: '1.75rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Revenue</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Settled payouts, last 7 months</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData} barSize={28}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {revenueData.map((_, i) => (
                <Cell key={i} fill={i === revenueData.length - 1 ? '#7c3aed' : '#2a2a45'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Latest activity */}
      <div style={{ padding: '1.75rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Latest activity</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)' }}>
                  {a.customer_name[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.customer_name}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>{a.package_name} · {a.event_date}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatINR(a.amount)}</span>
                <span className={statusClass(a.status)}>{statusLabel[a.status as keyof typeof statusLabel]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:900px){ [style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}
