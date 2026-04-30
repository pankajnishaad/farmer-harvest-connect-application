import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HiOutlineClipboardList, HiOutlineTag, HiOutlineShoppingCart, HiOutlineCurrencyRupee } from 'react-icons/hi';
import { GiWheat } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { StatCard, Badge } from '../../components/common/UI';

const AREA_DATA = [
  { month: 'Jan', income: 12000 }, { month: 'Feb', income: 19000 },
  { month: 'Mar', income: 15000 }, { month: 'Apr', income: 28000 },
  { month: 'May', income: 23000 }, { month: 'Jun', income: 35000 },
  { month: 'Jul', income: 42000 }, { month: 'Aug', income: 38000 },
];

const BAR_DATA = [
  { crop: 'Wheat',  qty: 45 }, { crop: 'Rice',   qty: 30 },
  { crop: 'Soybean',qty: 60 }, { crop: 'Corn',   qty: 25 },
  { crop: 'Cotton', qty: 35 },
];

const RECENT_OFFERS = [
  { id: 1, provider: 'Suresh Transport', service: 'Truck (10 Ton)', price: '₹4,200/day', status: 'pending' },
  { id: 2, provider: 'Ram Logistics',    service: '5 Labourers',    price: '₹1,500/day', status: 'accepted' },
  { id: 3, provider: 'Gupta Vehicles',   service: 'Tractor',        price: '₹2,800/day', status: 'rejected' },
];

const CROP_LISTINGS = [
  { id: 1, crop: 'Wheat',   qty: '200 Qtl', price: '₹2,150/Qtl', status: 'active', offers: 3 },
  { id: 2, crop: 'Soybean', qty: '80 Qtl',  price: '₹4,800/Qtl', status: 'active', offers: 1 },
  { id: 3, crop: 'Rice',    qty: '120 Qtl', price: '₹3,200/Qtl', status: 'sold',   offers: 0 },
];

export default function FarmerDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineClipboardList} label="Harvest Posts" value="3"  change={12}  color="forest" />
        <StatCard icon={HiOutlineTag}            label="Active Offers" value="7"  change={5}   color="earth" />
        <StatCard icon={GiWheat}                 label="Crop Listings" value="5"  change={-2}  color="blue" />
        <StatCard icon={HiOutlineCurrencyRupee}  label="Total Earned"  value="₹3.8L" change={18} color="purple" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Income Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900">Income Overview</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Income']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2.5} fill="url(#incGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Qty Bar */}
        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-4">Crop Quantity (Qtl)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="crop" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="qty" fill="#16a34a" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Offers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900">Recent Service Offers</h3>
            <Link to="/farmer/offers" className="text-forest-600 text-sm font-semibold hover:text-forest-800">View all</Link>
          </div>
          <div className="space-y-3">
            {RECENT_OFFERS.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{o.provider}</p>
                  <p className="text-xs text-gray-500">{o.service} · {o.price}</p>
                </div>
                <Badge variant={o.status === 'accepted' ? 'green' : o.status === 'rejected' ? 'red' : 'yellow'}>
                  {o.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Listings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900">My Crop Listings</h3>
            <Link to="/farmer/crops" className="text-forest-600 text-sm font-semibold hover:text-forest-800">Manage</Link>
          </div>
          <div className="space-y-3">
            {CROP_LISTINGS.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-forest-100 rounded-xl flex items-center justify-center">
                    <GiWheat className="text-forest-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{c.crop}</p>
                    <p className="text-xs text-gray-500">{c.qty} · {c.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={c.status === 'active' ? 'green' : 'gray'}>{c.status}</Badge>
                  {c.offers > 0 && <p className="text-xs text-earth-600 mt-1">{c.offers} offers</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-display font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Post Harvest Need', to: '/farmer/harvest', emoji: '📋', color: 'forest' },
            { label: 'List Crop for Sale', to: '/farmer/crops',   emoji: '🌾', color: 'earth' },
            { label: 'View Offers',        to: '/farmer/offers',  emoji: '📬', color: 'blue' },
            { label: 'Buyer Requests',     to: '/farmer/buyerOffers', emoji: '🤝', color: 'purple' },
          ].map(a => (
            <Link key={a.label} to={a.to}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-forest-50 rounded-xl transition-colors text-center group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{a.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-forest-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
