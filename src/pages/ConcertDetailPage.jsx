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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Search,
  Tv,
  ListMusic,
  Play,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { fetchConcertEventById } from '../services/firebase';
import VideoPlayer from '../components/VideoPlayer';
import { parseVideoUrl } from '../utils/videoUtils';
import { usePageSEO } from '../hooks/usePageSEO';

export default function ConcertDetailPage() {
  const { id } = useParams();
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [searchSong, setSearchSong] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('Semua');
  const [copied, setCopied] = useState(false);

  // SEO
  usePageSEO({
    title: concert?.eventName
      ? `${concert.eventName} — Fancam & Dokumentasi Konser`
      : 'Detail Konser & Fancam',
    description:
      concert?.notes ||
      (concert?.eventName
        ? `Dokumentasi rekaman panggung fancam ${concert.eventName}${
            concert.venue ? ` di ${concert.venue}` : ''
          }.`
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
          setActiveVideoIndex(0);
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

  // Scroll to top on page load
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

  // Filter songs by search and artist
  const query = searchSong.toLowerCase().trim();
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      !query ||
      (v.songTitle || '').toLowerCase().includes(query) ||
      (v.artist || '').toLowerCase().includes(query) ||
      (v.notes || '').toLowerCase().includes(query);

    const matchesArtist =
      selectedArtist === 'Semua' ||
      (v.artist || 'Artis').trim().toLowerCase() === selectedArtist.toLowerCase();

    return matchesSearch && matchesArtist;
  });

  const activeVideo = videos[activeVideoIndex] || videos[0] || null;

  const handleNextVideo = () => {
    if (videos.length <= 1) return;
    setActiveVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    if (videos.length <= 1) return;
    setActiveVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

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
        <div className="pt-2">
          <Link
            to="/fancam-list"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Semua Konser</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* ========================================== */}
      {/* BREADCRUMB & TOP ACTIONS                   */}
      {/* ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/fancam-list"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-400 font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Semua Konser</span>
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

      {/* ========================================== */}
      {/* CONCERT HERO BANNER                        */}
      {/* ========================================== */}
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
                  <Sparkles size={11} />
                  <span>{videos.length} Video Fancam</span>
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

            {uniqueArtists.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {uniqueArtists.map((artist) => (
                  <span
                    key={artist}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/15 text-slate-100"
                  >
                    <Mic size={11} className="text-fuchsia-400" />
                    <span>{artist}</span>
                  </span>
                ))}
              </div>
            )}
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

      {/* ========================================== */}
      {/* VIDEO PLAYER & PLAYLIST SECTION            */}
      {/* ========================================== */}
      {videos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3 bg-white/50 dark:bg-slate-900/50">
          <Music size={32} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Belum ada rekaman lagu yang ditambahkan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Video lagu dan fancam untuk event konser ini belum diunggah melalui menu Admin.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Video Player Stage */}
          {activeVideo && (
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-sm space-y-4 p-4 sm:p-6">
              {/* Active Video Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">
                      Lagu {activeVideoIndex + 1} dari {videos.length}
                    </span>
                    {activeVideo.artist && (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Mic size={12} className="text-fuchsia-500" />
                        <span>{activeVideo.artist}</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                    {activeVideo.songTitle || 'Rekaman Konser'}
                  </h2>
                </div>

                {/* Player Controls (Prev / Next & Source) */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    disabled={videos.length <= 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Lagu Sebelumnya"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    disabled={videos.length <= 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Lagu Selanjutnya"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {activeVideo.videoUrl && (
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Buka Video Sumber Asli"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Video Embed Player */}
              <div className="w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                <VideoPlayer
                  url={activeVideo.videoUrl}
                  title={`${activeVideo.artist || ''} - ${activeVideo.songTitle || ''}`}
                  autoPlay={false}
                  aspectRatio="16/9"
                />
              </div>

              {/* Active Song Notes */}
              {activeVideo.notes && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 mr-1.5">
                    Catatan Fancam:
                  </span>
                  {activeVideo.notes}
                </div>
              )}
            </div>
          )}

          {/* Playlist & Filter Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <ListMusic size={18} className="text-fuchsia-600 dark:text-fuchsia-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Daftar Lagu di Konser Ini ({videos.length})
                </h3>
              </div>

              {/* Quick Search Song inside this concert */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari lagu di konser ini..."
                  value={searchSong}
                  onChange={(e) => setSearchSong(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
            </div>

            {/* Filter Pills if multiple artists exist */}
            {uniqueArtists.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedArtist('Semua')}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedArtist === 'Semua'
                      ? 'bg-fuchsia-600 text-white font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Semua Penyanyi ({videos.length})
                </button>
                {uniqueArtists.map((artist) => (
                  <button
                    key={artist}
                    type="button"
                    onClick={() => setSelectedArtist(artist)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedArtist === artist
                        ? 'bg-fuchsia-600 text-white font-semibold shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <span>{artist}</span>
                    <span className="text-[10px] opacity-75">({artistCounts[artist]})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Songs Grouped by Artist */}
            {filteredVideos.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs text-slate-500">
                  Tidak ada lagu yang cocok dengan pencarian "{searchSong}".
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {uniqueArtists.map((artist) => {
                  const vids = filteredVideos.filter(
                    (v) => ((v.artist || concert?.eventName || 'Artis').trim()) === artist
                  );
                  if (vids.length === 0) return null;
                  return (
                    <div key={artist}>
                      <h3 className="text-lg font-semibold mb-3 text-fuchsia-600 dark:text-fuchsia-400">
                        {artist} ({vids.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {vids.map((vid) => {
                          const origIdx = videos.findIndex((v) => v === vid);
                          const isCurrent = origIdx === activeVideoIndex;
                          const parsed = parseVideoUrl(vid.videoUrl);
                          return (
                            <div
                              key={vid.id || origIdx}
                              onClick={() => {
                                setActiveVideoIndex(origIdx);
                                window.scrollTo({ top: 320, behavior: 'smooth' });
                              }}
                              className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                                isCurrent
                                  ? 'border-fuchsia-500 bg-fuchsia-50/50 dark:bg-fuchsia-950/30 ring-2 ring-fuchsia-500/20'
                                  : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-fuchsia-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              {/* Thumbnail with status badge */}
                              <div className="relative w-20 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                                {parsed.thumbnailUrl ? (
                                  <img
                                    src={parsed.thumbnailUrl}
                                    alt={vid.songTitle}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-fuchsia-900 to-indigo-950 flex items-center justify-center">
                                    <Music size={18} className="text-white/60" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform ${
                                      isCurrent
                                        ? 'bg-fuchsia-600 text-white scale-110'
                                        : 'bg-black/60 text-white group-hover:bg-fuchsia-600 group-hover:scale-110'
                                    }`}
                                  >
                                    <Play size={11} className="ml-0.5 fill-current" />
                                  </div>
                                </div>
                              </div>
                              {/* Song Info */}
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono font-bold text-slate-400">
                                    #{origIdx + 1}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-fuchsia-600 text-white">
                                      Diputar
                                    </span>
                                  )}
                                </div>
                                <h4
                                  className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                                    isCurrent
                                      ? 'text-fuchsia-600 dark:text-fuchsia-400'
                                      : 'text-slate-900 dark:text-slate-100 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'
                                  }`}
                                >
                                  {vid.songTitle || 'Lagu Konser'}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {vid.artist || concert.eventName}
                                </p>
                              </div>
                              <div
                                className={`text-slate-400 transition-colors pr-1 ${
                                  isCurrent
                                    ? 'text-fuchsia-600 dark:text-fuchsia-400'
                                    : 'group-hover:text-fuchsia-500'
                                }`}
                              >
                                <ChevronRight size={16} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
