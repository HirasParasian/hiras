import * as XLSX from 'xlsx';

/**
 * Normalizes Excel row keys (case-insensitive and whitespace-stripped)
 */
const normalizeKey = (key) => {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

/**
 * Parses an Excel or CSV file into an array of book objects
 * @param {File} file 
 * @returns {Promise<Array<Object>>}
 */
export const parseExcelBooks = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('File Excel kosong atau format tabel tidak dikenali.');
        }

        // Map columns intelligently
        const books = rawJson.map((row, index) => {
          const normalizedRow = {};
          Object.keys(row).forEach((k) => {
            normalizedRow[normalizeKey(k)] = row[k];
          });

          // Helper to find value from possible aliases
          const findVal = (...aliases) => {
            for (const alias of aliases) {
              const norm = normalizeKey(alias);
              if (normalizedRow[norm] !== undefined && normalizedRow[norm] !== '') {
                return normalizedRow[norm];
              }
            }
            return '';
          };

          const title = findVal('judul', 'title', 'judulbuku', 'booktitle', 'nama') || `Buku ${index + 1}`;
          const author = findVal('penulis', 'author', 'pengarang', 'writer') || 'Penulis Tidak Diketahui';
          const genre = findVal('genre', 'kategori', 'category', 'topik') || 'Umum';
          
          let rawRating = findVal('rating', 'nilai', 'stars', 'bintang');
          let rating = Number(rawRating);
          if (isNaN(rating) || rating < 1) rating = 5;
          if (rating > 5) rating = 5;

          let rawStatus = String(findVal('status', 'progress', 'kondisi') || 'Selesai Dibaca').trim();
          let status = 'Selesai Dibaca';
          const lowerStatus = rawStatus.toLowerCase();
          if (lowerStatus.includes('sedang') || lowerStatus.includes('reading') || lowerStatus.includes('baca')) {
            status = 'Sedang Dibaca';
          } else if (lowerStatus.includes('ingin') || lowerStatus.includes('wish') || lowerStatus.includes('rencana') || lowerStatus.includes('mau')) {
            status = 'Wishlist';
          } else {
            status = 'Selesai Dibaca';
          }

          const year = String(findVal('tahun', 'year', 'tahunbaca', 'tanggal', 'date') || new Date().getFullYear());
          const notes = String(findVal('catatan', 'notes', 'review', 'ulasan', 'quote', 'ringkasan') || '');
          const cover = String(findVal('cover', 'image', 'urlcover', 'coverurl', 'foto') || '');

          return {
            id: 'book-' + Date.now() + '-' + index,
            title,
            author,
            genre,
            rating,
            status,
            year,
            notes,
            cover: cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          };
        });

        resolve(books);
      } catch (err) {
        reject(new Error('Gagal membaca file Excel: ' + (err.message || 'Format tidak valid')));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari komputer.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Downloads a pre-formatted Excel template for books
 */
export const downloadExcelTemplate = () => {
  const sampleData = [
    {
      'Judul Buku': 'Clean Code: A Handbook of Agile Software Craftsmanship',
      'Penulis': 'Robert C. Martin',
      'Genre': 'Software Engineering',
      'Rating (1-5)': 5,
      'Status': 'Selesai Dibaca',
      'Tahun Selesai': '2024',
      'Catatan/Review': 'Buku fundamental wajib bagi software engineer untuk menulis kode yang mudah dipelihara dan elegan.',
      'URL Cover': 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80'
    },
    {
      'Judul Buku': 'Designing Data-Intensive Applications',
      'Penulis': 'Martin Kleppmann',
      'Genre': 'Distributed Systems & Cloud',
      'Rating (1-5)': 5,
      'Status': 'Sedang Dibaca',
      'Tahun Selesai': '2025',
      'Catatan/Review': 'Pembedahan mendalam tentang arsitektur database, konsistensi data, dan sistem terdistribusi modern.',
      'URL Cover': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    },
    {
      'Judul Buku': 'Atomic Habits',
      'Penulis': 'James Clear',
      'Genre': 'Self Development',
      'Rating (1-5)': 5,
      'Status': 'Selesai Dibaca',
      'Tahun Selesai': '2023',
      'Catatan/Review': 'Prinsip 1% perbaikan setiap hari yang mengubah cara kerja dan produktivitas engineering.',
      'URL Cover': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
    },
    {
      'Judul Buku': 'The Pragmatic Programmer: 20th Anniversary Edition',
      'Penulis': 'David Thomas & Andrew Hunt',
      'Genre': 'Software Engineering',
      'Rating (1-5)': 5,
      'Status': 'Wishlist',
      'Tahun Selesai': '2025',
      'Catatan/Review': 'Rencana bacaan berikutnya seputar mindset developer adaptif.',
      'URL Cover': ''
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Buku Hiras');

  // Set column widths
  ws['!cols'] = [
    { wch: 38 }, // Judul
    { wch: 24 }, // Penulis
    { wch: 22 }, // Genre
    { wch: 14 }, // Rating
    { wch: 18 }, // Status
    { wch: 14 }, // Tahun
    { wch: 50 }, // Catatan
    { wch: 35 }, // Cover
  ];

  XLSX.writeFile(wb, 'Template_List_Buku_Hiras.xlsx');
};

/**
 * Exports current books to an Excel file
 */
export const exportBooksToExcel = (books) => {
  if (!books || books.length === 0) {
    alert('Tidak ada data buku untuk diekspor.');
    return;
  }

  const exportData = books.map((b) => ({
    'Judul Buku': b.title,
    'Penulis': b.author,
    'Genre': b.genre,
    'Rating (1-5)': b.rating,
    'Status': b.status,
    'Tahun Selesai': b.year,
    'Catatan/Review': b.notes,
    'URL Cover': b.cover
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Buku Hiras');

  XLSX.writeFile(wb, `List_Buku_Hiras_${new Date().toISOString().split('T')[0]}.xlsx`);
};
