import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, MapPin, Phone, CreditCard, ChevronLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ordersApi } from '../api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, updateQty, removeItem, clear, total, deliveryFee, discount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [placing, setPlacing] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: 'Flat 201, Green Heights',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    paymentMethod: 'UPI'
  });

  const subtotal = total();
  const fee = deliveryFee();
  const disc = discount();
  const grand = subtotal + fee - disc;

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4">🛒</div>
      <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Discover fresh dairy products and pet essentials</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in to place order'); navigate('/login'); return; }
    
    setPlacing(true);
    try {
      const orderItems = items.map(i => ({ productId: i.id, productName: i.name, price: i.price, quantity: i.quantity }));
      await ordersApi.create({
        items: orderItems,
        deliveryAddress: {
          fullName: shippingForm.fullName,
          phone: shippingForm.phone,
          line1: shippingForm.line1,
          city: shippingForm.city,
          state: shippingForm.state,
          pincode: shippingForm.pincode,
        },
        paymentMethod: shippingForm.paymentMethod,
        subtotal,
        deliveryFee: fee,
        discount: disc,
        totalAmount: grand,
      });
      clear();
      toast.success('Order placed successfully!', { icon: '🎉' });
      navigate('/orders');
    } catch { 
      toast.error('Failed to place order. Please try again.'); 
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {checkoutMode ? 'Delivery & Checkout' : 'Shopping Cart'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {checkoutMode ? 'Verify your delivery details' : `${items.length} items in your cart`}
          </p>
        </div>
        {checkoutMode && (
          <button 
            onClick={() => setCheckoutMode(false)}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2">
          {!checkoutMode ? (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.unit} • {item.brand || 'MS Dairy'}</p>
                    <div className="font-black text-primary mt-1">₹{item.price}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button 
                      onClick={() => updateQty(item.id, item.quantity - 1)} 
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item.id, item.quantity + 1)} 
                      className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right shrink-0 self-end sm:self-center">
                    <div className="font-black text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="mt-1.5 text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-xs font-semibold ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={placeOrder} className="card p-6 space-y-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3"><MapPin className="w-4 h-4 text-primary" /> Shipping Address</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Name *</label>
                  <input 
                    required 
                    type="text"
                    value={shippingForm.fullName} 
                    onChange={e => setForm({ ...shippingForm, fullName: e.target.value })} 
                    className="input" 
                    placeholder="e.g. Priya Sharma" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone Number *</label>
                  <input 
                    required 
                    type="tel"
                    value={shippingForm.phone} 
                    onChange={e => setForm({ ...shippingForm, phone: e.target.value })} 
                    className="input" 
                    placeholder="e.g. +91 98765 43210" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Street Address *</label>
                <input 
                  required 
                  type="text"
                  value={shippingForm.line1} 
                  onChange={e => setForm({ ...shippingForm, line1: e.target.value })} 
                  className="input" 
                  placeholder="e.g. Flat 201, Green Park Heights" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">City *</label>
                  <input 
                    required 
                    type="text"
                    value={shippingForm.city} 
                    onChange={e => setForm({ ...shippingForm, city: e.target.value })} 
                    className="input" 
                    placeholder="Mumbai" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Pincode *</label>
                  <input 
                    required 
                    type="text"
                    maxLength={6}
                    value={shippingForm.pincode} 
                    onChange={e => setForm({ ...shippingForm, pincode: e.target.value.replace(/\D/g,'') })} 
                    className="input" 
                    placeholder="400050" 
                  />
                </div>
              </div>

              <h2 className="font-bold text-gray-800 flex items-center gap-2 border-t border-gray-100 pt-5 pb-1"><CreditCard className="w-4 h-4 text-primary" /> Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                {['UPI', 'Card', 'Cash on Delivery'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm({ ...shippingForm, paymentMethod: method })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      shippingForm.paymentMethod === method 
                        ? 'border-primary bg-primary-pale text-primary' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <button type="submit" disabled={placing} className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2">
                {placing ? 'Placing Order...' : <><span>Pay & Place Order</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>

        {/* Right Side - Order Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-gray-850 mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
              <ShoppingBag className="w-4 h-4 text-primary" /> Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className={`flex justify-between ${fee === 0 ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                <span>Delivery</span>
                <span>{fee === 0 ? 'FREE' : `₹${fee}`}</span>
              </div>
              {disc > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Discount (5%)</span>
                  <span>-₹{disc}</span>
                </div>
              )}
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-black text-gray-900 text-base">
                <span>Total</span>
                <span>₹{grand}</span>
              </div>
            </div>
            {fee > 0 && (
              <div className="mt-4 text-xs text-center text-gray-500 bg-amber-50 rounded-xl p-2.5 border border-amber-100 font-medium">
                Add ₹{500 - subtotal} more for free delivery
              </div>
            )}
            {!checkoutMode && (
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Please sign in to continue');
                    navigate('/login');
                  } else {
                    setCheckoutMode(true);
                  }
                }} 
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <div className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
              Safe Payments • 100% Purity Guaranteed • Free Morning Deliveries
            </div>
          </div>
          <Link to="/products" className="block text-center text-sm text-primary font-bold hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  // Helper utility to make setShippingForm available with same syntax as App.tsx form handlers
  function setForm(val: typeof shippingForm) {
    setShippingForm(val);
  }
}
