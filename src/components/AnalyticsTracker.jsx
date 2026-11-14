import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from '../services/analytics';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    // Delay sedikit agar document.title sudah terupdate oleh usePageSEO
    const timer = setTimeout(() => {
      const fullPath = location.pathname + location.search;
      trackPageView(fullPath, document.title);
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}

