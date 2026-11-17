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
  ListMusic,
  Play,
  Loader2,
  AlertCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { fetchConcertEventById } from '../services/firebase';
import VideoPlayer from '../components/VideoPlayer';
import { parseVideoUrl } from '../utils/videoUtils';
import { usePageSEO } from '../hooks/usePageSEO';

export default function ConcertArtistDetailPage() {
  const { id, artistName } = useParams();
  const decodedArtist = decodeURIComponent(artistName || '');

  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [searchSong, setSearchSong] = useState('');
  const [copied, setCopied] = useState(false);

  // Default orientasi video: portrait di mobile (< 640px), landscape di desktop
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return true;
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, artistName]);

  const allVideos = concert?.videos || [];
  // Filter video khusus artist ini
  const artistVideos = allVideos.filter(
    (v) => (v.artist || concert?.eventName || 'Artis').trim().toLowerCase() === decodedArtist.toLowerCase()
  );

  const artistData = (concert?.artists && concert.artists[decodedArtist]) || {};

  // SEO
  usePageSEO({
    title: concert?.eventName
      ? `${decodedArtist} @ ${concert.eventName} — Fancam & Dokumentasi`
      : `${decodedArtist} — Fancam Konser`,
    description:
      artistData.bio ||
      `Koleksi video rekaman panggung dan fancam ${decodedArtist} di konser ${concert?.eventName || ''}.`,
    image: artistData.coverImage || concert?.coverImage || 'https://www.hiras.my.id/icon-512.png',
    url: `https://www.hiras.my.id/fancam-concert/${id}/${encodeURIComponent(decodedArtist)}`,
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const query = searchSong.toLowerCase().trim();
  const filteredVideos = artistVideos.filter((v) => {
    if (!query) return true;
    return (
      (v.songTitle || '').toLowerCase().includes(query) ||
      (v.notes || '').toLowerCase().includes(query)
    );
  });

  const activeVideo = artistVideos[activeVideoIndex] || artistVideos[0] || null;

  const handleNextVideo = () => {
    if (artistVideos.length <= 1) return;
    setActiveVideoIndex((prev) => (prev + 1) % artistVideos.length);
  };

  const handlePrevVideo = () => {
    if (artistVideos.length <= 1) return;
    setActiveVideoIndex((prev) => (prev - 1 + artistVideos.length) % artistVideos.length);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 size={28} className="animate-spin text-fuchsia-500" />
        <span className="text-sm font-medium">Memuat dokumentasi musisi...</span>
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
      {/* BREADCRUMB & BACK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to={`/fancam-concert/${id}`}
            className="text-slate-500 hover:text-fuchsia-600 transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft size={13} />
            <span>{concert.eventName}</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-sm">
            {decodedArtist}
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
              <span>Bagikan</span>
            </>
          )}
        </button>
      </div>

      {/* ARTIST HERO BANNER */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-slate-950 shadow-md">
        <div className="relative w-full min-h-[200px] sm:min-h-[240px] bg-slate-900 overflow-hidden flex flex-col justify-end p-5 sm:p-8">
          {artistData.coverImage || concert.coverImage ? (
            <img
              src={artistData.coverImage || concert.coverImage}
              alt={decodedArtist}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-950 via-slate-900 to-indigo-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end gap-5 text-white">
            {artistData.coverImage ? (
              <img
                src={artistData.coverImage}
                alt={decodedArtist}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-xl shrink-0"
              />
            ) : (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white border-2 border-white/20 shadow-xl shrink-0">
                <Mic size={36} />
              </div>
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/fancam-concert/${id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-xs text-slate-200 border border-white/15 transition-colors"
                >
                  <span>Event: {concert.eventName}</span>
                </Link>
                {artistData.genre && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-600/90 text-white">
                    {artistData.genre}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  <Sparkles size={11} className="text-fuchsia-400" />
                  <span>{artistVideos.length} Video Fancam</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-xs">
                {decodedArtist}
              </h1>

              {artistData.bio && (
                <p className="text-xs sm:text-sm text-slate-200/90 max-w-2xl leading-relaxed">
                  {artistData.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO PLAYER & PLAYLIST */}
      {artistVideos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3 bg-white/50 dark:bg-slate-900/50">
          <Music size={32} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Belum ada rekaman lagu untuk {decodedArtist}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Video lagu dan fancam untuk artis ini belum ditambahkan pada event konser ini.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Video Stage */}
          {activeVideo && (
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-sm space-y-4 p-4 sm:p-6">
              {/* Header Video Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">
                      Lagu {activeVideoIndex + 1} dari {artistVideos.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Mic size={12} className="text-fuchsia-500" />
                      <span>{decodedArtist}</span>
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                    {activeVideo.songTitle || 'Rekaman Konser'}
                  </h2>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsPortrait((prev) => !prev)}
                    className={`px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                      isPortrait
                        ? 'border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isPortrait ? (
                      <>
                        <Smartphone size={15} className="text-fuchsia-500" />
                        <span className="text-[11px]">Portrait</span>
                      </>
                    ) : (
                      <>
                        <Monitor size={15} />
                        <span className="text-[11px]">Landscape</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    disabled={artistVideos.length <= 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    disabled={artistVideos.length <= 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {activeVideo.videoUrl && (
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Video Frame */}
              <div
                className={`w-full rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center transition-all duration-300 ${
                  isPortrait ? 'max-w-xs sm:max-w-sm mx-auto' : ''
                }`}
              >
                <VideoPlayer
                  url={activeVideo.videoUrl}
                  title={`${decodedArtist} - ${activeVideo.songTitle || ''}`}
                  autoPlay={false}
                  aspectRatio={isPortrait ? 'aspect-[9/16]' : 'aspect-video'}
                />
              </div>

              {/* Song Notes */}
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

          {/* Playlist Tracks */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <ListMusic size={18} className="text-fuchsia-600 dark:text-fuchsia-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Daftar Lagu {decodedArtist} ({artistVideos.length})
                </h3>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari lagu musisi ini..."
                  value={searchSong}
                  onChange={(e) => setSearchSong(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
            </div>

            {/* Song Cards */}
            {filteredVideos.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                <p className="text-xs text-slate-500">
                  Tidak ada lagu yang cocok dengan pencarian "{searchSong}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredVideos.map((vid, idx) => {
                  const origIdx = artistVideos.findIndex((v) => v === vid);
                  const isCurrent = origIdx === activeVideoIndex;
                  const parsed = parseVideoUrl(vid.videoUrl);

                  return (
                    <div
                      key={vid.id || idx}
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
                      {/* Thumbnail */}
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
                        {vid.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {vid.notes}
                          </p>
                        )}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
