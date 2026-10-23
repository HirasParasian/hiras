# 🚀 Hiras Parasian — Personal Website & Portfolio

Website pribadi modern, interaktif, dan berkinerja tinggi yang dibangun untuk **Hiras Parasian**. Terhubung langsung dengan **Firebase** (Autentikasi & Database NoSQL Firestore), **Cloudinary** (Pipeline optimasi media CDN), dan siap di-deploy secara **100% gratis ke GitHub Pages**.

---

## ✨ Fitur Unggulan

1. **Creative & Dynamic Aesthetics**:
   - Sleek Dark Mode dengan efek Glassmorphism premium dan kartu berpendar (*glowing accents*).
   - Animasi latar belakang ambient orbs halus dan grid mesh tech modern.
   - Tipografi modern Google Fonts (*Outfit* untuk heading & *Plus Jakarta Sans* untuk body text).
   - Kartu kode interaktif terminal di Hero section yang menampilkan kapabilitas teknis.

2. **Arsitektur Multi-Page Penuh (React Router)**:
   - Navigasi halaman terpisah yang bersih: **Home (`/`)**, **Tentang (`/about`)**, **Portofolio (`/projects`)**, **Buku Bacaan (`/books`)**, **Blog (`/blog`)**, **Halaman Artikel Penuh (`/blog/:id`)**, dan **Kontak (`/contact`)**.
   - URL mandiri dan dapat dibagikan langsung ke media sosial tanpa takut link 404 di GitHub Pages.

3. **Rak Buku & Reading Tracker (Upload via Excel .xlsx / .csv)**:
   - Halaman khusus `#/books` yang menampilkan buku-buku yang telah dibaca, sedang dibaca, atau wishlist.
   - **Upload via Excel**: Cukup pilih atau seret file spreadsheet Excel (`.xlsx`, `.xls`, `.csv`). Sistem secara otomatis mendeteksi kolom judul, penulis, rating, genre, status, dan catatan!
   - **Preview Tabel Sebelum Impor**: Lihat preview data buku yang terdeteksi sebelum disimpan secara batch ke Firebase Firestore.
   - **Unduh Template Excel**: Tombol 1-klik untuk mengunduh template spreadsheet resmi berformat rapi.
   - **Ekspor ke Excel**: Cadangkan seluruh daftar buku Anda kembali ke file `.xlsx` kapan saja.

4. **Sistem Blog & Catatan Teknis (Halaman Penuh)**:
   - Halaman katalog blog (`#/blog`) dengan pencarian instan dan filter kategori.
   - Halaman pembaca penuh (`#/blog/:id`) dengan breadcrumb, estimasi waktu baca, hero image, format tipografi artikel yang nyaman, profil penulis, dan rekomendasi artikel terkait.

5. **Portofolio Proyek Interaktif**:
   - Filter proyek dinamis (*Full Stack, Cloud/AI, Fintech*), pencarian nama/tech stack, dan optimasi gambar Cloudinary.

6. **Formulir Kontak Real-Time**:
   - Pesan dari pengunjung tersimpan langsung ke database **Firebase Firestore** (`messages`).

7. **Admin Dashboard / CMS Terintegrasi**:
   - Autentikasi admin via **Firebase Auth** (`hirasparasian@gmail.com`).
   - Kelola proyek, artikel blog, dan buku bacaan secara visual, termasuk upload gambar langsung ke Cloudinary (*Preset: ListBook*).

---

## 🛠️ Tech Stack

- **Frontend Core**: [React](https://react.dev/) + [Vite](https://vite.dev/) (SPA static build)
- **Styling**: Vanilla CSS kustom dengan arsitektur design system & CSS variables (tanpa library berat)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Media CDN**: [Cloudinary](https://cloudinary.com/) (Direct Unsigned Upload Preset `ListBook`)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVG Brand Icons
- **Deployment**: [GitHub Pages](https://pages.github.com/) (Free CDN Hosting)

---

## 🚀 Menjalankan Secara Lokal

1. **Pastikan dependencies terpasang**:
   ```bash
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173/`.

---

## 🌐 Cara Deploy ke GitHub Pages (Gratis)

### Opsi 1: Deploy Langsung dari Terminal (Satu Perintah)
```bash
npm run deploy
```
*Script ini otomatis menjalankan `npm run build` dan mem-push bundle statis ke branch `gh-pages`.*

### Opsi 2: Deploy Otomatis via GitHub Actions
Workflow CI/CD sudah disediakan di [deploy.yml](file:///d:/MyWeb/hiras/.github/workflows/deploy.yml).
Setiap kali Anda melakukan `git push origin main`, GitHub Actions akan otomatis mem-build dan mempublikasikan website ke GitHub Pages!

> **Pengaturan di GitHub Repository**:
> 1. Buka repo Anda di GitHub: `https://github.com/HirasParasian/hiras`
> 2. Masuk ke tab **Settings** > **Pages**.
> 3. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions** (atau deploy dari branch `gh-pages`).

---

## 🔒 Konfigurasi Environment Variables

File `.env` sudah dikonfigurasikan dengan kredensial Firebase dan Cloudinary Anda:
- `VITE_FIREBASE_API_KEY`: Kunci API Firebase
- `VITE_FIREBASE_AUTH_DOMAIN`: Domain autentikasi Firebase
- `VITE_FIREBASE_PROJECT_ID`: ID Proyek Firebase (`listbook-f6979`)
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloud name Cloudinary (`fknx9yw1`)
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Unsigned upload preset (`ListBook`)
- `VITE_ADMIN_EMAIL`: Email admin otoritas (`hirasparasian@gmail.com`)

*Catatan: File `.env` sudah dimasukkan ke `.gitignore` agar tidak bocor ke publik.*
