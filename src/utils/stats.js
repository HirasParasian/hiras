/**
 * Menghitung tahun pengalaman secara dinamis sejak Mei 2022
 * @param {Date} [startDate] - Default Mei 2022 (index bulan 4)
 * @returns {string} Contoh: '4+'
 */
export const calculateExperienceYears = (startDate = new Date(2022, 4, 1)) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  let years = currentYear - startYear;
  if (currentMonth < startMonth) {
    years -= 1;
  }
  return `${Math.max(1, years)}+`;
};

/**
 * Membentuk array 4 statistik beranda secara dinamis
 * @param {Object} params
 * @param {number} [params.booksCount] - Total buku
 * @param {number} [params.articlesCount] - Total artikel terbit
 * @param {string} [params.completedProjects] - Proyek selesai (dari Firestore / setting)
 * @param {Date} [params.startDate] - Tanggal awal karier
 * @returns {Array<{label: string, value: string}>}
 */
export const getDynamicStats = ({
  booksCount = 0,
  articlesCount = 0,
  completedProjects = '20+',
  startDate = new Date(2022, 4, 1),
} = {}) => {
  return [
    {
      label: 'Buku di Rak',
      value: booksCount > 0 ? `${booksCount}+` : '0',
    },
    {
      label: 'Artikel Diterbitkan',
      value: articlesCount > 0 ? `${articlesCount}+` : '0',
    },
    {
      label: 'Tahun Pengalaman',
      value: calculateExperienceYears(startDate),
    },
    {
      label: 'Proyek Selesai',
      value: completedProjects || '20+',
    },
  ];
};
