import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useCartStore } from '../store/cartStore';
import { formatUSD } from '../lib/utils';

export default function ShopPage() {
  const { products, categories } = useAdminStore();
  const addItem = useCartStore((s) => s.addItem);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const activeCat = searchParams.get('cat') || 'all';

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive);
    if (activeCat !== 'all') list = list.filter((p) => p.categorySlug === activeCat);
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.shortDesc.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCat, search, sort]);

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div className="section-eyebrow">Borneo Specimens</div>
          <h1 className="section-title" style={{ fontSize: '40px', marginBottom: '16px' }}>Our Collection</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{filtered.length} species available</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search species..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ maxWidth: '260px' }}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-field" style={{ maxWidth: '200px' }}>
            <option value="default">Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <FilterBtn active={activeCat === 'all'} onClick={() => setSearchParams({})}>All</FilterBtn>
            {categories.map((c) => (
              <FilterBtn key={c.id} active={activeCat === c.slug} onClick={() => setSearchParams({ cat: c.slug })}>
                {c.icon} {c.name}
              </FilterBtn>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontFamily: 'Space Mono, monospace' }}>No specimens found matching your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map((p) => (
              <div key={p.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'linear-gradient(135deg, var(--bg), var(--bg2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', position: 'relative' }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                    p.categorySlug === 'ants' ? '🐜' : p.categorySlug === 'reptiles' ? '🦎' : '🦗'
                  )}
                  {p.badge && <span className="badge" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '9px' }}>{p.badge}</span>}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>{p.category}</div>
                  <Link to={`/shop/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 className="section-title" style={{ fontSize: '15px', marginBottom: '4px', color: 'var(--text)', lineHeight: 1.3 }}>{p.name}</h3>
                  </Link>
                  {p.scientificName && <div style={{ fontStyle: 'italic', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{p.scientificName}</div>}
                  <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>{p.shortDesc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', color: 'var(--primary)', fontWeight: 700 }}>{formatUSD(p.price)}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/shop/${p.slug}`} className="btn-ghost" style={{ padding: '7px 12px', fontSize: '10px' }}>Details</Link>
                      <button onClick={() => addItem(p, 1)} className="btn-primary" style={{ padding: '7px 14px', fontSize: '10px' }}>+ Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px',
      fontFamily: 'Space Mono, monospace',
      fontSize: '11px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? '#000' : 'var(--muted)',
      cursor: 'pointer',
      borderRadius: '2px',
      transition: 'all 0.2s',
    }}>{children}</button>
  );
}
