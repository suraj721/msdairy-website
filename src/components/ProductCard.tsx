import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface Product {
  id: string; name: string; price: number; originalPrice?: number; image: string;
  unit: string; rating?: number; reviewCount?: number; discount?: number; stock?: number;
  isFeatured?: boolean; isPopular?: boolean; category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQty } = useCartStore();
  const cartItem = items.find(i => i.id === product.id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, unit: product.unit });
    toast.success(`${product.name} added to cart`, { icon: '🛒' });
  };

  return (
    <div className="card group cursor-pointer">
      <div className="relative overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.discount && product.discount > 0 ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.discount}% OFF</div>
        ) : null}
        {product.isFeatured && <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</div>}
        {product.isPopular && !product.isFeatured && <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">Popular</div>}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
        <div className="text-xs text-gray-500 mb-2">{product.unit}</div>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
            {product.reviewCount && <span className="text-xs text-gray-400">({product.reviewCount})</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
            )}
          </div>
          {qty === 0 ? (
            <button onClick={handleAdd} disabled={product.stock === 0} className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-light transition-colors disabled:opacity-50">
              <ShoppingCart className="w-3.5 h-3.5" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={() => updateQty(product.id, qty - 1)} className="w-6 h-6 rounded-lg bg-primary-pale text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-primary">{qty}</span>
              <button onClick={() => updateQty(product.id, qty + 1)} className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
