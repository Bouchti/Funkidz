import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Calendar
} from 'lucide-react';
import { Button } from '@/app/components/ui-kit/Button';
import useAuthStore from '@/store/authStore';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Acceuil' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Galerie' },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'À propos' },
  ];

  const authLinks = [
    { label: 'Mes réservations', to: '/bookings', icon: Calendar },
    { label: 'Mon profil', to: '/profile', icon: UserIcon },
  ];

  if (user?.role === 'ADMIN') {
    authLinks.unshift({ label: 'Administration', to: '/admin', icon: LayoutDashboard });
  } else if (user?.role === 'ANIMATEUR') {
    authLinks.unshift({ label: 'Mon planning', to: '/planning', icon: Calendar });
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg py-3'
            : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--fun-orange)] to-[var(--fun-pink)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">FunKids</h1>
                <p className="text-xs text-gray-600">Animation Événementielle</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-[var(--fun-purple)] bg-[var(--fun-light-bg)]'
                      : 'text-gray-700 hover:text-[var(--fun-purple)] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--fun-purple-light)] flex items-center justify-center text-[var(--fun-purple)]">
                      <UserIcon size={18} />
                    </div>
                    <span>{user?.email?.split('@')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--fun-purple)] mt-0.5">{user?.role}</p>
                      </div>
                      {authLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--fun-light-bg)] hover:text-[var(--fun-purple)] transition-colors"
                        >
                          <link.icon size={16} />
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-[var(--fun-purple)] font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Button to="/booking" size="sm">
                    Réserver 🎉
                  </Button>
                </div>
              )}
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-[var(--fun-purple)] transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100">
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-[var(--fun-purple)] bg-[var(--fun-light-bg)]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="my-2 border-t border-gray-50 pt-2" />
                  {authLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <link.icon size={18} className="text-[var(--fun-purple)]" />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Connexion
                  </Link>
                  <Button to="/booking" fullWidth className="mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Réserver 🎉
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
