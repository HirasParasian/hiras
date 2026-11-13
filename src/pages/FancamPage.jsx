import React, { useState, useEffect } from 'react';
import {
  Film,
  Music,
  Calendar,
  MapPin,
  Play,
  X,
  Search,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Tv,
  ListMusic,
  Maximize2,
} from 'lucide-react';
import { fetchConcertEvents } from '../services/firebase';
import { defaultConcerts } from '../data/defaultData';
import VideoPlayer from '../components/VideoPlayer';
import { parseVideoUrl } from '../utils/videoUtils';

export default function FancamPage() {
  const [concerts, setConcerts] = useState(defaultConcerts);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('events'); // 'events' | 'videos'

  // Cinema Modal state
  const [activeModal, setActiveModal] = useState(null); // { event, video, videoIndex }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchConcertEvents();
        if (Array.isArray(data) && data.length > 0) {
          setConcerts(data);
        }
      } catch (err) {
        console.warn('Load concerts error, using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Keyboard navigation for Cinema Modal (Esc to close, Left/Right for prev/next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModal) return;
      if (e.key === 'Escape') {
        setActiveModal(null);
      } else if (e.key === 'ArrowRight') {
        handleNextVideo();
      } else if (e.key === 'ArrowLeft') {
        handlePrevVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleNextVideo = () => {
    if (!activeModal || !activeModal.event?.videos) return;
    const { event, videoIndex } = activeModal;
    const nextIdx = (videoIndex + 1) % event.videos.length;
    setActiveModal({
      event,
      video: event.videos[nextIdx],
      videoIndex: nextIdx,
    });
  };

  const handlePrevVideo = () => {
    if (!activeModal || !activeModal.event?.videos) return;
    const { event, videoIndex } = activeModal;
    const prevIdx = (videoIndex - 1 + event.videos.length) % event.videos.length;
    setActiveModal({
      event,
      video: event.videos[prevIdx],
      videoIndex: prevIdx,
    });
  };

  // Flatten all videos for "All Videos" view mode & search calculation
  const allVideos = concerts.flatMap((event) =>
    (event.videos || []).map((video, idx) => ({
      ...video,
      event,
      videoIndex: idx,
    }))
  );

  // Filtered by Search
  const query = search.toLowerCase().trim();
  const filteredEvents = concerts.filter((evt) => {
    const matchEvent =
      (evt.eventName || '').toLowerCase().includes(query) ||
      (evt.venue || '').toLowerCase().includes(query) ||
      (evt.notes || '').toLowerCase().includes(query);

    const matchVideo = (evt.videos || []).some(
      (v) =>
        (v.songTitle || '').toLowerCase().includes(query) ||
        (v.artist || '').toLowerCase().includes(query) ||
        (v.notes || '').toLowerCase().includes(query)
    );

    return matchEvent || matchVideo;
  });

  const filteredVideos = allVideos.filter((v) => {
    return (
      (v.songTitle || '').toLowerCase().includes(query) ||
      (v.artist || '').toLowerCase().includes(query) ||
      (v.event?.eventName || '').toLowerCase().includes(query) ||
      (v.event?.venue || '').toLowerCase().includes(query)
    );
  });

  // Calculate unique artists
  const uniqueArtists = Array.from(
    new Set(allVideos.map((v) => v.artist).filter(Boolean))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-900 shadow-xs">
          <Film size={14} className="text-fuchsia-600 dark:text-fuchsia-400" />
          <span>Arsip Dokumentasi & Fancam Konser</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Fancam & Dokumentasi Konser
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal max-w-2xl leading-relaxed">
            Koleksi rekaman langsung (*fancam*) dari barisan penonton, momen panggung spektakuler, serta catatan lagu dari konser musik yang pernah saya hadiri.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 max-w-xl">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <span className="block text-2xl font-bold font-mono text-fuchsia-600 dark:text-fuchsia-400">
              {concerts.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Event Konser</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <span className="block text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {allVideos.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Lagu / Fancam</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <span className="block text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {uniqueArtists.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Penyanyi / Artis</span>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FILTER & SEARCH TOOLBAR                    */}
      {/* ========================================== */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lagu, nama artis, konser, atau venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'events'
                ? 'bg-white dark:bg-slate-900 text-fuchsia-600 dark:text-fuchsia-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ListMusic size={14} />
            <span>Per Event</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('videos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'videos'
                ? 'bg-white dark:bg-slate-900 text-fuchsia-600 dark:text-fuchsia-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Tv size={14} />
            <span>Semua Video ({allVideos.length})</span>
          </button>
        </div>
      </section>

      {/* ========================================== */}
      {/* CONTENT VIEW                               */}
      {/* ========================================== */}
      {viewMode === 'events' ? (
        /* ------------------------------------------ */
        /* 1. PER-EVENT CONCERT CARDS                 */
        /* ------------------------------------------ */
        <div className="space-y-10">
          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <Film size={36} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tidak ada konser atau lagu yang sesuai pencarian "{search}".
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-3 text-xs text-fuchsia-600 dark:text-fuchsia-400 underline"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const videos = event.videos || [];
              return (
                <div
                  key={event.id}
                  className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Event Banner / Header */}
                  <div className="relative w-full aspect-21/9 sm:aspect-24/7 min-h-[140px] bg-slate-900 overflow-hidden">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover opacity-75"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                    {/* Header Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-600/90 backdrop-blur-xs text-white">
                            <Sparkles size={11} />
                            <span>{videos.length} Video Fancam</span>
                          </span>
                          {event.date && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                              <Calendar size={12} />
                              <span>{event.date}</span>
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                          {event.eventName}
                        </h2>
                        {event.venue && (
                          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                            <MapPin size={13} className="text-fuchsia-400 shrink-0" />
                            <span>{event.venue}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Notes & Personal Experience */}
                  {event.notes && (
                    <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
                      "{event.notes}"
                    </div>
                  )}

                  {/* Songs / Fancam Video List */}
                  <div className="p-4 sm:p-6 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      Daftar Fancam & Lagu Dibawakan
                    </h3>

                    {videos.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        Belum ada video lagu yang ditambahkan pada konser ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {videos.map((vid, idx) => {
                          const parsed = parseVideoUrl(vid.videoUrl);
                          return (
                            <div
                              key={vid.id || idx}
                              onClick={() =>
                                setActiveModal({
                                  event,
                                  video: vid,
                                  videoIndex: idx,
                                })
                              }
                              className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 hover:bg-fuchsia-50/20 dark:hover:bg-fuchsia-950/20 transition-all cursor-pointer shadow-2xs"
                            >
                              {/* Thumbnail / Play Badge */}
                              <div className="relative w-20 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                                {parsed.thumbnailUrl ? (
                                  <img
                                    src={parsed.thumbnailUrl}
                                    alt={vid.songTitle}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-fuchsia-900 to-indigo-950 flex items-center justify-center">
                                    <Music size={18} className="text-white/60" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                  <div className="w-7 h-7 rounded-full bg-fuchsia-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <Play size={12} className="ml-0.5 fill-current" />
                                  </div>
                                </div>
                              </div>

                              {/* Song & Artist Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                                  {vid.songTitle}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {vid.artist || 'Artis Konser'}
                                </p>
                                {vid.notes && (
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {vid.notes}
                                  </p>
                                )}
                              </div>

                              <div className="text-slate-400 group-hover:text-fuchsia-500 transition-colors pr-1">
                                <ChevronRight size={18} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ------------------------------------------ */
        /* 2. ALL VIDEOS GRID VIEW                    */
        /* ------------------------------------------ */
        <div className="space-y-6">
          {filteredVideos.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <Film size={36} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tidak ada video yang cocok dengan pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((item, idx) => {
                const parsed = parseVideoUrl(item.videoUrl);
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setActiveModal({
                        event: item.event,
                        video: item,
                        videoIndex: item.videoIndex,
                      })
                    }
                    className="group flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-md hover:border-fuchsia-500 dark:hover:border-fuchsia-500 transition-all cursor-pointer hover:-translate-y-0.5"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      {parsed.thumbnailUrl ? (
                        <img
                          src={parsed.thumbnailUrl}
                          alt={item.songTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-fuchsia-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                          <Music size={32} className="text-white/40" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-fuchsia-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={16} className="ml-0.5 fill-current" />
                        </div>
                      </div>

                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/70 text-white backdrop-blur-xs truncate max-w-[85%]">
                        {item.event?.eventName}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex flex-col flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors line-clamp-1">
                        {item.songTitle}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {item.artist}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mt-auto pt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* CINEMA THEATER MODAL                       */}
      {/* ========================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 sm:py-3.5 border-b border-slate-800/80 flex items-center justify-between text-white bg-slate-900/60">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-fuchsia-600 text-white shrink-0">
                  FANCAM
                </span>
                <span className="text-xs sm:text-sm font-semibold truncate text-slate-200">
                  {activeModal.video.artist} — {activeModal.video.songTitle}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeModal.video.videoUrl && (
                  <a
                    href={activeModal.video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Buka Video di Sumber Asli"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Tutup (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player Area */}
            <div className="bg-black flex-1 flex items-center justify-center">
              <VideoPlayer
                url={activeModal.video.videoUrl}
                title={`${activeModal.video.artist} - ${activeModal.video.songTitle}`}
                artist={activeModal.video.artist}
                autoPlay={true}
              />
            </div>

            {/* Modal Footer (Info & Navigation) */}
            <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-fuchsia-400 font-medium">
                  <span>{activeModal.event?.eventName}</span>
                  {activeModal.event?.venue && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">{activeModal.event.venue}</span>
                    </>
                  )}
                </div>
                {activeModal.video.notes && (
                  <p className="text-xs text-slate-300 italic">
                    "{activeModal.video.notes}"
                  </p>
                )}
              </div>

              {/* Prev / Next Video Buttons */}
              {activeModal.event?.videos?.length > 1 && (
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                    title="Lagu Sebelumnya"
                  >
                    <ChevronLeft size={14} />
                    <span>Sebelumnya</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextVideo}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                    title="Lagu Berikutnya"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
