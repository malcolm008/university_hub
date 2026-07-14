import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout, ambassadors, showToast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  const isAmbassador = user?.role === 'ambassador' || user?.role === 'admin';
  const isLoggedIn = !!user;

  // Build navigation items based on user role
  const navItems = useMemo(() => {
    const items = [
      { label: 'Home', page: 'home', icon: 'fa-house' },
      { label: 'Gallery', page: 'gallery', icon: 'fa-images' },
      { label: 'Register', page: 'register', icon: 'fa-pen-to-square' },
    ];

    if (isLoggedIn && isAmbassador) {
      items.push({ 
        label: 'Dashboard', 
        page: 'ambassador', 
        icon: 'fa-chart-simple' 
      });
    }

    if (isLoggedIn && isAdmin) {
      items.push({ 
        label: 'Admin', 
        page: 'admin', 
        icon: 'fa-user-shield' 
      });
      items.push({ 
        label: 'Admin Gallery', 
        page: 'admin-gallery', 
        icon: 'fa-camera' 
      });
    }

    return items;
  }, [isLoggedIn, isAmbassador, isAdmin]);


  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    showToast('Logged out successfully', 'info');
  };

  const handleCopyLink = () => {
    // Use the logged-in user's slug or default to malcolm
    const ambassadorSlug = user?.ambassadorSlug || 'malcolm';
    const link = `${window.location.origin}${window.location.pathname}?ref=${ambassadorSlug}`;
    
    navigator.clipboard?.writeText(link)
      .then(() => {
        showToast('Referral link copied!', 'success');
      })
      .catch(() => {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Referral link copied!', 'success');
      });
  };

  // Find the default ambassador (Malcolm) for the referral link button
  const defaultAmbassador = ambassadors.find(a => a.slug === 'malcolm');

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <span className="font-semibold text-gray-800 dark:text-white text-lg hidden sm:block">
              Awareness Hub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.page 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <i className={`fas ${item.icon} mr-2`}></i>
                {item.label}
              </button>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-2 px-2">
              <ThemeToggle />
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                {/* User info */}
                <span className="ml-2 text-sm text-gray-600 dark:text-red-300">
                  <i className="fas fa-user-circle mr-1"></i>
                  {user.name}
                </span>
                
                {/* Copy referral link for ambassadors */}
                {isAmbassador && (
                  <button 
                    onClick={handleCopyLink} 
                    className="ml-2 px-3 py-1.5 bg-indigo-600 dark:bg-purple-700 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all shadow-sm"
                  >
                    <i className="fas fa-link mr-1"></i>Share
                  </button>
                )}
                
                {/* Logout button */}
                <button 
                  onClick={handleLogout} 
                  className="ml-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => setCurrentPage('login')} 
                className="ml-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-purple-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
              >
                <i className="fas fa-lock mr-2"></i>Login
              </button>
            )}
            
            {/* Referral link button for non-logged-in users */}
            {!isLoggedIn && defaultAmbassador && (
              <button 
                onClick={handleCopyLink} 
                className="ml-2 px-4 py-2 bg-indigo-600 dark:bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all shadow-sm"
              >
                <i className="fas fa-link mr-2"></i>Get Referral Link
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden text-gray-600 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-4 py-2 space-y-1">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => { 
                setCurrentPage(item.page); 
                setMobileOpen(false); 
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.page 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`fas ${item.icon} mr-3 w-5`}></i>
              {item.label}
            </button>
          ))}
          
          {/* Mobile Theme Toggle */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <i className="fas fa-moon mr-2"></i>Dark Mode
            </span>
            <ThemeToggle />
          </div>

          {/* Mobile Auth Buttons */}
          {isLoggedIn ? (
            <>
              {/* User info */}
              <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                <i className="fas fa-user-circle mr-2"></i>
                Logged in as <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({user.role})</span>
              </div>
              
              {/* Copy referral link for ambassadors */}
              {isAmbassador && (
                <button 
                  onClick={() => { 
                    handleCopyLink(); 
                    setMobileOpen(false); 
                  }} 
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-indigo-600 dark:bg-purple-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all"
                >
                  <i className="fas fa-link mr-3 w-5"></i>Copy Referral Link
                </button>
              )}
              
              {/* Logout button */}
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
              >
                <i className="fas fa-sign-out-alt mr-3 w-5"></i>Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => { 
                  setCurrentPage('login'); 
                  setMobileOpen(false); 
                }} 
                className="w-full text-left px-4 py-3 text-sm font-medium text-indigo-600 dark:text-purple-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
              >
                <i className="fas fa-lock mr-3 w-5"></i>Login
              </button>
              
              {/* Referral link for non-logged-in users */}
              {defaultAmbassador && (
                <button 
                  onClick={() => { 
                    handleCopyLink(); 
                    setMobileOpen(false); 
                  }} 
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-indigo-600 dark:bg-purple-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all"
                >
                  <i className="fas fa-link mr-3 w-5"></i>Get Referral Link
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;