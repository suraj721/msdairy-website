import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Search, ChevronDown, Download } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import clsx from 'clsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const count = useCartStore(s => s.count());
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileApp = typeof navigator !== 'undefined' && navigator.userAgent.includes('MSDairy-Mobile-App');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm">MS</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-primary text-lg leading-none">MS Dairy</div>
              <div className="text-[10px] text-gray-500 leading-none">Pure. Fresh. Delivered.</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search milk, paneer, ghee, pet food..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </form>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {[['/', 'Home'], ['/products', 'Shop'], ['/pets', 'Pet Services'], ['/about', 'About']].map(([path, label]) => (
              <Link key={path} to={path} className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', isActive(path) ? 'text-primary bg-primary-pale' : 'text-gray-600 hover:text-primary hover:bg-gray-50')}>
                {label}
              </Link>
            ))}
            {!isMobileApp && (
              <Link to="/download" className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors', isActive('/download') ? 'text-primary bg-primary-pale' : 'text-primary hover:bg-primary-pale')}>
                <Download className="w-3.5 h-3.5" />
                Download App
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {count > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">{count}</span>}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary-pale flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-sm">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-semibold hover:bg-primary-pale transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      My Orders & Bookings
                    </Link>
                    <button onClick={() => { logout(); setUserMenu(false); navigate('/'); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl hover:bg-gray-50">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <form onSubmit={handleSearch} className="flex mb-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input rounded-r-none" />
            <button type="submit" className="px-4 bg-primary text-white rounded-r-xl"><Search className="w-4 h-4" /></button>
          </form>
          {[['/', 'Home'], ['/products', 'Shop'], ['/pets', 'Pet Services'], ['/orders', 'My Orders & Bookings'], ['/about', 'About'], ['/download', 'Download App'], ['/contact', 'Contact']]
            .filter(([path]) => !isMobileApp || path !== '/download')
            .map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setOpen(false)} className={clsx('block px-3 py-2 rounded-xl text-sm font-medium', isActive(path) ? 'text-primary bg-primary-pale' : 'text-gray-700 hover:bg-gray-50')}>
                {label}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}
