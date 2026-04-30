import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const LINKS = {
  Platform: [
    { label: 'For Farmers',   to: '/auth/farmer' },
    { label: 'For Buyers',    to: '/auth/buyer' },
    { label: 'For Providers', to: '/auth/provider' },
  ],
  Company: [
    { label: 'About Us',  to: '/about' },
    { label: 'Contact',   to: '/contact' },
    { label: 'Careers',   to: '#' },
    { label: 'Blog',      to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Use',   to: '#' },
    { label: 'Refund Policy',  to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-white">
      {/* Top CTA */}
      <div className="bg-forest-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Ready to transform your harvest?
          </h3>
          <p className="text-forest-300 mb-6 font-body">
            Join thousands of farmers, buyers and service providers already using Harvest Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/farmer"   className="bg-forest-500 hover:bg-forest-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Join as Farmer
            </Link>
            <Link to="/auth/buyer"    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Start Buying
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center">
                <GiWheat className="text-white text-xl" />
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none">Farmer Harvest</p>
                <p className="text-forest-400 text-xs tracking-widest uppercase">Connect</p>
              </div>
            </div>
            <p className="text-forest-300 text-sm leading-relaxed mb-6 max-w-xs">
              Bridging the gap between farmers, service providers, and buyers for a more efficient and sustainable agricultural ecosystem.
            </p>
            <div className="flex gap-3">
              {[FaTwitter, FaLinkedin, FaInstagram, FaFacebook].map((Icon, i) => (
                <a key={i} href="#"
                   className="w-9 h-9 bg-forest-800 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm tracking-wider uppercase text-forest-400 mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-forest-200 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-forest-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-forest-400 text-sm">
            © {new Date().getFullYear()} Farmer Harvest Connect. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}
