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
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
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
  if (!db) return null;
  try {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Fetch books error:', error);
    return null;
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
  await deleteDoc(doc(db, 'books', id));
  return id;
};

// ==========================================
// ARTIKEL (FIRESTORE)
// ==========================================
export const fetchArticles = async (onlyPublished = false) => {
  if (!db) return null;
  try {
    let q;
    if (onlyPublished) {
      q = query(
        collection(db, 'articles'),
        where('status', '==', 'terbit'),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Fetch articles error:', error);
    return null;
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
  await deleteDoc(doc(db, 'articles', id));
  return id;
};
