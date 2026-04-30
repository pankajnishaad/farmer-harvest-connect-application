import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineGlobe, HiOutlineLightBulb, HiOutlineChartBar } from 'react-icons/hi';

const TEAM = [
  { name: 'Arjun Sharma',   role: 'CEO & Co-Founder',     emoji: '👨‍💼', desc: 'Former IIT graduate with 10 years in AgriTech.' },
  { name: 'Priya Gupta',    role: 'CTO',                  emoji: '👩‍💻', desc: 'Ex-Google engineer, ML & platform architecture.' },
  { name: 'Raj Malhotra',   role: 'Head of Partnerships', emoji: '🤝', desc: 'Built relationships with 5000+ farmers across India.' },
  { name: 'Anita Verma',    role: 'Product Designer',     emoji: '🎨', desc: 'Award-winning UX designer focused on rural tech.' },
];

const VALUES = [
  { icon: HiOutlineHeart,   title: 'Farmer First',   desc: 'Every feature is built with farmers in mind. Their success is our mission.' },
  { icon: HiOutlineGlobe,   title: 'Pan-India Reach', desc: 'Serving 18 states across India with local language support.' },
  { icon: HiOutlineLightBulb,title: 'Innovation',    desc: 'Leveraging technology to solve age-old agricultural challenges.' },
  { icon: HiOutlineChartBar, title: 'Transparency',  desc: 'No hidden fees. Direct connections. Fair prices for everyone.' },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-forest-600 font-semibold text-sm tracking-widest uppercase mb-3">About Us</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Reimagining India's
            <span className="text-gradient block">Agricultural Supply Chain</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Founded in 2022, Farmer Harvest Connect was born from a simple observation: Indian farmers were losing 30-40% of their income to middlemen. We built the platform to change that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-earth-600 font-semibold text-sm tracking-widest uppercase mb-3">Our Mission</p>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                Empowering 140 Million Farming Families
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                India has over 140 million farming households. Most lack access to fair markets, efficient logistics, and direct buyer connections. FHC bridges this gap through technology.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our platform enables farmers to post their harvest logistics needs, connect with local service providers, and sell crops directly to buyers — creating a transparent, fair ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[['₹85Cr+', 'Facilitated'], ['12,000+', 'Farmers'], ['18', 'States'], ['4.8/5', 'Rating']].map(([v, l]) => (
                  <div key={l} className="bg-forest-50 rounded-xl p-4">
                    <p className="font-display font-bold text-2xl text-forest-700">{v}</p>
                    <p className="text-gray-500 text-sm">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-forest-600 to-forest-800 rounded-3xl p-10 text-white text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="font-display text-2xl font-bold mb-3">Sustainable Agriculture</h3>
              <p className="text-forest-200 leading-relaxed">
                We're committed to promoting sustainable farming practices and reducing waste across the supply chain through better logistics coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="card text-center">
                  <div className="w-12 h-12 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-forest-600 text-2xl" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">Passionate individuals building the future of Indian agriculture.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} className="card text-center hover:-translate-y-1">
                <div className="text-5xl mb-4">{m.emoji}</div>
                <h3 className="font-display font-bold text-gray-900">{m.name}</h3>
                <p className="text-forest-600 text-sm font-semibold mb-2">{m.role}</p>
                <p className="text-gray-500 text-xs">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-forest-950 text-white text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="text-forest-300 mb-8">Be part of transforming Indian agriculture.</p>
        <Link to="/auth/farmer" className="btn-primary inline-block">Get Started Today</Link>
      </section>
    </div>
  );
}
