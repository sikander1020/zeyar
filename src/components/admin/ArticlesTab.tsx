'use client';

import { useState, useEffect, useCallback } from 'react';

const ROSE  = '#B76E79';
const BROWN = '#3A2E2A';
const MUTED = '#9A7B72';
const BEIGE = '#F5EDE6';
const CREAM = '#FAF7F4';

const TAGS = ['Editorial', 'Style Guide', 'Fabric & Craft', 'Accessory Edit', 'Behind the Brand', 'New Collection', 'Care Guide'];

interface Article {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const emptyForm = () => ({
  title: '',
  tag: 'Editorial',
  excerpt: '',
  body: '',
  coverImage: '',
  readTime: '3 min read',
  isPublished: false,
});

export default function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts    = localStorage.getItem('zaybaash_admin_ts')    ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts };
  }, []);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await fetch('/api/admin/articles', { headers: authHeaders() });
      const data = await res.json() as { articles?: Article[] };
      setArticles(data.articles ?? []);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  }, [authHeaders]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  function startNew() {
    setEditing(null);
    setForm(emptyForm());
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function startEdit(a: Article) {
    setEditing(a);
    setForm({
      title:       a.title,
      tag:         a.tag,
      excerpt:     a.excerpt,
      body:        '',
      coverImage:  a.coverImage,
      readTime:    a.readTime,
      isPublished: a.isPublished,
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.excerpt.trim()) { setError('Excerpt is required.'); return; }
    setSaving(true);
    setError('');
    try {
      let res;
      if (editing) {
        res = await fetch(`/api/admin/articles/${editing._id}`, {
          method: 'PUT',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) throw new Error('Save failed');
      setSuccess(editing ? 'Article updated!' : 'Article created!');
      setShowForm(false);
      fetchArticles();
    } catch (e: any) {
      setError(e.message ?? 'Error saving article');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this article permanently?')) return;
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchArticles();
  }

  async function togglePublish(a: Article) {
    await fetch(`/api/admin/articles/${a._id}`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !a.isPublished }),
    });
    fetchArticles();
  }

  const input = (label: string, key: keyof typeof form, type: 'text' | 'textarea' | 'url' = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: BROWN }}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={4}
          style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 14, resize: 'vertical', fontFamily: 'inherit', outline: 'none', color: BROWN }}
        />
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 14, outline: 'none', color: BROWN }}
        />
      )}
    </div>
  );

  if (loading) return <p style={{ color: MUTED }}>Loading articles…</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: BROWN }}>Journal Articles</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>
            Articles marked as <b>Published</b> appear automatically in the homepage journal carousel.
          </p>
        </div>
        <button
          onClick={startNew}
          style={{ padding: '10px 20px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + New Article
        </button>
      </div>

      {success && <p style={{ color: '#6B8E6B', fontSize: 13, background: '#EFF7EF', padding: '10px 14px', borderRadius: 8 }}>{success}</p>}

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 28 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700, color: BROWN }}>
            {editing ? 'Edit Article' : 'New Article'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            {input('Title *', 'title')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: BROWN }}>Tag / Category</label>
              <select
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 14, outline: 'none', color: BROWN, background: '#fff' }}
              >
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {input('Cover Image URL', 'coverImage', 'url')}
            {input('Read Time (e.g. 4 min read)', 'readTime')}
          </div>
          <div style={{ marginBottom: 18 }}>
            {input('Excerpt (shown in carousel) *', 'excerpt', 'textarea')}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: BROWN, display: 'block', marginBottom: 6 }}>
              Full Article Body (optional)
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={8}
              placeholder="Write the full article here…"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 14, resize: 'vertical', fontFamily: 'inherit', outline: 'none', color: BROWN, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            />
            <label htmlFor="isPublished" style={{ fontSize: 14, color: BROWN, cursor: 'pointer' }}>
              Publish immediately (visible on homepage)
            </label>
          </div>
          {error && <p style={{ color: '#C0504D', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '12px 28px', background: saving ? MUTED : ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Saving…' : editing ? 'Update Article' : 'Create Article'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ padding: '12px 20px', background: BEIGE, color: BROWN, border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Articles list */}
      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: BROWN }}>All Articles ({articles.length})</h3>
        {articles.length === 0 ? (
          <p style={{ color: MUTED, fontSize: 14 }}>No articles yet. Click "New Article" to create your first one.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map((a) => (
              <div
                key={a._id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 18px', border: '1px solid #EBD9CC', borderRadius: 10,
                  background: a.isPublished ? CREAM : BEIGE,
                  borderLeft: `4px solid ${a.isPublished ? '#6B8E6B' : '#EBD9CC'}`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: a.isPublished ? '#C7E5C7' : '#EBD9CC', color: a.isPublished ? '#3A6B3A' : MUTED,
                      padding: '2px 8px', borderRadius: 20,
                    }}>
                      {a.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span style={{ fontSize: 11, color: MUTED, background: '#EBD9CC', padding: '2px 8px', borderRadius: 20 }}>{a.tag}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: BROWN, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: MUTED }}>{a.readTime} · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 16, flexShrink: 0 }}>
                  <button
                    onClick={() => togglePublish(a)}
                    style={{
                      padding: '6px 14px', background: a.isPublished ? '#EBD9CC' : '#6B8E6B',
                      color: a.isPublished ? BROWN : '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {a.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => startEdit(a)}
                    style={{ padding: '6px 14px', background: BEIGE, color: BROWN, border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    style={{ padding: '6px 14px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
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
