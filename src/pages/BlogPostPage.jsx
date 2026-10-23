import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, ChevronRight, Bookmark, Sparkles, User, Tag } from 'lucide-react';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function BlogPostPage({ posts, profile }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => String(p.id) === String(id));

  // Scroll to top when reading a new post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!post) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Artikel Tidak Ditemukan</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Artikel yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <Link to="/blog" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Kembali ke Daftar Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link artikel berhasil disalin ke clipboard!');
    }
  };

  const otherPosts = posts.filter((p) => String(p.id) !== String(id)).slice(0, 2);

  return (
    <article className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container">
        <div className="blog-article-container">
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="breadcrumb-link">Blog</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--accent-cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>
              {post.title}
            </span>
          </nav>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <Link to="/blog" className="btn btn-secondary btn-sm">
              <ArrowLeft size={15} />
              <span>Semua Artikel</span>
            </Link>

            <button onClick={handleShare} className="btn btn-outline-glow btn-sm" title="Bagikan artikel ini">
              <Share2 size={15} />
              <span>Bagikan</span>
            </button>
          </div>

          {/* Article Header */}
          <header className="blog-article-header">
            <span className="section-tag" style={{ margin: 0, marginBottom: '1rem' }}>
              <Bookmark size={13} />
              <span>{post.category || 'Engineering'}</span>
            </span>

            <h1 className="blog-article-title">{post.title}</h1>

            <div className="blog-meta-row" style={{ fontSize: '0.92rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={15} color="var(--accent-cyan)" />
                <span>
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Terbaru'}
                </span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={15} color="var(--accent-purple)" />
                <span>{post.readTime || '5 menit baca'}</span>
              </div>
              <span>•</span>
              <span>Ditulis oleh <strong>{profile?.name || 'Hiras Parasian'}</strong></span>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <img
              src={getOptimizedImageUrl(post.image, 1200, 600) || post.image}
              alt={post.title}
              className="blog-article-featured-img"
            />
          )}

          {/* Article Body */}
          <div className="blog-article-body">
            {post.content ? (
              <div style={{ whiteSpace: 'pre-line' }}>{post.content}</div>
            ) : (
              <p>{post.summary}</p>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              marginTop: '3.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap'
            }}>
              <Tag size={16} color="var(--accent-cyan)" />
              {post.tags.map((tag, idx) => (
                <span key={idx} className="project-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Box */}
          <div className="author-bio-card">
            <div className="author-avatar">HP</div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Penulis
              </div>
              <h3 style={{ margin: '0.2rem 0 0.5rem 0', fontSize: '1.35rem' }}>{profile?.name || 'Hiras Parasian'}</h3>
              <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {profile?.bio || 'Full-Stack Developer & Cloud Architect yang berfokus membangun produk web modern, scalable, dan interaktif.'}
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {otherPosts.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Artikel Lainnya yang Menarik</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {otherPosts.map((op) => (
                  <Link
                    key={op.id}
                    to={`/blog/${op.id}`}
                    className="glass-card glass-card-interactive"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
                  >
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '0.4rem' }}>
                      {op.category}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>
                      {op.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {op.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
