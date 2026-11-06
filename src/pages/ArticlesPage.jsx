import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Search, Clock, ArrowRight } from 'lucide-react';
import { fetchArticles } from '../services/firebase';
import { defaultArticles } from '../data/defaultData';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('Semua');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const cloudArticles = await fetchArticles(true);
        if (Array.isArray(cloudArticles)) {
          setArticles(cloudArticles);
        }
      } catch (err) {
        console.warn('Error loading articles from Firestore:', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  // Filter only published articles for public view
  const publishedArticles = articles.filter((a) => a.status === 'terbit');

  // Extract all unique tags
  const allTags = ['Semua', ...new Set(
    publishedArticles.flatMap((a) =>
      Array.isArray(a.tags) ? a.tags : (a.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
    )
  )];

  const filteredArticles = publishedArticles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      (art.summary && art.summary.toLowerCase().includes(search.toLowerCase()));

    const tagsArray = Array.isArray(art.tags)
      ? art.tags
      : (art.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    const matchTag = selectedTag === 'Semua' || tagsArray.includes(selectedTag);

    return matchSearch && matchTag;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <PenTool size={14} />
          <span>Publikasi & Catatan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Artikel
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          A collection of thoughts, ideas, and everything in between.
          An engineer by profession, a curious mind by nature. This is where I keep things I find interesting, questions I cannot stop asking, and thoughts worth revisiting.
        </p>
      </div>

      {/* Search and Tag Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari artikel berdasarkan judul atau topik pembahasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {allTags.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article List */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          Memuat artikel publik...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Belum ada artikel yang cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredArticles.map((art) => {
            const articleUrl = `/artikel/${art.shortId || art.id}`;
            const tagsArray = Array.isArray(art.tags)
              ? art.tags
              : (art.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

            return (
              <article
                key={art.id}
                className="group p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:-translate-y-0.5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {art.coverImage && (
                    <Link
                      to={articleUrl}
                      className="w-full sm:w-48 aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0"
                    >
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  )}

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{art.readTime || '3 menit'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-blue-600 dark:text-blue-400 font-sans font-medium">
                        {tagsArray[0] || 'Teknologi'}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      <Link
                        to={articleUrl}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {art.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {art.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tagsArray.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={articleUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Baca</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
