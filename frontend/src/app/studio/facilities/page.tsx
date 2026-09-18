'use client';
import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

const defaultFacilities = [
  { id: 1, name: 'In-house PA system', icon: '🔊', description: 'Professional sound setup included' },
  { id: 2, name: 'Stage lighting', icon: '💡', description: 'Full LED rig with operator' },
  { id: 3, name: 'Sound engineer', icon: '🎚️', description: 'Dedicated engineer for the event' },
  { id: 4, name: 'Own instruments', icon: '🎸', description: 'All instruments provided' },
];

const commonFacilities = [
  { name: 'Parking', icon: '🚗' },
  { name: 'Catering', icon: '🍽️' },
  { name: 'Air conditioning', icon: '❄️' },
  { name: 'In-house bar', icon: '🍹' },
  { name: 'Projector & screen', icon: '📽️' },
  { name: 'Wi-Fi', icon: '📶' },
  { name: 'Changing rooms', icon: '🚪' },
  { name: 'Security', icon: '🔒' },
];

export default function StudioFacilitiesPage() {
  const [facilities, setFacilities] = useState(defaultFacilities);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const add = (name: string, icon: string = '✓', desc: string = '') => {
    setFacilities(prev => [...prev, { id: Date.now(), name, icon, description: desc }]);
    setNewName('');
    setNewDesc('');
  };

  const remove = (id: number) => setFacilities(prev => prev.filter(f => f.id !== id));

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Facilities</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Highlight what you provide. This helps customers make faster decisions.</p>
      </div>

      {/* Current facilities */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: '1rem' }}>Your facilities</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.875rem', marginBottom: '1.25rem' }}>
          {facilities.map(f => (
            <div key={f.id} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.06)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', position: 'relative' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{f.name}</p>
                {f.description && <p style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginTop: '0.125rem' }}>{f.description}</p>}
              </div>
              <button onClick={() => remove(f.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '0.125rem', flexShrink: 0, opacity: 0.6, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Quick add */}
        <div style={{ padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.75rem' }}>Quick add common facilities</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {commonFacilities.filter(cf => !facilities.find(f => f.name === cf.name)).map(cf => (
              <button key={cf.name} onClick={() => add(cf.name, cf.icon)}
                style={{ padding: '0.375rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border-2)', background: 'var(--surface-2)', color: 'var(--text-2)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                <Plus size={12} /> {cf.icon} {cf.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom add */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>Add custom facility</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Facility name</label>
            <input className="input" placeholder="e.g. Green room" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Description (optional)</label>
            <input className="input" placeholder="Brief description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          </div>
        </div>
        <button onClick={() => newName && add(newName, '✓', newDesc)} disabled={!newName} className="btn-primary" style={{ fontSize: '0.85rem', opacity: newName ? 1 : 0.4 }}>
          <Plus size={14} /> Add facility
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button className="btn-primary">Save facilities</button>
      </div>
    </div>
  );
}
