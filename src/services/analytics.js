/**
 * Google Analytics 4 (GA4) Service for Single Page Applications (SPA)
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;

/**
 * Inisialisasi Google Analytics 4
 * Menambahkan script gtag.js secara dinamis jika VITE_GA_MEASUREMENT_ID diatur.
 */
export function initGA() {
  if (typeof window === 'undefined' || isInitialized) return;
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') {
    return;
  }

  try {
    // Inject gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      send_page_view: false, // SPA will handle page_view manually
      anonymize_ip: true,
    });

    isInitialized = true;
  } catch (err) {
    console.warn('Google Analytics init error:', err);
  }
}

/**
 * Kirim event page_view saat rute berpindah
 * @param {string} path - URL pathname (e.g. '/fancam-concert')
 * @param {string} title - Judul halaman
 */
export function trackPageView(path, title = '') {
  if (typeof window === 'undefined') return;

  // Jika GA belum terinisialisasi dan ada ID, coba inisialisasi
  if (!isInitialized && GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
    initGA();
  }

  if (window.gtag && GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
}

/**
 * Kirim custom event ke Google Analytics (opsional)
 * @param {string} eventName 
 * @param {object} params 
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag && GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', eventName, params);
  }
}

