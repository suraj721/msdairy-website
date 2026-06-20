import { Link } from 'react-router-dom';
import { Leaf, Heart, Shield, Users, Trophy, Award, CheckCircle2, ChevronRight } from 'lucide-react';

export default function About() {
  const Milestones = [
    { year: '2020', title: 'Our Humble Beginnings', desc: 'Started with just 10 Gir cows on a small family farm in Pune, delivering organic A2 milk to 50 neighbor households.' },
    { year: '2022', title: 'Automating Hygiene', desc: 'Installed fully computerized, zero-touch milking and cold-chain storage facilities, scaling purity checking to 18 daily metrics.' },
    { year: '2024', title: 'Pet Care Integration', desc: 'Partnered with veterinary clinics and animal rescues to introduce adoption, at-home grooming services, and healthy food lines.' },
    { year: '2026', title: 'MS Dairy Ecosystem', desc: 'Now delivering fresh, organic dairy and pet care items to over 10,000 happy families across 5 major Indian cities.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <div className="badge bg-primary-pale text-primary border border-primary/20 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider">Our Story & Mission</div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
            Purity From Farm to Table, <br />
            <span className="text-primary">With Pure Love.</span>
          </h1>
          <p className="text-gray-650 leading-relaxed mb-4 text-base">
            MS Dairy was founded with a single, clear objective — to bypass long supply chain delays and deliver pure, unadulterated, farm-fresh milk to families within hours of milking.
          </p>
          <p className="text-gray-650 leading-relaxed mb-8 text-base">
            Today, our state-of-the-art farm utilizes computer-guided packaging and automated cold-chain logistics to serve fresh dairy alongside a complete pet care ecosystem (clinic support, grooming, and local shelter adoptions).
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="btn-primary">Browse Shop</Link>
            <Link to="/contact" className="btn-secondary">Get in Touch</Link>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80" alt="Dairy Farm pasture" className="w-full h-96 object-cover rounded-[32px] shadow-2xl border-4 border-white" />
          <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-800">Best Organic Brand</div>
              <div className="text-xs text-gray-400">Voted by Dairy Association</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-gray-900">Our Core Principles</h2>
          <p className="text-gray-500 mt-2 text-sm">How we maintain standard-setting quality across all sectors</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Leaf, title: '100% Pure & Organic', desc: 'No synthetic chemicals, no artificial preservatives, and no bovine growth hormones. Just pure nature.', color: 'text-green-600 bg-green-50' },
            { icon: Shield, title: 'Rigorous Lab Testing', desc: 'Every milk batch undergoes 18 parameters of daily chemical tests to confirm absolute purity.', color: 'text-blue-600 bg-blue-50' },
            { icon: Heart, title: 'Zero-Pain Pet Care', desc: 'Our veterinarians and groomers utilize gentle, positive reinforcement methods for diagnostic sessions.', color: 'text-red-600 bg-red-50' },
            { icon: Users, title: 'Sustainable Farming', desc: 'Empowering local farming networks with fair wages, healthy cattle feeds, and eco-friendly techniques.', color: 'text-purple-600 bg-purple-50' },
          ].map(v => (
            <div key={v.title} className="card p-6 hover:scale-[1.03] transition-all duration-300 border border-gray-150">
              <div className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center mb-4`}><v.icon className="w-6 h-6" /></div>
              <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-900">Our Journey So Far</h2>
          <p className="text-gray-500 mt-2 text-sm">A timeline of scaling quality and trust</p>
        </div>
        <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-12">
          {Milestones.map((m, i) => (
            <div key={m.year} className="relative pl-8 md:pl-12">
              {/* Year Indicator on left */}
              <div className="absolute -left-4 md:-left-24 top-0.5 font-black text-primary text-xl md:text-2xl bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-250">
                {m.year}
              </div>
              <div className="absolute -left-1.5 top-2.5 w-3 h-3 rounded-full bg-primary border-2 border-white" />
              <div className="card p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-base text-gray-900 mb-1">{m.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-wider flex items-center justify-center gap-2">
          <Award className="w-6 h-6" /> Impact Metrics & Certifications
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            ['10,000+', 'Happy Families'],
            ['50+', 'Verified Products'],
            ['2,000+', 'Happy Groomed Pets'],
            ['100%', 'Purity Guarantee']
          ].map(([n, l]) => (
            <div key={l} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl sm:text-4xl font-black">{n}</div>
              <div className="text-xs text-primary-pale font-semibold mt-1 tracking-wider uppercase">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
