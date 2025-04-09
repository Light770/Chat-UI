// components/ChatUI/ThemeToggle.tsx
import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference or localStorage
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Update when the toggle is switched
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update DOM
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme
      </span>
      <div className="flex items-center space-x-2">
        <SunIcon className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          className={`${
            isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200/70 dark:bg-gray-600/50'
          } relative inline-flex h-6 w-11 items-center rounded-full glass-effect transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2`}
        >
          <span className="sr-only">Toggle dark mode</span>
          <span
            className={`${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform`}
          />
        </Switch>
        <MoonIcon className="h-4 w-4 text-gray-500 dark:text-blue-300" />
      </div>
    </div>
  );
};

export default ThemeToggle;