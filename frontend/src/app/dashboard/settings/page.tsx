'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { User, Mail, Lock, Bell } from 'lucide-react';

export default function DashboardSettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Profile */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <User size={18} color="var(--accent)" />
          <h3 style={{ fontWeight: 700 }}>Profile</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Full name</label>
            <input className="input" defaultValue={user?.name || ''} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Email</label>
            <input className="input" type="email" defaultValue={user?.email || ''} />
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '1.25rem', fontSize: '0.85rem', padding: '0.5rem 1.125rem' }}>Save changes</button>
      </div>

      {/* Password */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Lock size={18} color="var(--accent)" />
          <h3 style={{ fontWeight: 700 }}>Password</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '360px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Current password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>New password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
        </div>
        <button className="btn-secondary" style={{ marginTop: '1.25rem', fontSize: '0.85rem' }}>Update password</button>
      </div>

      {/* Notifications */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Bell size={18} color="var(--accent)" />
          <h3 style={{ fontWeight: 700 }}>Notifications</h3>
        </div>
        {[
          { label: 'Booking confirmations', desc: 'Get notified when a booking is confirmed' },
          { label: 'Payment releases', desc: 'Get notified when a payment is released' },
          { label: 'New reviews', desc: 'Get notified when you receive a review' },
        ].map(n => (
          <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{n.label}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '0.125rem' }}>{n.desc}</p>
            </div>
            <div style={{ width: '40px', height: '22px', borderRadius: '999px', background: 'var(--primary)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ position: 'absolute', right: '3px', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
