import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  BookOpen,
  PenTool,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  MapPin,
  Globe,
  Settings,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchBooks,
  saveBookItem,
  deleteBookItem,
  fetchArticles,
  saveArticleItem,
  deleteArticleItem,
  ADMIN_EMAIL,
} from '../services/firebase';
import ImageUpload from '../components/ImageUpload';
import TiptapEditor from '../components/TiptapEditor';
import { generateShortId } from '../utils/shortId';
import { defaultBooks, defaultArticles } from '../data/defaultData';

export default function AdminPage() {
  const { currentUser, isAdmin, loading: authLoading, loginEmail, loginGoogle, logout } = useAuth();

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Active Admin Tab: 'books' | 'articles' | 'system'
  const [activeTab, setActiveTab] = useState('books');

  // Books data & form state
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [bookSearch, setBookSearch] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    genre: 'Rekayasa Perangkat Lunak',
    status: 'Selesai Dibaca',
    format: 'fisik',
    publisher: '',
    location: '',
    onlineUrl: '',
    notes: '',
    rating: 5,
    cover: '',
    year: String(new Date().getFullYear()),
  });

  // Articles data & form state
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articleSearch, setArticleSearch] = useState('');
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    shortId: '',
    summary: '',
    content: '',
    tags: '',
    status: 'terbit',
    coverImage: '',
    readTime: '4 menit baca',
  });

  // Status feedback
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Load cloud data once authenticated
  const loadData = async () => {
    try {
      setLoadingBooks(true);
      setLoadingArticles(true);

      const [cloudBooks, cloudArticles] = await Promise.all([
        fetchBooks(),
        fetchArticles(false),
      ]);

      setBooks(cloudBooks && cloudBooks.length > 0 ? cloudBooks : defaultBooks);
      setArticles(cloudArticles && cloudArticles.length > 0 ? cloudArticles : defaultArticles);
    } catch (err) {
      console.warn('Error loading data in admin, using local fallbacks:', err);
      setBooks(defaultBooks);
      setArticles(defaultArticles);
    } finally {
      setLoadingBooks(false);
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Handle Login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);
    try {
      await loginEmail(emailInput.trim(), passwordInput);
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Gagal masuk. Periksa email dan password Anda.');
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setLoginError('');
    setSubmittingLogin(true);
    try {
      await loginGoogle(false);
    } catch (err) {
      console.error('Google login error:', err);
      setLoginError(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setSubmittingLogin(false);
    }
  };

  // ==========================================
  // BOOK HANDLERS
  // ==========================================
  const handleOpenAddBook = () => {
    setEditingBookId(null);
    setBookForm({
      title: '',
      author: '',
      genre: 'Rekayasa Perangkat Lunak',
      status: 'Selesai Dibaca',
      format: 'fisik',
      publisher: '',
      location: '',
      onlineUrl: '',
      notes: '',
      rating: 5,
      cover: '',
      year: String(new Date().getFullYear()),
    });
    setIsBookFormOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      genre: book.genre || 'Rekayasa Perangkat Lunak',
      status: book.status || 'Selesai Dibaca',
      format: book.format || 'fisik',
      publisher: book.publisher || '',
      location: book.location || '',
      onlineUrl: book.onlineUrl || '',
      notes: book.notes || '',
      rating: Number(book.rating) || 5,
      cover: book.cover || '',
      year: String(book.year || new Date().getFullYear()),
    });
    setIsBookFormOpen(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!bookForm.title.trim()) {
      showFeedback('error', 'Judul buku wajib diisi.');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        ...bookForm,
        id: editingBookId || undefined,
      };
      await saveBookItem(payload);
      showFeedback('success', editingBookId ? 'Buku berhasil diperbarui!' : 'Buku baru berhasil ditambahkan!');
      setIsBookFormOpen(false);
      setEditingBookId(null);
      await loadData();
    } catch (err) {
      console.error('Save book error:', err);
      showFeedback('error', err.message || 'Gagal menyimpan buku ke Firestore.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Yakin ingin menghapus buku "${book.title}"?`)) return;
    setActionLoading(true);
    try {
      await deleteBookItem(book.id);
      showFeedback('success', `Buku "${book.title}" berhasil dihapus.`);
      await loadData();
    } catch (err) {
      console.error('Delete book error:', err);
      showFeedback('error', err.message || 'Gagal menghapus buku.');
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // ARTICLE HANDLERS
  // ==========================================
  const handleOpenAddArticle = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      shortId: generateShortId(7),
      summary: '',
      content: '<p>Tulis paragraf pembuka artikel Anda di sini...</p>',
      tags: 'Web, Rekayasa Perangkat Lunak',
      status: 'terbit',
      coverImage: '',
      readTime: '3 menit baca',
    });
    setIsArticleFormOpen(true);
  };

  const handleEditArticle = (article) => {
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title || '',
      shortId: article.shortId || generateShortId(7),
      summary: article.summary || '',
      content: article.content || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '',
      status: article.status || 'terbit',
      coverImage: article.coverImage || '',
      readTime: article.readTime || '3 menit baca',
      publishedAt: article.publishedAt,
    });
    setIsArticleFormOpen(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSaveArticle = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!articleForm.title.trim()) {
      showFeedback('error', 'Judul artikel wajib diisi.');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        ...articleForm,
        shortId: articleForm.shortId.trim() || generateShortId(7),
        id: editingArticleId || undefined,
      };
      await saveArticleItem(payload);
      showFeedback('success', editingArticleId ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil disimpan!');
      setIsArticleFormOpen(false);
      setEditingArticleId(null);
      await loadData();
    } catch (err) {
      console.error('Save article error:', err);
      showFeedback('error', err.message || 'Gagal menyimpan artikel.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteArticle = async (article) => {
    if (!window.confirm(`Yakin ingin menghapus artikel "${article.title}"?`)) return;
    setActionLoading(true);
    try {
      await deleteArticleItem(article.id);
      showFeedback('success', `Artikel "${article.title}" berhasil dihapus.`);
      await loadData();
    } catch (err) {
      console.error('Delete article error:', err);
      showFeedback('error', err.message || 'Gagal menghapus artikel.');
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // RENDER: LOADING STATE
  // ==========================================
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <span className="text-sm text-slate-500">Memeriksa autentikasi Firebase...</span>
      </div>
    );
  }

  // ==========================================
  // RENDER: LOGIN FORM (IF NOT ADMIN)
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <Shield size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Admin & Pengelolaan Konten
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Khusus untuk Hiras Parasian (<span className="font-mono text-blue-500">{ADMIN_EMAIL}</span>)
            </p>
          </div>

          {currentUser && !isAdmin && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-medium">Akun Anda ({currentUser.email}) bukan admin yang terdaftar.</p>
              <button
                type="button"
                onClick={logout}
                className="mt-2 text-blue-600 dark:text-blue-400 underline font-medium cursor-pointer"
              >
                Keluar dan masuk dengan akun admin
              </button>
            </div>
          )}

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Google 1-Click Login */}
          <button
            type="button"
            onClick={handleGoogleSubmit}
            disabled={submittingLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 mb-4"
          >
            {submittingLogin ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.2.01 10.04.01 12c0 1.96.45 3.8 1.26 5.41l4.01-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
                />
              </svg>
            )}
            <span>Masuk dengan Akun Google</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] uppercase tracking-wider text-slate-400">
              atau via Email
            </span>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {submittingLogin ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>Masuk sebagai Admin</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: DASHBOARD (ADMIN VERIFIED)
  // ==========================================
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.genre.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      (a.shortId && a.shortId.toLowerCase().includes(articleSearch.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-slate-900/20 border border-blue-500/20 mb-8 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Panel Pengelolaan Hiras
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Admin Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-xs font-medium transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Keluar</span>
        </button>
      </div>

      {/* Global Feedback Alert */}
      {feedback.message && (
        <div
          className={`mb-6 p-3.5 rounded-xl text-sm flex items-center gap-2.5 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle size={18} className="shrink-0 text-rose-500" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'books'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen size={16} />
          <span>Kelola Buku ({books.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'articles'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PenTool size={16} />
          <span>Tulis & Kelola Artikel ({articles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'system'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Settings size={16} />
          <span>Info Sistem</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: KELOLA BUKU
         ========================================== */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari buku berdasarkan judul atau penulis..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddBook}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Tambah Buku Baru</span>
            </button>
          </div>

          {/* Book Form (Modal / Collapsible Panel) */}
          {isBookFormOpen && (
            <div className="p-5 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 shadow-md">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-500" />
                  <span>{editingBookId ? 'Edit Data Buku' : 'Tambah Buku Baru ke Rak'}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsBookFormOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Tutup Form
                </button>
              </div>

              <form onSubmit={handleSaveBook} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Judul Buku *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookForm.title}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      placeholder="Contoh: Designing Data-Intensive Applications"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Penulis Buku *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookForm.author}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      placeholder="Contoh: Martin Kleppmann"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Format Buku: Fisik vs Online */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Format Buku
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="bookFormat"
                        value="fisik"
                        checked={bookForm.format === 'fisik'}
                        onChange={() => setBookForm({ ...bookForm, format: 'fisik' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Buku Fisik (Cetak)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="bookFormat"
                        value="online"
                        checked={bookForm.format === 'online'}
                        onChange={() => setBookForm({ ...bookForm, format: 'online' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Buku Online (E-book / Web)</span>
                    </label>
                  </div>

                  {bookForm.format === 'fisik' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Penerbit Buku Fisik
                        </label>
                        <input
                          type="text"
                          value={bookForm.publisher}
                          onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                          placeholder="Contoh: O'Reilly Media / Gramedia"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Lokasi Buku Fisik (Rak / Kotak)
                        </label>
                        <input
                          type="text"
                          value={bookForm.location}
                          onChange={(e) => setBookForm({ ...bookForm, location: e.target.value })}
                          placeholder="Contoh: Rak Utama - Tingkat 2 / Kotak Koleksi A"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Tautan / Link Buku Online (URL)
                      </label>
                      <input
                        type="url"
                        value={bookForm.onlineUrl}
                        onChange={(e) => setBookForm({ ...bookForm, onlineUrl: e.target.value })}
                        placeholder="Contoh: https://jamesclear.com/atomic-habits"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status Baca
                    </label>
                    <select
                      value={bookForm.status}
                      onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Selesai Dibaca">Selesai Dibaca</option>
                      <option value="Sedang Dibaca">Sedang Dibaca</option>
                      <option value="Wishlist">Wishlist (Ingin Dibeli/Baca)</option>
                      <option value="Belum Dibaca">Belum Dibaca</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Genre / Tag
                    </label>
                    <input
                      type="text"
                      value={bookForm.genre}
                      onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
                      placeholder="Contoh: Rekayasa Perangkat Lunak"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Rating (1 - 5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={bookForm.rating}
                      onChange={(e) => setBookForm({ ...bookForm, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Cloudinary Image Upload */}
                <ImageUpload
                  value={bookForm.cover}
                  onChange={(url) => setBookForm({ ...bookForm, cover: url })}
                  label="Gambar Sampul Buku (Cloudinary Upload)"
                />

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Pribadi & Esensi Buku
                  </label>
                  <textarea
                    rows={3}
                    value={bookForm.notes}
                    onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                    placeholder="Tuliskan gagasan pokok, pelajaran utama, atau kutipan yang berkesan..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBookFormOpen(false)}
                    className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading && <Loader2 size={16} className="animate-spin" />}
                    <span>{editingBookId ? 'Perbarui Buku' : 'Simpan Buku'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Book List Table / Cards */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Menampilkan {filteredBooks.length} buku di katalog</span>
              <span>Diurutkan berdasarkan yang terbaru</span>
            </div>

            {loadingBooks ? (
              <div className="p-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin text-blue-500" />
                <span>Memuat data buku dari Firestore...</span>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Tidak ada buku yang cocok dengan pencarian.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-16 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        {book.cover ? (
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Cover
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {book.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              book.status === 'Selesai Dibaca'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : book.status === 'Sedang Dibaca'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {book.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span>{book.author}</span>
                          <span>•</span>
                          <span>{book.genre}</span>
                          <span>•</span>
                          {book.format === 'fisik' ? (
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <MapPin size={11} />
                              <span>{book.location || 'Buku Fisik'}</span>
                            </span>
                          ) : (
                            <a
                              href={book.onlineUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:underline"
                            >
                              <Globe size={11} />
                              <span>Tautan Online</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleEditBook(book)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Buku"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Hapus Buku"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: TULIS & KELOLA ARTIKEL
         ========================================== */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari artikel berdasarkan judul atau ID singkat..."
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddArticle}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          {/* Article Editor Form */}
          {isArticleFormOpen && (
            <div className="p-5 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 shadow-md">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <PenTool size={18} className="text-blue-500" />
                  <span>{editingArticleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsArticleFormOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Tutup Form
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Judul Artikel *
                    </label>
                    <input
                      type="text"
                      required
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                      placeholder="Contoh: Membangun Website Pribadi Modern dengan Firebase"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      ID Singkat (Link Publik: /artikel/:id) *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        required
                        value={articleForm.shortId}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            shortId: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                          })
                        }
                        placeholder="contoh: k9x2m4p"
                        className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setArticleForm({ ...articleForm, shortId: generateShortId(7) })
                        }
                        className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Acak ID Singkat Baru"
                      >
                        Acak
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status Publikasi
                    </label>
                    <select
                      value={articleForm.status}
                      onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="terbit">Terbit (Dapat dibaca publik)</option>
                      <option value="draf">Draf (Hanya admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Genre / Tags (pisahkan koma)
                    </label>
                    <input
                      type="text"
                      value={articleForm.tags}
                      onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                      placeholder="Web, React, Arsitektur"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Estimasi Waktu Baca
                    </label>
                    <input
                      type="text"
                      value={articleForm.readTime}
                      onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                      placeholder="4 menit baca"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ringkasan Singkat (Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                    placeholder="Deskripsi singkat yang muncul pada kartu artikel..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cloudinary Image Upload for Cover */}
                <ImageUpload
                  value={articleForm.coverImage}
                  onChange={(url) => setArticleForm({ ...articleForm, coverImage: url })}
                  label="Gambar Banner / Sampul Artikel (Opsional)"
                />

                {/* Visual Tiptap Editor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <span>Isi Konten Artikel (Visual Editor Tiptap)</span>
                    <span className="text-[11px] text-blue-500 font-normal">
                      • Bergaya Word: Bold, Italic, Judul, List, Kutipan, Kode, Gambar
                    </span>
                  </label>
                  <TiptapEditor
                    content={articleForm.content}
                    onChange={(html) => setArticleForm({ ...articleForm, content: html })}
                    placeholder="Mulai menulis isi artikel Anda di sini..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsArticleFormOpen(false)}
                    className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading && <Loader2 size={16} className="animate-spin" />}
                    <span>{editingArticleId ? 'Perbarui Artikel' : 'Simpan & Publikasikan'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Article List */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Menampilkan {filteredArticles.length} artikel</span>
              <span>Dikelola secara langsung di Firestore</span>
            </div>

            {loadingArticles ? (
              <div className="p-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin text-blue-500" />
                <span>Memuat data artikel dari Firestore...</span>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Belum ada artikel yang cocok dengan pencarian.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {article.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                            article.status === 'terbit'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {article.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="font-mono text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                          /artikel/{article.shortId || article.id}
                        </span>
                        <span>•</span>
                        <span>{article.readTime || '3 menit'}</span>
                        {article.tags && (
                          <>
                            <span>•</span>
                            <span>{Array.isArray(article.tags) ? article.tags.join(', ') : article.tags}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        to={`/artikel/${article.shortId || article.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Lihat Pratinjau Publik"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEditArticle(article)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Artikel"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(article)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Hapus Artikel"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: INFO SISTEM & DEPLOYMENT
         ========================================== */}
      {activeTab === 'system' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings size={16} className="text-blue-500" />
              <span>Status Konfigurasi Backend & CDN</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Firebase Project ID</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'listbook-f6979'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Email Otoritas Admin</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {ADMIN_EMAIL}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Cloudinary Cloud Name</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'fknx9yw1'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Upload Preset (Unsigned)</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ListBook'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ExternalLink size={16} className="text-emerald-500" />
              <span>Panduan Keamanan Firestore Security Rules</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pastikan Firestore Security Rules di Firebase Console diatur agar hanya akun admin Anda
              yang memiliki izin tulis (write/delete), sedangkan publik memiliki izin baca (read):
            </p>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Publik bisa membaca buku dan artikel terbit
    match /books/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email.lower() == '${ADMIN_EMAIL}';
    }
    match /articles/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email.lower() == '${ADMIN_EMAIL}';
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
