'use client';

import { useState, useEffect, useCallback } from 'react';

// Brand colors to match dashboard
const ROSE   = '#B76E79';
const BROWN  = '#3A2E2A';
const MUTED  = '#9A7B72';
const BEIGE  = '#F5EDE6';

export default function CampaignsTab() {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts };
  }, []);

  const fetchFilms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/campaign-films', { headers: authHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setFilms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title.trim()) {
      setError('Please enter a title for the video before uploading.');
      return;
    }
    setError('');
    setUploading(true);

    try {
      // 1. Upload video to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      // 2. Save film to database
      const saveRes = await fetch('/api/admin/campaign-films', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, videoUrl: uploadData.url }),
      });

      if (!saveRes.ok) throw new Error('Database save failed');

      setTitle('');
      fetchFilms();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setUploading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/campaign-films/${id}`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    fetchFilms();
  };

  const deleteFilm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this film?')) return;
    await fetch(`/api/admin/campaign-films/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    fetchFilms();
  };

  if (loading) return <p style={{ color: MUTED }}>Loading campaign videos...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: BROWN }}>Upload New Campaign Film</h2>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column', maxWidth: 400 }}>
          {error && <p style={{ margin: 0, color: '#C0504D', fontSize: 13 }}>{error}</p>}
          <input
            type="text"
            placeholder="Video Title (e.g. Summer Collection 2026)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 14, outline: 'none' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{
                opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer'
              }}
            />
            <button
              disabled={uploading}
              style={{
                width: '100%', padding: '12px', background: uploading ? MUTED : ROSE, color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'Uploading Video (This may take a minute)...' : 'Select MP4 File & Upload'}
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: MUTED }}>Maximum file size: 50MB. Cloudinary accepts MP4, WEBM, MOV.</p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: BROWN }}>Current Films</h2>
        {films.length === 0 ? (
          <p style={{ color: MUTED, fontSize: 14 }}>No campaign films uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {films.map((film) => (
              <div key={film._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #EBD9CC', borderRadius: 8, background: BEIGE }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: BROWN }}>{film.title}</h3>
                  <a href={film.videoUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: ROSE, textDecoration: 'none' }}>View Raw Video</a>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button
                    onClick={() => toggleStatus(film._id, film.isActive)}
                    style={{ padding: '6px 12px', background: film.isActive ? '#6B8E6B' : MUTED, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                  >
                    {film.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteFilm(film._id)}
                    style={{ padding: '6px 12px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
