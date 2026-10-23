// Cloudinary Direct Unsigned Upload Service

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'fknx9yw1';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ListBook';

export const isCloudinaryConfigured = () => {
  return Boolean(
    CLOUD_NAME &&
    CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    UPLOAD_PRESET
  );
};

/**
 * Uploads an image file to Cloudinary unsigned upload preset
 * @param {File|Blob} file 
 * @param {Function} [onProgress]
 * @returns {Promise<{url: string, publicId: string, format: string}>}
 */
export const uploadToCloudinary = async (file, onProgress) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary environment variables (CLOUD_NAME atau UPLOAD_PRESET) belum diisi.');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            url: res.secure_url || res.url,
            publicId: res.public_id,
            format: res.format,
            width: res.width,
            height: res.height,
          });
        } catch (e) {
          reject(new Error('Gagal memproses respon dari Cloudinary.'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload gagal dengan status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload gagal: ${xhr.statusText || 'Error pada server Cloudinary'}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Koneksi ke Cloudinary gagal. Periksa koneksi internet Anda.'));
    };

    xhr.send(formData);
  });
};

/**
 * Returns optimized thumbnail URL using Cloudinary transformations
 * @param {string} originalUrl 
 * @param {number} width 
 * @param {number} height 
 * @returns {string}
 */
export const getOptimizedImageUrl = (originalUrl, width = 800, height = 500) => {
  if (!originalUrl) return '';
  if (!originalUrl.includes('cloudinary.com')) return originalUrl;
  
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v1234/file.jpg
  // Target: https://res.cloudinary.com/<cloud>/image/upload/w_800,h_500,c_fill,q_auto,f_auto/v1234/file.jpg
  return originalUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
};
