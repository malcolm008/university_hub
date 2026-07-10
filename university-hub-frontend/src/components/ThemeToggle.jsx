import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      style={{
        backgroundColor: isDark ? '#AD65A2' : '#d1d5db',
      }}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;