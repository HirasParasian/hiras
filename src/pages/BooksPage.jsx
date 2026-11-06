import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Star,
  MapPin,
  Globe,
  ExternalLink,
  X,
  Building,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { fetchBooks } from '../services/firebase';
import { defaultBooks } from '../data/defaultData';
import { useAuth } from '../context/AuthContext';
import ExcelImportModal from '../components/ExcelImportModal';
import { downloadBookTemplate } from '../services/excelService';

export default function BooksPage() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState(defaultBooks);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [formatFilter, setFormatFilter] = useState('Semua');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const loadBooks = async () => {
    try {
      const cloudBooks = await fetchBooks();
      if (cloudBooks && cloudBooks.length > 0) {
        setBooks(cloudBooks);
      }
    } catch (err) {
      console.warn('Using default books fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const statuses = ['Semua', 'Sedang Dibaca', 'Selesai Dibaca', 'Wishlist'];

  const filteredBooks = books
    .filter((book) => {
      const matchSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        (book.genre && book.genre.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'Semua' || book.status === statusFilter;
      const matchFormat =
        formatFilter === 'Semua' ||
        (formatFilter === 'fisik' && book.format === 'fisik') ||
        (formatFilter === 'online' && book.format === 'online');

      return matchSearch && matchStatus && matchFormat;
    })
    .sort((a, b) => {
      // Buku fisik tampil lebih dulu dari buku online
      if (a.format === 'fisik' && b.format !== 'fisik') return -1;
      if (a.format !== 'fisik' && b.format === 'fisik') return 1;
      return 0;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <BookOpen size={14} />
            <span>Katalog & Koleksi Bacaan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Daftar Buku Saya
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Koleksi buku fisik yang tersimpan di rak dan kotak saya, serta buku online/e-book yang pernah dan sedang saya telaah beserta catatan intisarinya.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={downloadBookTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-xs cursor-pointer"
            title="Download Template Excel (.xlsx)"
          >
            <Download size={14} className="text-emerald-500" />
            <span>Download Template Excel</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>Bulk Upload Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul buku, penulis, atau genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}

          {/* Format Toggle */}
          <div className="w-[1px] h-5 bg-slate-200 dark:border-slate-800 mx-1"></div>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="Semua">Semua Format</option>
            <option value="fisik">Buku Fisik</option>
            <option value="online">Buku Online</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          Memuat daftar buku dari koleksi...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <BookOpen size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tidak ada buku yang sesuai dengan pencarian.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('Semua');
              setFormatFilter('Semua');
            }}
            className="mt-3 text-xs text-blue-500 underline"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group flex flex-col p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:-translate-y-1 cursor-pointer shadow-xs"
            >
              {/* Cover Aspect Ratio 3:4 */}
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 relative">
                <img
                  src={book.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Status Badge */}
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-md shadow-xs ${
                    book.status === 'Selesai Dibaca'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                      : book.status === 'Sedang Dibaca'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-800/50'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                  }`}
                >
                  {book.status}
                </span>

                {/* Format Pill (Fisik / Online) */}
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-black/70 text-slate-200 backdrop-blur-xs flex items-center gap-1">
                  {book.format === 'fisik' ? (
                    <>
                      <MapPin size={10} />
                      <span>Fisik</span>
                    </>
                  ) : (
                    <>
                      <Globe size={10} />
                      <span>Online</span>
                    </>
                  )}
                </span>
              </div>

              {/* Title & Author */}
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-medium mb-1 line-clamp-1">
                {book.genre || 'Umum'}
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                {book.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {book.author}
              </p>

              {/* Rating row */}
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    className={
                      s <= (book.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-28 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={selectedBook.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400">
                    {selectedBook.genre}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {selectedBook.status}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {selectedBook.title}
                </h2>
                <p className="text-xs text-slate-500">Penulis: {selectedBook.author}</p>

                <div className="flex items-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={
                        s <= (selectedBook.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1.5 font-mono">
                    ({selectedBook.rating || 5}/5)
                  </span>
                </div>

                {/* Details format */}
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Format:</span>
                    <span className="font-medium capitalize">{selectedBook.format || 'Buku Fisik'}</span>
                  </div>

                  {selectedBook.format === 'fisik' ? (
                    <>
                      {selectedBook.publisher && (
                        <div className="flex items-center gap-1.5">
                          <Building size={12} className="text-slate-400" />
                          <span className="text-slate-400">Penerbit:</span>
                          <span>{selectedBook.publisher}</span>
                        </div>
                      )}
                      {selectedBook.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-blue-500" />
                          <span className="text-slate-400">Lokasi:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {selectedBook.location}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    selectedBook.onlineUrl && (
                      <div className="pt-1">
                        <a
                          href={selectedBook.onlineUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline"
                        >
                          <Globe size={13} />
                          <span>Buka Tautan Buku Online</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {selectedBook.notes && (
              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold block mb-1 text-slate-900 dark:text-slate-100">
                  Catatan Pribadi & Pelajaran Utama:
                </span>
                <p className="italic">"{selectedBook.notes}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Excel Bulk Upload Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportSuccess={async () => {
          await loadBooks();
        }}
      />
    </div>
  );
}
