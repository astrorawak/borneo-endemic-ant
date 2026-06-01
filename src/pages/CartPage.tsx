import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatUSD } from '../lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🛒</div>
      <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '12px' }}>Your Cart is Empty</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>No specimens selected yet. Explore our collection.</p>
      <Link to="/shop" className="btn-primary">Browse Collection</Link>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container">
        <div className="section-eyebrow">Review Your Order</div>
        <h1 className="section-title" style={{ fontSize: '40px', marginBottom: '40px' }}>Shopping Cart</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--bg2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>
                  {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> : '🐜'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', marginBottom: '4px' }}>{product.name}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: 'var(--primary)' }}>{formatUSD(product.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '2px' }}>
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>-</button>
                    <span style={{ width: '32px', textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>+</button>
                  </div>
                  <button onClick={() => removeItem(product.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700, color: 'var(--text)', minWidth: '80px', textAlign: 'right' }}>
                  {formatUSD(product.price * quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px', position: 'sticky', top: '88px' }}>
            <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '24px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--muted)' }}>
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span style={{ color: 'var(--text)' }}>{formatUSD(totalPrice())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '13px', color: 'var(--muted)' }}>
              <span>Shipping</span><span>Calculated at checkout</span>
            </div>
            <hr className="divider" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '16px' }}>Total</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', color: 'var(--primary)', fontWeight: 700 }}>{formatUSD(totalPrice())}</span>
            </div>
            <Link to="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%' }}>Proceed to Checkout</Link>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
