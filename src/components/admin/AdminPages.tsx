import React, { useState, useCallback, useRef } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { slugify, formatUSD } from '../../lib/utils';
import type { Product, Category, BlogPost, StoreSettings } from '../../types';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; type: ToastType; message: string; }

function Toast({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '16px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none', maxWidth: '320px' }}>
      {toasts.map((t) => (
        <div key={t.id} className="animate-toast" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', background: t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#374151', color: '#fff', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <span>{t.type === 'success' ? '\u2705' : t.type === 'error' ? '\u274c' : '\u2139\ufe0f'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => onRemove(t.id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>&times;</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, show, remove };
}

function ImageUploader({ value, onChange, onToast, label = 'Image' }: { value: string; onChange: (url: string) => void; onToast: (msg: string, type: ToastType) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { onToast('File must be an image', 'error'); return; }
    if (file.size > 3 * 1024 * 1024) { onToast('Image too large. Max 3MB.', 'error'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target?.result as string); setUploading(false); onToast(`${label} uploaded!`, 'success'); };
    reader.onerror = () => { setUploading(false); onToast('Failed to read file.', 'error'); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</label>
      <div onClick={() => !uploading && fileRef.current?.click()} style={{ border: `2px dashed ${value ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', background: 'var(--bg2)', overflow: 'hidden' }}>
        {value ? (
          <img src={value} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            {uploading ? <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--primary)' }}>Processing...</p> : <><div style={{ fontSize: '32px', marginBottom: '8px' }}>\ud83d\udcf7</div><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)' }}>Tap to upload &middot; JPG, PNG, WebP &middot; Max 3MB</p></>}
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value && <button type="button" onClick={() => onChange('')} style={{ marginTop: '6px', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>\ud83d\uddd1\ufe0f Remove</button>}
    </div>
  );
}

function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
      {sub && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>{sub}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h1>
        {action}
      </div>
    </div>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '600px', marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg2)', borderRadius: '12px 12px 0 0', zIndex: 1 }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '24px', lineHeight: 1, padding: '4px 8px' }}>&times;</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

// ===== DASHBOARD =====
export function AdminDashboard() {
  const { products, orders, blogPosts, categories } = useAdminStore();
  const activeProducts = products.filter((p) => p.isActive).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStock = products.filter((p) => p.isActive && p.stock <= 3);
  return (
    <div>
      <PageHeader title="Dashboard" sub="Overview" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {([['Products', products.length, '\ud83d\udc1c'], ['Active', activeProducts, '\u2705'], ['Orders', pendingOrders, '\ud83d\udce6'], ['Categories', categories.length, '\ud83c\udff7\ufe0f'], ['Articles', blogPosts.filter((p) => p.isPublished).length, '\ud83d\udcdd']] as [string, number, string][]).map(([label, val, icon]) => (
          <div key={label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{val}</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '12px', color: 'var(--primary)' }}>\u26a0\ufe0f Low Stock</h3>
          {lowStock.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
              <span style={{ flex: 1, paddingRight: '8px' }}>{p.name}</span>
              <span style={{ fontFamily: 'Space Mono, monospace', color: p.stock === 0 ? '#ef4444' : 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>{p.stock} left</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== PRODUCTS =====
const EMPTY_PRODUCT: Omit<Product, 'id'> = { name: '', slug: '', price: 0, category: 'Ants', categorySlug: 'ants', description: '', shortDesc: '', image: '', stock: 10, isActive: true, origin: 'Borneo, Malaysia', badge: '', difficulty: 'Intermediate', scientificName: '' };

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useAdminStore();
  const { toasts, show, remove } = useToast();
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setForm(EMPTY_PRODUCT); setModal('add'); };
  const openEdit = (p: Product) => { const { id, ...rest } = p; setEditId(id); setForm(rest); setModal('edit'); };
  const close = () => { setModal(null); setEditId(null); };
  const f = (k: keyof Omit<Product, 'id'>, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { show('Product name required', 'error'); return; }
    if (modal === 'add') { addProduct({ ...form, id: Math.max(0, ...products.map((p) => p.id)) + 1, slug: slugify(form.name) }); show('Product added!'); }
    else if (editId !== null) { updateProduct({ ...form, id: editId, slug: form.slug || slugify(form.name) }); show('Product updated!'); }
    close();
  };

  return (
    <div>
      <PageHeader title="Products" sub="Manage Specimens" action={
        <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 18px', fontSize: '12px', whiteSpace: 'nowrap' }}>+ Add Product</button>
      } />

      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field" style={{ fontSize: '14px' }} />
      </div>

      {/* CARD LIST — works on mobile & desktop */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px' }}>
            {/* Top row: image + info */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '6px', background: 'var(--bg)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '\ud83d\udc1c'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                {p.scientificName && <div style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{p.scientificName}</div>}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>{formatUSD(p.price)}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: p.stock <= 3 ? '#ef4444' : 'var(--muted)' }}>Stock: {p.stock}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', padding: '2px 8px', borderRadius: '2px', background: p.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', color: p.isActive ? '#4ade80' : '#ef4444', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.isActive ? 'Active' : 'Off'}</span>
                  {p.badge && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', padding: '2px 8px', borderRadius: '2px', background: 'rgba(255,107,26,0.15)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.badge}</span>}
                </div>
              </div>
            </div>

            {/* Bottom row: action buttons — ALWAYS VISIBLE */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button
                onClick={() => openEdit(p)}
                style={{ flex: 1, padding: '10px', background: 'var(--bg)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '1px', fontWeight: 700 }}
              >
                \u270f\ufe0f EDIT
              </button>
              {delConfirm === p.id ? (
                <>
                  <button onClick={() => { deleteProduct(p.id); setDelConfirm(null); show('Deleted', 'info'); }} style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700 }}>CONFIRM DELETE</button>
                  <button onClick={() => setDelConfirm(null)} style={{ padding: '10px 14px', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                </>
              ) : (
                <button
                  onClick={() => setDelConfirm(p.id)}
                  style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '1px', fontWeight: 700 }}
                >
                  \ud83d\uddd1\ufe0f DELETE
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>No products found</div>}
      </div>

      {/* MODAL */}
      {modal && (
        <Modal onClose={close} title={modal === 'add' ? 'Add Product' : 'Edit Product'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Name *"><input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="e.g. Camponotus saundersi Queen" /></Field>
            <Field label="Scientific Name"><input className="input-field" value={form.scientificName ?? ''} onChange={(e) => f('scientificName', e.target.value)} placeholder="e.g. Camponotus saundersi" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Price (USD)"><input type="number" className="input-field" value={form.price} onChange={(e) => f('price', parseFloat(e.target.value) || 0)} /></Field>
              <Field label="Stock"><input type="number" className="input-field" value={form.stock} onChange={(e) => f('stock', parseInt(e.target.value) || 0)} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Category">
                <select className="select-field" value={form.categorySlug} onChange={(e) => { const cat = categories.find((c) => c.slug === e.target.value); f('categorySlug', e.target.value); if (cat) f('category', cat.name); }}>
                  {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Difficulty">
                <select className="select-field" value={form.difficulty ?? 'Intermediate'} onChange={(e) => f('difficulty', e.target.value as Product['difficulty'])}>
                  <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                </select>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Badge"><input className="input-field" value={form.badge ?? ''} onChange={(e) => f('badge', e.target.value)} placeholder="Rare, New, Limited..." /></Field>
              <Field label="Origin"><input className="input-field" value={form.origin} onChange={(e) => f('origin', e.target.value)} placeholder="Borneo, Malaysia" /></Field>
            </div>
            <Field label="Short Description"><input className="input-field" value={form.shortDesc} onChange={(e) => f('shortDesc', e.target.value)} placeholder="One-line summary for shop grid" /></Field>
            <Field label="Full Description"><textarea className="input-field" value={form.description} onChange={(e) => f('description', e.target.value)} rows={3} placeholder="Detailed product description..." /></Field>
            <ImageUploader value={form.image} onChange={(url) => f('image', url)} onToast={show} label="Product Image" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)} id="active" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="active" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Active (visible in shop)</label>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button onClick={close} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '12px' }}>Save Product</button>
            </div>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

// ===== ORDERS =====
export function AdminOrders() {
  const { orders, updateOrder } = useAdminStore();
  const { toasts, show, remove } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const order = orders.find((o) => o.id === selected);
  const STATUS_COLORS: Record<string, string> = { pending: '#facc15', confirmed: '#60a5fa', shipped: '#a78bfa', delivered: '#4ade80', cancelled: '#ef4444' };

  const updateStatus = (id: string, status: string, trackingNumber?: string) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    updateOrder({ ...o, status: status as typeof o.status, trackingNumber: trackingNumber ?? o.trackingNumber, updatedAt: new Date().toISOString() });
    show(`Status: ${status}`);
  };

  return (
    <div>
      <PageHeader title="Orders" sub="Customer Orders" />
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>No orders yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map((o) => (
            <div key={o.id} style={{ background: 'var(--bg3)', border: `1px solid ${selected === o.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', overflow: 'hidden' }}>
              {/* Order summary row */}
              <div onClick={() => setSelected(selected === o.id ? null : o.id)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', marginBottom: '2px' }}>{o.orderNumber}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.buyerName} &middot; {o.buyerCountry}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(o.totalAmount)}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', padding: '3px 8px', borderRadius: '2px', background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status], textTransform: 'uppercase', letterSpacing: '1px' }}>{o.status}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '16px' }}>{selected === o.id ? '\u25b2' : '\u25bc'}</span>
                </div>
              </div>

              {/* Expanded detail */}
              {selected === o.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>
                  {[['Buyer', o.buyerName], ['Email', o.buyerEmail], ['Country', o.buyerCountry], ['Address', o.buyerAddress], ['Payment', o.paymentMethod]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', minWidth: '70px', paddingTop: '2px', flexShrink: 0 }}>{k}</span>
                      <span style={{ wordBreak: 'break-all' }}>{v}</span>
                    </div>
                  ))}
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
                  {o.items.map(({ product, quantity }) => (
                    <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--muted)', flex: 1, paddingRight: '8px' }}>{product.name} x{quantity}</span>
                      <span style={{ flexShrink: 0 }}>{formatUSD(product.price * quantity)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)', fontFamily: 'Space Mono, monospace' }}>{formatUSD(o.totalAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {o.status === 'pending' && <button onClick={() => updateStatus(o.id, 'confirmed')} className="btn-primary" style={{ fontSize: '12px', padding: '12px' }}>\u2705 Confirm Payment</button>}
                    {o.status === 'confirmed' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input className="input-field" placeholder="Tracking number" id={`track-${o.id}`} style={{ flex: 1, fontSize: '12px', padding: '10px' }} />
                        <button onClick={() => { const t = (document.getElementById(`track-${o.id}`) as HTMLInputElement)?.value; updateStatus(o.id, 'shipped', t); }} className="btn-primary" style={{ fontSize: '12px', padding: '10px 16px', flexShrink: 0 }}>\ud83d\udce6 Ship</button>
                      </div>
                    )}
                    {o.status === 'shipped' && <button onClick={() => updateStatus(o.id, 'delivered')} className="btn-primary" style={{ fontSize: '12px', padding: '12px' }}>\ud83d\udce9 Mark Delivered</button>}
                    {o.status !== 'cancelled' && <button onClick={() => updateStatus(o.id, 'cancelled')} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: '4px', padding: '10px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Space Mono, monospace' }}>Cancel Order</button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

// ===== BLOG =====
const EMPTY_POST: Omit<BlogPost, 'id'> = { title: '', slug: '', excerpt: '', content: '', image: '', author: 'Borneo Endemic Ant', isPublished: false, publishedAt: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), tags: [] };

export function AdminBlog() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAdminStore();
  const { toasts, show, remove } = useToast();
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [form, setForm] = useState<Omit<BlogPost, 'id'>>(EMPTY_POST);
  const [editId, setEditId] = useState<number | null>(null);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const openAdd = () => { setForm(EMPTY_POST); setModal('add'); };
  const openEdit = (p: BlogPost) => { const { id, ...rest } = p; setEditId(id); setForm(rest); setModal('edit'); };
  const close = () => { setModal(null); setEditId(null); };
  const f = (k: keyof Omit<BlogPost, 'id'>, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));
  const insertText = (prefix: string) => { const ta = textRef.current; if (!ta) return; const start = ta.selectionStart; f('content', form.content.slice(0, start) + prefix + form.content.slice(ta.selectionEnd)); };

  const handleSave = () => {
    if (!form.title.trim()) { show('Title required', 'error'); return; }
    if (modal === 'add') { addBlogPost({ ...form, id: Math.max(0, ...blogPosts.map((p) => p.id)) + 1, slug: slugify(form.title) }); show('Post created!'); }
    else if (editId !== null) { updateBlogPost({ ...form, id: editId, slug: form.slug || slugify(form.title) }); show('Post updated!'); }
    close();
  };

  return (
    <div>
      <PageHeader title="Blog" sub="Journal Articles" action={
        <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 18px', fontSize: '12px', whiteSpace: 'nowrap' }}>+ New Article</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {blogPosts.map((post) => (
          <div key={post.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '4px', lineHeight: 1.4 }}>{post.title}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{post.publishedAt} &middot; <span style={{ color: post.isPublished ? '#4ade80' : '#facc15' }}>{post.isPublished ? 'Published' : 'Draft'}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button onClick={() => openEdit(post)} style={{ flex: 1, padding: '10px', background: 'var(--bg)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700 }}>\u270f\ufe0f EDIT</button>
              {delConfirm === post.id ? (
                <>
                  <button onClick={() => { deleteBlogPost(post.id); setDelConfirm(null); show('Deleted', 'info'); }} style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700 }}>CONFIRM</button>
                  <button onClick={() => setDelConfirm(null)} style={{ padding: '10px 14px', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setDelConfirm(post.id)} style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700 }}>\ud83d\uddd1\ufe0f DELETE</button>
              )}
            </div>
          </div>
        ))}
        {blogPosts.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontFamily: 'Space Mono, monospace' }}>No posts yet</div>}
      </div>

      {modal && (
        <Modal onClose={close} title={modal === 'add' ? 'New Article' : 'Edit Article'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Title *"><input className="input-field" value={form.title} onChange={(e) => f('title', e.target.value)} /></Field>
            <Field label="Excerpt"><input className="input-field" value={form.excerpt} onChange={(e) => f('excerpt', e.target.value)} placeholder="Short summary..." /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Author"><input className="input-field" value={form.author} onChange={(e) => f('author', e.target.value)} /></Field>
              <Field label="Date"><input type="date" className="input-field" value={form.publishedAt} onChange={(e) => f('publishedAt', e.target.value)} /></Field>
            </div>
            <Field label="Tags"><input className="input-field" value={form.tags.join(', ')} onChange={(e) => f('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="ants, care, shipping" /></Field>
            <ImageUploader value={form.image} onChange={(url) => f('image', url)} onToast={show} label="Cover Image" />
            <Field label="Content">
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[['H2', '## '], ['H3', '### '], ['Bold', '**bold**'], ['List', '\n- Item']].map(([lbl, prefix]) => (
                  <button key={lbl} type="button" onClick={() => insertText(prefix)} style={{ padding: '5px 10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '10px' }}>{lbl}</button>
                ))}
              </div>
              <textarea ref={textRef} className="input-field" value={form.content} onChange={(e) => f('content', e.target.value)} rows={8} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px' }} />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => f('isPublished', e.target.checked)} id="pub" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="pub" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Published</label>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={close} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '12px' }}>Save</button>
            </div>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

// ===== CATEGORIES =====
const EMOJIS = ['\ud83d\udc1c', '\ud83e\udd97', '\ud83e\udd8e', '\ud83e\udd8b', '\ud83d\udc1b', '\ud83e\udd9f', '\ud83d\udc1d', '\ud83e\uddea', '\ud83c\udf31', '\ud83c\udf3f', '\u26a1', '\ud83d\udd25'];

export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const { toasts, show, remove } = useToast();
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '\ud83d\udc1c' });
  const [editId, setEditId] = useState<number | null>(null);

  const openAdd = () => { setForm({ name: '', slug: '', description: '', icon: '\ud83d\udc1c' }); setModal('add'); };
  const openEdit = (c: Category) => { const { id, ...rest } = c; setEditId(id); setForm(rest); setModal('edit'); };
  const close = () => { setModal(null); setEditId(null); };
  const f = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { show('Name required', 'error'); return; }
    if (modal === 'add') { addCategory({ ...form, id: Math.max(0, ...categories.map((c) => c.id)) + 1, slug: slugify(form.name) }); show('Category added!'); }
    else if (editId !== null) { updateCategory({ ...form, id: editId, slug: form.slug || slugify(form.name) }); show('Category updated!'); }
    close();
  };

  return (
    <div>
      <PageHeader title="Categories" sub="Manage Categories" action={
        <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 18px', fontSize: '12px', whiteSpace: 'nowrap' }}>+ Add</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map((c) => (
          <div key={c.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px', flexShrink: 0 }}>{c.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '2px' }}>{c.name}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{c.slug}</div>
                {c.description && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{c.description}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button onClick={() => openEdit(c)} style={{ flex: 1, padding: '10px', background: 'var(--bg)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700 }}>\u270f\ufe0f EDIT</button>
              <button onClick={() => { deleteCategory(c.id); show('Deleted', 'info'); }} style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700 }}>\ud83d\uddd1\ufe0f DELETE</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal onClose={close} title={modal === 'add' ? 'Add Category' : 'Edit Category'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Name *"><input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} /></Field>
            <Field label="Description"><input className="input-field" value={form.description} onChange={(e) => f('description', e.target.value)} /></Field>
            <Field label="Icon">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {EMOJIS.map((e) => (<button key={e} type="button" onClick={() => f('icon', e)} style={{ width: '44px', height: '44px', fontSize: '22px', background: form.icon === e ? 'rgba(255,107,26,0.2)' : 'var(--bg)', border: `1px solid ${form.icon === e ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>{e}</button>))}
              </div>
            </Field>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={close} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '12px' }}>Save</button>
            </div>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

// ===== SETTINGS =====
export function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();
  const { toasts, show, remove } = useToast();
  const [form, setForm] = useState<StoreSettings>(settings);
  const f = (k: keyof StoreSettings, v: string | boolean) => setForm((prev) => ({ ...prev, [k]: v }));
  const handleSave = () => { updateSettings(form); show('Settings saved!'); };

  return (
    <div>
      <PageHeader title="Settings" sub="Store Configuration" action={
        <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 18px', fontSize: '12px', whiteSpace: 'nowrap' }}>Save</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        {[
          { title: 'Store Info', fields: [{ k: 'storeName', l: 'Store Name' }, { k: 'storeEmail', l: 'Email' }, { k: 'whatsapp', l: 'WhatsApp Number' }] as { k: keyof StoreSettings; l: string }[] },
          { title: 'PayPal', fields: [{ k: 'paypalEmail', l: 'PayPal Email' }] as { k: keyof StoreSettings; l: string }[] },
          { title: 'USDT Crypto', fields: [{ k: 'usdtAddress', l: 'Wallet Address (TRC20/ERC20)' }, { k: 'usdtNetwork', l: 'Network' }] as { k: keyof StoreSettings; l: string }[] },
          { title: 'Western Union', fields: [{ k: 'westernUnionName', l: 'Recipient Name' }, { k: 'westernUnionCountry', l: 'Country' }] as { k: keyof StoreSettings; l: string }[] },
          { title: 'Social Media', fields: [{ k: 'instagram', l: 'Instagram' }, { k: 'facebook', l: 'Facebook' }, { k: 'tiktok', l: 'TikTok' }, { k: 'youtube', l: 'YouTube' }] as { k: keyof StoreSettings; l: string }[] },
        ].map((section) => (
          <div key={section.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>{section.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.fields.map(({ k, l }) => (
                <Field key={k} label={l}><input className="input-field" value={String(form[k])} onChange={(e) => f(k, e.target.value)} /></Field>
              ))}
            </div>
          </div>
        ))}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Shipping</h3>
          <Field label="Shipping Note"><textarea className="input-field" value={form.shippingNote} onChange={(e) => f('shippingNote', e.target.value)} rows={3} /></Field>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <input type="checkbox" checked={form.liveArrivalGuarantee} onChange={(e) => f('liveArrivalGuarantee', e.target.checked)} id="lag" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="lag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Live Arrival Guarantee</label>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ width: '100%', padding: '14px' }}>Save All Settings</button>
      </div>
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}
