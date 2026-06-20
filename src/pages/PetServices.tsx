import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Clock, CheckCircle, Heart } from 'lucide-react';
import { petsApi, groomingApi, vetsApi } from '../api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const TABS = [
  { id: 'adoption', label: '🐾 Adoption', desc: 'Find your forever friend' },
  { id: 'grooming', label: '✂️ Grooming', desc: 'Book a grooming session' },
  { id: 'vet', label: '🩺 Veterinary', desc: 'Consult a vet' },
];

export default function PetServices() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'adoption');
  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [vets, setVets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState<{ type: 'grooming' | 'vet'; item: any } | null>(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([petsApi.list(), groomingApi.services(), vetsApi.list()])
      .then(([p, g, v]) => { setPets(p.data); setServices(g.data); setVets(v.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (type: 'grooming' | 'vet', item: any) => {
    if (!isAuthenticated) { toast.error('Please sign in to book'); navigate('/login'); return; }
    setBookingModal({ type, item });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Pet Services</h1>
        <p className="text-gray-500 text-sm mt-1">Adoption, Grooming & Veterinary care — all in one place</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-2xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={clsx('px-5 py-2.5 rounded-xl text-sm font-semibold transition-all', tab === t.id ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800')}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-72 animate-pulse bg-gray-100" />)}
        </div>
      ) : (
        <>
          {/* ADOPTION */}
          {tab === 'adoption' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map(pet => (
                  <div key={pet.id} className="card group">
                    <div className="relative overflow-hidden">
                      <img src={pet.image} alt={pet.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-primary capitalize">{pet.type}</div>
                      {pet.vaccinated && <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Vaccinated</div>}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{pet.name}</h3>
                          <p className="text-gray-500 text-sm">{pet.breed} • {pet.age} • {pet.gender}</p>
                        </div>
                        <button className="p-2 rounded-xl hover:bg-red-50 transition-colors"><Heart className="w-5 h-5 text-gray-400 hover:text-red-500" /></button>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{pet.description}</p>
                      <div className="flex items-center justify-between">
                        <div><span className="font-bold text-primary">₹{pet.adoptionFee?.toLocaleString()}</span><span className="text-xs text-gray-500 ml-1">adoption fee</span></div>
                        <button onClick={() => { if (!isAuthenticated) { toast.error('Please sign in'); navigate('/login'); } else toast.success(`Contact: ${pet.ownerPhone}`, { icon: '📞', duration: 5000 }); }} className="btn-primary text-sm py-2 px-4">
                          Adopt {pet.name}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <span>📍 {pet.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pets.length === 0 && <div className="text-center py-20 text-gray-500">No pets available for adoption right now. Check back soon!</div>}
            </div>
          )}

          {/* GROOMING */}
          {tab === 'grooming' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(s => (
                <div key={s.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{s.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</span>
                        {s.rating && <span className="text-xs flex items-center gap-1 text-amber-600"><Star className="w-3 h-3 fill-amber-400" /> {s.rating} ({s.reviewCount})</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-primary">₹{s.price}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                  {s.includes && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Includes:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.includes.map((item: string) => <span key={item} className="text-xs bg-primary-pale text-primary rounded-full px-2 py-0.5">{item}</span>)}
                      </div>
                    </div>
                  )}
                  <button onClick={() => handleBook('grooming', s)} className="btn-primary w-full">Book Now</button>
                </div>
              ))}
            </div>
          )}

          {/* VET */}
          {tab === 'vet' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vets.map(v => (
                <div key={v.id} className="card p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={v.image} alt={v.name} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{v.name}</h3>
                      <p className="text-sm text-primary font-medium">{v.specialization}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{v.experience} experience</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" /><span className="font-bold text-sm">{v.rating}</span></div>
                      <div className="text-xs text-gray-400">{v.reviewCount} reviews</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{v.about}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Consultation Fee</div>
                    <div className="font-bold text-primary text-lg">₹{v.fee}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Available Days:</div>
                    <div className="flex flex-wrap gap-1">{v.availableDays?.map((d: string) => <span key={d} className="text-xs bg-secondary-pale text-secondary rounded-full px-2 py-0.5">{d.slice(0, 3)}</span>)}</div>
                  </div>
                  <button onClick={() => handleBook('vet', v)} className="btn-primary w-full">Book Appointment</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {bookingModal && <BookingModal type={bookingModal.type} item={bookingModal.item} onClose={() => setBookingModal(null)} />}
    </div>
  );
}

function BookingModal({ type, item, onClose }: { type: 'grooming' | 'vet'; item: any; onClose: () => void }) {
  const [form, setForm] = useState({ petName: '', petType: 'Dog', date: '', time: item.availableSlots?.[0] || '10:00 AM', reason: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'grooming') {
        await groomingApi.book({ serviceId: item.id, serviceName: item.name, totalAmount: item.price, ...form });
        toast.success('Grooming booked! We\'ll confirm shortly.');
      } else {
        await vetsApi.book({ vetId: item.id, vetName: item.name, fee: item.fee, ...form });
        toast.success('Appointment booked! We\'ll confirm shortly.');
      }
      onClose();
    } catch { toast.error('Booking failed. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light p-5 text-white">
          <h2 className="font-bold text-lg">{type === 'grooming' ? '✂️ Book Grooming' : '🩺 Book Appointment'}</h2>
          <p className="text-primary-pale text-sm">{item.name}</p>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Pet Name *</label>
              <input required value={form.petName} onChange={e => setForm({ ...form, petName: e.target.value })} className="input" placeholder="e.g. Max" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Pet Type</label>
              <select value={form.petType} onChange={e => setForm({ ...form, petType: e.target.value })} className="input">
                <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Date *</label>
              <input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Time *</label>
              {item.availableSlots ? (
                <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input">
                  {item.availableSlots.map((s: string) => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input" placeholder="10:00 AM" />
              )}
            </div>
          </div>
          {type === 'vet' && <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Reason for Visit *</label><input required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="input" placeholder="e.g. Annual vaccination" /></div>}
          <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Notes (optional)</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input resize-none h-20" placeholder="Any special instructions..." /></div>
          <div className="flex items-center justify-between pt-2">
            <div><div className="text-xs text-gray-500">Total</div><div className="font-bold text-primary text-xl">₹{item.price || item.fee}</div></div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary text-sm py-2">{loading ? 'Booking...' : 'Confirm Booking'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
