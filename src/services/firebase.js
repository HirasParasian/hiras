import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'hirasparasian@gmail.com').toLowerCase().trim();

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_firebase_api_key' &&
    firebaseConfig.projectId
  );
};

let app = null;
let auth = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('Firebase initialization warning:', err);
}

function ensureAuth() {
  if (auth) return;
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase belum dikonfigurasi dengan kredensial yang valid.');
  }
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

// ==========================================
// AUTHENTICATION
// ==========================================
export const loginWithEmail = async (email, password) => {
  ensureAuth();
  return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async (useRedirect = false) => {
  ensureAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  if (useRedirect) {
    return await signInWithRedirect(auth, provider);
  }

  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    console.warn('Google popup error, trying redirect:', err);
    return await signInWithRedirect(auth, provider);
  }
};

export const checkRedirectLogin = async () => {
  if (!auth) return null;
  try {
    return await getRedirectResult(auth);
  } catch (err) {
    console.warn('Redirect auth result warning:', err);
    return null;
  }
};

export const logoutUser = async () => {
  if (!auth) return;
  return await signOut(auth);
};

export const onAuthUserChanged = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// ==========================================
// BOOKS (FIRESTORE)
// ==========================================
export const fetchBooks = async () => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'books'));
    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    list.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  } catch (error) {
    console.error('Fetch books error:', error);
    return [];
  }
};

export const saveBookItem = async (bookData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const { id, ...data } = bookData;

  const payload = {
    title: data.title || 'Tanpa Judul',
    author: data.author || 'Anonim',
    genre: data.genre || 'Umum',
    status: data.status || 'Selesai Dibaca', // 'Selesai Dibaca' | 'Sedang Dibaca' | 'Wishlist' | 'Belum Dibaca'
    format: data.format || 'fisik', // 'fisik' | 'online'
    publisher: data.publisher || '', // untuk buku fisik
    location: data.location || '', // lokasi rak/kotak untuk buku fisik
    onlineUrl: data.onlineUrl || '', // tautan untuk buku online
    notes: data.notes || '',
    rating: Number(data.rating) || 5,
    cover: data.cover || '',
    year: String(data.year || new Date().getFullYear()),
    updatedAt: serverTimestamp(),
  };

  if (id && !String(id).startsWith('local-')) {
    await updateDoc(doc(db, 'books', id), payload);
    return { id, ...payload };
  } else {
    payload.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'books'), payload);
    return { id: docRef.id, ...payload };
  }
};

export const deleteBookItem = async (id) => {
  if (!db) throw new Error('Firestore belum aktif.');
  if (String(id).startsWith('local-')) return id;
  await deleteDoc(doc(db, 'books', id));
  return id;
};

export const batchSaveBooks = async (booksList) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const batch = writeBatch(db);
  const created = [];

  for (const book of booksList) {
    const docRef = doc(collection(db, 'books'));
    const payload = {
      title: book.title || 'Tanpa Judul',
      author: book.author || 'Anonim',
      genre: book.genre || 'Umum',
      status: book.status || 'Selesai Dibaca',
      format: book.format || 'fisik',
      publisher: book.publisher || '',
      location: book.location || '',
      onlineUrl: book.onlineUrl || '',
      notes: book.notes || '',
      rating: Number(book.rating) || 5,
      cover: book.cover || '',
      year: String(book.year || new Date().getFullYear()),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    batch.set(docRef, payload);
    created.push({ id: docRef.id, ...payload });
  }

  await batch.commit();
  return created;
};

// ==========================================
// ARTIKEL (FIRESTORE)
// ==========================================
export const fetchArticles = async (onlyPublished = false) => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'articles'));
    let list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    if (onlyPublished) {
      list = list.filter((a) => a.status === 'terbit');
    }

    list.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  } catch (error) {
    console.error('Fetch articles error:', error);
    return [];
  }
};

export const fetchArticleByShortId = async (shortId) => {
  if (!db) return null;
  try {
    // Cari berdasarkan field shortId
    const q = query(collection(db, 'articles'), where('shortId', '==', shortId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
    // Jika tidak ditemukan via shortId, coba via document id
    const docRef = doc(db, 'articles', shortId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Fetch article by shortId error:', error);
    return null;
  }
};

export const saveArticleItem = async (articleData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const { id, ...data } = articleData;

  const payload = {
    title: data.title || 'Tanpa Judul',
    shortId: data.shortId || '',
    content: data.content || '',
    summary: data.summary || '',
    tags: Array.isArray(data.tags)
      ? data.tags
      : (data.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    status: data.status || 'draf', // 'draf' | 'terbit'
    coverImage: data.coverImage || '',
    readTime: data.readTime || '3 menit baca',
    updatedAt: serverTimestamp(),
  };

  if (payload.status === 'terbit' && !data.publishedAt) {
    payload.publishedAt = serverTimestamp();
  } else if (data.publishedAt) {
    payload.publishedAt = data.publishedAt;
  }

  if (id && !String(id).startsWith('local-')) {
    await updateDoc(doc(db, 'articles', id), payload);
    return { id, ...payload };
  } else {
    payload.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'articles'), payload);
    return { id: docRef.id, ...payload };
  }
};

export const deleteArticleItem = async (id) => {
  if (!db) throw new Error('Firestore belum aktif.');
  if (String(id).startsWith('local-')) return id;
  await deleteDoc(doc(db, 'articles', id));
  return id;
};

// ==========================================
// PENGATURAN STATISTIK SITUS (FIRESTORE)
// ==========================================
export const fetchSiteStats = async () => {
  if (!db) {
    try {
      const cached = localStorage.getItem('hiras_site_stats');
      return cached ? JSON.parse(cached) : { completedProjects: '20+' };
    } catch {
      return { completedProjects: '20+' };
    }
  }
  try {
    const docRef = doc(db, 'settings', 'stats');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      try {
        localStorage.setItem('hiras_site_stats', JSON.stringify(data));
      } catch (err) {
        console.warn('Storage cache error:', err);
      }
      return data;
    }
    return { completedProjects: '20+' };
  } catch (error) {
    console.warn('Fetch site stats error:', error);
    try {
      const cached = localStorage.getItem('hiras_site_stats');
      return cached ? JSON.parse(cached) : { completedProjects: '20+' };
    } catch {
      return { completedProjects: '20+' };
    }
  }
};

export const saveSiteStats = async (statsData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const docRef = doc(db, 'settings', 'stats');
  await setDoc(
    docRef,
    {
      ...statsData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  try {
    localStorage.setItem('hiras_site_stats', JSON.stringify(statsData));
  } catch (err) {
    console.warn('Storage cache error:', err);
  }
  return statsData;
};

// ==========================================
// BIO PROFILE (FIRESTORE)
// ==========================================
export const fetchBioProfile = async () => {
  if (!db) {
    try {
      const cached = localStorage.getItem('hiras_bio_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }
  try {
    const docRef = doc(db, 'settings', 'profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      try {
        localStorage.setItem('hiras_bio_profile', JSON.stringify(data));
      } catch (err) {
        console.warn('Storage cache error:', err);
      }
      return data;
    }
    return null;
  } catch (error) {
    console.warn('Fetch bio profile error:', error);
    try {
      const cached = localStorage.getItem('hiras_bio_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }
};

export const saveBioProfile = async (profileData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const docRef = doc(db, 'settings', 'profile');
  await setDoc(
    docRef,
    {
      ...profileData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  try {
    localStorage.setItem('hiras_bio_profile', JSON.stringify(profileData));
  } catch (err) {
    console.warn('Storage cache error:', err);
  }
  return profileData;
};

// ==========================================
// PROJECTS (FIRESTORE)
// ==========================================
export const fetchProjects = async () => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => {
      const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
    return list;
  } catch (err) { console.error('fetchProjects error:', err); return []; }
};

export const saveProject = async (data) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const { id, ...payload } = data;
  payload.updatedAt = serverTimestamp();
  if (id && !String(id).startsWith('local-')) {
    await updateDoc(doc(db, 'projects', id), payload);
    return { id, ...payload };
  } else {
    payload.createdAt = serverTimestamp();
    const ref = await addDoc(collection(db, 'projects'), payload);
    return { id: ref.id, ...payload };
  }
};

export const deleteProject = async (id) => {
  if (!db) throw new Error('Firestore belum aktif.');
  if (String(id).startsWith('local-')) return id;
  await deleteDoc(doc(db, 'projects', id));
  return id;
};

// ==========================================
// EXPERIENCE & EDUCATION (FIRESTORE)
// ==========================================
export const fetchProfileExtended = async () => {
  if (!db) {
    try {
      const cached = localStorage.getItem('hiras_profile_extended');
      return cached ? JSON.parse(cached) : { experience: [], education: [] };
    } catch { return { experience: [], education: [] }; }
  }
  try {
    const ref = doc(db, 'settings', 'profile_extended');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      try { localStorage.setItem('hiras_profile_extended', JSON.stringify(data)); } catch {}
      return data;
    }
    return { experience: [], education: [] };
  } catch (err) {
    console.warn('fetchProfileExtended error:', err);
    try {
      const cached = localStorage.getItem('hiras_profile_extended');
      return cached ? JSON.parse(cached) : { experience: [], education: [] };
    } catch { return { experience: [], education: [] }; }
  }
};

export const saveProfileExtended = async (data) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const ref = doc(db, 'settings', 'profile_extended');
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  try { localStorage.setItem('hiras_profile_extended', JSON.stringify(data)); } catch {}
  return data;
};
