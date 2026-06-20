import { useState } from 'react';
import { Smartphone, Download as DownloadIcon, Shield, Star, Wifi, Bell, CheckCircle, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: '🥛', title: 'Daily Milk Delivery', desc: 'Order fresh dairy every morning with a single tap' },
  { icon: '🐾', title: 'Pet Services Booking', desc: 'Book grooming, vet consultation, or adopt in minutes' },
  { icon: '📦', title: 'Live Order Tracking', desc: 'Track your order in real-time, from farm to your door' },
  { icon: '💸', title: 'Exclusive App Offers', desc: 'Access flash deals and loyalty cashbacks only on mobile' },
  { icon: '🔔', title: 'Delivery Notifications', desc: 'Get silent alerts as soon as your milk is delivered' },
  { icon: '💳', title: 'Secure Multi-Payments', desc: 'Pay smoothly with UPI, Credit Cards, or MS Wallet' },
];

const SCREENSHOTS = [
  { url: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=300&q=80', label: 'Fresh Milk Ordering' },
  { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80', label: 'Pet Care Ecosystem' },
  { url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80', label: 'Vet Consultations' },
];

// Configure the APK download URL variable here
const backendUrl = (import.meta as any).env?.VITE_API_URL || '';
const DOWNLOAD_APP_URL = (import.meta as any).env?.VITE_DOWNLOAD_APP_URL || `${backendUrl}/api/download/apk`;

export default function Download() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    // If it's a remote URL, open it directly in a new window
    if (DOWNLOAD_APP_URL.startsWith('http://') || DOWNLOAD_APP_URL.startsWith('https://')) {
      window.open(DOWNLOAD_APP_URL, '_blank');
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
      return;
    }

    // Otherwise, fetch the local API endpoint
    setDownloading(true);
    try {
      const res = await fetch(DOWNLOAD_APP_URL);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MSDairy.apk';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 4000);
      } else {
        // Fallback or Coming Soon warning
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 4000);
      }
    } catch {
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-primary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Smartphone className="w-4 h-4 text-green-400" />
                <span className="text-white/90 font-semibold text-sm">Official Android App — Free Download</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
                MS Dairy<br />
                <span className="text-green-400">in your pocket.</span>
              </h1>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Unlock instant access to farm-fresh milk delivery, vet slot booking, at-home grooming, and pet adoptions. Lightweight and easy.
              </p>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="group flex items-center gap-4 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-green-50 transition-all shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                  ) : downloaded ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <DownloadIcon className="w-6 h-6 text-primary group-hover:animate-bounce" />
                  )}
                  <div className="text-left">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">
                      {downloaded ? 'Preparing File' : 'Ready to Install'}
                    </div>
                    <div className="text-base leading-none">
                      {downloaded ? 'Downloading APK...' : 'Download APK for Android'}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <span className="text-xl">🍎</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">App Store</div>
                    <div className="text-white/80 font-bold text-sm leading-none">Coming soon on iOS</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 border-t border-white/10 pt-8">
                {[
                  { value: '10K+', label: 'Active Downloads' },
                  { value: '4.8★', label: 'PlayStore Rating' },
                  { value: '5.2 MB', label: 'File Size (Lightweight)' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-white">{value}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Mockups */}
            <div className="hidden lg:flex items-center justify-center gap-4">
              {SCREENSHOTS.map((s, i) => (
                <div
                  key={s.label}
                  className={`relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/15 ${i === 1 ? 'h-[420px] w-[200px] -mt-8' : 'h-[360px] w-[180px]'}`}
                  style={{ transform: i === 0 ? 'rotate(-6deg)' : i === 2 ? 'rotate(6deg)' : 'none' }}
                >
                  <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white text-xs font-bold">{s.label}</div>
                  </div>
                  {/* Status bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-black/30 backdrop-blur-sm flex items-center justify-between px-4">
                    <div className="text-white text-[10px] font-bold">09:41</div>
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3 h-3 text-white" />
                      <Bell className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Install Section */}
      <section className="py-16 bg-amber-50/50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">Step-by-Step Installation Guide</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', icon: <DownloadIcon className="w-6 h-6 text-primary" />, title: 'Download APK', desc: 'Tap the download button above to retrieve the secure MSDairy.apk installation file.' },
              { step: '2', icon: <Shield className="w-6 h-6 text-amber-600" />, title: 'Enable Unknown Sources', desc: 'Go to Settings → Apps & Notifications → Special Access → Install Unknown Apps → Allow from Browser.' },
              { step: '3', icon: <CheckCircle className="w-6 h-6 text-green-600" />, title: 'Install & Launch', desc: 'Open the downloaded file, tap "Install", and log in to start ordering fresh milk!' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  {icon}
                </div>
                <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center mb-2">{step}</div>
                <div className="font-bold text-gray-900 mb-2">{title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900">Why order on our Mobile App?</h2>
            <p className="text-gray-500 mt-2">The fastest, most seamless way to manage your daily schedule</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="group p-8 rounded-3xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all bg-white flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform w-fit">{f.icon}</div>
                  <div className="font-bold text-gray-900 mb-2">{f.title}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-12">Trusted by 10,000+ Android users</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Kunal P.', stars: 5, text: 'Super fast download. Setting up my morning milk delivery takes less than 2 minutes.' },
              { name: 'Sneha R.', stars: 5, text: 'The grooming booking is amazing. I can select slots and pay right in the app. Top-notch!' },
              { name: 'Megha S.', stars: 5, text: 'Extremely lightweight, does not hog memory. Real-time updates help me track my orders.' },
            ].map(r => (
              <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left">
                <div className="flex mb-3">{[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">"{r.text}"</p>
                <div className="font-bold text-sm text-gray-800">{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-light py-20 border-t border-primary-light/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Start your smart dairy plan</h2>
          <p className="text-primary-pale mb-10 max-w-lg mx-auto">Free download. Safe and secure. Verified by Play Protect. Freshness delivered to your door.</p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-3 bg-white text-primary font-bold px-10 py-4 rounded-2xl hover:bg-primary-pale transition-all shadow-2xl hover:scale-105"
          >
            {downloading ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <DownloadIcon className="w-5 h-5" />
            )}
            {downloading ? 'Preparing File...' : 'Download APK Now'}
          </button>
        </div>
      </section>
    </div>
  );
}
