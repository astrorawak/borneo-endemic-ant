import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export default function BlogPage() {
  const { blogPosts } = useAdminStore();
  const posts = blogPosts.filter((p) => p.isPublished);

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container">
        <div className="section-eyebrow">Knowledge & Care</div>
        <h1 className="section-title" style={{ fontSize: '40px', marginBottom: '16px' }}>The Journal</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '48px', fontSize: '14px' }}>Articles on ant keeping, exotic insects, Borneo biodiversity, and care guides.</p>

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📝</div>
            <p style={{ fontFamily: 'Space Mono, monospace' }}>No articles published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', overflow: 'hidden' }}>
                  <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--bg), var(--bg2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', borderBottom: '1px solid var(--border)' }}>
                    {post.image ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌿'}
                  </div>
                  <div style={{ padding: '20px' }}>
                    {post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {post.tags.map((t) => <span key={t} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '2px' }}>{t}</span>)}
                      </div>
                    )}
                    <h3 className="section-title" style={{ fontSize: '16px', marginBottom: '8px', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '16px' }}>{post.excerpt}</p>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>{post.author} · {post.publishedAt}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
