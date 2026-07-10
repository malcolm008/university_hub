import { useState } from 'react';
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      case 'confirmation':
        return <ConfirmationPage setCurrentPage={setCurrentPage} />;
      case 'proof':
        return <ProofSubmissionPage setCurrentPage={setCurrentPage} />;
      case 'ambassador':
        return <AmbassadorDashboard setCurrentPage={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      case 'gallery':
        return <GalleryPage setCurrentPage={setCurrentPage} />;
      case 'admin-gallery':
        return <AdminGallery setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;