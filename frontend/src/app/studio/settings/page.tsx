'use client';
import { User, Lock, Bell, CreditCard, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function StudioSettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [account, setAccount] = useState({
    name: user?.name || 'Midnight Echo',
    email: user?.email || 'midnight@echo.com'
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleSave = () => {
    toast.success('Account settings saved!');
  };

  const handleUpdateBank = () => {
    toast.success('Bank details updated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Account */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <User size={18} color="var(--accent)" />
          <h3 style={{ fontWeight: 700 }}>Account settings</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Full name</label>
            <input className="input" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Email</label>
            <input className="input" type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '1.25rem', fontSize: '0.85rem' }} onClick={handleSave}>Save changes</button>
      </div>

      {/* Payout */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <CreditCard size={18} color="var(--accent)" />
          <h3 style={{ fontWeight: 700 }}>Payout settings</h3>
        </div>
        <div style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>✅</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--success)' }}>Bank account verified</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>HDFC Bank ••• 4821</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '360px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Bank account number</label>
            <input className="input" type="password" defaultValue="••••••••4821" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>IFSC code</label>
            <input className="input" defaultValue="HDFC0001234" />
          </div>
        </div>
        <button className="btn-secondary" style={{ marginTop: '1.25rem', fontSize: '0.85rem' }} onClick={handleUpdateBank}>Update bank details</button>
      </div>

      {/* Notifications */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Bell size={18} color="var(--accent)" />
          <h3 style={{ fontWeight: 700 }}>Notifications</h3>
        </div>
        {[
          { label: 'New booking requests', desc: 'Get notified instantly for new requests' },
          { label: 'Payment releases', desc: 'Get notified when payments are released' },
          { label: 'Review alerts', desc: 'Get notified when customers leave reviews' },
          { label: 'Expiring requests', desc: 'Reminders for requests expiring in 24h' },
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

      {/* Danger zone */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
        <h3 style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: '1rem' }}>Danger zone</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Sign out</p>
            <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>Sign out from all devices</p>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
