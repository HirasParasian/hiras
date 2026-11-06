import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  PenTool,
  ArrowRight,
  Sparkles,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { defaultProfile, defaultBooks, defaultArticles } from '../data/defaultData';
import { fetchBooks, fetchArticles, fetchSiteStats, fetchBioProfile } from '../services/firebase';
import { getDynamicStats } from '../utils/stats';

export default function HomePage() {
  const [books, setBooks] = useState(defaultBooks);
  const [articles, setArticles] = useState(defaultArticles);
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('hiras_bio_profile');
      return cached ? { ...defaultProfile, ...JSON.parse(cached) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [siteStats, setSiteStats] = useState(() => {
    try {
      const cached = localStorage.getItem('hiras_site_stats');
      return cached ? JSON.parse(cached) : { completedProjects: '20+' };
    } catch {
      return { completedProjects: '20+' };
    }
  });

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const [cloudBooks, cloudArticles, cloudStats, cloudProfile] = await Promise.all([
          fetchBooks(),
          fetchArticles(true),
          fetchSiteStats(),
          fetchBioProfile(),
        ]);
        if (Array.isArray(cloudBooks) && cloudBooks.length > 0) setBooks(cloudBooks);
        if (Array.isArray(cloudArticles)) setArticles(cloudArticles);
        if (cloudStats && cloudStats.completedProjects) setSiteStats(cloudStats);
        if (cloudProfile && cloudProfile.name) setProfile((prev) => ({ ...prev, ...cloudProfile }));
      } catch (err) {
        console.warn('Using default highlights:', err);
      }
    };
    loadHighlights();
  }, []);

  const currentlyReading = books.filter((b) => b.status === 'Sedang Dibaca').slice(0, 2);
  const recentBooks = books.slice(0, 4);
  const publishedArticles = articles.filter((a) => a.status === 'terbit');

  const dynamicStats = getDynamicStats({
    booksCount: books.length,
    articlesCount: publishedArticles.length,
    completedProjects: siteStats.completedProjects || '20+',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Hero Introduction */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <Sparkles size={13} />
          <span>{profile.statusBadge || profile.status || defaultProfile.statusBadge}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Halo, Saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{profile.name || defaultProfile.name}</span>.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl leading-relaxed">
            {profile.bio || defaultProfile.bio}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/list-book"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs"
          >
            <BookOpen size={16} />
            <span>Lihat Rak Buku</span>
          </Link>

          <Link
            to="/artikel"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors"
          >
            <PenTool size={16} />
            <span>Baca Artikel</span>
          </Link>

          <Link
            to="/me"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
          >
            <span>Tentang & Kontak</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          {dynamicStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80"
            >
              <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Currently Reading Highlight */}
      {currentlyReading.length > 0 && (
        <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/50 via-slate-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:via-slate-900/40 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Sedang Aktif Dibaca
              </h2>
            </div>
            <Link
              to="/list-book"
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Semua Buku</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentlyReading.map((book) => (
              <div
                key={book.id}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="w-14 h-20 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {book.genre}
                  </span>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500">{book.author}</p>
                  {book.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-2 pt-1">
                      "{book.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Book Shelf Grid Preview */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Koleksi Buku Bacaan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Buku cetak fisik dan buku online yang sedang dan telah saya baca.
            </p>
          </div>

          <Link
            to="/list-book"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Buka Rak Lengkap</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recentBooks.map((book) => (
            <Link
              key={book.id}
              to="/list-book"
              className="group flex flex-col p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:-translate-y-1 shadow-xs"
            >
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5 relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white backdrop-blur-xs">
                  {book.status}
                </span>
              </div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-500 transition-colors">
                {book.title}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">{book.author}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Published Articles */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Artikel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tulisan yang saya publikasikan.
            </p>
          </div>

          <Link
            to="/artikel"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Semua Artikel</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {publishedArticles.map((art) => (
            <Link
              key={art.id}
              to={`/artikel/${art.shortId || art.id}`}
              className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:-translate-y-1 shadow-xs"
            >
              {art.coverImage && (
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5 font-mono">
                <span>{art.readTime || '3 menit'}</span>
                <span>•</span>
                <span className="text-blue-500 font-sans">
                  {Array.isArray(art.tags) ? art.tags[0] : 'Teknologi'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mb-1.5 leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">
                {art.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
