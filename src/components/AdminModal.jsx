import React, { useState, useEffect } from 'react';
import {
  X, Shield, Lock, Mail, Upload, Trash2, Edit3, Plus,
  CheckCircle, AlertCircle, RefreshCw, Layers, BookOpen, MessageSquare, Database, Cloud, FileSpreadsheet, Star, Bookmark
} from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
  saveProjectItem,
  deleteProjectItem,
  savePostItem,
  deletePostItem,
  saveBookItem,
  deleteBookItem,
  fetchContactMessages,
  deleteContactMessage,
  markMessageAsRead,
  isFirebaseConfigured,
  ADMIN_EMAIL
} from '../services/firebase';
import { uploadToCloudinary, isCloudinaryConfigured } from '../services/cloudinary';

export default function AdminModal({
  isOpen,
  onClose,
  currentUser,
  isAdmin,
  projects,
  posts,
  books = [],
  onRefreshData,
  editingProject,
  setEditingProject,
  editingPost,
  setEditingPost,
  editingBook,
  setEditingBook,
  onOpenExcelImport
}) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'posts' | 'books' | 'messages' | 'system'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    id: null,
    title: '',
    category: 'Full Stack',
    description: '',
    image: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
    metrics: '',
    order: 1
  });

  // Post form state
  const [postForm, setPostForm] = useState({
    id: null,
    title: '',
    category: 'Web Development',
    readTime: '4 menit baca',
    summary: '',
    content: '',
    image: '',
    tags: ''
  });

  // Book form state
  const [bookForm, setBookForm] = useState({
    id: null,
    title: '',
    author: '',
    genre: 'Software Engineering',
    rating: 5,
    status: 'Selesai Dibaca',
    year: String(new Date().getFullYear()),
    notes: '',
    cover: ''
  });

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Sync editingProject
  useEffect(() => {
    if (editingProject) {
      setProjectForm({
        id: editingProject.id,
        title: editingProject.title || '',
        category: editingProject.category || 'Full Stack',
        description: editingProject.description || '',
        image: editingProject.image || '',
        tags: Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : '',
        liveUrl: editingProject.liveUrl || '',
        githubUrl: editingProject.githubUrl || '',
        metrics: editingProject.metrics || '',
        order: editingProject.order || 1
      });
      setActiveTab('projects');
    }
  }, [editingProject]);

  // Sync editingPost
  useEffect(() => {
    if (editingPost) {
      setPostForm({
        id: editingPost.id,
        title: editingPost.title || '',
        category: editingPost.category || 'Web Development',
        readTime: editingPost.readTime || '4 menit baca',
        summary: editingPost.summary || '',
        content: editingPost.content || '',
        image: editingPost.image || '',
        tags: Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : ''
      });
      setActiveTab('posts');
    }
  }, [editingPost]);

  // Sync editingBook
  useEffect(() => {
    if (editingBook) {
      setBookForm({
        id: editingBook.id,
        title: editingBook.title || '',
        author: editingBook.author || '',
        genre: editingBook.genre || 'Software Engineering',
        rating: editingBook.rating || 5,
        status: editingBook.status || 'Selesai Dibaca',
        year: String(editingBook.year || new Date().getFullYear()),
        notes: editingBook.notes || '',
        cover: editingBook.cover || ''
      });
      setActiveTab('books');
    }
  }, [editingBook]);

  // Fetch messages
  useEffect(() => {
    if (isOpen && isAdmin && activeTab === 'messages') {
      loadMessages();
    }
  }, [isOpen, isAdmin, activeTab]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await fetchContactMessages();
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  if (!isOpen) return null;

  // Handle Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      await loginWithEmail(loginEmail, loginPassword);
    } catch (err) {
      setAuthError(err.message || 'Gagal login.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setAuthError(err.message || 'Gagal login dengan Google.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Image upload handler for Cloudinary
  const handleImageUpload = async (file, target) => {
    if (!file) return;
    setUploadError('');
    setUploadProgress(0);
    try {
      const res = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });
      if (target === 'project') {
        setProjectForm((prev) => ({ ...prev, image: res.url }));
      } else if (target === 'post') {
        setPostForm((prev) => ({ ...prev, image: res.url }));
      } else if (target === 'book') {
        setBookForm((prev) => ({ ...prev, cover: res.url }));
      }
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Gagal mengupload gambar ke Cloudinary.');
      setUploadProgress(null);
    }
  };

  // Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess('');
    try {
      const tagsArray = projectForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await saveProjectItem({
        id: projectForm.id,
        title: projectForm.title,
        category: projectForm.category,
        description: projectForm.description,
        image: projectForm.image,
        tags: tagsArray,
        liveUrl: projectForm.liveUrl,
        githubUrl: projectForm.githubUrl,
        metrics: projectForm.metrics,
        order: Number(projectForm.order) || 1
      });

      setSaveSuccess('Proyek berhasil disimpan!');
      if (onRefreshData) onRefreshData();
      resetProjectForm();
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert('Gagal menyimpan proyek: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      id: null,
      title: '',
      category: 'Full Stack',
      description: '',
      image: '',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      metrics: '',
      order: 1
    });
    if (setEditingProject) setEditingProject(null);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Yakin ingin menghapus proyek ini?')) return;
    try {
      await deleteProjectItem(id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Gagal menghapus proyek: ' + err.message);
    }
  };

  // Save Post
  const handleSavePost = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess('');
    try {
      const tagsArray = postForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await savePostItem({
        id: postForm.id,
        title: postForm.title,
        category: postForm.category,
        readTime: postForm.readTime,
        summary: postForm.summary,
        content: postForm.content,
        image: postForm.image,
        tags: tagsArray
      });

      setSaveSuccess('Artikel berhasil disimpan!');
      if (onRefreshData) onRefreshData();
      resetPostForm();
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert('Gagal menyimpan artikel: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      id: null,
      title: '',
      category: 'Web Development',
      readTime: '4 menit baca',
      summary: '',
      content: '',
      image: '',
      tags: ''
    });
    if (setEditingPost) setEditingPost(null);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    try {
      await deletePostItem(id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Gagal menghapus artikel: ' + err.message);
    }
  };

  // Save Book
  const handleSaveBook = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess('');
    try {
      await saveBookItem({
        id: bookForm.id,
        title: bookForm.title,
        author: bookForm.author,
        genre: bookForm.genre,
        rating: Number(bookForm.rating) || 5,
        status: bookForm.status,
        year: bookForm.year,
        notes: bookForm.notes,
        cover: bookForm.cover
      });

      setSaveSuccess('Buku berhasil disimpan ke database!');
      if (onRefreshData) onRefreshData();
      resetBookForm();
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      alert('Gagal menyimpan buku: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const resetBookForm = () => {
    setBookForm({
      id: null,
      title: '',
      author: '',
      genre: 'Software Engineering',
      rating: 5,
      status: 'Selesai Dibaca',
      year: String(new Date().getFullYear()),
      notes: '',
      cover: ''
    });
    if (setEditingBook) setEditingBook(null);
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`Hapus buku "${title}"?`)) return;
    try {
      await deleteBookItem(id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Gagal menghapus buku: ' + err.message);
    }
  };

  const handleDeleteMsg = async (id) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    await deleteContactMessage(id);
    loadMessages();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050811'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Admin Dashboard & CMS</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {isAdmin ? `Login sebagai: ${currentUser?.email}` : 'Masuk untuk mengelola konten website'}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {!isAdmin ? (
            /* Login Form */
            <div style={{ maxWidth: 420, margin: '1rem auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Lock size={40} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.4rem' }}>Autentikasi Pengelola</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Akses khusus untuk admin (<strong>{ADMIN_EMAIL}</strong>) menggunakan Firebase Auth.
                </p>
              </div>

              {authError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  marginBottom: '1rem',
                  fontSize: '0.88rem'
                }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailLogin}>
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-email">Email Admin</label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="hirasparasian@gmail.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="admin-password">Password</label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
                >
                  {authLoading ? 'Memproses...' : 'Masuk dengan Email'}
                </button>
              </form>

              <div style={{ textAlign: 'center', margin: '1.25rem 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                ATAU
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.8rem' }}
              >
                <span>Masuk dengan Akun Google</span>
              </button>
            </div>
          ) : (
            /* Logged-In Admin CMS */
            <div>
              {/* Tab Navigation */}
              <div className="admin-tabs">
                <button
                  className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  <Layers size={16} />
                  <span>Proyek ({projects.length})</span>
                </button>

                <button
                  className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  <BookOpen size={16} />
                  <span>Artikel Blog ({posts.length})</span>
                </button>

                <button
                  className={`admin-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                  onClick={() => setActiveTab('books')}
                >
                  <Bookmark size={16} />
                  <span>Buku Bacaan ({books.length})</span>
                </button>

                <button
                  className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare size={16} />
                  <span>Pesan Masuk ({messages.length})</span>
                </button>

                <button
                  className={`admin-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
                  onClick={() => setActiveTab('system')}
                >
                  <Database size={16} />
                  <span>Status Cloud & Deploy</span>
                </button>
              </div>

              {saveSuccess && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <CheckCircle size={18} />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* TAB 1: PROJECTS CMS */}
              {activeTab === 'projects' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0 }}>{projectForm.id ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h4>
                    {projectForm.id && (
                      <button className="btn btn-secondary btn-sm" onClick={resetProjectForm}>
                        <Plus size={14} />
                        <span>Mode Tambah Baru</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProject}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Judul Proyek</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="Contoh: ListBook — Library Tracker"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kategori</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="form-input"
                          style={{ background: '#0a0e18' }}
                        >
                          <option value="Full Stack">Full Stack</option>
                          <option value="Cloud / AI">Cloud / AI</option>
                          <option value="Fintech">Fintech</option>
                          <option value="Mobile App">Mobile App</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Deskripsi Proyek</label>
                      <textarea
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Deskripsikan fitur utama, arsitektur..."
                        className="form-textarea"
                        style={{ minHeight: '85px' }}
                      />
                    </div>

                    {/* Image Upload with Cloudinary */}
                    <div className="form-group">
                      <label className="form-label">Gambar Sampul Proyek (Cloudinary Direct Upload)</label>
                      <div className="upload-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          id="project-image-input"
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(e.target.files[0], 'project')}
                        />
                        <label htmlFor="project-image-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                          <Upload size={28} color="var(--accent-cyan)" />
                          <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>Pilih Gambar atau Seret ke Sini</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                            Otomatis diupload langsung ke Cloudinary (Preset: ListBook)
                          </span>
                        </label>

                        {uploadProgress !== null && (
                          <div style={{ width: '100%', maxWidth: 300, marginTop: '0.5rem' }}>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.2s' }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {projectForm.image && (
                        <div className="upload-preview-box">
                          <img src={projectForm.image} alt="Preview" />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Tech Stack (pisahkan dengan koma)</label>
                        <input
                          type="text"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                          placeholder="React, Firebase, Cloudinary, Vite"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Metrik / Highlights</label>
                        <input
                          type="text"
                          value={projectForm.metrics}
                          onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                          placeholder="Contoh: <100ms Latency"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Link Demo</label>
                        <input
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Link GitHub</label>
                        <input
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="form-input"
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={saveLoading} className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', marginTop: '0.5rem' }}>
                      {saveLoading ? 'Menyimpan...' : (projectForm.id ? 'Perbarui Proyek' : 'Tambah ke Portofolio')}
                    </button>
                  </form>

                  {/* List of projects */}
                  <div style={{ marginTop: '3rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Daftar Proyek Aktif</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {projects.map((p) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={p.image || 'https://via.placeholder.com/60'} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{p.title}</div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{p.category}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingProject(p)}>
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(p.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BLOG CMS */}
              {activeTab === 'posts' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0 }}>{postForm.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h4>
                    {postForm.id && (
                      <button className="btn btn-secondary btn-sm" onClick={resetPostForm}>
                        <Plus size={14} />
                        <span>Mode Tulis Baru</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePost}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Judul Artikel</label>
                        <input
                          type="text"
                          required
                          value={postForm.title}
                          onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                          placeholder="Judul tulisan..."
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kategori</label>
                        <input
                          type="text"
                          value={postForm.category}
                          onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                          placeholder="Web Development"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ringkasan Singkat (Summary)</label>
                      <input
                        type="text"
                        required
                        value={postForm.summary}
                        onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
                        placeholder="Ringkasan 1-2 kalimat..."
                        className="form-input"
                      />
                    </div>

                    {/* Blog Image Upload with Cloudinary */}
                    <div className="form-group">
                      <label className="form-label">Gambar Sampul Artikel (Cloudinary)</label>
                      <div className="upload-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          id="post-image-input"
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(e.target.files[0], 'post')}
                        />
                        <label htmlFor="post-image-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                          <Upload size={28} color="var(--accent-purple)" />
                          <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>Pilih Gambar Sampul</span>
                        </label>
                      </div>

                      {postForm.image && (
                        <div className="upload-preview-box">
                          <img src={postForm.image} alt="Preview" />
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Konten Lengkap Artikel</label>
                      <textarea
                        required
                        value={postForm.content}
                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                        placeholder="Tulis isi artikel lengkap..."
                        className="form-textarea"
                        style={{ minHeight: '200px' }}
                      />
                    </div>

                    <button type="submit" disabled={saveLoading} className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                      {saveLoading ? 'Menyimpan...' : (postForm.id ? 'Perbarui Artikel' : 'Publikasikan Artikel')}
                    </button>
                  </form>

                  {/* List of posts */}
                  <div style={{ marginTop: '3rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Daftar Artikel</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {posts.map((p) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{p.title}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)' }}>{p.category}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingPost(p)}>
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletePost(p.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKS CMS & EXCEL */}
              {activeTab === 'books' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{bookForm.id ? 'Edit Data Buku' : 'Tambah Buku Manual'}</h4>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                        Atau impor puluhan buku sekaligus via spreadsheet Excel
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={onOpenExcelImport}
                        type="button"
                      >
                        <FileSpreadsheet size={15} />
                        <span>Upload File Excel (.xlsx)</span>
                      </button>

                      {bookForm.id && (
                        <button className="btn btn-secondary btn-sm" onClick={resetBookForm}>
                          <Plus size={14} />
                          <span>Mode Tambah Baru</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Book Form */}
                  <form onSubmit={handleSaveBook}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Judul Buku</label>
                        <input
                          type="text"
                          required
                          value={bookForm.title}
                          onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                          placeholder="Designing Data-Intensive Applications"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Penulis / Pengarang</label>
                        <input
                          type="text"
                          required
                          value={bookForm.author}
                          onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                          placeholder="Martin Kleppmann"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Genre / Topik</label>
                        <input
                          type="text"
                          value={bookForm.genre}
                          onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
                          placeholder="Cloud Architecture"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Status Bacaan</label>
                        <select
                          value={bookForm.status}
                          onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })}
                          className="form-input"
                          style={{ background: '#0a0e18' }}
                        >
                          <option value="Selesai Dibaca">Selesai Dibaca</option>
                          <option value="Sedang Dibaca">Sedang Dibaca</option>
                          <option value="Wishlist">Wishlist / Rencana</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Rating (1-5)</label>
                        <select
                          value={bookForm.rating}
                          onChange={(e) => setBookForm({ ...bookForm, rating: Number(e.target.value) })}
                          className="form-input"
                          style={{ background: '#0a0e18' }}
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                          <option value={2}>⭐⭐ (2/5)</option>
                          <option value={1}>⭐ (1/5)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tahun Selesai</label>
                        <input
                          type="text"
                          value={bookForm.year}
                          onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })}
                          placeholder="2025"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Catatan / Review / Kutipan Menarik</label>
                      <textarea
                        value={bookForm.notes}
                        onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                        placeholder="Pelajaran penting atau quotes dari buku ini..."
                        className="form-textarea"
                        style={{ minHeight: '80px' }}
                      />
                    </div>

                    {/* Book Cover Image Upload with Cloudinary */}
                    <div className="form-group">
                      <label className="form-label">Cover Buku (Upload Cloudinary atau Masukkan URL)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center' }}>
                        <div className="upload-dropzone" style={{ padding: '1rem' }}>
                          <input
                            type="file"
                            accept="image/*"
                            id="book-image-input"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e.target.files[0], 'book')}
                          />
                          <label htmlFor="book-image-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                            <Upload size={20} color="var(--accent-cyan)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-bright)' }}>Upload Cover</span>
                          </label>
                        </div>

                        <input
                          type="url"
                          placeholder="Atau tempel link URL cover gambar..."
                          value={bookForm.cover}
                          onChange={(e) => setBookForm({ ...bookForm, cover: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      {bookForm.cover && (
                        <div style={{ width: 100, height: 140, borderRadius: 8, overflow: 'hidden', marginTop: '0.75rem' }}>
                          <img src={bookForm.cover} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>

                    <button type="submit" disabled={saveLoading} className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                      {saveLoading ? 'Menyimpan...' : (bookForm.id ? 'Perbarui Buku' : 'Simpan Buku ke Database')}
                    </button>
                  </form>

                  {/* List of books */}
                  <div style={{ marginTop: '3rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Daftar Buku Aktif ({books.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 400, overflowY: 'auto' }}>
                      {books.map((b) => (
                        <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img src={b.cover || 'https://via.placeholder.com/40'} alt="" style={{ width: 36, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-bright)', fontSize: '0.95rem' }}>{b.title}</div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {b.author} • <span style={{ color: 'var(--accent-purple)' }}>{b.genre}</span> • ⭐ {b.rating}/5
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingBook(b)}>
                              <Edit3 size={13} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(b.id, b.title)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MESSAGES INBOX */}
              {activeTab === 'messages' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0 }}>Pesan Masuk dari Pengunjung</h4>
                    <button className="btn btn-secondary btn-sm" onClick={loadMessages}>
                      <RefreshCw size={14} />
                      <span>Segarkan</span>
                    </button>
                  </div>

                  {loadingMessages ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Memuat pesan masuk dari Firestore...
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                      Belum ada pesan masuk dari pengunjung.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {messages.map((m) => (
                        <div key={m.id} style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: m.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 242, 254, 0.05)', border: `1px solid ${m.read ? 'var(--border-subtle)' : 'rgba(0, 242, 254, 0.25)'}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div>
                              <strong style={{ color: 'var(--text-bright)', fontSize: '1.05rem' }}>{m.name}</strong>
                              <a href={`mailto:${m.email}`} style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                                {m.email}
                              </a>
                            </div>
                            <button className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDeleteMsg(m.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                          {m.subject && <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Subjek: {m.subject}</div>}
                          <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>{m.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SYSTEM & CLOUD STATUS */}
              {activeTab === 'system' && (
                <div>
                  <h4 style={{ marginBottom: '1.25rem' }}>Status Integrasi Cloud & GitHub Deploy</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                        <Database size={20} color="var(--accent-cyan)" />
                        <h4 style={{ margin: 0 }}>Firebase Services</h4>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>Auth: <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Aktif ({ADMIN_EMAIL})</span></div>
                        <div>Firestore: <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Terkoneksi</span></div>
                        <div>Koleksi: <code>projects</code>, <code>posts</code>, <code>books</code>, <code>messages</code></div>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                        <Cloud size={20} color="var(--accent-purple)" />
                        <h4 style={{ margin: 0 }}>Cloudinary Media</h4>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>Cloud Name: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>fknx9yw1</span></div>
                        <div>Upload Preset: <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>ListBook (Unsigned)</span></div>
                        <div>Optimasi Gambar: <span style={{ color: 'var(--accent-cyan)' }}>Aktif (f_auto, q_auto)</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Perintah Deploy ke GitHub Pages (100% Gratis)</h4>
                    <div style={{ background: '#07090e', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                      npm run deploy
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
