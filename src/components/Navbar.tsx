import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe2, Menu, X } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'tr', name: 'Türkçe' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center space-x-2 group"
            >
               <img 
                src="src/public/luxfood.png" 
                className="h-8 md:h-10" // Hauteur de 2rem (32px) par défaut, 2.5rem (40px) sur écrans moyens et +
                alt="LuxFood Logo"
              />
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {[
                { path: '/', label: 'nav.home' },
                { path: '/products', label: 'nav.products' },
                { path: '/about', label: 'nav.about' },
                { path: '/contact', label: 'nav.contact' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-300'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Selector and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-gray-100">
                <Globe2 className="h-5 w-5 text-gray-500" />
                <select
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  value={i18n.language}
                  className="bg-transparent text-sm text-gray-600 font-medium focus:outline-none cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
          {[
            { path: '/', label: 'nav.home' },
            { path: '/products', label: 'nav.products' },
            { path: '/about', label: 'nav.about' },
            { path: '/contact', label: 'nav.contact' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200 ${
                isActivePath(item.path)
                  ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}