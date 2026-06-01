import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminDashboard, AdminProducts, AdminOrders, AdminBlog, AdminCategories, AdminSettings } from './AdminPages';

const ADMIN_KEY = 'bea_admin_auth';
const ADMIN_PASS = 'BorneoBea2024!';

function useAdminAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const login = (pass: string) => { if (pass === ADMIN_PASS) { sessionStorage.setItem(ADMIN_KEY, 'true'); setAuthed(true); return true; } return false; };
  const logout = () => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); };
  return { authed, login, logout };
}

const NAV = [
  { path: '', label: 'Dashboard', icon: '\ud83d\udcca' },
  { path: 'products', label: 'Products', icon: '\ud83d\udc1c' },
  { path: 'orders', label: 'Orders', icon: '\ud83d\udce6' },
  { path: 'blog', label: 'Blog', icon: '\ud83d\udcdd' },
  { path: 'categories', label: 'Categories', icon: '\ud83c\udff7\ufe0f' },
  { path: 'settings', label: 'Settings', icon: '\u2699\ufe0f' },
];

export function AdminLayout() {
  const { authed, login, logout } = useAdminAuth();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>\ud83d\udc1c</div>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', marginBottom: '32px', color: 'var(--primary)' }}>Admin Access</h2>
        <input type="password" placeholder="Admin password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { if (!login(pass)) setError('Incorrect password'); } }} className="input-field" style={{ marginBottom: '12px', textAlign: 'center' }} />
        {error && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#ef4444', marginBottom: '12px' }}>{error}</p>}
        <button onClick={() => { if (!login(pass)) setError('Incorrect password'); }} className="btn-primary" style={{ width: '100%' }}>Enter Admin</button>
      </div>
    </div>
  );

  const base = '/admin-bea2024x';
  const currentPath = location.pathname.replace(base, '').replace(/^\//, '') || '';
  const currentLabel = NAV.find((n) => n.path === currentPath)?.label ?? 'Dashboard';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        .admin-layout { display: flex; }
        .admin-sidebar {
          width: 220px;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          flex-shrink: 0;
          position: fixed;
          top: 0;
          left: -260px;
          height: 100vh;
          overflow-y: auto;
          z-index: 80;
          transition: left 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar.open { left: 0; }
        .admin-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 70;
        }
        .admin-overlay.open { display: block; }
        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          height: 56px;
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 60;
        }
        .admin-main { flex: 1; padding: 20px 16px 80px; min-width: 0; overflow-x: hidden; }
        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          font-family: Raleway, sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border-left: 3px solid transparent;
          transition: all 0.15s;
          color: var(--muted);
        }
        .admin-nav-link.active { color: var(--primary); background: rgba(255,107,26,0.08); border-left-color: var(--primary); }
        .admin-nav-link:hover { color: var(--primary); background: rgba(255,107,26,0.04); }
        @media (min-width: 1024px) {
          .admin-sidebar { position: sticky; left: 0 !important; top: 0; height: 100vh; }
          .admin-sidebar-close { display: none !important; }
          .admin-topbar-menu { display: none !important; }
          .admin-overlay { display: none !important; }
          .admin-main { padding: 32px 32px 80px; }
        }
      `}</style>

      {/* TOP BAR - mobile */}
      <div className="admin-topbar">
        <button className="admin-topbar-menu" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '24px', padding: '4px 8px', lineHeight: 1 }}>&#9776;</button>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>{currentLabel}</span>
        <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px', padding: '4px 8px' }}>&#128274;</button>
      </div>

      <div className="admin-layout">
        {/* OVERLAY */}
        <div className={`admin-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* SIDEBAR */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>\ud83d\udc1c BEA Admin</span>
            <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px', padding: '4px' }}>&#10005;</button>
          </div>

          <nav style={{ flex: 1, paddingTop: '8px' }}>
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path === '' ? base : `${base}/${item.path}`}
                onClick={() => setSidebarOpen(false)}
                className={`admin-nav-link${currentPath === item.path ? ' active' : ''}`}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '1px' }}>\ud83d\udd12 Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="admin-main">
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
    </div>
  );
}
