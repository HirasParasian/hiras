import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthUserChanged,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  checkRedirectLogin,
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
    // Check redirect login if any
    checkRedirectLogin().catch((err) => console.warn('Redirect login check:', err));

    const unsubscribe = onAuthUserChanged((user) => {
      setCurrentUser(user);
      if (user && user.email) {
        const userEmail = user.email.toLowerCase().trim();
        setIsAdmin(userEmail === ADMIN_EMAIL);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginEmail = async (email, password) => {
    return await loginWithEmail(email, password);
  };

  const handleLoginGoogle = async (useRedirect = false) => {
    return await loginWithGoogle(useRedirect);
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

