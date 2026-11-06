import React, { useState } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../services/cloudinary';

export default function ImageUpload({ value, onChange, label = 'Unggah Gambar Sampul', folder = '' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 10MB.');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, (pct) => setProgress(pct), folder);
      onChange(result.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Gagal mengunggah gambar ke Cloudinary.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <label className="font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {manualMode ? 'Gunakan Upload File' : 'Input URL Manual'}
        </button>
      </div>

      {manualMode ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... atau URL gambar"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 transition-colors w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Mengunggah ke Cloudinary... {progress}%
                </span>
                <div className="w-36 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Upload size={22} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Klik untuk memilih file gambar
                </span>
                <span className="text-[11px] text-slate-400">
                  Cloudinary CDN {folder ? `• Folder: ${folder}` : ''} • JPG, PNG, WEBP (Maks 10MB)
                </span>
              </div>
            )}
          </label>

          {value && (
            <div className="relative group w-24 h-28 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={value}
                alt="Pratinjau Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
