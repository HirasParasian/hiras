import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  Music,
  Mic,
  Share2,
  Check,
  ChevronRight,
  ExternalLink,
  Film,
  Search,
  ListMusic,
  Play,
  Loader2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { fetchConcertEventById } from '../services/firebase';
import { parseVideoUrl } from '../utils/videoUtils';
import { usePageSEO } from '../hooks/usePageSEO';

export default function ConcertDetailPage() {
  const { id } = useParams();
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchArtist, setSearchArtist] = useState('');
  const [copied, setCopied] = useState(false);

  // SEO
  usePageSEO({
    title: concert?.eventName
      ? `${concert.eventName} — Musisi & Fancam Konser`
      : 'Detail Konser & Fancam',
    description:
      concert?.notes ||
      (concert?.eventName
        ? `Daftar musisi dan arsip fancam panggung ${concert.eventName}${concert.venue ? ` di ${concert.venue}` : ''}.`
        : 'Arsip rekaman fancam konser musik.'),
    image: concert?.coverImage || 'https://www.hiras.my.id/icon-512.png',
    url: `https://www.hiras.my.id/fancam-concert/${id}`,
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchConcertEventById(id);
        if (isMounted) {
          setConcert(data);
        }
      } catch (err) {
        console.warn('Error loading concert detail:', err);
        if (isMounted) setConcert(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const videos = concert?.videos || [];

  // Group unique artists for this concert
  const artistCounts = videos.reduce((acc, v) => {
    const name = (v.artist || concert?.eventName || 'Artis').trim();
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const uniqueArtists = Object.keys(artistCounts);

  const query = searchArtist.toLowerCase().trim();
  const filteredArtists = uniqueArtists.filter((artist) => {
    if (!query) return true;
    const artistData = (concert?.artists && concert.artists[artist]) || {};
    return (
      artist.toLowerCase().includes(query) ||
      (artistData.genre || '').toLowerCase().includes(query) ||
      (artistData.bio || '').toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={28} className="animate-spin text-fuchsia-500" />
        <span className="text-sm font-medium">Memuat dokumentasi konser...</span>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 mx-auto flex items-center justify-center text-rose-500 shadow-sm">
          <AlertCircle size={30} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Konser Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Tautan konser dengan ID <span className="font-mono text-fuchsia-600 dark:text-fuchsia-400">/{id}</span> mungkin telah dipindahkan atau belum ditambahkan.
        </p>
        <Link
          to="/fancam-list"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-fuchsia-600 text-white text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Daftar Konser</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* BREADCRUMB & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/fancam-list"
            className="text-slate-500 hover:text-fuchsia-600 transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft size={13} />
            <span>Fancam Konser</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-sm">
            {concert.eventName}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Link Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>Bagikan Konser</span>
            </>
          )}
        </button>
      </div>

      {/* CONCERT HERO BANNER */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-slate-950 shadow-md">
        <div className="relative w-full aspect-21/9 sm:aspect-24/7 min-h-[170px] bg-slate-900 overflow-hidden">
          {concert.coverImage ? (
            <img
              src={concert.coverImage}
              alt={concert.eventName}
              className="w-full h-full object-cover opacity-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-fuchsia-950 via-slate-900 to-indigo-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />

          {/* Banner Info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-600/90 backdrop-blur-xs text-white">
                  <Users size={11} />
                  <span>{uniqueArtists.length} Musisi / Artis</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-white">
                  <Sparkles size={11} />
                  <span>{videos.length} Fancam</span>
                </span>
                {concert.date && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                    <Calendar size={12} />
                    <span>{concert.date}</span>
                  </span>
                )}
                {concert.venue && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                    <MapPin size={12} className="text-fuchsia-400" />
                    <span>{concert.venue}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-xs">
                {concert.eventName}
              </h1>
            </div>
          </div>
        </div>

        {/* Personal Notes Banner */}
        {concert.notes && (
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic flex items-start gap-3">
            <span className="text-fuchsia-500 font-serif text-lg leading-none">&ldquo;</span>
            <div className="flex-1">
              <span className="font-semibold not-italic text-slate-700 dark:text-slate-200 block text-[11px] mb-0.5 uppercase tracking-wider">
                Kesan & Pengalaman Konser
              </span>
              <p>{concert.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* ARTISTS / MUSICIANS LIST SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mic size={18} className="text-fuchsia-600 dark:text-fuchsia-400" />
              <span>Daftar Musisi / Artis di Konser Ini</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih musisi untuk melihat koleksi rekaman lagu dan fancam khusus penampilan mereka.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari musisi..."
              value={searchArtist}
              onChange={(e) => setSearchArtist(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
        </div>

        {uniqueArtists.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3 bg-white/50 dark:bg-slate-900/50">
            <Music size={32} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Belum ada musisi / lagu yang ditambahkan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Lagu dan musisi untuk event konser ini belum diunggah melalui menu Admin.
            </p>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
            <p className="text-xs text-slate-500">
              Tidak ada musisi yang cocok dengan pencarian "{searchArtist}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map((artist) => {
              const artistData = (concert.artists && concert.artists[artist]) || {};
              const songCount = artistCounts[artist] || 0;
              const artistSongs = videos.filter(
                (v) => (v.artist || concert?.eventName || 'Artis').trim() === artist
              );

              return (
                <Link
                  key={artist}
                  to={`/fancam-concert/${id}/${encodeURIComponent(artist)}`}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start gap-4">
                    {artistData.coverImage ? (
                      <img
                        src={artistData.coverImage}
                        alt={artist}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 shrink-0 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-300">
                        <Mic size={26} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {artistData.genre && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-600 dark:text-fuchsia-400">
                            {artistData.genre}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {songCount} Lagu
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors truncate">
                        {artist}
                      </h3>

                      {artistData.bio ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {artistData.bio}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic line-clamp-1">
                          Lihat semua rekaman lagu panggung.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Track Preview List */}
                  {artistSongs.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Lagu Fancam:
                      </div>
                      {artistSongs.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                          <span className="text-[10px] font-mono text-fuchsia-500">▶</span>
                          <span className="truncate">{s.songTitle}</span>
                        </div>
                      ))}
                      {artistSongs.length > 2 && (
                        <span className="text-[11px] text-fuchsia-600 dark:text-fuchsia-400 font-medium block pt-0.5">
                          +{artistSongs.length - 2} lagu lainnya...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400 group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300">
                    <span>Buka Detail Musisi</span>
                    <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
