import React, { useState } from 'react';
import { X, FileSpreadsheet, Upload, Download, CheckCircle2, AlertCircle, Database, Trash2 } from 'lucide-react';
import { parseExcelBooks, downloadExcelTemplate } from '../services/excel';
import { batchSaveBooks } from '../services/firebase';

export default function ExcelImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [previewBooks, setPreviewBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');
    setSuccessMsg('');
    setFile(selectedFile);
    setLoading(true);

    try {
      const parsed = await parseExcelBooks(selectedFile);
      setPreviewBooks(parsed);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal memproses file Excel.');
      setPreviewBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (index) => {
    setPreviewBooks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImportToFirebase = async () => {
    if (previewBooks.length === 0) return;
    setSaving(true);
    setError('');

    try {
      await batchSaveBooks(previewBooks);
      setSuccessMsg(`Berhasil mengimpor ${previewBooks.length} buku ke database Firestore!`);
      if (onImportSuccess) {
        onImportSuccess(previewBooks);
      }
      setTimeout(() => {
        handleReset();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Gagal menyimpan ke Firestore: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewBooks([]);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Impor List Buku via Excel</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Dukung format .xlsx, .xls, dan .csv dengan auto-mapping kolom
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Template Download Recommendation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-bright)', fontSize: '0.95rem' }}>
                Belum punya format Excel yang pas?
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Gunakan template resmi berisi contoh kolom Judul, Penulis, Genre, Rating, Status, dan Catatan.
              </div>
            </div>
            <button
              onClick={downloadExcelTemplate}
              className="btn btn-outline-glow btn-sm"
              type="button"
            >
              <Download size={15} />
              <span>Unduh Template (.xlsx)</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {previewBooks.length === 0 ? (
            <div className="upload-dropzone" style={{ padding: '2.75rem 2rem' }}>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                id="excel-file-input"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label
                htmlFor="excel-file-input"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%'
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(0, 242, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)'
                }}>
                  <Upload size={28} />
                </div>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                    Pilih File Excel Anda
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Seret file <code>.xlsx</code> / <code>.csv</code> ke sini atau klik untuk menelusuri
                  </div>
                </div>
              </label>
            </div>
          ) : (
            /* Preview Table */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Preview Data Buku ({previewBooks.length} ditemukan)</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    File: {file?.name}
                  </span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                  Ganti File Excel
                </button>
              </div>

              <div className="excel-preview-table-wrapper">
                <table className="excel-preview-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Judul Buku</th>
                      <th>Penulis</th>
                      <th>Genre</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Tahun</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewBooks.map((book, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span style={{ color: 'var(--accent-purple)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                            {book.genre}
                          </span>
                        </td>
                        <td>⭐ {book.rating}/5</td>
                        <td>
                          <span className={`book-status-pill ${
                            book.status === 'Selesai Dibaca' ? 'book-status-read' :
                            book.status === 'Sedang Dibaca' ? 'book-status-reading' : 'book-status-wishlist'
                          }`} style={{ position: 'static', padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}>
                            {book.status}
                          </span>
                        </td>
                        <td>{book.year}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                            onClick={() => handleRemoveItem(idx)}
                            title="Hapus baris ini dari impor"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.9rem'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          {previewBooks.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleImportToFirebase}
                disabled={saving || previewBooks.length === 0}
              >
                <Database size={16} />
                <span>{saving ? 'Menyimpan ke Firestore...' : `Impor ${previewBooks.length} Buku ke Database`}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
