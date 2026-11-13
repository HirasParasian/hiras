/**
 * Video URL Parser & Embed Helper
 * Mendukung:
 * 1. YouTube (watch, shorts, youtu.be, embed)
 * 2. Google Drive (file preview)
 * 3. Direct Video (.mp4, .webm, .mov, Cloudinary video)
 * 4. Generic iframe / Web link
 */

export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: '', rawUrl: '' };
  }

  const cleanUrl = url.trim();

  // 1. YouTube
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rawUrl: cleanUrl,
    };
  }

  // 2. Google Drive
  // Matches: drive.google.com/file/d/FILE_ID/..., drive.google.com/open?id=FILE_ID
  const driveMatch = cleanUrl.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i
  );
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'drive',
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: '',
      rawUrl: cleanUrl,
    };
  }

  // 3. Direct Video File (.mp4, .webm, .mov, atau Cloudinary video upload)
  const isDirectVideo =
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(cleanUrl) ||
    (cleanUrl.includes('cloudinary.com') && cleanUrl.includes('/video/upload/'));

  if (isDirectVideo) {
    return {
      type: 'direct',
      embedUrl: cleanUrl,
      thumbnailUrl: '',
      rawUrl: cleanUrl,
    };
  }

  // 4. Fallback: Generic Link / Web URL
  return {
    type: 'generic',
    embedUrl: cleanUrl,
    thumbnailUrl: '',
    rawUrl: cleanUrl,
  };
}
