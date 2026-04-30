import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import {
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed,
  HiOutlinePhone, HiOutlineLocationMarker,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common/UI';

const DEMO = {
  login:    { email: 'farmer@demo.com', password: 'demo123' },
  register: { name: 'Ramesh Patel', email: 'ramesh@farm.com', phone: '9876543210', location: 'Indore, MP', password: 'demo123', confirmPassword: 'demo123' },
};

export default function FarmerAuth() {
  const [mode, setMode]     = useState('login');
  const [form, setForm]     = useState(DEMO[mode]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email?.trim())    e.email    = 'Email required';
    if (!form.password?.trim()) e.password = 'Password required';
    if (mode === 'register') {
      if (!form.name?.trim())   e.name     = 'Name required';
      if (!form.phone?.trim())  e.phone    = 'Phone required';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({ name: form.name || 'Farmer Demo', email: form.email, role: 'farmer' }, 'mock-farmer-token');
    toast.success(mode === 'login' ? 'Welcome back! 🌾' : 'Account created! Welcome aboard 🎉');
    navigate('/farmer');
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-forest-800 to-forest-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <GiWheat className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl">Farmer Harvest Connect</span>
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 leading-tight">
            Your digital farming partner
          </h2>
          <p className="text-forest-200 text-lg leading-relaxed">
            Post harvest requirements, connect with logistics providers, sell your crops directly to buyers.
          </p>

          <div className="mt-10 space-y-4">
            {['Post harvest logistics requirements', 'List crops for direct sale', 'Receive buyer offers instantly', 'Track all transactions'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-forest-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-forest-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-white/10 rounded-2xl p-5">
          <p className="text-forest-100 text-sm italic">"In 3 months on FHC, I sold my wheat crop 28% above MSP directly to a buyer in Surat."</p>
          <p className="text-forest-300 text-xs mt-2">— Gopal Singh, Farmer, Vidisha MP</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 bg-cream">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-forest-600 rounded-xl flex items-center justify-center">
              <GiWheat className="text-white" />
            </div>
            <span className="font-display font-bold text-gray-900">Farmer Portal</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-500 mt-1">
              {mode === 'login' ? 'Sign in to your farmer account' : 'Join as a farmer today — it\'s free'}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setForm(DEMO[m]); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m ? 'bg-white text-forest-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input label="Full Name" icon={HiOutlineUser} placeholder="Your full name"
                value={form.name || ''} onChange={set('name')} error={errors.name} />
            )}
            <Input label="Email Address" icon={HiOutlineMail} type="email" placeholder="you@example.com"
              value={form.email || ''} onChange={set('email')} error={errors.email} />
            {mode === 'register' && (
              <>
                <Input label="Phone Number" icon={HiOutlinePhone} placeholder="10-digit mobile number"
                  value={form.phone || ''} onChange={set('phone')} error={errors.phone} />
                <Input label="Location / District" icon={HiOutlineLocationMarker} placeholder="e.g. Indore, Madhya Pradesh"
                  value={form.location || ''} onChange={set('location')} error={errors.location} />
              </>
            )}
            <Input label="Password" icon={HiOutlineLockClosed} type="password" placeholder="Enter password"
              value={form.password || ''} onChange={set('password')} error={errors.password} />
            {mode === 'register' && (
              <Input label="Confirm Password" icon={HiOutlineLockClosed} type="password" placeholder="Re-enter password"
                value={form.confirmPassword || ''} onChange={set('confirmPassword')} error={errors.confirmPassword} />
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-sm text-forest-600 hover:text-forest-800 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              {mode === 'login' ? 'Sign In to Dashboard' : 'Create Farmer Account'}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Not a farmer?{' '}
            <Link to="/auth/buyer" className="text-forest-600 font-semibold hover:text-forest-800">Buyer</Link>
            {' '}or{' '}
            <Link to="/auth/provider" className="text-forest-600 font-semibold hover:text-forest-800">Service Provider</Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
