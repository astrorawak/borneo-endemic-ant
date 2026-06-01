import { useState, useCallback, useRef } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { slugify, generateId, formatUSD } from '../../lib/utils';
import type { Product, Category, BlogPost, StoreSettings } from '../../types';

// ===== TOAST =====
type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; type: ToastType; message: string; }

function Toast({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div key={t.id} className="animate-toast" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', background: t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#374151', color: '#fff', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', maxWidth: '320px' }}>
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => onRemove(t.id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', opacity: 0.7 }}>×</button>
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

// ===== IMAGE UPLOADER =====
function ImageUploader({ value, onChange, onToast, label = 'Image' }: { value: string; onChange: (url: string) => void; onToast: (msg: string, type: ToastType) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { onToast('File must be an image (JPG, PNG, WebP)', 'error'); return; }
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
      <div onClick={() => !uploading && fileRef.current?.click()} style={{ border: `2px dashed ${value ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: uploading ? 'wait' : 'pointer', background: value ? 'rgba(255,107,26,0.05)' : 'var(--bg2)', transition: 'all 0.2s', overflow: 'hidden' }}>
        {value ? (
          <div style={{ position: 'relative' }}>
            <img src={value} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}><span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>🔄 Change Image</span></div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            {uploading ? <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--primary)' }}>⏳ Processing...</p> : <><div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)' }}>Click to upload · JPG, PNG, WebP · Max 3MB</p></>}
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value && <button type="button" onClick={() => onChange('')} style={{ marginTop: '6px', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️ Remove image</button>}
    </div>
  );
}

// ===== SHARED =====
function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
      <div>
        {sub && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--primary)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>{sub}</div>}
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '28px', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '640px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {[['Total Products', products.length, '🐜'], ['Active', activeProducts, '✅'], ['Pending Orders', pendingOrders, '📦'], ['Categories', categories.length, '🏷️'], ['Blog Posts', blogPosts.filter((p) => p.isPublished).length, '📝']].map(([label, val, icon]) => (
          <div key={label as string} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '24px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{val}</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>{label as string}</div>
          </div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', marginBottom: '16px', color: 'var(--primary)' }}>⚠️ Low Stock Alert</h3>
          {lowStock.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
              <span>{p.name}</span>
              <span style={{ fontFamily: 'Space Mono, monospace', color: p.stock === 0 ? '#ef4444' : 'var(--primary)', fontWeight: 700 }}>{p.stock} left</span>
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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(EMPTY_PRODUCT); setModal('add'); };
  const openEdit = (p: Product) => { const { id, ...rest } = p; setEditId(id); setForm(rest); setModal('edit'); };
  const close = () => { setModal(null); setEditId(null); };

  const f = (k: keyof Omit<Product, 'id'>, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { show('Product name is required', 'error'); return; }
    if (modal === 'add') {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      addProduct({ ...form, id: newId, slug: slugify(form.name) });
      show('Product added!', 'success');
    } else if (editId !== null) {
      updateProduct({ ...form, id: editId, slug: form.slug || slugify(form.name) });
      show('Product updated!', 'success');
    }
    close();
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    show('Product deleted', 'info');
  };

  return (
    <div>
      <PageHeader title="Products" sub="Manage Specimens" action={
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field" style={{ maxWidth: '200px', padding: '8px 12px', fontSize: '13px' }} />
          <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>+ Add Product</button>
        </div>
      } />

      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,107,26,0.04)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', marginBottom: '2px' }}>{p.name}</div>
                  {p.scientificName && <div style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--muted)' }}>{p.scientificName}</div>}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.category}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Space Mono, monospace', color: 'var(--primary)', fontWeight: 700 }}>{formatUSD(p.price)}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Space Mono, monospace', color: p.stock <= 3 ? '#ef4444' : 'var(--text)' }}>{p.stock}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '3px 8px', borderRadius: '2px', background: p.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', color: p.isActive ? '#4ade80' : '#ef4444' }}>{p.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(p)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }}>Edit</button>
                    {deleteConfirm === p.id ? (
                      <><button onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '6px 12px', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button></>
                    ) : (
                      <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '6px 12px', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>No products found</div>}
      </div>

      {modal && (
        <Modal onClose={close} title={modal === 'add' ? 'Add New Product' : 'Edit Product'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Product Name *">
                <input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Camponotus saundersi Queen" />
              </FormField>
              <FormField label="Scientific Name">
                <input className="input-field" value={form.scientificName ?? ''} onChange={(e) => f('scientificName', e.target.value)} placeholder="Camponotus saundersi" />
              </FormField>
              <FormField label="Price (USD) *">
                <input type="number" className="input-field" value={form.price} onChange={(e) => f('price', parseFloat(e.target.value) || 0)} />
              </FormField>
              <FormField label="Stock">
                <input type="number" className="input-field" value={form.stock} onChange={(e) => f('stock', parseInt(e.target.value) || 0)} />
              </FormField>
              <FormField label="Category">
                <select className="select-field" value={form.categorySlug} onChange={(e) => { const cat = categories.find((c) => c.slug === e.target.value); f('categorySlug', e.target.value); if (cat) f('category', cat.name); }}>
                  {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </FormField>
              <FormField label="Difficulty">
                <select className="select-field" value={form.difficulty ?? 'Intermediate'} onChange={(e) => f('difficulty', e.target.value as Product['difficulty'])}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </FormField>
              <FormField label="Badge (optional)">
                <input className="input-field" value={form.badge ?? ''} onChange={(e) => f('badge', e.target.value)} placeholder="Rare, New, Limited..." />
              </FormField>
              <FormField label="Origin">
                <input className="input-field" value={form.origin} onChange={(e) => f('origin', e.target.value)} placeholder="Borneo, Malaysia" />
              </FormField>
            </div>
            <FormField label="Short Description">
              <input className="input-field" value={form.shortDesc} onChange={(e) => f('shortDesc', e.target.value)} placeholder="One-line summary for shop grid" />
            </FormField>
            <FormField label="Full Description">
              <textarea className="input-field" value={form.description} onChange={(e) => f('description', e.target.value)} rows={4} placeholder="Detailed description..." />
            </FormField>
            <ImageUploader value={form.image} onChange={(url) => f('image', url)} onToast={show} label="Product Image" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)} id="active" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
              <label htmlFor="active" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Active (visible in shop)</label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <button onClick={close} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px', fontSize: '12px' }}>Save Product</button>
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
    show(`Order status updated to ${status}`, 'success');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '24px', alignItems: 'start' }}>
      <div>
        <PageHeader title="Orders" sub="Customer Orders" />
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontFamily: 'Space Mono, monospace' }}>No orders yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sorted.map((o) => (
              <div key={o.id} onClick={() => setSelected(selected === o.id ? null : o.id)}
                style={{ background: 'var(--bg3)', border: `1px solid ${selected === o.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', transition: 'border-color 0.2s' }}>
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '2px' }}>{o.orderNumber}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)' }}>{o.buyerName} · {o.buyerCountry} · {new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(o.totalAmount)}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '2px', background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status], textTransform: 'uppercase', letterSpacing: '1px' }}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {order && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', position: 'sticky', top: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px' }}>{order.orderNumber}</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
          {[['Buyer', order.buyerName], ['Email', order.buyerEmail], ['Phone', order.buyerPhone || '-'], ['Country', order.buyerCountry], ['Address', `${order.buyerAddress}, ${order.buyerCity} ${order.buyerPostalCode}`], ['Payment', order.paymentMethod.toUpperCase()], ['Shipping', order.shippingMethod]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', minWidth: '80px', paddingTop: '2px' }}>{k}</span>
              <span style={{ flex: 1, wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))}
          <hr className="divider" style={{ margin: '16px 0' }} />
          {order.items.map(({ product, quantity }) => (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--muted)' }}>{product.name} x{quantity}</span>
              <span>{formatUSD(product.price * quantity)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)', fontFamily: 'Space Mono, monospace' }}>{formatUSD(order.totalAmount)}</span>
          </div>
          <hr className="divider" style={{ margin: '16px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'confirmed')} className="btn-primary" style={{ fontSize: '12px', padding: '10px' }}>✅ Confirm Payment</button>}
            {order.status === 'confirmed' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="input-field" placeholder="Tracking number" id="tracking" style={{ flex: 1, fontSize: '12px', padding: '10px' }} />
                <button onClick={() => { const t = (document.getElementById('tracking') as HTMLInputElement)?.value; updateStatus(order.id, 'shipped', t); }} className="btn-primary" style={{ fontSize: '12px', padding: '10px 16px', flexShrink: 0 }}>📦 Ship</button>
              </div>
            )}
            {order.status === 'shipped' && <button onClick={() => updateStatus(order.id, 'delivered')} className="btn-primary" style={{ fontSize: '12px', padding: '10px' }}>📩 Mark Delivered</button>}
            {order.status !== 'cancelled' && <button onClick={() => updateStatus(order.id, 'cancelled')} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '2px', padding: '8px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Space Mono, monospace' }}>Cancel Order</button>}
          </div>
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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const openAdd = () => { setForm(EMPTY_POST); setModal('add'); };
  const openEdit = (p: BlogPost) => { const { id, ...rest } = p; setEditId(id); setForm(rest); setModal('edit'); };
  const close = () => { setModal(null); setEditId(null); };
  const f = (k: keyof Omit<BlogPost, 'id'>, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  const insertText = (prefix: string) => {
    const ta = textRef.current;
    if (!ta) return;
    const start = ta.selectionStart; const end = ta.selectionEnd;
    const before = form.content.slice(0, start); const after = form.content.slice(end);
    f('content', before + prefix + form.content.slice(start, end) + after);
  };

  const handleSave = () => {
    if (!form.title.trim()) { show('Title required', 'error'); return; }
    if (modal === 'add') {
      const newId = Math.max(0, ...blogPosts.map((p) => p.id)) + 1;
      addBlogPost({ ...form, id: newId, slug: slugify(form.title) });
      show('Post created!', 'success');
    } else if (editId !== null) {
      updateBlogPost({ ...form, id: editId, slug: form.slug || slugify(form.title) });
      show('Post updated!', 'success');
    }
    close();
  };

  return (
    <div>
      <PageHeader title="Blog" sub="Journal Articles" action={
        <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>+ New Article</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {blogPosts.map((post) => (
          <div key={post.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', marginBottom: '4px' }}>{post.title}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{post.author} · {post.publishedAt} · <span style={{ color: post.isPublished ? '#4ade80' : '#facc15' }}>{post.isPublished ? 'Published' : 'Draft'}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => openEdit(post)} className="btn-ghost" style={{ padding: '7px 14px', fontSize: '11px' }}>Edit</button>
              {deleteConfirm === post.id ? (
                <><button onClick={() => { deleteBlogPost(post.id); setDeleteConfirm(null); show('Post deleted', 'info'); }} style={{ padding: '7px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Confirm</button>
                <button onClick={() => setDeleteConfirm(null)} style={{ padding: '7px 14px', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button></>
              ) : (
                <button onClick={() => setDeleteConfirm(post.id)} style={{ padding: '7px 14px', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
              )}
            </div>
          </div>
        ))}
        {blogPosts.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontFamily: 'Space Mono, monospace' }}>No posts yet</div>}
      </div>

      {modal && (
        <Modal onClose={close} title={modal === 'add' ? 'New Article' : 'Edit Article'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Title *"><input className="input-field" value={form.title} onChange={(e) => f('title', e.target.value)} /></FormField>
            <FormField label="Excerpt"><input className="input-field" value={form.excerpt} onChange={(e) => f('excerpt', e.target.value)} placeholder="Short summary..." /></FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Author"><input className="input-field" value={form.author} onChange={(e) => f('author', e.target.value)} /></FormField>
              <FormField label="Date"><input type="date" className="input-field" value={form.publishedAt} onChange={(e) => f('publishedAt', e.target.value)} /></FormField>
            </div>
            <FormField label="Tags (comma-separated)">
              <input className="input-field" value={form.tags.join(', ')} onChange={(e) => f('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="ants, care, shipping" />
            </FormField>
            <ImageUploader value={form.image} onChange={(url) => f('image', url)} onToast={show} label="Cover Image" />
            <FormField label="Content (Markdown)">
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[['H2', '## '], ['H3', '### '], ['Bold', '**bold**'], ['List', '\n- Item 1\n- Item 2']].map(([label, prefix]) => (
                  <button key={label} type="button" onClick={() => insertText(prefix)} style={{ padding: '4px 10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '10px' }}>{label}</button>
                ))}
              </div>
              <textarea ref={textRef} className="input-field" value={form.content} onChange={(e) => f('content', e.target.value)} rows={10} style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px' }} />
            </FormField>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => f('isPublished', e.target.checked)} id="published" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
              <label htmlFor="published" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Published</label>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={close} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px', fontSize: '12px' }}>Save</button>
            </div>
          </div>
        </Modal>
      )}
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

// ===== CATEGORIES =====
const EMOJI_OPTIONS = ['🐜', '🦗', '🦎', '🦋', '🐛', '🦟', '🐝', '🧪', '🌱', '🌿', '⚡', '🔥'];

export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const { toasts, show, remove } = useToast();
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '🐜' });
  const [editId, setEditId] = useState<number | null>(null);

  const openAdd = () => { setForm({ name: '', slug: '', description: '', icon: '🐜' }); setModal('add'); };
  const openEdit = (c: Category) => { const { id, ...rest } = c; setEditId(id); setForm(rest); setModal('edit'); };
  const close = () => { setModal(null); setEditId(null); };
  const f = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { show('Category name required', 'error'); return; }
    if (modal === 'add') {
      const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
      addCategory({ ...form, id: newId, slug: slugify(form.name) });
      show('Category added!', 'success');
    } else if (editId !== null) {
      updateCategory({ ...form, id: editId, slug: form.slug || slugify(form.name) });
      show('Category updated!', 'success');
    }
    close();
  };

  return (
    <div>
      <PageHeader title="Categories" sub="Manage Categories" action={
        <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>+ Add Category</button>
      } />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {categories.map((c) => (
          <div key={c.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '32px' }}>{c.icon}</span>
              <div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '15px' }}>{c.name}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)' }}>{c.slug}</div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{c.description}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => openEdit(c)} className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: '11px' }}>Edit</button>
              <button onClick={() => { deleteCategory(c.id); show('Category deleted', 'info'); }} style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal onClose={close} title={modal === 'add' ? 'Add Category' : 'Edit Category'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Name *"><input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} /></FormField>
            <FormField label="Description"><input className="input-field" value={form.description} onChange={(e) => f('description', e.target.value)} /></FormField>
            <FormField label="Icon">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {EMOJI_OPTIONS.map((e) => (
                  <button key={e} type="button" onClick={() => f('icon', e)} style={{ width: '40px', height: '40px', fontSize: '20px', background: form.icon === e ? 'rgba(255,107,26,0.2)' : 'var(--bg)', border: `1px solid ${form.icon === e ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>{e}</button>
                ))}
              </div>
            </FormField>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={close} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '12px' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px', fontSize: '12px' }}>Save</button>
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

  const handleSave = () => { updateSettings(form); show('Settings saved!', 'success'); };

  return (
    <div>
      <PageHeader title="Settings" sub="Store Configuration" action={
        <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px', fontSize: '12px' }}>Save Settings</button>
      } />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '680px' }}>
        {[{
          title: 'Store Info',
          fields: [{ k: 'storeName', l: 'Store Name' }, { k: 'storeEmail', l: 'Contact Email' }, { k: 'whatsapp', l: 'WhatsApp Number' }] as { k: keyof StoreSettings; l: string }[],
        }, {
          title: 'PayPal',
          fields: [{ k: 'paypalEmail', l: 'PayPal Email' }] as { k: keyof StoreSettings; l: string }[],
        }, {
          title: 'USDT Cryptocurrency',
          fields: [{ k: 'usdtAddress', l: 'Wallet Address (TRC20 / ERC20)' }, { k: 'usdtNetwork', l: 'Network (e.g. TRC20)' }] as { k: keyof StoreSettings; l: string }[],
        }, {
          title: 'Western Union',
          fields: [{ k: 'westernUnionName', l: 'Recipient Name' }, { k: 'westernUnionCountry', l: 'Recipient Country' }] as { k: keyof StoreSettings; l: string }[],
        }, {
          title: 'Social Media',
          fields: [{ k: 'instagram', l: 'Instagram Username' }, { k: 'facebook', l: 'Facebook Page' }, { k: 'tiktok', l: 'TikTok Username' }, { k: 'youtube', l: 'YouTube Channel' }] as { k: keyof StoreSettings; l: string }[],
        }].map((section) => (
          <div key={section.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>{section.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {section.fields.map(({ k, l }) => (
                <FormField key={k} label={l}>
                  <input className="input-field" value={String(form[k])} onChange={(e) => f(k, e.target.value)} />
                </FormField>
              ))}
            </div>
          </div>
        ))}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Shipping</h3>
          <FormField label="Shipping Note">
            <textarea className="input-field" value={form.shippingNote} onChange={(e) => f('shippingNote', e.target.value)} rows={3} />
          </FormField>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <input type="checkbox" checked={form.liveArrivalGuarantee} onChange={(e) => f('liveArrivalGuarantee', e.target.checked)} id="lag" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
            <label htmlFor="lag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Live Arrival Guarantee</label>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '14px 40px' }}>Save All Settings</button>
      </div>
      <Toast toasts={toasts} onRemove={remove} />
    </div>
  );
}

const generateId_ = generateId;
void generateId_;
