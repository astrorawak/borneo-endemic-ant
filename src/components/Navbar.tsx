import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/blog', label: 'Journal' },
  { to: '/about', label: 'About' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems);
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <style>{`
        .nav-desktop-links { display: none; }
        @media (min-width: 768px) { .nav-desktop-links { display: flex; } }
        .nav-hamburger { display: flex; }
        @media (min-width: 768px) { .nav-hamburger { display: none; } }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(12,8,4,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* MAIN BAR */}
        <div className="page-container" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* LOGO */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>&#128028;</div>
            <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
              Borneo<span style={{ color: 'var(--text)' }}>Endemic</span><span style={{ color: 'var(--primary)' }}>Ant</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <ul className="nav-desktop-links" style={{ gap: '20px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: isActive(l.to) ? 'var(--primary)' : 'var(--muted)', textDecoration: 'none' }}>{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* RIGHT: CART + HAMBURGER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link to="/cart" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text)', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '7px 14px', borderRadius: '2px', position: 'relative' }}>
              &#128722;
              {totalItems() > 0 && (
                <span style={{ background: 'var(--primary)', color: '#000', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{totalItems()}</span>
              )}
            </Link>
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '18px', padding: '6px 10px', borderRadius: '2px', lineHeight: 1 }}
              aria-label="Menu"
            >
              {menuOpen ? '\u2715' : '\u2630'}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '8px 0' }}>
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 24px',
                  fontFamily: 'Raleway, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: isActive(l.to) ? 'var(--primary)' : 'var(--muted)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
