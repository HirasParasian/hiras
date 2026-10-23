import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Calendar, Clock, ArrowRight, Sparkles, Edit3 } from 'lucide-react';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function BlogPage({ posts, isAdmin, onEditPost }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Categories
  const categories = useMemo(() => {
    const set = new Set(['Semua']);
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="section" style={{ minHeight: '85vh', paddingTop: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <BookOpen size={13} />
            <span>Blog & Catatan Rekayasa Web</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
            Wawasan Teknis & <span className="text-gradient-cyan">Pelajaran Arsitektur</span>
          </h1>
          <p className="section-subtitle">
            Kumpulan artikel mendalam seputar pengembangan web modern, arsitektur serverless, dan optimasi performa digital.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '3rem',
          padding: '1.25rem',
          background: 'rgba(16, 23, 38, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(12px)'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Cari artikel atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingBottom: '0.55rem', paddingTop: '0.55rem', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', margin: '2rem 0' }}>
            <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3>Tidak ada artikel yang cocok</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Coba kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <div key={post.id} className="glass-card glass-card-interactive blog-card">
                <Link to={`/blog/${post.id}`} className="blog-card-media">
                  <img
                    src={getOptimizedImageUrl(post.image, 800, 450) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    className="blog-card-img"
                    loading="lazy"
                  />
                </Link>

                <div className="blog-card-content">
                  <div className="blog-meta-row">
                    <span className="blog-badge">{post.category || 'Tech'}</span>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      <span>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Terbaru'}
                      </span>
                    </div>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} />
                      <span>{post.readTime || '4 menit'}</span>
                    </div>
                  </div>

                  <h3 className="blog-title">
                    <Link to={`/blog/${post.id}`} style={{ color: 'inherit' }}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="blog-summary">
                    {post.summary}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <Link
                      to={`/blog/${post.id}`}
                      className="project-link-btn"
                    >
                      <span>Baca Artikel Lengkap</span>
                      <ArrowRight size={15} />
                    </Link>

                    {isAdmin && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onEditPost(post)}
                        title="Edit Artikel"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
