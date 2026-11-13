import React, { useState } from 'react';
import { ExternalLink, Play, AlertCircle, RefreshCw } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoUtils';

export default function VideoPlayer({ url, title, artist, className = '', autoPlay = true }) {
  const [loadError, setLoadError] = useState(false);
  const parsed = parseVideoUrl(url);

  if (!url) {
    return (
      <div className={`w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs p-4 ${className}`}>
        <Play size={32} className="opacity-40 mb-2" />
        <span>Tautan video belum tersedia.</span>
      </div>
    );
  }

  // 1. YouTube Player
  if (parsed.type === 'youtube') {
    return (
      <div className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={title || 'Fancam Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // 2. Google Drive Player
  if (parsed.type === 'drive') {
    return (
      <div className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={title || 'Google Drive Video'}
          allow="autoplay"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // 3. Direct Video File (.mp4, .webm, Cloudinary Video)
  if (parsed.type === 'direct') {
    return (
      <div className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <video
          controls
          autoPlay={autoPlay}
          playsInline
          className="w-full h-full object-contain"
          onError={() => setLoadError(true)}
        >
          <source src={parsed.embedUrl} type="video/mp4" />
          <source src={parsed.embedUrl} type="video/webm" />
          Browser Anda tidak mendukung tag video HTML5.
        </video>
        {loadError && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center">
            <AlertCircle size={32} className="text-amber-400 mb-2" />
            <p className="text-xs text-slate-300 mb-3">
              Video tidak dapat diputar langsung di browser.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
            >
              <span>Buka Video di Tab Baru</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    );
  }

  // 4. Fallback Generic Web Link
  return (
    <div className={`w-full aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-300 border border-slate-800 ${className}`}>
      <Play size={40} className="text-blue-400 mb-3" />
      <h4 className="text-sm font-semibold text-white mb-1">
        {title || 'Tonton Video Fancam'}
      </h4>
      {artist && <p className="text-xs text-slate-400 mb-4">{artist}</p>}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105"
      >
        <span>Buka Tautan Video Sumber</span>
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
