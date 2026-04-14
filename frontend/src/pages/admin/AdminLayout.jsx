import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Sparkles, 
  Users, 
  Image, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Réservations', icon: CalendarCheck, path: '/admin/bookings' },
  { label: 'Services', icon: Sparkles, path: '/admin/services' },
  { label: 'Options', icon: Settings, path: '/admin/options' },
  { label: 'Animateurs', icon: Users, path: '/admin/animateurs' },
  { label: 'Galerie', icon: Image, path: '/admin/gallery' },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 shrink-0">
          {isSidebarOpen ? (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--fun-purple)] to-[var(--fun-pink)] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-black text-xl tracking-tight text-gray-900">FUNKIDZ <span className="text-[var(--fun-purple)]">ADMIN</span></span>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-[var(--fun-purple)] rounded-xl flex items-center justify-center text-white mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[var(--fun-purple)]/5 text-[var(--fun-purple)] shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <div className={`
                  p-2 rounded-xl transition-all duration-200
                  ${isActive ? 'bg-white shadow-sm' : 'bg-transparent group-hover:bg-white'}
                `}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                {isSidebarOpen && (
                  <span className="font-bold flex-grow truncate">{item.label}</span>
                )}
                {isSidebarOpen && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className={`flex items-center ${isSidebarOpen ? 'gap-4 justify-between' : 'justify-center'} px-2 py-4`}>
            {isSidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shadow-inner overflow-hidden">
                  <UserCircle className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900 truncate max-w-[120px]">Admin</span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--fun-purple)] font-black">Funkidz Team</span>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className={`
                p-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all
                ${!isSidebarOpen ? 'w-full flex justify-center' : ''}
              `}
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mt-2 w-full flex items-center justify-center py-2 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
              Administration • {ADMIN_NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Detail'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-[var(--fun-light-bg)] px-4 py-2 rounded-full border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-600">Connecté en tant qu'Admin</span>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-grow overflow-y-auto bg-gray-50/50 relative">
          <div className="p-8 max-w-[1400px] mx-auto min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
