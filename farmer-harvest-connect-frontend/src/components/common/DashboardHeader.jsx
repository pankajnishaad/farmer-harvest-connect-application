import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function DashboardHeader({ role, onToggleSidebar, onMobileMenu }) {
  const { user } = useAuth();

  const greetings = {
    farmer:   'Manage your harvest & crops',
    provider: 'Manage your services & bids',
    buyer:    'Discover fresh crops & deals',
    admin:    'Platform overview & management',
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 md:px-6 flex-shrink-0">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="hidden md:flex p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <HiOutlineMenuAlt2 size={20} />
      </button>
      <button
        onClick={onMobileMenu}
        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <HiOutlineMenuAlt2 size={20} />
      </button>

      {/* Greeting */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 hidden sm:block">{greetings[role]}</p>
        <h2 className="font-display font-semibold text-gray-800 text-base leading-tight truncate">
          Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
        </h2>
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-56">
        <HiOutlineSearch className="text-gray-400" />
        <input
          placeholder="Quick search..."
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
        <HiOutlineBell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Avatar */}
      <div className="w-9 h-9 bg-forest-600 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
        <span className="text-white text-sm font-bold">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </span>
      </div>
    </header>
  );
}
