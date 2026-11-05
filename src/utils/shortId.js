/**
 * Menghasilkan ID unik singkat untuk artikel publik (contoh: 'k9x2m4p')
 */
export function generateShortId(length = 7) {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

