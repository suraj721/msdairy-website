import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Stethoscope, Scissors, ChevronDown, ChevronUp } from 'lucide-react';
import { ordersApi, vetsApi, groomingApi } from '../api';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const TABS = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'appointments', label: 'Vet Appointments', icon: Stethoscope },
  { id: 'grooming', label: 'Grooming Bookings', icon: Scissors },
];

export default function MyActivity() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ordersApi.list().then(r => setOrders(r.data)).catch(() => {}),
      vetsApi.appointments().then(r => setAppointments(r.data)).catch(() => {}),
      groomingApi.bookings().then(r => setBookings(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">My Activity</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1.5 mb-6 bg-gray-100 p-1 rounded-2xl w-fit max-w-full">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              tab === id ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === 'orders' && orders.length > 0 && (
              <span className="ml-1 bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{orders.length}</span>
            )}
            {id === 'appointments' && appointments.length > 0 && (
              <span className="ml-1 bg-secondary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{appointments.length}</span>
            )}
            {id === 'grooming' && bookings.length > 0 && (
              <span className="ml-1 bg-accent text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{bookings.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-gray-100" />)}
        </div>
      ) : (
        <>
          {/* ORDERS */}
          {tab === 'orders' && (
            orders.length === 0 ? (
              <Empty emoji="📦" title="No orders yet" sub="Place your first order and enjoy fresh dairy delivered to your door!" cta="Shop Now" to="/products" />
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="card overflow-hidden">
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary-pale flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-primary font-mono">{order.id}</span>
                          <span className={`badge border text-xs ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'} capitalize`}>{order.status}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>{order.items?.length} item(s)</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-gray-800">₹{order.totalAmount}</div>
                        {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400 ml-auto mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-auto mt-1" />}
                      </div>
                    </button>
                    {expanded === order.id && (
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                        <div className="space-y-2 mb-3">
                          {order.items?.map((item: any) => (
                            <div key={item.productId} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.productName} <span className="text-gray-400">× {item.quantity}</span></span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-dashed border-gray-200 pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Payment: <strong>{order.paymentMethod}</strong></span>
                          {order.deliveryFee === 0 && <span className="text-green-600 font-medium">Free Delivery ✓</span>}
                          {order.discount > 0 && <span className="text-green-600">Saved ₹{order.discount}</span>}
                          {order.deliveryAddress && <span>📍 {order.deliveryAddress.city}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* VET APPOINTMENTS */}
          {tab === 'appointments' && (
            appointments.length === 0 ? (
              <Empty emoji="🩺" title="No vet appointments" sub="Book a veterinary consultation for your pet" cta="Book Appointment" to="/pets?tab=vet" />
            ) : (
              <div className="space-y-3">
                {appointments.map(a => (
                  <div key={a.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{a.vetName}</span>
                          <span className={`badge border text-xs ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-600'} capitalize`}>{a.status}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>🐾 <strong>{a.petName}</strong> ({a.petType})</span>
                          <span>📅 {a.date} at {a.time}</span>
                          {a.reason && <span className="sm:col-span-2">📋 {a.reason}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.createdAt).toLocaleDateString('en-IN')}</span>
                          <span className="font-bold text-primary">₹{a.fee}</span>
                        </div>
                      </div>
                    </div>
                    {a.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Awaiting confirmation from the clinic. You'll be notified once confirmed.</span>
                        </div>
                      </div>
                    )}
                    {a.status === 'confirmed' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl px-3 py-2">
                          <span>✓ Appointment confirmed! Please arrive 10 minutes early.</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* GROOMING BOOKINGS */}
          {tab === 'grooming' && (
            bookings.length === 0 ? (
              <Empty emoji="✂️" title="No grooming bookings" sub="Book a grooming session for your pet" cta="Book Grooming" to="/pets?tab=grooming" />
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        <Scissors className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{b.serviceName}</span>
                          <span className={`badge border text-xs ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'} capitalize`}>{b.status}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>🐾 <strong>{b.petName}</strong> ({b.petType})</span>
                          <span>📅 {b.date} at {b.time}</span>
                          {b.notes && <span className="sm:col-span-2">📝 {b.notes}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                          <span className="font-bold text-primary">₹{b.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                    {b.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Awaiting confirmation. We'll reach out to schedule your slot.</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

function Empty({ emoji, title, sub, cta, to }: { emoji: string; title: string; sub: string; cta: string; to: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="font-bold text-gray-700 text-lg mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-5">{sub}</p>
      <Link to={to} className="btn-primary">{cta}</Link>
    </div>
  );
}
