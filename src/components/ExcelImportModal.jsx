import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  Loader2,
  X,
  MapPin,
  Globe,
  Trash2,
} from 'lucide-react';
import { downloadBookTemplate, parseBookExcel } from '../services/excelService';
import { batchSaveBooks } from '../services/firebase';

export default function ExcelImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [parsedBooks, setParsedBooks] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');
    setParsing(true);
    setFile(selectedFile);

    try {
      const books = await parseBookExcel(selectedFile);
      setParsedBooks(books);
    } catch (err) {
      console.error('Parse error:', err);
      setError(err.message || 'Gagal membaca file Excel.');
      setParsedBooks([]);
    } finally {
      setParsing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedBooks([]);
    setError('');
  };

  const handleSaveToFirestore = async () => {
    if (parsedBooks.length === 0) return;

    setSaving(true);
    setError('');

    try {
      await batchSaveBooks(parsedBooks);
      onImportSuccess(parsedBooks.length);
      handleReset();
      onClose();
    } catch (err) {
      console.error('Batch save error:', err);
      setError(err.message || 'Gagal menyimpan daftar buku ke Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Bulk Upload Buku via Excel
              </h2>
              <p className="text-xs text-slate-500">
                Impor banyak buku sekaligus tanpa sampul terlebih dahulu.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Download Template */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                Langkah 1 • Unduh Format
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Gunakan template spreadsheet resmi agar nama kolom langsung terdeteksi otomatis.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadBookTemplate}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Download size={15} />
              <span>Download Template Excel (.xlsx)</span>
            </button>
          </div>

          {/* Step 2: Upload File Area */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Langkah 2 • Pilih File Spreadsheet (.xlsx / .csv)
            </span>

            {!file ? (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 transition-colors text-center">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload size={28} className="text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Klik untuk memilih file Excel dari komputer Anda
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Mendukung file .xlsx, .xls, dan .csv
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedBooks.length} buku terdeteksi
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Ganti File"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {parsing && (
            <div className="py-8 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 size={18} className="animate-spin text-emerald-500" />
              <span>Menganalisis baris spreadsheet...</span>
            </div>
          )}

          {/* Step 3: Preview Table */}
          {parsedBooks.length > 0 && !parsing && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Pratinjau Data ({parsedBooks.length} Buku)
                </span>
                <span className="text-[11px] text-slate-400">
                  *Sampul otomatis kosong (dapat diunggah kemudian)
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 text-[11px] text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 pl-3">#</th>
                      <th className="p-2.5">Judul Buku</th>
                      <th className="p-2.5">Penulis</th>
                      <th className="p-2.5">Format</th>
                      <th className="p-2.5">Lokasi / Tautan</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Genre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedBooks.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 pl-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">
                          {b.title}
                        </td>
                        <td className="p-2.5 text-slate-500">{b.author || '-'}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {b.format}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">
                          {b.format === 'fisik' ? (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-blue-500 shrink-0" />
                              <span className="truncate max-w-[130px]">{b.location || 'Fisik'}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-blue-500">
                              <Globe size={11} className="shrink-0" />
                              <span className="truncate max-w-[130px]">{b.onlineUrl || 'Online'}</span>
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                              b.status === 'Selesai Dibaca'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : b.status === 'Sedang Dibaca'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">{b.genre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
          <span className="text-xs text-slate-500">
            {parsedBooks.length > 0 ? `${parsedBooks.length} buku siap diimpor` : 'Silakan pilih file Excel'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSaveToFirestore}
              disabled={saving || parsedBooks.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              <span>
                {saving
                  ? 'Menyimpan ke Firestore...'
                  : `Konfirmasi Impor ${parsedBooks.length} Buku`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
