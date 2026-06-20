import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Scissors,
  Stethoscope, PawPrint, TrendingUp, ChevronUp, ChevronDown,
  RefreshCw, Edit3, Trash2, Plus, Check, X, Eye, BarChart2, Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { adminApi, productsApi, ordersApi, vetsApi, groomingApi } from '../api';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'grooming', label: 'Grooming', icon: Scissors },
  { id: 'vet', label: 'Veterinary', icon: Stethoscope },
];

export default function Admin() {
  const { user, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" />;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar — collapses to icon-only on small screens */}
      <aside className={clsx('bg-gray-900 text-gray-300 transition-all duration-300 flex flex-col shrink-0', sidebarOpen ? 'w-14 sm:w-56' : 'w-14')}>
        <div className="p-2 sm:p-3 border-b border-gray-800 flex items-center justify-between h-14">
          {sidebarOpen && <span className="hidden sm:block font-bold text-white text-sm">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors ml-auto hidden sm:flex">
            {sidebarOpen ? <ChevronDown className="w-4 h-4 rotate-90" /> : <ChevronUp className="w-4 h-4 rotate-90" />}
          </button>
        </div>
        <nav className="flex-1 p-1.5 sm:p-2 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} title={label} className={clsx('w-full flex items-center gap-3 px-2.5 sm:px-3 py-2.5 rounded-xl text-sm font-medium transition-colors', tab === id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}>
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="hidden sm:block">{label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="hidden sm:block p-3 border-t border-gray-800">
            <div className="text-xs text-gray-500">Logged in as</div>
            <div className="font-semibold text-white text-sm truncate">{user?.name}</div>
          </div>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6">
          {tab === 'dashboard' && <DashboardTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'customers' && <CustomersTab />}
          {tab === 'grooming' && <GroomingTab />}
          {tab === 'vet' && <VetTab />}
        </div>
      </main>
    </div>
  );
}

/* ─── Dashboard ─── */
function DashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.dashboard().then(r => setData(r.data)).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard...</div>;
  if (!data) return null;

  const { stats, revenueChart, monthlyTrends, ordersByStatus, topProducts, recentOrders } = data;

  const StatCard = ({ title, value, sub, color, icon: Icon }: any) => {
    let bgCol = 'bg-gray-50';
    if (color.includes('emerald')) bgCol = 'bg-emerald-50';
    else if (color.includes('blue')) bgCol = 'bg-blue-50';
    else if (color.includes('purple')) bgCol = 'bg-purple-50';
    else if (color.includes('teal')) bgCol = 'bg-teal-50';
    else if (color.includes('amber')) bgCol = 'bg-amber-50';
    else if (color.includes('primary')) bgCol = 'bg-green-50';

    return (
      <div className="card p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-500 font-medium">{title}</div>
            <div className={`text-2xl font-black mt-1 ${color}`}>{value}</div>
            {sub && <div className="text-xs text-gray-400 mt-1 font-medium">{sub}</div>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgCol}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary px-3 py-1.5 rounded-xl border border-gray-200 hover:border-primary transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} sub={`₹${stats.todayRevenue} today`} color="text-emerald-600" icon={TrendingUp} />
        <StatCard title="Total Orders" value={stats.totalOrders} sub={`${stats.todayOrders} today`} color="text-blue-600" icon={ShoppingBag} />
        <StatCard title="Total Customers" value={stats.totalUsers} sub={`${stats.goldTierUsers} Gold Tier Members`} color="text-purple-600" icon={Users} />
        <StatCard title="Active Bookings" value={stats.activeBookings} sub={`${stats.pendingGrooming + stats.pendingVet} pending approval`} color="text-teal-600" icon={Calendar} />
        <StatCard title="Products & Pets" value={stats.totalProducts} sub={`${stats.availablePets} pets for adoption`} color="text-amber-600" icon={Package} />
      </div>

      {/* Secondary Alert Banner / Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pending Orders', val: stats.pendingOrders, bg: 'bg-yellow-50', text: 'text-yellow-700' },
          { label: 'Grooming Pending', val: stats.pendingGrooming, bg: 'bg-teal-50', text: 'text-teal-700' },
          { label: 'Vet Pending', val: stats.pendingVet, bg: 'bg-blue-50', text: 'text-blue-700' },
          { label: 'Pets Available', val: stats.availablePets, bg: 'bg-orange-50', text: 'text-orange-700' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 sm:p-4 border border-black/5`}>
            <div className={`text-xl sm:text-2xl font-black ${s.text}`}>{s.val}</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Multi-series and 7-day charts grid */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="card p-5 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" /> Daily Revenue (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={(v: any) => [`₹${v}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#1A7F4B" strokeWidth={2.5} dot={{ fill: '#1A7F4B', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-600" /> Monthly Growth & Bookings (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: any, name: string) => {
                if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                if (name === 'registrations') return [value, 'New Customers'];
                if (name === 'bookings') return [value, 'Appointments'];
                return [value, name];
              }} />
              <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="registrations" name="registrations" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" name="bookings" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section: Recent Orders (2/3 width) and Orders/Products metrics (1/3 width) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <span className="text-xs font-semibold text-primary bg-primary-pale px-2.5 py-1 rounded-full">Realtime updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Order ID', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((o: any) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-primary font-bold">{o.id}</td>
                    <td className="py-3 px-3 text-gray-600">{o.items?.length} item(s)</td>
                    <td className="py-3 px-3 font-semibold">₹{o.totalAmount}</td>
                    <td className="py-3 px-3">
                      <span className={`badge border text-[11px] font-medium py-0.5 px-2 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-xs">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {Object.entries(ordersByStatus).map(([status, count]: any) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`badge border text-[11px] py-0.5 px-2 rounded-full capitalize ${STATUS_COLORS[status]}`}>{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (count / (stats.totalOrders || 1)) * 100)}%` }} />
                    </div>
                    <span className="font-bold text-sm text-gray-700 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Top Selling Products</h2>
            <div className="space-y-2">
              {topProducts?.map((p: any, i: number) => (
                <div key={p.name} className="flex items-center gap-2 text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="w-5 h-5 rounded-full bg-primary-pale text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="flex-1 text-gray-700 truncate font-medium">{p.name}</span>
                  <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded text-xs">{p.count} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    adminApi.orders().then(r => setOrders(r.data)).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await ordersApi.updateStatus(id, status);
      setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-black text-gray-900">Orders</h1><p className="text-sm text-gray-500">{orders.length} total orders</p></div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-auto">
          <option value="">All Status</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary font-bold">{o.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800 text-xs">{o.deliveryAddress?.fullName}</div>
                      <div className="text-gray-400 text-xs">{o.deliveryAddress?.city}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{o.items?.length} item(s)</td>
                    <td className="py-3 px-4 font-bold text-gray-800">₹{o.totalAmount}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{o.paymentMethod}</td>
                    <td className="py-3 px-4"><span className={`badge border text-xs ${STATUS_COLORS[o.status]} capitalize`}>{o.status}</span></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-primary">
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No orders found</div>}
        </div>
      )}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', price: '', originalPrice: '', unit: '', category: 'milk', stock: '100', image: '', discount: '0', description: '' });

  const load = () => { productsApi.list().then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, price: String(p.price), originalPrice: String(p.originalPrice || ''), unit: p.unit, category: p.category, stock: String(p.stock), image: p.image, discount: String(p.discount || 0), description: p.description || '' }); setShowForm(true); };
  const reset = () => { setEditing(null); setForm({ name: '', price: '', originalPrice: '', unit: '', category: 'milk', stock: '100', image: '', discount: '0', description: '' }); setShowForm(false); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock), discount: Number(form.discount) };
    try {
      if (editing) { await productsApi.update(editing.id, data); toast.success('Product updated'); }
      else { await productsApi.create(data); toast.success('Product created'); }
      reset(); load();
    } catch { toast.error('Failed to save product'); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await productsApi.delete(id); setProducts(p => p.filter(x => x.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const CATS = ['milk', 'curd', 'paneer', 'ghee', 'butter', 'cheese', 'dog-food', 'cat-food', 'bird-food', 'pet-accessories'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-black text-gray-900">Products</h1><p className="text-sm text-gray-500">{products.length} products</p></div>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 border-2 border-primary/20">
          <h2 className="font-bold text-gray-800 mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Name *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">{CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₹) *</label><input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Original Price (₹)</label><input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="input" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Unit *</label><input required value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="input" placeholder="e.g. 1 Litre, 200g" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Stock</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Discount (%)</label><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="input" /></div>
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." /></div>
            <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input resize-none h-20" /></div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={reset} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update Product' : 'Add Product'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Image', 'Name', 'Category', 'Price', 'Stock', 'Discount', 'Actions'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4"><img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" onError={e => (e.currentTarget.src = 'https://placehold.co/40')} /></td>
                    <td className="py-2 px-4"><div className="font-medium text-gray-800">{p.name}</div><div className="text-xs text-gray-400">{p.unit}</div></td>
                    <td className="py-2 px-4"><span className="badge bg-gray-100 text-gray-600 capitalize">{p.category}</span></td>
                    <td className="py-2 px-4"><div className="font-bold text-gray-800">₹{p.price}</div>{p.originalPrice > p.price && <div className="text-xs line-through text-gray-400">₹{p.originalPrice}</div>}</td>
                    <td className="py-2 px-4"><span className={`font-semibold ${p.stock < 10 ? 'text-red-600' : p.stock < 30 ? 'text-amber-600' : 'text-green-600'}`}>{p.stock}</span></td>
                    <td className="py-2 px-4">{p.discount ? <span className="badge bg-red-100 text-red-600">{p.discount}% OFF</span> : <span className="text-gray-400">—</span>}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => del(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Customers Tab ─── */
function CustomersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.users().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-black text-gray-900">Customers</h1><p className="text-sm text-gray-500">{users.filter(u => u.role === 'user').length} registered customers</p></div>
      {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100"><tr>{['Name', 'Email', 'Phone', 'Role', 'Loyalty Points', 'Joined'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-pale flex items-center justify-center font-bold text-primary text-sm shrink-0">{u.name?.[0]}</div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-gray-600">{u.phone || '—'}</td>
                    <td className="py-3 px-4"><span className={`badge ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                    <td className="py-3 px-4"><span className="font-semibold text-amber-600">⭐ {u.loyaltyPoints || 0}</span></td>
                    <td className="py-3 px-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Grooming Tab ─── */
function GroomingTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.groomingBookings().then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id: string, status: string) => {
    try { await groomingApi.updateStatus(id, status); setBookings(b => b.map(x => x.id === id ? { ...x, status } : x)); toast.success('Updated'); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-black text-gray-900">Grooming Bookings</h1><p className="text-sm text-gray-500">{bookings.length} total bookings</p></div>
      {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bookings.map(b => (
            <div key={b.id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{b.serviceName}</h3>
                  <div className="text-xs text-gray-500 mt-0.5">{b.id}</div>
                </div>
                <span className={`badge border text-xs ${STATUS_COLORS[b.status]} capitalize`}>{b.status}</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                <div>🐾 <strong>{b.petName}</strong> ({b.petType})</div>
                <div>📅 {b.date} at {b.time}</div>
                {b.notes && <div>📝 {b.notes}</div>}
                <div className="font-bold text-primary">₹{b.totalAmount}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(b.id, 'confirmed')} disabled={b.status === 'confirmed'} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors"><Check className="w-3 h-3" /> Confirm</button>
                <button onClick={() => updateStatus(b.id, 'cancelled')} disabled={b.status === 'cancelled'} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"><X className="w-3 h-3" /> Cancel</button>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <div className="col-span-full text-center py-16 text-gray-400">No grooming bookings yet</div>}
        </div>
      )}
    </div>
  );
}

/* ─── Vet Tab ─── */
function VetTab() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.vetAppointments().then(r => setAppointments(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await vetsApi.updateStatus(id, status);
      setAppointments(a => a.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-xl font-black text-gray-900">Vet Appointments</h1><p className="text-sm text-gray-500">{appointments.length} total appointments</p></div>
      {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {appointments.map(a => (
            <div key={a.id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{a.vetName}</h3>
                  <div className="text-xs text-gray-500">{a.id}</div>
                </div>
                <span className={`badge border text-xs ${STATUS_COLORS[a.status]} capitalize`}>{a.status}</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                <div>🐾 <strong>{a.petName}</strong> ({a.petType})</div>
                <div>📅 {a.date} at {a.time}</div>
                {a.reason && <div>📋 {a.reason}</div>}
                <div className="font-bold text-primary">₹{a.fee}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(a.id, 'confirmed')} disabled={a.status === 'confirmed'} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors">
                  <Check className="w-3 h-3" /> Confirm
                </button>
                <button onClick={() => updateStatus(a.id, 'completed')} disabled={a.status === 'completed'} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition-colors">
                  ✓ Complete
                </button>
                <button onClick={() => updateStatus(a.id, 'cancelled')} disabled={a.status === 'cancelled'} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors">
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ))}
          {appointments.length === 0 && <div className="col-span-full text-center py-16 text-gray-400">No vet appointments yet</div>}
        </div>
      )}
    </div>
  );
}
