import { NavLink, useNavigate } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import {
  HiOutlineHome, HiOutlineClipboardList, HiOutlineTag, HiOutlineShoppingCart,
  HiOutlineChatAlt2, HiOutlineUser, HiOutlineStar, HiOutlineLogout,
  HiOutlineViewGrid, HiOutlineTruck, HiOutlineDocumentText, HiOutlineCheckCircle,
  HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlineExclamationCircle, HiOutlineCollection,
  HiX,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_CONFIG = {
  farmer: {
    color: 'forest',
    emoji: '🌾',
    title: 'Farmer',
    links: [
      { to: '/farmer',             label: 'Dashboard',      icon: HiOutlineHome,          end: true },
      { to: '/farmer/harvest',     label: 'Post Harvest',   icon: HiOutlineClipboardList },
      { to: '/farmer/offers',      label: 'View Offers',    icon: HiOutlineTag },
      { to: '/farmer/crops',       label: 'Post Crops',     icon: GiWheat },
      { to: '/farmer/buyerOffers', label: 'Buyer Offers',   icon: HiOutlineShoppingCart },
      { to: '/farmer/feedback',    label: 'Feedback',       icon: HiOutlineStar },
      { to: '/farmer/profile',     label: 'Profile',        icon: HiOutlineUser },
    ],
  },
  provider: {
    color: 'earth',
    emoji: '🚚',
    title: 'Provider',
    links: [
      { to: '/provider',           label: 'Dashboard',      icon: HiOutlineHome,          end: true },
      { to: '/provider/service',   label: 'Post Service',   icon: HiOutlineTruck },
      { to: '/provider/requests',  label: 'Farmer Requests',icon: HiOutlineDocumentText },
      { to: '/provider/bookings',  label: 'Bookings',       icon: HiOutlineCheckCircle },
      { to: '/provider/feedback',  label: 'Feedback',       icon: HiOutlineStar },
      { to: '/provider/profile',   label: 'Profile',        icon: HiOutlineUser },
    ],
  },
  buyer: {
    color: 'blue',
    emoji: '🛒',
    title: 'Buyer',
    links: [
      { to: '/buyer',              label: 'Dashboard',      icon: HiOutlineHome,          end: true },
      { to: '/buyer/listings',     label: 'Crop Listings',  icon: HiOutlineViewGrid },
      { to: '/buyer/chat',         label: 'Chat',           icon: HiOutlineChatAlt2 },
      { to: '/buyer/orders',       label: 'My Orders',      icon: HiOutlineShoppingCart },
      { to: '/buyer/reviews',      label: 'Reviews',        icon: HiOutlineStar },
      { to: '/buyer/profile',      label: 'Profile',        icon: HiOutlineUser },
    ],
  },
  admin: {
    color: 'purple',
    emoji: '🔐',
    title: 'Admin',
    links: [
      { to: '/admin',              label: 'Dashboard',      icon: HiOutlineHome,          end: true },
      { to: '/admin/users',        label: 'Users',          icon: HiOutlineUsers },
      { to: '/admin/transactions', label: 'Transactions',   icon: HiOutlineCurrencyRupee },
      { to: '/admin/disputes',     label: 'Disputes',       icon: HiOutlineExclamationCircle },
      { to: '/admin/listings',     label: 'Listings',       icon: HiOutlineCollection },
    ],
  },
};

const COLOR_MAP = {
  forest: { bg: 'bg-forest-600', text: 'text-forest-600', light: 'bg-forest-50', border: 'border-forest-200' },
  earth:  { bg: 'bg-earth-500',  text: 'text-earth-600',  light: 'bg-earth-50',  border: 'border-earth-200' },
  blue:   { bg: 'bg-blue-600',   text: 'text-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
};

export default function Sidebar({ role, collapsed, mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const config = NAV_CONFIG[role];
  const colors = COLOR_MAP[config?.color || 'forest'];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const sidebarClasses = [
    'fixed md:relative z-30 flex flex-col h-full bg-white border-r border-gray-100 shadow-sidebar transition-all duration-300',
    collapsed ? 'w-16' : 'w-64',
    mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
  ].join(' ');

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 h-16 border-b border-gray-100`}>
        <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <GiWheat className="text-white text-lg" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-gray-900 text-sm leading-none">FHC</p>
            <p className={`text-xs font-semibold ${colors.text}`}>{config?.title} Portal</p>
          </div>
        )}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded text-gray-400 hover:text-gray-600"
        >
          <HiX />
        </button>
      </div>

      {/* User Badge */}
      {!collapsed && (
        <div className={`mx-3 mt-3 p-3 rounded-xl ${colors.light} border ${colors.border}`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || config?.emoji}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || `${role}@fhc.com`}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-0.5">
        {config?.links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-200 group relative
                 ${isActive ? `${colors.bg} text-white shadow-md` : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
              title={collapsed ? link.label : undefined}
            >
              <Icon className="text-lg flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2.5 rounded-xl
                      text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200`}
        >
          <HiOutlineLogout className="text-lg flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
