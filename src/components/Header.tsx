import React from 'react';
import { Shield, FileText, Globe, Lock, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className={`border-b transition-colors ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className={`text-xl font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              SecureTranslate AI
            </h1>
            <p className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Professional Document Translation Platform
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className={`text-lg font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              SecureTranslate
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              AES-256 Encrypted
            </span>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}