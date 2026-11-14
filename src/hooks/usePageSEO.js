import { useEffect } from 'react';

/**
 * Custom hook untuk mengatur metadata SEO dan Open Graph secara dinamis per halaman
 * @param {object} options
 * @param {string} options.title - Judul halaman
 * @param {string} [options.description] - Deskripsi meta & OG
 * @param {string} [options.image] - URL gambar preview Open Graph / Twitter Card
 * @param {string} [options.url] - URL kanonikal halaman
 * @param {string} [options.type] - 'website' | 'article'
 * @param {boolean} [options.noindex] - True jika halaman tidak boleh diindeks (misal /admin)
 */
export function usePageSEO({
  title,
  description = 'Website pribadi Hiras Parasian: catatan buku bacaan, artikel rekayasa perangkat lunak, portofolio proyek, dan arsip konser.',
  image = 'https://www.hiras.my.id/icon-512.png',
  url,
  type = 'website',
  noindex = false,
}) {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = title
      ? `${title} — Hiras Parasian`
      : 'Hiras Parasian — Personal Web & Catatan';
    document.title = fullTitle;

    // Helper untuk set/create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // Helper untuk set/create link canonical
    const setCanonical = (href) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Description & Robots
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Open Graph
    const pageUrl = url || window.location.href;
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', type);

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 5. Canonical URL
    setCanonical(pageUrl);
  }, [title, description, image, url, type, noindex]);
}

