import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems);

  const links = [
    { to: '/shop', label: 'Shop' },
    { to: '/blog', label: 'Journal' },
    { to: '/about', label: 'About' },
    { to: '/shipping', label: 'Shipping' },
    { to: '/faq', label: 'FAQ' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(12,8,4,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      height: '68px',
    }}>
      <div className="page-container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
          }}>🐜</div>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 900,
            fontSize: '15px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--primary)',
          }}>Borneo<span style={{ color: 'var(--text)' }}>Endemic</span>Ant</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: isActive(l.to) ? 'var(--primary)' : 'var(--muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  borderBottom: isActive(l.to) ? '1px solid var(--primary)' : '1px solid transparent',
                  paddingBottom: '2px',
                }}>{ l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Cart */}
          <Link to="/cart" style={{
            position: 'relative',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            color: 'var(--text)',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: '2px',
            transition: 'border-color 0.2s',
          }}>
            🛒
            {totalItems() > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: '#000',
                fontSize: '10px',
                fontWeight: 700,
                width: '18px', height: '18px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{totalItems()}</span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '20px', padding: '4px' }}
            className="md:hidden"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg2)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
        }}>
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                fontFamily: 'Raleway, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: isActive(l.to) ? 'var(--primary)' : 'var(--muted)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}>{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
