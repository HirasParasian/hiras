import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Upload, Download, FileSpreadsheet, Star, CheckCircle, Clock, Bookmark, Plus, Edit3, Trash2 } from 'lucide-react';
import { downloadExcelTemplate, exportBooksToExcel } from '../services/excel';
import { deleteBookItem } from '../services/firebase';

export default function BooksPage({ books, isAdmin, onOpenExcelImport, onSelectBook, onEditBook, onRefreshData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.genre?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'Semua' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [books, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = books.length;
    const completed = books.filter((b) => b.status === 'Selesai Dibaca').length;
    const reading = books.filter((b) => b.status === 'Sedang Dibaca').length;
    const wishlist = books.filter((b) => b.status === 'Wishlist').length;
    return { total, completed, reading, wishlist };
  }, [books]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus buku "${title}" dari daftar?`)) return;
    try {
      await deleteBookItem(id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Gagal menghapus buku: ' + err.message);
    }
  };

  return (
    <div className="section" style={{ minHeight: '85vh', paddingTop: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <BookOpen size={13} />
            <span>Reading Tracker & Bookshelf</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
            Daftar Buku & <span className="text-gradient-cyan">Catatan Bacaan</span>
          </h1>
          <p className="section-subtitle">
            Koleksi buku-buku yang telah saya baca seputar Software Engineering, Cloud Architecture, Distributed Systems, dan Pengembangan Diri.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Koleksi
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-bright)', marginTop: '0.25rem' }}>
              {stats.total} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>buku</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '3px solid #10b981' }}>
            <span style={{ fontSize: '0.82rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Selesai Dibaca
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
              {stats.completed}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '3px solid var(--accent-cyan)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sedang Dibaca
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
              {stats.reading}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '3px solid var(--accent-purple)' }}>
            <span style={{ fontSize: '0.82rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Wishlist / Rencana
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', marginTop: '0.25rem' }}>
              {stats.wishlist}
            </div>
          </div>
        </div>

        {/* Excel Import / Export Toolbar */}
        <div className="excel-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenExcelImport}
              className="btn btn-primary btn-sm"
              id="btn-upload-excel"
            >
              <Upload size={15} />
              <span>Upload via Excel (.xlsx / .csv)</span>
            </button>

            <button
              onClick={downloadExcelTemplate}
              className="btn btn-secondary btn-sm"
              title="Unduh format template Excel"
            >
              <Download size={15} />
              <span>Unduh Template Excel</span>
            </button>

            <button
              onClick={() => exportBooksToExcel(books)}
              className="btn btn-secondary btn-sm"
              title="Ekspor list buku saat ini ke file Excel"
            >
              <FileSpreadsheet size={15} />
              <span>Ekspor ke Excel</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Cari judul, penulis, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingBottom: '0.55rem', paddingTop: '0.55rem', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="project-filters" style={{ marginBottom: '2.5rem' }}>
          {['Semua', 'Selesai Dibaca', 'Sedang Dibaca', 'Wishlist'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status} {status === 'Semua' ? `(${books.length})` : ''}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', margin: '2rem 0' }}>
            <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Tidak ada buku yang ditemukan</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 1.5rem auto' }}>
              Tidak ada buku yang cocok dengan pencarian atau filter status yang dipilih. Anda dapat mengunggah file Excel berisi list buku Anda!
            </p>
            <button onClick={onOpenExcelImport} className="btn btn-primary btn-sm">
              <Upload size={15} />
              <span>Upload Buku dari Excel Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="glass-card glass-card-interactive book-card">
                {/* Book Cover */}
                <div className="book-cover-container">
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

                {/* Book Details */}
                <div className="book-body">
                  <div className="book-genre-tag">{book.genre || 'Teknologi'}</div>
                  <h3 className="book-title">{book.title}</h3>
                  <div className="book-author">oleh {book.author}</div>

                  {/* Rating Stars */}
                  <div className="book-stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        fill={star <= (book.rating || 5) ? '#fbbf24' : 'none'}
                        color={star <= (book.rating || 5) ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                      />
                    ))}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '0.4rem' }}>
                      ({book.rating || 5}/5)
                    </span>
                  </div>

                  {/* Notes / Quote */}
                  {book.notes && (
                    <div className="book-notes-box">
                      "{book.notes}"
                    </div>
                  )}

                  {/* Footer */}
                  <div className="book-footer-info">
                    <span>Tahun: {book.year || '2025'}</span>
                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          onClick={() => onEditBook(book)}
                          title="Edit Buku"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          onClick={() => handleDelete(book.id, book.title)}
                          title="Hapus Buku"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
