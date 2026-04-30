import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone, HiOutlineTruck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common/UI';

export default function ProviderAuth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: 'provider@demo.com', password: 'demo123' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!form.email || !form.password) {
      setErrors({ email: !form.email ? 'Required' : '', password: !form.password ? 'Required' : '' });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({ name: form.name || 'Provider Demo', email: form.email, role: 'provider' }, 'mock-provider-token');
    toast.success('Welcome back! 🚚');
    navigate('/provider');
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-earth-800 to-earth-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold mb-4 mt-12">Grow Your Service Business</h2>
          <p className="text-earth-200 text-lg">List your vehicles and manpower. Bid on farmer requirements. Maximize utilization.</p>
          <div className="mt-10 space-y-4">
            {['Post your vehicles & manpower details', 'Receive farmer harvest requests', 'Submit competitive bids', 'Manage bookings & payments'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-earth-400 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xs">✓</span></div>
                <span className="text-earth-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-white/10 rounded-2xl p-5">
          <p className="text-earth-100 text-sm italic">"Our fleet utilization went from 55% to 92% within 2 months of joining FHC."</p>
          <p className="text-earth-300 text-xs mt-2">— Suresh Logistics, Nagpur</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-cream">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900">Service Provider Portal</h1>
            <p className="text-gray-500 mt-1">Manage your services and grow your agricultural business</p>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white text-earth-700 shadow-sm' : 'text-gray-500'}`}>
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <Input label="Company / Owner Name" icon={HiOutlineUser} placeholder="Your business name" value={form.name || ''} onChange={set('name')} />
                <Input label="Phone" icon={HiOutlinePhone} placeholder="Mobile number" value={form.phone || ''} onChange={set('phone')} />
                <div>
                  <label className="form-label">Service Type</label>
                  <select className="form-select" value={form.serviceType || ''} onChange={set('serviceType')}>
                    <option value="">Select primary service</option>
                    <option>Transport / Vehicles</option>
                    <option>Manpower / Labour</option>
                    <option>Combine Harvester</option>
                    <option>Cold Storage</option>
                    <option>Both Transport & Manpower</option>
                  </select>
                </div>
              </>
            )}
            <Input label="Email" icon={HiOutlineMail} type="email" placeholder="business@example.com" value={form.email || ''} onChange={set('email')} error={errors.email} />
            <Input label="Password" icon={HiOutlineLockClosed} type="password" placeholder="Password" value={form.password || ''} onChange={set('password')} error={errors.password} />
            <Button type="submit" loading={loading} className="w-full bg-earth-600 hover:bg-earth-700">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            <Link to="/auth/farmer" className="text-forest-600 font-semibold">Farmer?</Link> or{' '}
            <Link to="/auth/buyer" className="text-forest-600 font-semibold">Buyer?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
