import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAdminStore } from '../store/adminStore';
import { formatUSD, generateOrderNumber, generateId } from '../lib/utils';
import type { Order } from '../types';

const SHIPPING = [
  { id: 'dhl', name: 'DHL Express', time: '5-7 business days', price: 35 },
  { id: 'ems', name: 'EMS International', time: '7-14 business days', price: 25 },
];

const PAYMENT = [
  { id: 'paypal', name: 'PayPal', icon: '💳', desc: 'Safe & secure online payment' },
  { id: 'usdt', name: 'USDT Cryptocurrency', icon: '💎', desc: 'TRC20 or ERC20 network' },
  { id: 'western_union', name: 'Western Union', icon: '🏦', desc: 'Bank / money transfer' },
] as const;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { addOrder, settings } = useAdminStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', address: '', city: '', postal: '', notes: '' });
  const [shipping, setShipping] = useState(SHIPPING[0].id);
  const [payment, setPayment] = useState<'paypal' | 'usdt' | 'western_union'>('paypal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingCost = SHIPPING.find((s) => s.id === shipping)?.price ?? 35;
  const total = totalPrice() + shippingCost;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.country.trim()) e.country = 'Country is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const orderNumber = generateOrderNumber();
    const order: Order = {
      id: generateId(),
      orderNumber,
      items,
      buyerName: form.name,
      buyerEmail: form.email,
      buyerPhone: form.phone,
      buyerCountry: form.country,
      buyerAddress: form.address,
      buyerCity: form.city,
      buyerPostalCode: form.postal,
      shippingMethod: shipping,
      shippingCost,
      paymentMethod: payment,
      totalAmount: total,
      status: 'pending',
      notes: form.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    navigate(`/order-success/${order.id}`, { state: { order, settings } });
  };

  if (items.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '16px' }}>Cart is Empty</h2>
      <a href="/borneo-endemic-ant/shop" className="btn-primary">Browse Collection</a>
    </div>
  );

  const f = (field: string, val: string) => setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container">
        <div className="section-eyebrow">Secure Checkout</div>
        <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '48px' }}>Complete Your Order</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Shipping details */}
            <Section title="Shipping Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Full Name *" error={errors.name}><input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="John Smith" /></Field>
                <Field label="Email *" error={errors.email}><input className="input-field" value={form.email} onChange={(e) => f('email', e.target.value)} placeholder="john@email.com" /></Field>
                <Field label="WhatsApp / Phone"><input className="input-field" value={form.phone} onChange={(e) => f('phone', e.target.value)} placeholder="+1 234 567 890" /></Field>
                <Field label="Country *" error={errors.country}><input className="input-field" value={form.country} onChange={(e) => f('country', e.target.value)} placeholder="United States" /></Field>
              </div>
              <Field label="Full Address *" error={errors.address}><input className="input-field" value={form.address} onChange={(e) => f('address', e.target.value)} placeholder="123 Main Street, Apt 4" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="City *" error={errors.city}><input className="input-field" value={form.city} onChange={(e) => f('city', e.target.value)} placeholder="Los Angeles" /></Field>
                <Field label="Postal Code"><input className="input-field" value={form.postal} onChange={(e) => f('postal', e.target.value)} placeholder="90001" /></Field>
              </div>
            </Section>

            {/* Shipping method */}
            <Section title="Shipping Method">
              {SHIPPING.map((s) => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: shipping === s.id ? 'rgba(255,107,26,0.08)' : 'var(--bg)', border: `1px solid ${shipping === s.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '4px', cursor: 'pointer', marginBottom: '12px' }}>
                  <input type="radio" checked={shipping === s.id} onChange={() => setShipping(s.id)} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: '14px' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{s.time}</div>
                  </div>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(s.price)}</span>
                </label>
              ))}
            </Section>

            {/* Payment method */}
            <Section title="Payment Method">
              {PAYMENT.map((pm) => (
                <label key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: payment === pm.id ? 'rgba(255,107,26,0.08)' : 'var(--bg)', border: `1px solid ${payment === pm.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '4px', cursor: 'pointer', marginBottom: '12px' }}>
                  <input type="radio" checked={payment === pm.id} onChange={() => setPayment(pm.id)} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '24px' }}>{pm.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: '14px' }}>{pm.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{pm.desc}</div>
                  </div>
                </label>
              ))}
            </Section>

            {/* Notes */}
            <Section title="Order Notes (Optional)">
              <textarea className="input-field" value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Special requests, questions about import, etc." rows={3} />
            </Section>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px', position: 'sticky', top: '88px' }}>
            <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '20px' }}>Order Summary</h3>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--muted)' }}>{product.name} x{quantity}</span>
                <span>{formatUSD(product.price * quantity)}</span>
              </div>
            ))}
            <hr className="divider" style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--muted)' }}>
              <span>Subtotal</span><span style={{ color: 'var(--text)' }}>{formatUSD(totalPrice())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: 'var(--muted)' }}>
              <span>Shipping</span><span style={{ color: 'var(--text)' }}>{formatUSD(shippingCost)}</span>
            </div>
            <hr className="divider" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span className="section-title" style={{ fontSize: '16px' }}>Total</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(total)}</span>
            </div>
            <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', fontSize: '13px' }}>Place Order</button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)', marginTop: '12px', fontFamily: 'Space Mono, monospace', lineHeight: 1.6 }}>By placing this order you agree to our shipping & payment terms.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
      <h3 className="section-title" style={{ fontSize: '16px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</label>
      {children}
      {error && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
  );
}
