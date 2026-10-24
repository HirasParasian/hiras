import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
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
  orderBy,
  serverTimestamp,
  writeBatch
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

export { auth, db };

// Auth helpers
export const loginWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase Auth belum terhubung.');
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase Auth belum terhubung.');
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGooglePopup = async () => {
  if (!auth) throw new Error('Firebase Auth belum terhubung.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
};

export const loginWithGoogleRedirect = async () => {
  if (!auth) throw new Error('Firebase Auth belum terhubung.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithRedirect(auth, provider);
};

export const loginWithGoogle = async (useRedirect = false) => {
  if (useRedirect) {
    return await loginWithGoogleRedirect();
  }
  try {
    return await loginWithGooglePopup();
  } catch (err) {
    console.warn('Popup login failed, attempting redirect:', err);
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/cancelled-popup-request' ||
      String(err.message).includes('Cross-Origin-Opener-Policy') ||
      String(err.message).includes('closed')
    ) {
      return await loginWithGoogleRedirect();
    }
    throw err;
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

// Firestore Projects
export const fetchProjects = async () => {
  if (!db) return null;
  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Fetch projects error:', error);
    // fallback or rethrow
    return null;
  }
};

export const saveProjectItem = async (projectData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const { id, ...data } = projectData;
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    await updateDoc(doc(db, 'projects', id), payload);
    return { id, ...payload };
  } else {
    payload.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'projects'), payload);
    return { id: docRef.id, ...payload };
  }
};

export const deleteProjectItem = async (id) => {
  if (!db) throw new Error('Firestore belum aktif.');
  await deleteDoc(doc(db, 'projects', id));
  return id;
};

// Firestore Blog Posts
export const fetchPosts = async () => {
  if (!db) return null;
  try {
    const q = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Fetch posts error:', error);
    return null;
  }
};

export const savePostItem = async (postData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const { id, ...data } = postData;
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (id) {
    await updateDoc(doc(db, 'posts', id), payload);
    return { id, ...payload };
  } else {
    payload.publishedAt = payload.publishedAt || new Date().toISOString();
    payload.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'posts'), payload);
    return { id: docRef.id, ...payload };
  }
};

export const deletePostItem = async (id) => {
  if (!db) throw new Error('Firestore belum aktif.');
  await deleteDoc(doc(db, 'posts', id));
  return id;
};

// Firestore Messages (from Contact Form)
export const sendContactMessage = async (messageData) => {
  if (!db) {
    // If db not available, simulate success or throw
    console.warn('Firestore offline, simulating message submission');
    return { id: 'local-' + Date.now(), ...messageData };
  }
  const payload = {
    ...messageData,
    read: false,
    createdAt: serverTimestamp(),
    timestampStr: new Date().toLocaleString('id-ID'),
  };
  const docRef = await addDoc(collection(db, 'messages'), payload);
  return { id: docRef.id, ...payload };
};

export const fetchContactMessages = async () => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Fetch messages error:', error);
    return [];
  }
};

export const deleteContactMessage = async (id) => {
  if (!db) return;
  await deleteDoc(doc(db, 'messages', id));
};

export const markMessageAsRead = async (id, readStatus = true) => {
  if (!db) return;
  await updateDoc(doc(db, 'messages', id), { read: readStatus });
};

// Firestore Profile info
export const fetchProfile = async () => {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'profile'));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error('Fetch profile error:', err);
    return null;
  }
};

export const saveProfile = async (profileData) => {
  if (!db) throw new Error('Firestore belum aktif.');
  await setDoc(doc(db, 'settings', 'profile'), {
    ...profileData,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// Firestore Books
export const fetchBooks = async () => {
  if (!db) return null;
  try {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
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
    ...data,
    rating: Number(data.rating) || 5,
    year: String(data.year || new Date().getFullYear()),
    updatedAt: serverTimestamp(),
  };

  if (id && !String(id).startsWith('book-')) {
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

export const batchSaveBooks = async (booksList) => {
  if (!db) throw new Error('Firestore belum aktif.');
  const batch = writeBatch(db);
  const created = [];

  for (const book of booksList) {
    const docRef = doc(collection(db, 'books'));
    const payload = {
      title: book.title || 'Untitled Book',
      author: book.author || 'Unknown Author',
      genre: book.genre || 'General',
      rating: Number(book.rating) || 5,
      status: book.status || 'Selesai Dibaca',
      year: String(book.year || new Date().getFullYear()),
      notes: book.notes || '',
      cover: book.cover || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    batch.set(docRef, payload);
    created.push({ id: docRef.id, ...payload });
  }

  await batch.commit();
  return created;
};
