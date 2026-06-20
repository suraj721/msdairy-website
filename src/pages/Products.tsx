import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productsApi } from '../api';
import ProductCard from '../components/ProductCard';

interface Product { id: string; name: string; price: number; originalPrice?: number; image: string; unit: string; rating?: number; reviewCount?: number; discount?: number; stock?: number; isFeatured?: boolean; isPopular?: boolean; category?: string; }

const CATS = [
  { value: '', label: 'All Products', icon: '🛒' },
  { value: 'milk', label: 'Milk', icon: '🥛' },
  { value: 'curd', label: 'Curd & Lassi', icon: '🥣' },
  { value: 'paneer', label: 'Paneer', icon: '🧀' },
  { value: 'ghee', label: 'Ghee', icon: '🫙' },
  { value: 'butter', label: 'Butter', icon: '🧈' },
  { value: 'cheese', label: 'Cheese', icon: '🫕' },
  { value: 'dog-food', label: 'Dog Food', icon: '🐕' },
  { value: 'cat-food', label: 'Cat Food', icon: '🐈' },
  { value: 'bird-food', label: 'Bird Food', icon: '🦜' },
  { value: 'pet-accessories', label: 'Accessories', icon: '🎀' },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [sort, setSort] = useState('');
  const category = params.get('category') || '';

  const fetchProducts = async () => {
    setLoading(true);
    const p: Record<string, string> = {};
    if (category) p.category = category;
    if (params.get('featured')) p.featured = 'true';
    if (params.get('popular')) p.popular = 'true';
    if (search) p.search = search;
    if (sort) p.sortBy = sort;
    try {
      const r = await productsApi.list(p);
      setProducts(r.data);
    } catch { setProducts([]); }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [category, sort, params.get('featured'), params.get('popular')]);
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProducts(); };

  const setCategory = (v: string) => {
    const next = new URLSearchParams();
    if (v) next.set('category', v);
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          {category ? CATS.find(c => c.value === category)?.label || 'Products' : 'All Products'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="card p-4">
            <h2 className="font-bold text-sm text-gray-700 mb-3">Categories</h2>
            <div className="space-y-1">
              {CATS.map(c => (
                <button key={c.value} onClick={() => setCategory(c.value)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${category === c.value ? 'bg-primary text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <form onSubmit={handleSearch} className="flex flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input pl-10 rounded-r-none" />
              <button type="submit" className="px-4 bg-primary text-white rounded-r-xl text-sm font-semibold hover:bg-primary-light transition-colors">Search</button>
              {search && <button type="button" onClick={() => { setSearch(''); fetchProducts(); }} className="absolute right-20 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
            </form>
            <select value={sort} onChange={e => setSort(e.target.value)} className="input w-auto min-w-[160px]">
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-700 text-lg">No products found</h3>
              <p className="text-gray-500 text-sm mt-2">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
