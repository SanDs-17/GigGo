'use client';
import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const mockMedia = [
  { id: 1, url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', type: 'image', caption: 'Live at Lollapalooza India' },
  { id: 2, url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', type: 'image', caption: 'Corporate event - Bengaluru' },
  { id: 3, url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400', type: 'image', caption: 'Wedding reception 2025' },
  { id: 4, url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400', type: 'image', caption: 'Peak hour set' },
  { id: 5, url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400', type: 'image', caption: 'Acoustic set' },
  { id: 6, url: 'https://images.unsplash.com/photo-1571266028243-d220c6a7c0d0?w=400', type: 'image', caption: 'Night performance' },
];

export default function StudioMediaPage() {
  const [media, setMedia] = useState(mockMedia);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remove = (id: number) => setMedia(prev => prev.filter(m => m.id !== id));

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newMedia = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      caption: file.name
    }));

    setMedia(prev => [...newMedia, ...prev]);
    toast.success(`Uploaded ${files.length} item(s) successfully!`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        hidden 
        ref={fileInputRef} 
        accept="image/*,video/*" 
        onChange={(e) => handleFiles(e.target.files)} 
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Media Gallery</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{media.length} items · Shown on your public profile</p>
        </div>
        <button className="btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => fileInputRef.current?.click()}>
          <Upload size={14} /> Upload media
        </button>
      </div>

      {/* Upload zone */}
      <div 
        style={{ border: '2px dashed var(--border-2)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', marginBottom: '2rem', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.04)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem' }}>
          <Plus size={22} color="var(--accent)" />
        </div>
        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Drop files here or click to upload</p>
        <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>JPG, PNG, MP4 · Max 50MB per file</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <span className="badge badge-purple"><ImageIcon size={10} /> Images</span>
          <span className="badge badge-green"><Video size={10} /> Videos</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {media.map(m => (
          <div key={m.id} style={{ borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)', position: 'relative', group: true } as any}
            onMouseEnter={e => { const btn = (e.currentTarget as HTMLElement).querySelector('.delete-btn') as HTMLElement; if (btn) btn.style.opacity = '1'; }}
            onMouseLeave={e => { const btn = (e.currentTarget as HTMLElement).querySelector('.delete-btn') as HTMLElement; if (btn) btn.style.opacity = '0'; }}>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
              <img src={m.url} alt={m.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
            </div>
            <div style={{ padding: '0.625rem 0.75rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.caption}</p>
            </div>
            <button className="delete-btn" onClick={() => remove(m.id)}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
