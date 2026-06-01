import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminDashboard } from './AdminPages';
import { AdminProducts } from './AdminPages';
import { AdminOrders } from './AdminPages';
import { AdminBlog } from './AdminPages';
import { AdminCategories } from './AdminPages';
import { AdminSettings } from './AdminPages';

const ADMIN_KEY = 'bea_admin_auth';
const ADMIN_PASS = 'BorneoBea2024!';

function useAdminAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const login = (pass: string) => {
    if (pass === ADMIN_PASS) { sessionStorage.setItem(ADMIN_KEY, 'true'); setAuthed(true); return true; }
    return false;
  };
  const logout = () => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); };
  return { authed, login, logout };
}

const NAV_ITEMS = [
  { path: '', label: 'Dashboard', icon: '📊' },
  { path: 'products', label: 'Products', icon: '🐜' },
  { path: 'orders', label: 'Orders', icon: '📦' },
  { path: 'blog', label: 'Blog', icon: '📝' },
  { path: 'categories', label: 'Categories', icon: '🏷️' },
  { path: 'settings', label: 'Settings', icon: '⚙️' },
];

export function AdminLayout() {
  const { authed, login, logout } = useAdminAuth();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🐜</div>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', marginBottom: '8px', color: 'var(--primary)' }}>Admin Access</h2>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', marginBottom: '32px', letterSpacing: '2px' }}>BORNEO ENDEMIC ANT</p>
        <input
          type="password"
          placeholder="Enter admin password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (!login(pass) && setError('Incorrect password'))}
          className="input-field"
          style={{ marginBottom: '12px', textAlign: 'center' }}
        />
        {error && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#ef4444', marginBottom: '12px' }}>{error}</p>}
        <button
          onClick={() => { if (!login(pass)) setError('Incorrect password'); }}
          className="btn-primary"
          style={{ width: '100%' }}
        >Enter Admin</button>
      </div>
    </div>
  );

  const base = '/admin-bea2024x';
  const currentPath = location.pathname.replace(base, '').replace(/^\//, '') || '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', padding: '24px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>BEA Admin</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '4px' }}>Management Panel</div>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path === '' ? base : `${base}/${item.path}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 20px',
                fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 600,
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                textDecoration: 'none',
                background: isActive ? 'rgba(255,107,26,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          );
        })}
        <div style={{ padding: '20px', marginTop: 'auto', borderTop: '1px solid var(--border)', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: 'Space Mono, monospace', fontSize: '11px' }}>🔒 Logout</button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', paddingBottom: '80px' }}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/blog" element={<AdminBlog />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
}
