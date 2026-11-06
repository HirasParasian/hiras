import * as XLSX from 'xlsx';

/**
 * Kolom template Excel:
 * Judul, Penulis, Format, Penerbit, Lokasi Rak/Kotak, Tautan Online, Genre, Status Baca, Rating, Tahun, Catatan Pribadi
 */
export const downloadBookTemplate = () => {
  const templateData = [
    {
      'Judul Buku *': 'Designing Data-Intensive Applications',
      'Penulis *': 'Martin Kleppmann',
      'Format (fisik/online)': 'fisik',
      'Penerbit': "O'Reilly Media",
      'Lokasi Rak/Kotak (Buku Fisik)': 'Rak Utama - Baris 1',
      'Tautan Online (Buku Online)': '',
      'Genre / Kategori': 'Sistem Terdistribusi',
      'Status Baca': 'Sedang Dibaca',
      'Rating (1-5)': 5,
      'Tahun': 2024,
      'URL Cover / Sampul (Opsional)': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'Catatan Pribadi': 'Kajian mendalam tentang replikasi, partisi, konsistensi data terdistribusi.',
    },
    {
      'Judul Buku *': 'Atomic Habits',
      'Penulis *': 'James Clear',
      'Format (fisik/online)': 'online',
      'Penerbit': '',
      'Lokasi Rak/Kotak (Buku Fisik)': '',
      'Tautan Online (Buku Online)': 'https://jamesclear.com/atomic-habits',
      'Genre / Kategori': 'Pengembangan Diri',
      'Status Baca': 'Selesai Dibaca',
      'Rating (1-5)': 5,
      'Tahun': 2023,
      'URL Cover / Sampul (Opsional)': '',
      'Catatan Pribadi': 'Perubahan kecil 1% setiap hari berdampak eksponensial dalam jangka panjang.',
    },
    {
      'Judul Buku *': 'Clean Code',
      'Penulis *': 'Robert C. Martin',
      'Format (fisik/online)': 'fisik',
      'Penerbit': 'Prentice Hall',
      'Lokasi Rak/Kotak (Buku Fisik)': 'Kotak Koleksi A',
      'Tautan Online (Buku Online)': '',
      'Genre / Kategori': 'Rekayasa Perangkat Lunak',
      'Status Baca': 'Selesai Dibaca',
      'Rating (1-5)': 5,
      'Tahun': 2023,
      'URL Cover / Sampul (Opsional)': '',
      'Catatan Pribadi': 'Prinsip kode bersih, fungsi kecil terfokus, dan refactoring berkala.',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Atur lebar kolom agar rapi saat dibuka di Microsoft Excel
  worksheet['!cols'] = [
    { wch: 35 }, // Judul
    { wch: 22 }, // Penulis
    { wch: 20 }, // Format
    { wch: 18 }, // Penerbit
    { wch: 28 }, // Lokasi Rak/Kotak
    { wch: 32 }, // Tautan Online
    { wch: 24 }, // Genre
    { wch: 16 }, // Status Baca
    { wch: 12 }, // Rating
    { wch: 10 }, // Tahun
    { wch: 38 }, // URL Cover / Sampul
    { wch: 45 }, // Catatan Pribadi
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Buku');

  XLSX.writeFile(workbook, 'Template_Upload_Buku_Hiras.xlsx');
};

/**
 * Parsing file Excel (.xlsx, .xls, .csv) menjadi array data buku
 */
export const parseBookExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          throw new Error('File Excel kosong atau tidak memiliki baris data.');
        }

        // Helper cari nilai dari alias kolom yang fleksibel
        const getVal = (row, ...keys) => {
          for (const key of keys) {
            for (const rowKey of Object.keys(row)) {
              const cleanKey = rowKey.toLowerCase().replace(/[^a-z0-9]/g, '');
              const cleanTarget = key.toLowerCase().replace(/[^a-z0-9]/g, '');
              if (cleanKey.includes(cleanTarget)) {
                return String(row[rowKey]).trim();
              }
            }
          }
          return '';
        };

        const books = rawRows
          .map((row) => {
            const title = getVal(row, 'judul', 'title', 'nama buku');
            const author = getVal(row, 'penulis', 'author', 'pengarang');
            let format = getVal(row, 'format', 'tipe', 'jenis').toLowerCase();
            if (format.includes('online') || format.includes('web') || format.includes('ebook') || format.includes('e-book')) {
              format = 'online';
            } else {
              format = 'fisik';
            }

            const publisher = getVal(row, 'penerbit', 'publisher');
            const location = getVal(row, 'lokasi', 'location', 'rak', 'kotak', 'tempat');
            const onlineUrl = getVal(row, 'link', 'url', 'tautan', 'online');
            const genre = getVal(row, 'genre', 'kategori', 'tag', 'kategori buku') || 'Umum';

            let status = getVal(row, 'status', 'status baca');
            if (status.toLowerCase().includes('selesai') || status.toLowerCase().includes('read') || status.toLowerCase().includes('tamat')) {
              status = 'Selesai Dibaca';
            } else if (status.toLowerCase().includes('sedang') || status.toLowerCase().includes('reading')) {
              status = 'Sedang Dibaca';
            } else if (status.toLowerCase().includes('wishlist') || status.toLowerCase().includes('ingin') || status.toLowerCase().includes('beli')) {
              status = 'Wishlist';
            } else {
              status = 'Selesai Dibaca';
            }

            const rawRating = getVal(row, 'rating', 'skor', 'nilai', 'bintang');
            const rating = Math.min(5, Math.max(1, Number(rawRating) || 5));
            const year = getVal(row, 'tahun', 'year') || String(new Date().getFullYear());
            const cover = getVal(row, 'cover', 'sampul', 'gambar', 'image', 'url cover', 'link cover', 'foto');
            const notes = getVal(row, 'catatan', 'notes', 'review', 'intisari', 'ringkasan');

            return {
              title,
              author,
              format,
              publisher,
              location,
              onlineUrl,
              genre,
              status,
              rating,
              year,
              notes,
              cover: cover || '',
            };
          })
          .filter((book) => Boolean(book.title)); // Wajib punya judul

        if (books.length === 0) {
          throw new Error('Tidak ditemukan baris buku yang memiliki judul.');
        }

        resolve(books);
      } catch (err) {
        console.error('Error parse Excel:', err);
        reject(new Error(err.message || 'Gagal membaca isi file Excel.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari komputer Anda.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

