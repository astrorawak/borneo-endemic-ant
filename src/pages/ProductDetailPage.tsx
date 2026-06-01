import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { formatUSD } from '../lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useAdminStore();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug === slug && p.isActive);
  const related = products.filter((p) => p.isActive && p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 3);

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>🐜</div>
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '16px' }}>Specimen Not Found</h2>
      <Link to="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  );

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link> /
          <Link to="/shop" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Shop</Link> /
          <span style={{ color: 'var(--primary)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', marginBottom: '80px' }}>
          {/* Image */}
          <div style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg3))', border: '1px solid var(--border)', borderRadius: '4px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', position: 'relative' }}>
            {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> : (
              product.categorySlug === 'ants' ? '🐜' : product.categorySlug === 'reptiles' ? '🦎' : '🦗'
            )}
            {product.badge && <span className="badge" style={{ position: 'absolute', top: '16px', left: '16px' }}>{product.badge}</span>}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>{product.category}</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '4px' }}>{product.name}</h1>
            {product.scientificName && <p style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '24px' }}>{product.scientificName}</p>}

            {product.difficulty && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px', padding: '6px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '2px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px' }}>
                Keeper Level: <span style={{ color: product.difficulty === 'Beginner' ? '#4ade80' : product.difficulty === 'Intermediate' ? '#facc15' : 'var(--primary)' }}>{product.difficulty}</span>
              </div>
            )}

            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)', marginBottom: '32px' }}>{product.description}</p>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {[['Origin', product.origin], ['Stock', `${product.stock} available`]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>{k}</div>
                  <div style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, fontSize: '14px' }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(product.price)}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '2px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '40px', height: '40px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '18px' }}>-</button>
                <span style={{ width: '40px', textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: '14px' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ width: '40px', height: '40px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '18px' }}>+</button>
              </div>
              <button onClick={handleAdd} className="btn-primary" style={{ flex: 1, maxWidth: '240px' }}>
                {added ? '✓ Added to Cart' : '+ Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <hr className="divider" style={{ marginBottom: '40px' }} />
            <div className="section-eyebrow">From the Same Category</div>
            <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '32px' }}>Related Specimens</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {related.map((r) => (
                <Link key={r.id} to={`/shop/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', flexShrink: 0 }}>
                      {r.image ? <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} /> : '🐜'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', marginBottom: '4px' }}>{r.name}</div>
                      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: 'var(--primary)', fontWeight: 700 }}>{formatUSD(r.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
