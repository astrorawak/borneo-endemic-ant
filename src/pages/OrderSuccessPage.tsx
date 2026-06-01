import { useParams, useLocation, Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { formatUSD } from '../lib/utils';
import type { Order } from '../types';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const { settings } = useAdminStore();
  const order = state?.order as Order | undefined;

  const waPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const waIntl = waPhone.startsWith('0') ? '62' + waPhone.slice(1) : waPhone;

  const paymentInstructions = () => {
    if (!order) return null;
    if (order.paymentMethod === 'paypal') return (
      <div style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid var(--primary)', borderRadius: '4px', padding: '20px', marginBottom: '24px' }}>
        <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', marginBottom: '12px' }}>💳 PayPal Payment Instructions</h4>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '8px' }}>Send <strong style={{ color: 'var(--primary)' }}>{formatUSD(order.totalAmount)}</strong> to:</p>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '15px', color: 'var(--text)', background: 'var(--bg)', padding: '12px 16px', borderRadius: '4px', marginBottom: '12px' }}>{settings.paypalEmail}</div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8 }}>In the PayPal note, include your order number: <strong>{order.orderNumber}</strong>. After sending payment, contact us on WhatsApp with your PayPal transaction ID.</p>
      </div>
    );
    if (order.paymentMethod === 'usdt') return (
      <div style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid var(--primary)', borderRadius: '4px', padding: '20px', marginBottom: '24px' }}>
        <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', marginBottom: '12px' }}>💎 USDT Payment Instructions</h4>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '8px' }}>Send exactly <strong style={{ color: 'var(--primary)' }}>{formatUSD(order.totalAmount)}</strong> USDT to:</p>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text)', background: 'var(--bg)', padding: '12px 16px', borderRadius: '4px', wordBreak: 'break-all', marginBottom: '8px' }}>{settings.usdtAddress}</div>
        <p style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '12px' }}>Network: {settings.usdtNetwork}</p>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8 }}>After sending, contact us on WhatsApp with your transaction hash and order number: <strong>{order.orderNumber}</strong></p>
      </div>
    );
    return (
      <div style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid var(--primary)', borderRadius: '4px', padding: '20px', marginBottom: '24px' }}>
        <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '15px', marginBottom: '12px' }}>🏦 Western Union Payment Instructions</h4>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '12px' }}>Send <strong style={{ color: 'var(--primary)' }}>{formatUSD(order.totalAmount)}</strong> via Western Union to:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {[['Recipient Name', settings.westernUnionName], ['Country', settings.westernUnionCountry]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', minWidth: '140px' }}>{k}:</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8 }}>After sending, contact us on WhatsApp with your MTCN number and order number: <strong>{order.orderNumber}</strong></p>
      </div>
    );
  };

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container" style={{ maxWidth: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Order Received</div>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '12px' }}>Thank You!</h1>
          {order && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: 'var(--muted)' }}>Order #{order.orderNumber}</div>}
        </div>

        {paymentInstructions()}

        {order && (
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
            <h4 className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Order Items</h4>
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                <span style={{ color: 'var(--muted)' }}>{product.name} x{quantity}</span>
                <span>{formatUSD(product.price * quantity)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', fontSize: '14px', color: 'var(--muted)' }}>
              <span>Shipping ({order.shippingMethod})</span>
              <span>{formatUSD(order.shippingCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
              <span className="section-title" style={{ fontSize: '15px' }}>Total</span>
              <span style={{ color: 'var(--primary)', fontSize: '18px' }}>{formatUSD(order.totalAmount)}</span>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <a href={`https://api.whatsapp.com/send?phone=${waIntl}&text=${encodeURIComponent(`Hello! I just placed order #${order?.orderNumber ?? ''} on Borneo Endemic Ant. Total: ${order ? formatUSD(order.totalAmount) : ''}. Payment method: ${order?.paymentMethod ?? ''}.`)}`}
            target="_blank" rel="noreferrer" className="btn-primary" style={{ marginRight: '16px', display: 'inline-block' }}>
            💬 Contact via WhatsApp
          </a>
          <Link to="/shop" className="btn-secondary" style={{ display: 'inline-block' }}>Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
