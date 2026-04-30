import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';
import { GiWheat } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const LOGIN_OPTIONS = [
  { label: '🌾 Farmer',          to: '/auth/farmer' },
  { label: '🚚 Service Provider', to: '/auth/provider' },
  { label: '🛒 Buyer',           to: '/auth/buyer' },
  { label: '🔐 Admin',           to: '/auth/admin' },
];

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const dashboardPath = user?.role ? `/${user.role}` : '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center
                          group-hover:bg-forest-700 transition-colors shadow-md">
            <GiWheat className="text-white text-xl" />
          </div>
          <div className="leading-tight">
            <span className="font-display font-bold text-gray-900 text-lg block leading-none">
              Harvest
            </span>
            <span className="text-forest-600 text-xs font-semibold tracking-widest uppercase">
              Connect
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                   ${isActive ? 'text-forest-700 bg-forest-50' : 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={dashboardPath} className="btn-outline text-sm py-2">
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                  <span className="text-forest-700 text-sm font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Login Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="btn-ghost flex items-center gap-1 text-sm"
                >
                  Login <HiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                    {LOGIN_OPTIONS.map(o => (
                      <Link
                        key={o.to}
                        to={o.to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 hover:text-forest-700 transition-colors"
                      >
                        {o.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/auth/farmer" className="btn-primary text-sm py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <HiX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-lg animate-fade-in">
          <ul className="space-y-1 mb-4">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-forest-50 hover:text-forest-700"
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 pt-4 space-y-2">
            {LOGIN_OPTIONS.map(o => (
              <Link
                key={o.to}
                to={o.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-forest-50"
              >
                {o.label}
              </Link>
            ))}
            <Link
              to="/auth/farmer"
              onClick={() => setMenuOpen(false)}
              className="block btn-primary text-sm text-center mt-2"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
