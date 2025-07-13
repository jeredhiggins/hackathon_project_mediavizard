import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {t('lightMode')}
          </span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {t('darkMode')}
          </span>
        </>
      )}
    </button>
  );
};