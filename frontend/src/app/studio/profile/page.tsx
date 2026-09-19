'use client';
import { Camera, MapPin, Music2, Globe, ExternalLink, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const categories = [
  { value: 'live_band', label: 'Live Band', icon: '🎸' },
  { value: 'solo_artist', label: 'Solo Artist', icon: '🎤' },
  { value: 'dj', label: 'DJ', icon: '🎧' },
  { value: 'venue', label: 'Venue', icon: '🏛️' },
];

export default function StudioProfilePage() {
  const [formData, setFormData] = useState({
    displayName: 'Midnight Echo',
    category: 'live_band',
    city: 'Bengaluru',
    tagline: 'Six-piece rock & funk collective built for peak-hour crowds.',
    bio: 'Midnight Echo has headlined 400+ weddings, corporate nights and festival stages across India. Full production, in-house sound engineer and a setlist tailored to your crowd.',
    website: '',
    instagram: '',
    youtube: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulate API call
    toast.success('Profile saved successfully!');
  };

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
              <input className="input" name="displayName" value={formData.displayName} onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Category</label>
              <select className="select" name="category" value={formData.category} onChange={handleChange}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>City</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input className="input" name="city" value={formData.city} onChange={handleChange} style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Tagline</label>
            <input className="input" name="tagline" value={formData.tagline} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '0.375rem' }}>Bio</label>
            <textarea className="input" name="bio" rows={5} value={formData.bio} onChange={handleChange} style={{ resize: 'vertical' }} />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Social links</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ position: 'relative' }}>
            <Globe size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="input" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" style={{ paddingLeft: '2.25rem' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <ExternalLink size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="input" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@handle" style={{ paddingLeft: '2.25rem' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <PlayCircle size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="input" name="youtube" value={formData.youtube} onChange={handleChange} placeholder="Channel URL" style={{ paddingLeft: '2.25rem' }} />
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleSave}>Save profile</button>
    </div>
  );
}
