import React from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, Edit3 } from 'lucide-react';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function Blog({ posts, isAdmin, onSelectPost, onEditPost }) {
  return (
    <section id="blog" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <BookOpen size={13} />
            <span>Blog & Catatan Teknis</span>
          </div>
          <h2>
            Artikel & <span className="text-gradient-cyan">Berbagi Wawasan</span>
          </h2>
          <p className="section-subtitle">
            Kumpulan tulisan seputar arsitektur cloud serverless, frontend modern, dan best practices software engineering.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-card glass-card-interactive blog-card"
            >
              <div
                className="blog-card-media"
                onClick={() => onSelectPost(post)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={getOptimizedImageUrl(post.image, 800, 450) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                  alt={post.title}
                  className="blog-card-img"
                  loading="lazy"
                />
              </div>

              <div className="blog-card-content">
                <div className="blog-meta-row">
                  <span className="blog-badge">{post.category || 'Engineering'}</span>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} />
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Baru'}</span>
                  </div>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} />
                    <span>{post.readTime || '4 menit'}</span>
                  </div>
                </div>

                <h3
                  className="blog-title"
                  onClick={() => onSelectPost(post)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                </h3>

                <p className="blog-summary">
                  {post.summary}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    className="project-link-btn"
                    onClick={() => onSelectPost(post)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={15} />
                  </button>

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
      </div>
    </section>
  );
}
