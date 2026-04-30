import { Link } from 'react-router-dom';
import {
  HiOutlineTruck, HiOutlineShoppingCart, HiOutlineShieldCheck,
  HiOutlineLightningBolt, HiArrowRight, HiStar,
} from 'react-icons/hi';
import { GiWheat, GiFarmer } from 'react-icons/gi';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const CHART_DATA = [
  { month: 'Jan', harvest: 40 }, { month: 'Feb', harvest: 65 },
  { month: 'Mar', harvest: 55 }, { month: 'Apr', harvest: 80 },
  { month: 'May', harvest: 95 }, { month: 'Jun', harvest: 120 },
  { month: 'Jul', harvest: 145 }, { month: 'Aug', harvest: 130 },
];

const FEATURES = [
  {
    icon: GiFarmer,
    title: 'Farmer Empowerment',
    desc: 'Post harvest requirements, manage crop listings, and connect directly with buyers and service providers.',
    color: 'forest',
  },
  {
    icon: HiOutlineTruck,
    title: 'Service Providers',
    desc: 'List your vehicles, manpower, and services. Bid on farmer requirements and grow your business.',
    color: 'earth',
  },
  {
    icon: HiOutlineShoppingCart,
    title: 'Direct Buying',
    desc: 'Browse fresh crop listings, make offers, and purchase directly from farmers at fair prices.',
    color: 'blue',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Verified & Trusted',
    desc: 'All users are verified. Transparent transactions with receipt uploads and dispute management.',
    color: 'green',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Real-time Offers',
    desc: 'Instant notifications on offers, bids, and booking confirmations. Never miss an opportunity.',
    color: 'yellow',
  },
  {
    icon: GiWheat,
    title: 'Crop Management',
    desc: 'Manage your entire crop lifecycle from posting to final sale with integrated tracking.',
    color: 'teal',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Verify', desc: 'Create your account as a Farmer, Service Provider, or Buyer. Quick verification process.', icon: '📋' },
  { step: '02', title: 'Post Requirements', desc: 'Farmers post harvest needs or crop listings. Providers post services. Buyers browse.', icon: '📝' },
  { step: '03', title: 'Connect & Negotiate', desc: 'Receive offers, negotiate terms, and communicate directly through our platform.', icon: '🤝' },
  { step: '04', title: 'Complete & Review', desc: 'Confirm bookings, complete transactions, upload receipts, and leave reviews.', icon: '✅' },
];

const TESTIMONIALS = [
  { name: 'Ramesh Patel', role: 'Wheat Farmer, Madhya Pradesh', text: 'FHC transformed how I sell my wheat. I found buyers directly and got 30% better prices than going through middlemen.', rating: 5, avatar: '🌾' },
  { name: 'Suresh Transport Co.', role: 'Service Provider, Gujarat', text: 'Our vehicle utilization jumped from 60% to 95% after listing on FHC. The bidding system is transparent and fair.', rating: 5, avatar: '🚚' },
  { name: 'Priya Mehta', role: 'Commodity Buyer, Mumbai', text: 'Direct sourcing from farmers means fresher produce and fair prices. The chat feature makes negotiation seamless.', rating: 5, avatar: '🛒' },
];

const STATS = [
  { value: '12,000+', label: 'Active Farmers' },
  { value: '₹85Cr+',  label: 'Transactions' },
  { value: '3,200+',  label: 'Service Providers' },
  { value: '8,500+',  label: 'Happy Buyers' },
];

const colorMap = {
  forest: 'bg-forest-50 text-forest-600',
  earth:  'bg-earth-50 text-earth-600',
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-700',
  teal:   'bg-teal-50 text-teal-600',
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-hero min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-on-load stagger-1">
                <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse-green" />
                India's Premier Agri-Marketplace
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-on-load stagger-2">
                Connecting
                <span className="text-gradient block">Farmers, Buyers</span>
                & Providers
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl animate-on-load stagger-3">
                A unified platform where farmers post harvest requirements, service providers offer logistics, and buyers source directly — eliminating middlemen for a fairer ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-on-load stagger-4">
                <Link to="/auth/farmer" className="btn-primary flex items-center justify-center gap-2 text-base">
                  Start as Farmer <HiArrowRight />
                </Link>
                <Link to="/about" className="btn-outline flex items-center justify-center gap-2 text-base">
                  Learn More
                </Link>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-on-load stagger-5">
                {STATS.map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-display font-bold text-2xl text-forest-700">{s.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Preview Card */}
            <div className="relative animate-float hidden lg:block">
              {/* Background glow */}
              <div className="absolute inset-0 bg-forest-200 rounded-3xl blur-3xl opacity-30 scale-110" />

              <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-gray-900">Harvest Activity</h3>
                  <span className="badge badge-green">Live</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="harvestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="harvest" stroke="#16a34a" strokeWidth={2.5} fill="url(#harvestGrad)" />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Active Listings', value: '248', color: 'text-forest-600' },
                    { label: 'Bids Today',       value: '34',  color: 'text-earth-600' },
                    { label: 'Completed',         value: '12',  color: 'text-blue-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className={`font-display font-bold text-xl ${s.color}`}>{s.value}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gray-100">
                <span className="text-2xl">🌾</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">New Harvest Posted</p>
                  <p className="text-xs text-gray-400">2 min ago</p>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gray-100">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">Offer Accepted</p>
                  <p className="text-xs text-gray-400">₹2,40,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-forest-600 font-semibold text-sm tracking-widest uppercase mb-2">Why Choose Us</p>
            <h2 className="section-title">Everything You Need in One Platform</h2>
            <p className="section-subtitle">Built specifically for India's agricultural ecosystem with features that matter.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card group hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-earth-600 font-semibold text-sm tracking-widest uppercase mb-2">Simple Process</p>
            <h2 className="section-title">How Harvest Connect Works</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-forest-200 -translate-y-1/2 z-0" />
                )}
                <div className="relative bg-white rounded-2xl p-6 shadow-card text-center z-10">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 mb-2 mt-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-forest-600 font-semibold text-sm tracking-widest uppercase mb-2">Testimonials</p>
            <h2 className="section-title">Trusted by Thousands Across India</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card relative">
                <div className="absolute -top-4 left-6 text-4xl">{t.avatar}</div>
                <div className="mt-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <HiStar key={j} className="text-earth-400 text-lg" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-forest-800 to-forest-600 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Agricultural Business?
          </h2>
          <p className="text-forest-200 text-lg mb-8">
            Join 12,000+ farmers and growing. Free to sign up, fair to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/farmer"   className="bg-white text-forest-800 font-bold px-8 py-3.5 rounded-xl hover:bg-forest-50 transition-colors">
              Register as Farmer
            </Link>
            <Link to="/auth/provider" className="bg-forest-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-forest-400 transition-colors border border-forest-400">
              Join as Provider
            </Link>
            <Link to="/auth/buyer"    className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-forest-800 transition-colors">
              Start Buying
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
