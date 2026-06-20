import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Download, Smartphone } from 'lucide-react';

export default function Footer() {
  const isMobileApp = typeof navigator !== 'undefined' && navigator.userAgent.includes('MSDairy-Mobile-App');
  if (isMobileApp) return null;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <span className="text-white font-black text-sm">MS</span>
              </div>
              <div>
                <div className="font-black text-white text-lg leading-none">MS Dairy</div>
                <div className="text-[10px] text-gray-400">Pure. Fresh. Delivered.</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Your one-stop destination for farm-fresh dairy, pet care products, grooming, adoption & veterinary services.</p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/products', 'Shop Now'], ['/products?category=milk', 'Fresh Milk'], ['/pets', 'Pet Services'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              {['Daily Milk Delivery', 'Dairy Products', 'Pet Adoption', 'Pet Grooming', 'Veterinary Consultation', 'Pet Food & Accessories'].map(s => (
                <li key={s} className="text-gray-400">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Get the App</h3>
            <p className="text-sm text-gray-400 mb-4">Order dairy & book pet services from your phone — anytime, anywhere.</p>
            <Link
              to="/download"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 transition-colors group mb-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 leading-none mb-0.5">Download free</div>
                <div className="text-white font-bold text-sm leading-none">Android APK</div>
              </div>
              <Download className="w-4 h-4 text-gray-400 ml-auto group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 opacity-60 cursor-not-allowed">
              <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                <span className="text-lg">🍎</span>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 leading-none mb-0.5">Coming soon</div>
                <div className="text-white font-bold text-sm leading-none">iOS App Store</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" /><span>12, Green Park Colony, Mumbai, Maharashtra 400001</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary shrink-0" /><a href="tel:+919000000000" className="hover:text-primary">+91 90000 00000</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary shrink-0" /><a href="mailto:hello@msdairy.com" className="hover:text-primary">hello@msdairy.com</a></li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-xl text-xs">
              <div className="font-semibold text-white mb-1">Delivery Hours</div>
              <div>Mon–Sat: 6:00 AM – 9:00 PM</div>
              <div>Sun: 7:00 AM – 8:00 PM</div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© 2024 MS Dairy. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
