import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export default function Footer() {
  const { settings } = useAdminStore();

  const waMsg = encodeURIComponent('Hello, I have a question about Borneo Endemic Ant.');
  const waPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const waIntl = waPhone.startsWith('0') ? '62' + waPhone.slice(1) : waPhone;

  return (
    <footer style={{
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>
      <div className="page-container" style={{ padding: '64px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🐜</div>
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>Borneo Endemic Ant</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.8', marginBottom: '16px' }}>
              Live endemic ants, exotic insects &amp; rare reptiles from the rainforests of Borneo. Shipped worldwide with live-arrival guarantee.
            </p>
            <a href={`https://api.whatsapp.com/send?phone=${waIntl}&text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'Space Mono, monospace', fontSize: '11px',
                color: 'var(--primary)', textDecoration: 'none',
                border: '1px solid var(--primary)', padding: '8px 16px', borderRadius: '2px',
              }}>
              💬 WhatsApp Us
            </a>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '16px' }}>Collection</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[['Ants', '/shop?cat=ants'], ['Insects', '/shop?cat=insects'], ['Reptiles', '/shop?cat=reptiles'], ['All Species', '/shop']].map(([label, href]) => (
                <li key={label} style={{ marginBottom: '8px' }}>
                  <Link to={href} style={{ fontFamily: 'Raleway, sans-serif', fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '16px' }}>Information</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[['About Us', '/about'], ['Shipping & Packaging', '/shipping'], ['FAQ', '/faq'], ['Journal', '/blog']].map(([label, href]) => (
                <li key={label} style={{ marginBottom: '8px' }}>
                  <Link to={href} style={{ fontFamily: 'Raleway, sans-serif', fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '16px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href={`mailto:${settings.storeEmail}`} style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none' }}>✉️ {settings.storeEmail}</a>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)' }}>📍 Borneo, Malaysia</span>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {settings.instagram && <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', fontSize: '16px' }}>📸</a>}
                {settings.facebook && <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', fontSize: '16px' }}>👤</a>}
                {settings.tiktok && <a href={`https://tiktok.com/@${settings.tiktok}`} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', fontSize: '16px' }}>🎵</a>}
                {settings.youtube && <a href={`https://youtube.com/@${settings.youtube}`} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', fontSize: '16px' }}>▶️</a>}
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />
        <div style={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>
            © {new Date().getFullYear()} BORNEO ENDEMIC ANT — ALL RIGHTS RESERVED
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
            PayPal · USDT · Western Union
          </span>
        </div>
      </div>
    </footer>
  );
}
