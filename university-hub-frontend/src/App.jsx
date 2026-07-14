import { useState, useMemo, useCallback } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProofSubmissionPage from './pages/ProofSubmissionPage';
import AmbassadorDashboard from './pages/AmbassadorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GalleryPage from './pages/GalleryPage';
import AdminGallery from './pages/AdminGallery';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user } = useApp();

  const handleSetPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = useMemo(() => {
    console.log('App: Rendering page:', currentPage);

    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handleSetPage} />;
      case 'login':
        return <LoginPage setCurrentPage={handleSetPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={handleSetPage} />;
      case 'confirmation':
        return <ConfirmationPage setCurrentPage={handleSetPage} />;
      case 'proof':
        return <ProofSubmissionPage setCurrentPage={handleSetPage} />;
      case 'ambassador':
        return <AmbassadorDashboard setCurrentPage={handleSetPage} />;
      case 'admin':
        return <AdminDashboard setCurrentPage={handleSetPage} />;
      case 'gallery':
        return <GalleryPage setCurrentPage={handleSetPage} />;
      case 'admin-gallery':
        return <AdminGallery setCurrentPage={handleSetPage} />;
      default:
        return <HomePage setCurrentPage={handleSetPage} />;
    }
  }, [currentPage, handleSetPage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={handleSetPage} />
      <main className="flex-1">{renderPage}</main>
      <Footer />
    </div>
  );
}

export default App;