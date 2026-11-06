import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthUserChanged,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  ADMIN_EMAIL,
} from '../services/firebase';

const AuthContext = createContext({
  currentUser: null,
  isAdmin: false,
  loading: true,
  loginEmail: async () => {},
  loginGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout: pastikan loading state tidak pernah stuck lebih dari 2.5 detik
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribe = onAuthUserChanged((user) => {
      clearTimeout(timer);
      setCurrentUser(user);
      if (user && user.email) {
        const userEmail = user.email.toLowerCase().trim();
        setIsAdmin(userEmail === ADMIN_EMAIL);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timer);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLoginEmail = async (email, password) => {
    return await loginWithEmail(email, password);
  };

  const handleLoginGoogle = async () => {
    return await loginWithGoogle();
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        loginEmail: handleLoginEmail,
        loginGoogle: handleLoginGoogle,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

