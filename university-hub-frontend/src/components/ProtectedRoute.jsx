import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useApp();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl text-gray-300 mb-4">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">Please log in to access this page.</p>
          <a href="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl text-red-300 mb-4">
            <i className="fas fa-ban"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-500 mb-4">
            You don't have permission to access this page. Required role: {allowedRoles.join(' or ')}
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;