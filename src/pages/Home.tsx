import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Star, Leaf, ChevronRight, Download, Smartphone, HelpCircle, MapPin, CheckCircle2, ChevronDown, Award } from 'lucide-react';
import { productsApi } from '../api';
import ProductCard from '../components/ProductCard';

interface Product { id: string; name: string; price: number; originalPrice?: number; image: string; unit: string; rating?: number; reviewCount?: number; discount?: number; stock?: number; isFeatured?: boolean; isPopular?: boolean; category?: string; }

const CATEGORIES = [
  { label: 'Fresh Milk', slug: 'milk', icon: '🥛', bg: 'from-green-50 to-emerald-100', text: 'text-green-700' },
  { label: 'Curd & Yogurt', slug: 'curd', icon: '🥣', bg: 'from-blue-50 to-sky-100', text: 'text-blue-700' },
  { label: 'Paneer', slug: 'paneer', icon: '🧀', bg: 'from-yellow-50 to-amber-100', text: 'text-amber-700' },
  { label: 'Ghee', slug: 'ghee', icon: '🫙', bg: 'from-orange-50 to-orange-100', text: 'text-orange-700' },
  { label: 'Butter', slug: 'butter', icon: '🧈', bg: 'from-purple-50 to-violet-100', text: 'text-purple-700' },
  { label: 'Cheese', slug: 'cheese', icon: '🫕', bg: 'from-pink-50 to-rose-100', text: 'text-rose-700' },
  { label: 'Pet Food', slug: 'dog-food', icon: '🐕', bg: 'from-teal-50 to-teal-100', text: 'text-teal-700' },
  { label: 'Accessories', slug: 'pet-accessories', icon: '🎀', bg: 'from-indigo-50 to-indigo-100', text: 'text-indigo-700' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'The A2 Gir cow milk is absolutely divine! My kids love it and I love knowing it\'s pure and fresh. Delivery is always on time by 7:00 AM.', avatar: 'P' },
  { name: 'Rahul Mehta', city: 'Pune', rating: 5, text: 'Got my dog Rocky groomed here — he looks amazing! The groomers are so gentle, patient and professional. Booking online is a breeze.', avatar: 'R' },
  { name: 'Anjali Singh', city: 'Bangalore', rating: 5, text: 'The paneer is fresh and soft every single time. And the ghee? Traditional aroma that elevates every dish. MS Dairy is a life-saver!', avatar: 'A' },
];

const FAQS = [
  { q: 'How early do you deliver the fresh milk?', a: 'All subscription orders are delivered daily between 6:00 AM and 8:30 AM. You can set up a recurring subscription or place custom orders by 10:00 PM the night before.' },
  { q: 'Are your dairy products pasteurized?', a: 'Yes, all our milk, set curd, paneer, and cheese are pasteurized to ensure the highest standards of safety while keeping the natural taste and nutrition intact.' },
  { q: 'How does home pet grooming work?', a: 'Our certified groomer will arrive at your home with all required sanitised kits, organic shampoo, and styling tools. We only require a bathing area and a clean corner with an electric socket.' },
  { q: 'How does pet adoption work on MS Dairy?', a: 'We act as a platform connecting loving rescues with forever homes. You can browse pet profiles, view details, and directly contact the rescue shelter via phone or WhatsApp.' },
  { q: 'Is there a delivery fee for products?', a: 'Delivery is absolutely free on all orders of ₹500 and above. For orders below ₹500, a small delivery charge of ₹40 is applied to cover logistic fees.' }
];

export default function Home() {
  const isMobileApp = typeof navigator !== 'undefined' && navigator.userAgent.includes('MSDairy-Mobile-App');
  const [featured, setFeatured] = useState<Product[]>([]);
  const [popular, setPopular] = useState<Product[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [coverageMessage, setCoverageMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    productsApi.list({ featured: 'true', limit: '4' }).then(r => setFeatured(r.data.slice(0, 4))).catch(() => {});
    productsApi.list({ popular: 'true', limit: '4' }).then(r => setPopular(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const checkCoverage = (e: React.FormEvent) => {
    e.preventDefault();
    const activeZips = ['400001', '400050', '400053', '411001', '560001', '500034', '110001'];
    if (activeZips.includes(zipCode.trim())) {
      setCoverageMessage({ type: 'success', text: '🎉 Yes! We deliver farm-fresh goodness to your location.' });
    } else if (zipCode.trim().length < 6) {
      setCoverageMessage({ type: 'error', text: 'Please enter a valid 6-digit Pincode.' });
    } else {
      setCoverageMessage({ type: 'error', text: '😔 Sorry, we do not deliver here yet. We are expanding fast!' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero */}
      {!isMobileApp && (
        <section className="relative bg-gradient-to-br from-primary-pale via-white to-secondary-pale overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary-pale border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="text-primary font-semibold text-sm">100% Natural & Farm Fresh Guarantee</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                  Pure Dairy &<br />
                  <span className="text-primary">Happy Pets,</span><br />
                  Delivered Fresh
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  From organic farm A2 milk to professional pet care services and premium nutritious food — MS Dairy is your trusted partner for premium family essentials.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/products" className="btn-primary flex items-center gap-2 text-base">
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/pets" className="btn-secondary flex items-center gap-2 text-base">
                    Explore Pet Services
                  </Link>
                </div>
                <div className="flex items-center gap-8 mt-10 border-t border-gray-100 pt-8">
                  {[['10K+', 'Happy Customers'], ['50+', 'Products'], ['100%', 'Pure & Organic']].map(([num, label]) => (
                    <div key={label}>
                      <div className="text-2xl font-black text-primary">{num}</div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&q=80" alt="Fresh Milk" className="w-full h-[450px] object-cover rounded-3xl shadow-2xl border-4 border-white" />
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-gray-100">
                    <div className="w-12 h-12 rounded-xl overflow-hidden"><img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100" className="w-full h-full object-cover" alt="pet" /></div>
                    <div><div className="font-bold text-sm text-gray-800">Pet Care Ecosystem</div><div className="text-xs text-gray-500">Grooming • Adoption • Clinic</div></div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-3 border border-gray-100">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                    </div>
                    <div className="font-bold text-xs">4.9★ Certified Service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Morning Delivery', sub: 'On orders above ₹500' },
              { icon: Leaf, title: '100% Organic Pasture', sub: 'No chemical additives' },
              { icon: Shield, title: 'Lab Tested Daily', sub: 'Certificates of purity' },
              { icon: Award, title: 'Award Winning Quality', sub: 'Trusted by 10K+ families' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3 p-2 hover:scale-[1.02] transition-transform duration-200">
                <div className="w-12 h-12 rounded-2xl bg-primary-pale flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">{title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Browse by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Farm-fresh milk, organic butter, paneer, and premium pet food</p>
            </div>
            <Link to="/products" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">View All Products <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {CATEGORIES.map(c => (
              <Link key={c.slug} to={`/products?category=${c.slug}`} className={`bg-gradient-to-br ${c.bg} rounded-3xl p-5 flex flex-col items-center gap-3 hover:scale-105 transition-all shadow-sm border border-black/5`}>
                <div className="text-4xl">{c.icon}</div>
                <div className={`text-xs font-bold text-center ${c.text}`}>{c.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900">How We Maintain Purity</h2>
            <p className="text-gray-500 mt-2">Our farm-to-table process guarantees fresh milk at your doorstep within 12 hours of milking.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Milking at Dawn', desc: 'Sourced from healthy, grass-fed cows under fully automated hygienic conditions.', image: 'https://images.unsplash.com/photo-1570042225831-d97fe759f2e4?w=400&q=80' },
              { step: '02', title: 'Daily Lab Analysis', desc: 'Tested for over 18 quality metrics including fat content, purity, and antibiotic presence.', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80' },
              { step: '03', title: 'Cold-Chain Delivery', desc: 'Shipped under 4°C directly to your doorstep before the morning alarm rings.', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' }
            ].map(proc => (
              <div key={proc.step} className="card group hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={proc.image} alt={proc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black w-8 h-8 rounded-full flex items-center justify-center">{proc.step}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{proc.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{proc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Featured Freshness</h2>
                <p className="text-gray-500 text-sm mt-1">Hand-picked premium farm-fresh items</p>
              </div>
              <Link to="/products?featured=true" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">Explore Featured <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Pet Services Banner */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white">Full-Scale Pet Care</h2>
            <p className="text-gray-400 mt-2">Professional, certified services for your furry friends</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: '🐕', title: 'Pet Adoption', sub: 'Give a loving home to a pet in need', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80', to: '/pets?tab=adoption' },
              { emoji: '✂️', title: 'Pet Grooming', sub: 'Stress-free grooming at your doorstep', img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80', to: '/pets?tab=grooming' },
              { emoji: '🩺', title: 'Veterinary Care', sub: 'Consult certified medical practitioners', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', to: '/pets?tab=vet' },
            ].map(s => (
              <Link key={s.title} to={s.to} className="group relative overflow-hidden rounded-3xl aspect-[4/3] block">
                <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="font-bold text-xl">{s.title}</div>
                  <div className="text-sm text-gray-300 mt-1">{s.sub}</div>
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      {popular.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Trending Today</h2>
                <p className="text-gray-500 text-sm mt-1">Customer favorites this week</p>
              </div>
              <Link to="/products?popular=true" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">View Popular <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {popular.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-500 mt-2">Real feedback from healthy families and happy pet parents</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-8 bg-white flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-pale flex items-center justify-center font-bold text-primary">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-500 mt-2">Have questions? We have got you covered.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white font-bold text-gray-800 hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage Checker Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-primary-pale/50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-pale flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Check Delivery Coverage</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your 6-digit Pincode to verify coverage in your locality</p>
          <form onSubmit={checkCoverage} className="flex max-w-md mx-auto relative mb-4">
            <input
              type="text"
              maxLength={6}
              value={zipCode}
              onChange={e => setZipCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 400053"
              className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-semibold shadow-sm"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary-light transition-colors">Check</button>
          </form>
          {coverageMessage && (
            <div className={`text-sm font-bold mt-2 ${coverageMessage.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {coverageMessage.text}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-4">Active coverage: Mumbai, Pune, Bangalore, Delhi NCR, Hyderabad</div>
        </div>
      </section>

      {/* Download App Banner */}
      {!isMobileApp && (
        <section className="py-12 bg-gray-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[32px] bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-14">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                    <Smartphone className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Android App Live</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Pure Freshness in<br />your hand</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">Create recurring milk subscriptions, book instant grooming appointments, consult certified vets online, and manage orders on the move.</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/download" className="flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3.5 rounded-2xl hover:bg-primary-pale transition-all hover:scale-105 shadow-xl">
                      <Download className="w-4 h-4 text-primary" />
                      Download APK
                    </Link>
                    <Link to="/download" className="flex items-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-2xl hover:bg-white/10 transition-colors">
                      Installation Guide <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center gap-6">
                  <div className="flex gap-4 items-end">
                    {[
                      { img: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=200&q=80', h: 'h-52' },
                      { img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80', h: 'h-64' },
                      { img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80', h: 'h-52' },
                    ].map((item, i) => (
                      <div key={i} className={`w-[110px] ${item.h} rounded-[24px] overflow-hidden border-2 border-white/10 shadow-2xl`}>
                        <img src={item.img} alt="App screenshot" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Start Your Morning with Pure Milk</h2>
          <p className="text-primary-pale text-lg mb-8 max-w-2xl mx-auto">Get doorstep delivery by 7:30 AM every morning. Set up a daily subscription plan and save 15%.</p>
          <Link to="/products?category=milk" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-primary-pale transition-colors shadow-2xl">
            Start Milk Subscription <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
