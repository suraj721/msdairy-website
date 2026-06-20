import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import PetServices from './pages/PetServices';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Orders from './pages/Orders';
import About from './pages/About';
import Admin from './pages/Admin';
import Download from './pages/Download';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';

  if (isLogin) return <Login />;
  if (isAdmin) return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Admin />
    </div>
  );

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/pets" element={<PetServices />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/about" element={<About />} />
        <Route path="/download" element={<Download />} />
        <Route path="/contact" element={<div className="text-center py-20"><h1 className="text-2xl font-bold">Contact Us</h1><p className="text-gray-500 mt-2">📞 +91 90000 00000 | ✉️ hello@msdairy.com</p></div>} />
      </Routes>
    </Layout>
  );
}
