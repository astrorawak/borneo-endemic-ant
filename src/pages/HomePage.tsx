import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { formatUSD } from '../lib/utils';

export default function HomePage() {
  const { products, categories, blogPosts } = useAdminStore();
  const addItem = useCartStore((s) => s.addItem);

  const featuredProducts = products.filter((p) => p.isActive).slice(0, 3);
  const latestPosts = blogPosts.filter((p) => p.isPublished).slice(0, 3);

  return (
    <main>
      {/* HERO */}
      <section style={{
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '80px 0',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(255,107,26,0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(255,80,0,0.06) 0%, transparent 60%)',
        }} className="grid-pattern" />
        <div className="page-container" style={{ position: 'relative', width: '100%' }}>
          <div style={{ maxWidth: '600px' }} className="animate-fade-up">
            <div className="section-eyebrow">Borneo Island · Est. 2024</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-1px' }}>
              Where the <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Rainforest</span><br />Meets Your Collection
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', marginBottom: '40px', maxWidth: '480px' }}>
              Live endemic ants, exotic insects &amp; rare reptiles from the ancient forests of Borneo. Ethically sourced. Expertly packed. Shipped worldwide.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn-primary">Explore Collection</Link>
              <Link to="/shipping" className="btn-secondary">Shipping Info</Link>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', fontSize: '180px', opacity: 0.06, pointerEvents: 'none' }}>🐜</div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'var(--bg3)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {[['40+', 'Species Available'], ['🌍', 'Ships Worldwide'], ['100%', 'Live Guarantee'], ['PayPal', 'Accepted']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{val}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 0' }}>
        <div className="page-container">
          <div className="section-eyebrow">Browse By Type</div>
          <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '40px' }}>Our Collections</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?cat=${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{cat.icon}</div>
                  <div className="section-title" style={{ fontSize: '16px', marginBottom: '6px' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{cat.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '80px 0', background: 'var(--bg2)' }}>
        <div className="page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="section-eyebrow">Featured Specimens</div>
              <h2 className="section-title" style={{ fontSize: '32px' }}>Top Sellers</h2>
            </div>
            <Link to="/shop" className="btn-ghost">View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={() => addItem(p, 1)} />
            ))}
          </div>
        </div>
      </section>

      {/* SHIPPING CALLOUT */}
      <section style={{ padding: '80px 0' }}>
        <div className="page-container">
          <div style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--primary)',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}>
            <div>
              <div className="section-eyebrow">Live Arrival Guarantee</div>
              <h3 className="section-title" style={{ fontSize: '24px', marginBottom: '12px' }}>Your Specimens Arrive Alive</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8 }}>Every shipment is carefully packed with insulated materials. If a DOA occurs, send a photo within 2 hours for a replacement or refund.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['DHL Express & EMS shipping', 'Climate-appropriate insulation', 'CITES documentation provided', 'WhatsApp tracking updates'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+</span> {f}
                </div>
              ))}
            </div>
            <div>
              <Link to="/shipping" className="btn-primary" style={{ display: 'inline-block' }}>Shipping Details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      {latestPosts.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--bg2)' }}>
          <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div>
                <div className="section-eyebrow">From The Journal</div>
                <h2 className="section-title" style={{ fontSize: '32px' }}>Latest Articles</h2>
              </div>
              <Link to="/blog" className="btn-ghost">All Articles →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {latestPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ height: '100%' }}>
                    <div style={{ height: '160px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', borderBottom: '1px solid var(--border)' }}>
                      {post.image ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌿'}
                    </div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{post.publishedAt}</div>
                      <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', marginBottom: '8px', lineHeight: 1.4 }}>{post.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PAYMENT METHODS */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px' }}>Accepted Payment Methods</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {[['PayPal', '💳'], ['USDT Crypto', '💎'], ['Western Union', '🏦']].map(([name, icon]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text)' }}>
                <span style={{ fontSize: '20px' }}>{icon}</span> {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product, onAdd }: { product: import('../types').Product; onAdd: () => void }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ height: '200px', background: 'linear-gradient(135deg, var(--bg), var(--bg2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', position: 'relative' }}>
        {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🐜'}
        {product.badge && <span className="badge" style={{ position: 'absolute', top: '12px', right: '12px' }}>{product.badge}</span>}
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>{product.category}</div>
        <Link to={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 className="section-title" style={{ fontSize: '16px', marginBottom: '6px', color: 'var(--text)', lineHeight: 1.3 }}>{product.name}</h3>
        </Link>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>{product.shortDesc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(product.price)}</span>
          <button onClick={onAdd} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '11px' }}>+ Cart</button>
        </div>
      </div>
    </div>
  );
}
