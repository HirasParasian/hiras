import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import { BookOpen, ArrowRight, Sparkles, FolderGit2, Star } from 'lucide-react';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function HomePage({
  profile,
  projects,
  posts,
  books,
  isAdmin,
  onSelectProject,
  onEditProject,
  onEditPost,
  onOpenExcelImport
}) {
  const featuredProjects = projects.slice(0, 3);
  const latestPosts = posts.slice(0, 3);
  const featuredBooks = books.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <Hero profile={profile} />

      {/* Featured Projects Section */}
      <section className="section" style={{ background: 'rgba(10, 14, 23, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="section-tag" style={{ margin: 0, marginBottom: '0.75rem' }}>
                <FolderGit2 size={13} />
                <span>Karya Terpilih</span>
              </div>
              <h2 style={{ margin: 0 }}>Proyek Unggulan & Portofolio</h2>
            </div>

            <Link to="/projects" className="btn btn-outline-glow btn-sm">
              <span>Lihat Semua Proyek ({projects.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <Projects
            projects={featuredProjects}
            isAdmin={isAdmin}
            onSelectProject={onSelectProject}
            onEditProject={onEditProject}
          />
        </div>
      </section>

      {/* Reading Shelf / Books Showcase Highlight */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="section-tag" style={{ margin: 0, marginBottom: '0.75rem' }}>
                <BookOpen size={13} />
                <span>Reading Shelf</span>
              </div>
              <h2 style={{ margin: 0 }}>Buku Bacaan & Referensi</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                Daftar buku yang membentuk pola pikir rekayasa perangkat lunak dan arsitektur sistem saya.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={onOpenExcelImport} className="btn btn-secondary btn-sm">
                <span>Upload via Excel</span>
              </button>
              <Link to="/books" className="btn btn-primary btn-sm">
                <span>Buka Rak Buku ({books.length})</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="books-grid">
            {featuredBooks.map((book) => (
              <div key={book.id} className="glass-card glass-card-interactive book-card">
                <div className="book-cover-container" style={{ height: 220 }}>
                  <img
                    src={book.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={book.title}
                    className="book-cover-img"
                    loading="lazy"
                  />
                  <span className={`book-status-pill ${
                    book.status === 'Selesai Dibaca' ? 'book-status-read' :
                    book.status === 'Sedang Dibaca' ? 'book-status-reading' : 'book-status-wishlist'
                  }`}>
                    {book.status}
                  </span>
                </div>
                <div className="book-body">
                  <span className="book-genre-tag">{book.genre}</span>
                  <h3 className="book-title" style={{ fontSize: '1.15rem' }}>{book.title}</h3>
                  <div className="book-author">oleh {book.author}</div>
                  <div className="book-stars-row" style={{ marginBottom: '0.75rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= (book.rating || 5) ? '#fbbf24' : 'none'}
                        color={s <= (book.rating || 5) ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                      />
                    ))}
                  </div>
                  {book.notes && (
                    <div className="book-notes-box" style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
                      "{book.notes}"
                    </div>
                  )}
                  <Link to="/books" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: 'auto' }}>
                    Lihat detail di rak buku →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Articles Highlight */}
      <section className="section" style={{ background: 'rgba(10, 14, 23, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="section-tag" style={{ margin: 0, marginBottom: '0.75rem' }}>
                <Sparkles size={13} />
                <span>Tulisan Terbaru</span>
              </div>
              <h2 style={{ margin: 0 }}>Artikel & Catatan Rekayasa</h2>
            </div>

            <Link to="/blog" className="btn btn-outline-glow btn-sm">
              <span>Buka Semua Artikel ({posts.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="blog-grid">
            {latestPosts.map((post) => (
              <div key={post.id} className="glass-card glass-card-interactive blog-card">
                <Link to={`/blog/${post.id}`} className="blog-card-media">
                  <img
                    src={getOptimizedImageUrl(post.image, 800, 450) || post.image}
                    alt={post.title}
                    className="blog-card-img"
                    loading="lazy"
                  />
                </Link>
                <div className="blog-card-content">
                  <div className="blog-meta-row">
                    <span className="blog-badge">{post.category || 'Tech'}</span>
                    <span>•</span>
                    <span>{post.readTime || '4 menit'}</span>
                  </div>
                  <h3 className="blog-title">
                    <Link to={`/blog/${post.id}`} style={{ color: 'inherit' }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="blog-summary">{post.summary}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="project-link-btn"
                    style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}
                  >
                    <span>Baca Artikel Penuh</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <About profile={profile} />

      {/* Contact Section */}
      <Contact profile={profile} />
    </div>
  );
}
