export const defaultProfile = {
  name: "Hiras Parasian",
  title: "Full-Stack Software Engineer & Creative Technologist",
  statusBadge: "Available for New Projects & Roles",
  bio: "Halo! Saya Hiras Parasian, seorang Software Engineer yang berfokus membangun web application berskala tinggi, antarmuka pengguna yang menakjubkan, serta arsitektur cloud serverless yang efisien.",
  longBio: "Saya memiliki passion yang mendalam dalam menggabungkan estetika desain visual dengan kode performa tinggi. Mulai dari membangun REST & real-time APIs di backend hingga merancang micro-interactions dan animasi mulus di frontend. Saya terbiasa bekerja dengan ekosistem React, Node.js, Firebase, dan Cloudinary.",
  location: "Indonesia",
  email: "hirasparasian@gmail.com",
  github: "https://github.com/HirasParasian",
  linkedin: "https://linkedin.com/in/hirasparasian",
  whatsapp: "https://wa.me/6281234567890",
  resumeUrl: "#",
  stats: [
    { label: "Proyek Selesai", value: "24+" },
    { label: "Tahun Pengalaman", value: "3+" },
    { label: "Tech Stack", value: "15+" },
    { label: "Kepuasan Klien", value: "99%" },
  ],
  skillsCategories: [
    {
      category: "Frontend Excellence",
      skills: ["React.js", "JavaScript (ESNext)", "TypeScript", "HTML5 & Semantic SEO", "CSS3 / Modern CSS Architecture", "Vite Ecosystem", "Responsive & Mobile-First"]
    },
    {
      category: "Backend & Cloud",
      skills: ["Node.js", "Firebase (Auth, Firestore, Cloud Functions)", "Cloudinary Media Pipeline", "RESTful APIs", "Serverless Architecture", "Express.js"]
    },
    {
      category: "Databases & Storage",
      skills: ["Firestore NoSQL", "PostgreSQL", "MongoDB", "Cloudinary CDN", "Local Storage & State Caching"]
    },
    {
      category: "Workflow & Tools",
      skills: ["Git & GitHub Actions", "CI/CD & GitHub Pages", "VS Code & Antigravity", "Figma to Code", "Performance Optimization"]
    }
  ],
  experiences: [
    {
      year: "2024 — Sekarang",
      role: "Lead Full-Stack Web Developer",
      company: "Independent / Creative Tech Projects",
      desc: "Merancang dan mendeploy aplikasi web modern interaktif berbasis React, Vite, Firebase, dan integrasi Cloudinary CDN."
    },
    {
      year: "2023 — 2024",
      role: "Frontend & Cloud Application Engineer",
      company: "Digital Solutions Studio",
      desc: "Mengembangkan dashboard interaktif, sistem autentikasi terpusat, dan integrasi media multi-format berkecepatan tinggi."
    },
    {
      year: "2021 — 2023",
      role: "Junior Web Developer & UI Designer",
      company: "Tech Agency",
      desc: "Membangun landing page responsif, implementasi UI/UX, dan optimalisasi SEO performa website."
    }
  ],
  education: [
    {
      year: "2020 — 2024",
      degree: "Sarjana Komputer (S.Kom) / Ilmu Komputer",
      institution: "Universitas",
      desc: "Fokus pada Rekayasa Perangkat Lunak, Arsitektur Sistem Informasi, dan Algoritma Pemrograman."
    }
  ]
};

export const defaultProjects = [
  {
    id: "proj-1",
    title: "ListBook — Library & Reading Management",
    category: "Full Stack",
    description: "Aplikasi manajemen buku dan tracking bacaan real-time yang terhubung langsung dengan Firebase Firestore dan Cloudinary untuk cover book asset optimization.",
    image: "https://images.unsplash.com/photo-1507842229451-7f01be7a50d7?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Firebase Auth", "Firestore", "Cloudinary", "Vite"],
    liveUrl: "https://github.com/HirasParasian/hiras",
    githubUrl: "https://github.com/HirasParasian/hiras",
    featured: true,
    order: 1,
    metrics: "Real-time sync & fast upload"
  },
  {
    id: "proj-2",
    title: "NexusFlow — AI Cloud Dashboard",
    category: "Cloud / AI",
    description: "Dashboard analitik interaktif dengan visualisasi data telemetri, metrik performa sistem, dan integrasi cloud serverless.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Vite", "Serverless", "Glassmorphism", "Chart.js"],
    liveUrl: "https://github.com/HirasParasian/hiras",
    githubUrl: "https://github.com/HirasParasian/hiras",
    featured: true,
    order: 2,
    metrics: "99.9% Uptime Analytics"
  },
  {
    id: "proj-3",
    title: "AuraPay — Modern Digital Payment Gateway",
    category: "Fintech",
    description: "Simulasi pembayaran modern dengan transaksi instan, otentikasi multi-faktor, dan riwayat transaksi dengan proteksi keamanan tinggi.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Firebase Security Rules", "REST API", "Tailored CSS"],
    liveUrl: "https://github.com/HirasParasian/hiras",
    githubUrl: "https://github.com/HirasParasian/hiras",
    featured: false,
    order: 3,
    metrics: "<100ms Latency Flow"
  },
  {
    id: "proj-4",
    title: "OmniCart — Creative Headless E-Commerce",
    category: "Full Stack",
    description: "Toko online headless dengan performa kilat, integrasi Cloudinary CDN dinamis untuk katalog produk, dan cart state persistence.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Cloudinary Image CDN", "State Management", "Vite"],
    liveUrl: "https://github.com/HirasParasian/hiras",
    githubUrl: "https://github.com/HirasParasian/hiras",
    featured: false,
    order: 4,
    metrics: "100/100 Lighthouse Performance"
  }
];

export const defaultPosts = [
  {
    id: "post-1",
    title: "Membangun Website Pribadi Modern dengan React, Firebase, dan Cloudinary",
    category: "Web Development",
    readTime: "5 menit baca",
    publishedAt: "2026-10-20",
    summary: "Panduan lengkap bagaimana mengintegrasikan backend serverless gratis tanpa biaya hosting bulanan menggunakan GitHub Pages, Firestore, dan Cloudinary.",
    content: `
Membangun portofolio pribadi di era modern tidak lagi membutuhkan server VPS mahal atau setup backend yang rumit. Dengan kombinasi **Vite + React** yang dihosting secara gratis di **GitHub Pages**, kita mendapatkan kecepatan loading super instan karena semua aset disajikan dalam bentuk static SPA yang di-cache di CDN global.

### Mengapa Memilih Firebase & Cloudinary?

1. **Firebase Firestore & Auth**: Menyediakan database real-time NoSQL dan autentikasi admin yang sangat aman. Cukup tentukan email admin Anda, dan Anda memiliki CMS pribadi langsung di dalam website!
2. **Cloudinary Media Pipeline**: Mengunggah gambar beresolusi tinggi langsung dari browser menggunakan *Unsigned Upload Preset*. Cloudinary secara otomatis melakukan kompresi format modern (WebP/AVIF) dengan parameter \`f_auto,q_auto\`.
3. **Deployment GitHub Pages Otomatis**: Dengan satu perintah \`npm run deploy\`, kode otomatis ter-bundle dan online dalam hitungan detik.

### Langkah Penting Keamanan

Pastikan Anda menyetel aturan keamanan (*Firestore Security Rules*) agar hanya admin yang dapat membuat atau menghapus artikel dan proyek, sementara publik hanya memiliki akses baca (\`read\`).
    `,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Firebase", "Cloudinary", "GitHub Pages"]
  },
  {
    id: "post-2",
    title: "Optimasi Unsigned Upload Cloudinary pada Client-Side Web App",
    category: "Cloud Architecture",
    readTime: "4 menit baca",
    publishedAt: "2026-10-15",
    summary: "Cara aman dan efisien melakukan upload gambar langsung dari browser ke Cloudinary tanpa mengekspos API Secret Anda.",
    content: `
Banyak pengembang ragu mengizinkan upload langsung dari browser karena takut API Secret mereka bocor. Untungnya, Cloudinary menyediakan fitur **Unsigned Upload Preset**.

Dengan Unsigned Preset:
- Secret API Key tetap aman di server atau tidak perlu dibagikan ke client.
- Preset dapat dikonfigurasi untuk membatasi ukuran file maksimum (misal 5MB), tipe file yang diizinkan (hanya gambar .jpg, .png, .webp), dan folder penyimpanan khusus.
- Di sisi frontend, kita cukup melakukan HTTP POST multipart FormData ke endpoint API Cloudinary, melacak progress bar upload, dan langsung menerima link CDN yang sudah teroptimasi!
    `,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Cloudinary", "Performance", "Security", "Frontend"]
  },
  {
    id: "post-3",
    title: "Desain Glassmorphism & Micro-Animations: Kunci Website yang Memikat",
    category: "UI/UX Design",
    readTime: "6 menit baca",
    publishedAt: "2026-10-08",
    summary: "Bagaimana memadukan nuansa dark mode, blur backdrop-filter, dan CSS glowing effects untuk menciptakan first impression yang berkesan.",
    content: `
Kesan pertama pengunjung website ditentukan dalam 3 detik pertama. Menggunakan warna-warna gelap berkelas dipadukan dengan aksen neon bergradien (seperti cyan, ungu elektrik, dan emerald) menghasilkan tampilan futuristik namun tetap elegan.

Teknik penting:
1. **Backdrop Filter Glassmorphism**: Memberikan rasa kedalaman spasial (*depth*) dengan border semi-transparan tipis.
2. **Interactive Hover Lift**: Memberikan sensasi bahwa setiap elemen responsif terhadap sentuhan kursor pengguna.
3. **Smooth Scroll & Navigation Transitions**: Memastikan perpindahan halaman terasa natural tanpa layar berkedip.
    `,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Design", "CSS", "UI/UX", "Glassmorphism"]
  }
];

export const defaultBooks = [
  {
    id: "book-1",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    genre: "Cloud & Distributed Systems",
    rating: 5,
    status: "Sedang Dibaca",
    year: "2025",
    notes: "Buku wajib yang mengupas tuntas arsitektur penyimpanan data, replikasi, partisi, transaksi, dan konsistensi sistem terdistribusi modern.",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "book-2",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    genre: "Software Engineering",
    rating: 5,
    status: "Selesai Dibaca",
    year: "2024",
    notes: "Pondasi penting tentang penamaan variabel yang bermakna, fungsi yang fokus satu tanggung jawab, dan refactoring berkelanjutan.",
    cover: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "book-3",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Productivity & Mindset",
    rating: 5,
    status: "Selesai Dibaca",
    year: "2023",
    notes: "Perubahan 1% setiap hari yang berakumulasi menjadi hasil eksponensial dalam karir pemrograman dan kedisiplinan hidup.",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "book-4",
    title: "The Pragmatic Programmer (20th Anniversary Edition)",
    author: "David Thomas & Andrew Hunt",
    genre: "Software Engineering",
    rating: 5,
    status: "Selesai Dibaca",
    year: "2024",
    notes: "Nasihat abadi bagi programmer untuk selalu berfikir kritis, adaptif, menguasai editor, dan menjaga codebase tetap fleksibel.",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "book-5",
    title: "System Design Interview – An Insider's Guide",
    author: "Alex Xu",
    genre: "Architecture & Systems",
    rating: 5,
    status: "Sedang Dibaca",
    year: "2025",
    notes: "Visualisasi langkah demi langkah mendesain sistem berskala jutaan pengguna: Rate limiter, chat system, search autocomplete, dan CDN.",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "book-6",
    title: "Building Microservices: Designing Fine-Grained Systems",
    author: "Sam Newman",
    genre: "Cloud & Microservices",
    rating: 4,
    status: "Wishlist",
    year: "2025",
    notes: "Rencana bacaan untuk memperdalam pemisahan domain logic dan komunikasi antar service event-driven.",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80"
  }
];
