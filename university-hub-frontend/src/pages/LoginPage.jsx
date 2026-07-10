import { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginPage = ({ setCurrentPage }) => {
  const { login, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === 'admin') {
          setCurrentPage('admin');
        } else if (result.user.role === 'ambassador') {
          setCurrentPage('ambassador');
        } else {
          setCurrentPage('home');
        }
      } else {
        // Handle rate limit error specifically
        if (result.message.includes('Too many login attempts')) {
          setError('Too many failed attempts. Please wait 15 minutes before trying again.');
        } else if (result.message.includes('Invalid credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(result.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.', err);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 transition-colors duration-500">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Staff Login</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Access the administration panel</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
              placeholder="admin@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 dark:bg-purple-600 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-purple-700 transition-all shadow-lg dark:shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Logging in...</>
            ) : (
              <><i className="fas fa-sign-in-alt mr-2"></i> Login</>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Demo Accounts:
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>Admin: admin@university.edu / admin123</div>
            <div>Ambassador: malcolm@university.edu / malcolm123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;