import { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Input, Textarea, Button } from '../../components/common/UI';

const CONTACT_INFO = [
  { icon: HiOutlineMail,           label: 'Email',          value: 'support@farmerharvest.in' },
  { icon: HiOutlinePhone,          label: 'Phone',          value: '+91 98765 43210' },
  { icon: HiOutlineLocationMarker, label: 'Office',         value: 'Bhopal, Madhya Pradesh, India' },
  { icon: HiOutlineClock,          label: 'Support Hours',  value: 'Mon–Sat, 9 AM – 6 PM IST' },
];

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', role: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', role: '', message: '' });
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-forest-600 font-semibold text-sm tracking-widest uppercase mb-2">Contact Us</p>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500 text-lg">Have questions? Our team is here to help. Reach out and we'll respond within 24 hours.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-500 text-sm">Reach us through any of these channels.</p>
            </div>

            {CONTACT_INFO.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-forest-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
                    <p className="text-gray-800 font-medium">{c.value}</p>
                  </div>
                </div>
              );
            })}

            <div className="bg-forest-50 rounded-2xl p-5 border border-forest-100 mt-4">
              <h3 className="font-semibold text-forest-800 mb-1">Farmer Support Helpline</h3>
              <p className="text-forest-600 text-sm">Dedicated support in Hindi, Marathi, Gujarati & English.</p>
              <p className="font-display font-bold text-forest-700 text-xl mt-2">1800-FHC-HELP</p>
              <p className="text-xs text-forest-500">Toll-free · Available 7 days</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 card">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  error={errors.name}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                />
              </div>

              <div>
                <label className="form-label">I am a...</label>
                <select
                  className="form-select"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="">Select your role</option>
                  <option>Farmer</option>
                  <option>Service Provider</option>
                  <option>Buyer</option>
                  <option>Other</option>
                </select>
              </div>

              <Textarea
                label="Message"
                placeholder="Describe your query or feedback..."
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                error={errors.message}
              />

              <Button type="submit" loading={loading} className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              ['Is the platform free to use?', 'Registration is free for all users. We charge a small commission only on completed transactions.'],
              ['How are payments processed?', 'Payments are handled securely. Buyers upload receipts and funds are released after confirmation.'],
              ['In which states are you available?', 'We operate in 18 states across India including MP, Gujarat, Maharashtra, Punjab, UP, and more.'],
              ['Can I use the platform in Hindi?', 'Yes! The platform supports Hindi, Marathi, Gujarati, and English.'],
            ].map(([q, a], i) => (
              <details key={i} className="card cursor-pointer group">
                <summary className="font-semibold text-gray-800 flex items-center justify-between">
                  {q}
                  <span className="text-forest-600 text-lg">+</span>
                </summary>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
