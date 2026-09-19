'use client';
import { useState, useEffect } from 'react';
import { packagesApi, formatINR } from '@/lib/api';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PkgForm { name: string; duration: string; price: string; features: string; }

export default function StudioPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<PkgForm>({ name: '', duration: '', price: '', features: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    packagesApi.list().then(setPackages).catch(console.error);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const features = form.features.split('\n').map(f => f.trim()).filter(Boolean);
      const created = await packagesApi.create({ name: form.name, duration: form.duration, price: Number(form.price), features });
      setPackages(prev => [...prev, { ...created, features }]);
      setForm({ name: '', duration: '', price: '', features: '' });
      setAdding(false);
      toast.success('Package created!');
    } catch {
      toast.error('Failed to create package');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await packagesApi.delete(id);
      setPackages(prev => prev.filter(p => p.id !== id));
      toast.success('Package removed');
    } catch {
      toast.error('Failed to remove package');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Packages & Pricing</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Define what customers can book and at what price.</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={15} /> Add package
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} style={{ padding: '1.5rem', borderRadius: '1rem', border: '2px dashed var(--primary)', background: 'rgba(124,58,237,0.05)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent)' }}>New package</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Package name *</label>
              <input className="input" required placeholder="e.g. Headline Night" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Duration *</label>
              <input className="input" required placeholder="e.g. 3 hours" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Price (₹) *</label>
              <input className="input" required type="number" placeholder="e.g. 75000" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Features (one per line)</label>
            <textarea className="input" rows={4} placeholder="6-piece line-up&#10;Full production&#10;Sound engineer" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Check size={14} /> {saving ? 'Saving...' : 'Save package'}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              <X size={14} /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Packages list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {packages.map(pkg => (
          <div key={pkg.id} style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
              <h3 style={{ fontWeight: 700 }}>{pkg.name}</h3>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '0.25rem' }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(pkg.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginBottom: '0.875rem' }}>{pkg.duration}</p>
            <p style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '1rem' }}>{formatINR(pkg.price)}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {pkg.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                  <Check size={12} color="var(--success)" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
