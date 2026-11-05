import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Check, ShieldAlert } from 'lucide-react';
import { fetchArticleByShortId } from '../services/firebase';
import { defaultArticles, defaultProfile } from '../data/defaultData';
import { useAuth } from '../context/AuthContext';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        // First try to fetch from Firestore by shortId
        const cloudArticle = await fetchArticleByShortId(id);
        if (cloudArticle) {
          setArticle(cloudArticle);
        } else {
          // Fallback to local defaultArticles
          const found = defaultArticles.find(
            (a) => a.shortId === id || a.id === id
          );
          setArticle(found || null);
        }
      } catch (err) {
        console.warn('Error fetching article:', err);
        const found = defaultArticles.find(
          (a) => a.shortId === id || a.id === id
        );
        setArticle(found || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Memuat konten artikel...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-500">
          Tautan artikel dengan ID <span className="font-mono text-blue-500">/{id}</span> mungkin telah dipindahkan atau belum dipublikasikan.
        </p>
        <Link
          to="/artikel"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Katalog Artikel</span>
        </Link>
      </div>
    );
  }

  // If article is draft and viewer is not admin
  if (article.status === 'draf' && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center mx-auto text-amber-500">
          <ShieldAlert size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Artikel Masih Berupa Draf
        </h1>
        <p className="text-sm text-slate-500">
          Artikel ini belum dipublikasikan untuk umum oleh Hiras Parasian.
        </p>
        <Link to="/artikel" className="text-sm text-blue-500 underline">
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  const tagsArray = Array.isArray(article.tags)
    ? article.tags
    : (article.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/artikel"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Semua Artikel</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          title="Salin tautan artikel"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
          <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            <span>{article.readTime || '3 menit'}</span>
          </span>
          <span>•</span>
          <span className="font-mono text-blue-500">ID: {article.shortId || article.id}</span>
          {article.status === 'draf' && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-sans">
              Pratinjau Draf Admin
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {article.summary}
          </p>
        )}

        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          {tagsArray.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Hero Banner Image */}
      {article.coverImage && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Render Tiptap HTML Content */}
      <div
        className="ProseMirror text-slate-800 dark:text-slate-200 text-base leading-relaxed pt-4 border-t border-slate-200 dark:border-slate-800"
        dangerouslySetInnerHTML={{ __html: article.content || '<p>Konten belum tersedia.</p>' }}
      />

      {/* Author Profile Footer Card */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
          HP
        </div>
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {defaultProfile.name}
            </h3>
            <span className="text-[11px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              Penulis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {defaultProfile.bio}
          </p>
          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
            <Link to="/me" className="text-xs font-semibold text-blue-500 hover:underline">
              Hubungi di /me →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
