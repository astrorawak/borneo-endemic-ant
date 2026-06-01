import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { InfoPages } from './pages/InfoPages';
import { AdminLayout } from './components/admin/AdminLayout';

export default function App() {
  return (
    <BrowserRouter basename="/borneo-endemic-ant">
      <Routes>
        {/* Admin routes */}
        <Route path="/admin-bea2024x/*" element={<AdminLayout />} />

        {/* Public routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<InfoPages page="about" />} />
              <Route path="/shipping" element={<InfoPages page="shipping" />} />
              <Route path="/faq" element={<InfoPages page="faq" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '72px', color: 'var(--border)', marginBottom: '16px' }}>404</div>
      <h1 className="section-title" style={{ fontSize: '24px', marginBottom: '16px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>The specimen you're looking for may have escaped into the forest.</p>
      <a href="/borneo-endemic-ant/" className="btn-primary">Return to Home</a>
    </div>
  );
}
