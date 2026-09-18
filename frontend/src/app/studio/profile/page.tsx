'use client';
import { Camera, MapPin, Music2, Globe, ExternalLink, PlayCircle } from 'lucide-react';

const categories = [
  { value: 'live_band', label: 'Live Band', icon: '🎸' },
  { value: 'solo_artist', label: 'Solo Artist', icon: '🎤' },
  { value: 'dj', label: 'DJ', icon: '🎧' },
  { value: 'venue', label: 'Venue', icon: '🏛️' },
];

export default function StudioProfilePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Cover + Avatar */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Profile Images</h3>
        <div style={{ height: '160px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--primary) 0%, #4c1d95 100%)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <Camera size={28} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.85rem' }}>Click to upload cover image</p>
          </div>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>Recommended: 1200×400px, max 5MB. JPG or PNG.</p>
      </div>

      {/* Basic info */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Basic information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Display name</label>
              <input className="input" defaultValue="Midnight Echo" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Category</label>
              <select className="select" defaultValue="live_band">
                {categories.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>City</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input className="input" defaultValue="Bengaluru" style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Tagline</label>
            <input className="input" defaultValue="Six-piece rock & funk collective built for peak-hour crowds." />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Bio</label>
            <textarea className="input" rows={5} defaultValue="Midnight Echo has headlined 400+ weddings, corporate nights and festival stages across India. Full production, in-house sound engineer and a setlist tailored to your crowd." style={{ resize: 'vertical' }} />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Social links</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            { icon: Globe, label: 'Website', placeholder: 'https://yourwebsite.com' },
            { icon: ExternalLink, label: 'Instagram', placeholder: '@handle' },
            { icon: PlayCircle, label: 'YouTube', placeholder: 'Channel URL' },
          ].map(s => (
            <div key={s.label} style={{ position: 'relative' }}>
              <s.icon size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input className="input" placeholder={s.placeholder} style={{ paddingLeft: '2.25rem' }} />
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save profile</button>
    </div>
  );
}
