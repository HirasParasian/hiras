import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import ExcelImportModal from './components/ExcelImportModal';
import ProjectDetailModal from './components/ProjectDetailModal';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import BooksPage from './pages/BooksPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';

import { defaultProfile, defaultProjects, defaultPosts, defaultBooks } from './data/defaultData';
import {
  onAuthUserChanged,
  logoutUser,
  fetchProjects,
  fetchPosts,
  fetchBooks,
  fetchProfile,
  ADMIN_EMAIL
} from './services/firebase';

export default function App() {
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState(defaultProjects);
  const [posts, setPosts] = useState(defaultPosts);
  const [books, setBooks] = useState(defaultBooks);

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Editing items
  const [editingProject, setEditingProject] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthUserChanged((user) => {
      setCurrentUser(user);
      if (user && user.email) {
        const userEmail = user.email.toLowerCase().trim();
        setIsAdmin(userEmail === ADMIN_EMAIL);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch dynamic data from Firestore
  const loadCloudData = async () => {
    try {
      const [remoteProjects, remotePosts, remoteBooks, remoteProfile] = await Promise.all([
        fetchProjects(),
        fetchPosts(),
        fetchBooks(),
        fetchProfile()
      ]);

      if (remoteProjects && remoteProjects.length > 0) {
        setProjects(remoteProjects);
      }
      if (remotePosts && remotePosts.length > 0) {
        setPosts(remotePosts);
      }
      if (remoteBooks && remoteBooks.length > 0) {
        setBooks(remoteBooks);
      }
      if (remoteProfile) {
        setProfile((prev) => ({ ...prev, ...remoteProfile }));
      }
    } catch (err) {
      console.info('Using local default dataset (Firebase sync standby):', err);
    }
  };

  useEffect(() => {
    loadCloudData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsAdmin(false);
    setCurrentUser(null);
  };

  const handleEditProject = (proj) => {
    setEditingProject(proj);
    setAdminModalOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setAdminModalOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setAdminModalOpen(true);
  };

  const handleImportBooksSuccess = (importedBooks) => {
    setBooks((prev) => [...importedBooks, ...prev]);
    loadCloudData();
  };

  return (
    <Router>
      <div className="app-container">
        {/* Creative Dynamic Ambient Layer */}
        <div className="bg-ambient-layer">
          <div className="ambient-orb orb-1"></div>
          <div className="ambient-orb orb-2"></div>
          <div className="ambient-orb orb-3"></div>
          <div className="ambient-grid"></div>
        </div>

        {/* Global Multi-Page Navigation Bar */}
        <Navbar
          user={currentUser}
          isAdmin={isAdmin}
          onOpenAdmin={() => setAdminModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Multi-Page Routes */}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  profile={profile}
                  projects={projects}
                  posts={posts}
                  books={books}
                  isAdmin={isAdmin}
                  onSelectProject={(p) => setSelectedProject(p)}
                  onEditProject={handleEditProject}
                  onEditPost={handleEditPost}
                  onOpenExcelImport={() => setExcelModalOpen(true)}
                />
              }
            />
            <Route
              path="/about"
              element={<AboutPage profile={profile} />}
            />
            <Route
              path="/projects"
              element={
                <ProjectsPage
                  projects={projects}
                  isAdmin={isAdmin}
                  onSelectProject={(p) => setSelectedProject(p)}
                  onEditProject={handleEditProject}
                />
              }
            />
            <Route
              path="/books"
              element={
                <BooksPage
                  books={books}
                  isAdmin={isAdmin}
                  onOpenExcelImport={() => setExcelModalOpen(true)}
                  onEditBook={handleEditBook}
                  onRefreshData={loadCloudData}
                />
              }
            />
            <Route
              path="/blog"
              element={
                <BlogPage
                  posts={posts}
                  isAdmin={isAdmin}
                  onEditPost={handleEditPost}
                />
              }
            />
            <Route
              path="/blog/:id"
              element={
                <BlogPostPage
                  posts={posts}
                  profile={profile}
                />
              }
            />
            <Route
              path="/contact"
              element={<ContactPage profile={profile} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer profile={profile} />

        {/* Admin CMS Modal */}
        <AdminModal
          isOpen={adminModalOpen}
          onClose={() => {
            setAdminModalOpen(false);
            setEditingProject(null);
            setEditingPost(null);
            setEditingBook(null);
          }}
          currentUser={currentUser}
          isAdmin={isAdmin}
          projects={projects}
          posts={posts}
          books={books}
          onRefreshData={loadCloudData}
          editingProject={editingProject}
          setEditingProject={setEditingProject}
          editingPost={editingPost}
          setEditingPost={setEditingPost}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          onOpenExcelImport={() => {
            setAdminModalOpen(false);
            setExcelModalOpen(true);
          }}
        />

        {/* Excel Import Modal */}
        <ExcelImportModal
          isOpen={excelModalOpen}
          onClose={() => setExcelModalOpen(false)}
          onImportSuccess={handleImportBooksSuccess}
        />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </Router>
  );
}
