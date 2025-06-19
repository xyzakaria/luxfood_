import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe2, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'tr', name: 'Türkçe' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex">
              <Link 
                to="/" 
                className="flex-shrink-0 flex items-center space-x-2 group"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-300">
                  Luxfoods
                </span>
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

            {/* Language Selector, Auth, and Mobile Menu Button */}
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

              {/* Auth Button */}
              <div className="hidden sm:block">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-gray-100"
                    >
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600 font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('auth.signOut')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-indigo-700"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {t('auth.signIn')}
                    </span>
                  </button>
                )}
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
            {/* Mobile Auth Button */}
            {user ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
              >
                {t('auth.signOut')}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                {t('auth.signIn')}
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}