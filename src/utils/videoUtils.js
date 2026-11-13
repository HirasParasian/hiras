/**
 * Video URL Parser & Embed Helper
 * Mendukung video non-YouTube:
 * 1. Google Drive (preview embed)
 * 2. Dropbox (auto convert to raw streamable HTML5 video)
 * 3. Direct Video (.mp4, .webm, .mov, Cloudinary video CDN, S3, dll)
 * 4. Vimeo (player.vimeo.com)
 * 5. Streamable (streamable.com/e)
 * 6. YouTube (opsional bagi yang mau)
 * 7. Generic iframe / Web link
 */

export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: '', rawUrl: '', provider: 'Unknown' };
  }

  let cleanUrl = url.trim();

  // 1. Google Drive
  // Matches: drive.google.com/file/d/FILE_ID/..., drive.google.com/open?id=FILE_ID, drive.google.com/uc?id=FILE_ID
  const driveMatch = cleanUrl.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([a-zA-Z0-9_-]+)/i
  );
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      provider: 'Google Drive',
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
      rawUrl: cleanUrl,
    };
  }

  // 2. Dropbox Link (Ubah dl=0 menjadi raw=1 agar bisa streaming di HTML5 <video>)
  if (cleanUrl.includes('dropbox.com')) {
    let directDropbox = cleanUrl.replace(/[?&]dl=0/, '').replace(/[?&]raw=1/, '');
    directDropbox += directDropbox.includes('?') ? '&raw=1' : '?raw=1';
    return {
      type: 'direct',
      provider: 'Dropbox',
      embedUrl: directDropbox,
      thumbnailUrl: '',
      rawUrl: cleanUrl,
    };
  }

  // 3. Vimeo
  // Matches: vimeo.com/123456789
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]+\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      provider: 'Vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
      thumbnailUrl: '',
      rawUrl: cleanUrl,
    };
  }

  // 4. Streamable
  // Matches: streamable.com/xyz123
  const streamableMatch = cleanUrl.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/i);
  if (streamableMatch && streamableMatch[1]) {
    const streamableId = streamableMatch[1];
    return {
      type: 'streamable',
      provider: 'Streamable',
      embedUrl: `https://streamable.com/e/${streamableId}?autoplay=1`,
      thumbnailUrl: '',
      rawUrl: cleanUrl,
    };
  }

  // 5. Direct Video File (.mp4, .webm, .mov, Cloudinary video, AWS S3, Firebase Storage, dsb)
  const isDirectVideo =
    /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(cleanUrl) ||
    (cleanUrl.includes('cloudinary.com') && cleanUrl.includes('/video/upload/')) ||
    cleanUrl.includes('firebasestorage.googleapis.com');

  if (isDirectVideo) {
    return {
      type: 'direct',
      provider: cleanUrl.includes('cloudinary') ? 'Cloudinary Video' : 'Direct Video (MP4)',
      embedUrl: cleanUrl,
      thumbnailUrl: '',
      rawUrl: cleanUrl,
    };
  }

  // 6. YouTube (Tetap didukung jika suatu saat ingin digunakan)
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      provider: 'YouTube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rawUrl: cleanUrl,
    };
  }

  // 7. Fallback: Generic Link / Web URL
  return {
    type: 'generic',
    provider: 'Web Link',
    embedUrl: cleanUrl,
    thumbnailUrl: '',
    rawUrl: cleanUrl,
  };
}

