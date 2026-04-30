// BuyerAuth.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common/UI';

export function BuyerAuth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: 'buyer@demo.com', password: 'demo123' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email?.trim()) e.email = 'Email required';
    if (!form.password?.trim()) e.password = 'Password required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({ name: form.name || 'Buyer Demo', email: form.email, role: 'buyer' }, 'mock-buyer-token');
    toast.success(mode === 'login' ? 'Welcome back! 🛒' : 'Account created! 🎉');
    navigate('/buyer');
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-800 to-blue-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold mb-4 mt-12">Source Fresh Crops Directly</h2>
          <p className="text-blue-200 text-lg leading-relaxed">Connect with thousands of farmers. No middlemen. Fair prices. Fresh produce.</p>
          <div className="mt-10 space-y-4">
            {['Browse verified crop listings', 'Make direct offers to farmers', 'Integrated chat & negotiation', 'Secure payment & receipts'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-white text-xs">✓</span></div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-white/10 rounded-2xl p-5">
          <p className="text-blue-100 text-sm italic">"We source 100% of our wheat directly through FHC. Quality is better and cost is 18% lower."</p>
          <p className="text-blue-300 text-xs mt-2">— Priya Mehta, Commodity Buyer, Mumbai</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-cream">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900">{mode === 'login' ? 'Buyer Login' : 'Create Buyer Account'}</h1>
            <p className="text-gray-500 mt-1">Access crop listings and direct farmer connections</p>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}>
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <Input label="Full Name / Company" icon={HiOutlineUser} placeholder="Your name or business name" value={form.name || ''} onChange={set('name')} error={errors.name} />
                <Input label="Phone" icon={HiOutlinePhone} placeholder="Mobile number" value={form.phone || ''} onChange={set('phone')} />
                <Input label="Business Type" icon={HiOutlineOfficeBuilding} placeholder="e.g. Wholesale, Retail, Export" value={form.bizType || ''} onChange={set('bizType')} />
              </>
            )}
            <Input label="Email" icon={HiOutlineMail} type="email" placeholder="you@example.com" value={form.email || ''} onChange={set('email')} error={errors.email} />
            <Input label="Password" icon={HiOutlineLockClosed} type="password" placeholder="Password" value={form.password || ''} onChange={set('password')} error={errors.password} />
            <Button type="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-4">
            <Link to="/auth/farmer" className="text-forest-600 font-semibold">Farmer?</Link> or{' '}
            <Link to="/auth/provider" className="text-forest-600 font-semibold">Service Provider?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default BuyerAuth;
