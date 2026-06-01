import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

function renderContent(content: string): React.ReactNode[] {
  return content.split('\n').map((line, i) => {
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) return <img key={i} src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', borderRadius: '8px', margin: '16px 0', objectFit: 'cover', maxHeight: '400px' }} />;
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 700, margin: '32px 0 12px', color: 'var(--text)' }}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', fontWeight: 600, margin: '24px 0 8px' }}>{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', fontSize: '15px', color: 'var(--text)', lineHeight: 1.8 }}>{line.slice(2)}</li>;
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return <p key={i} style={{ fontSize: '15px', lineHeight: 1.9, marginBottom: '16px', color: 'var(--text)' }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--primary)' }}>{p}</strong> : p)}</p>;
    }
    if (line.trim()) return <p key={i} style={{ fontSize: '15px', lineHeight: 1.9, marginBottom: '16px', color: 'var(--muted)' }}>{line}</p>;
    return <br key={i} />;
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useAdminStore();
  const post = blogPosts.find((p) => p.slug === slug && p.isPublished);
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post?.title ?? '', url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!post) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '16px' }}>Article Not Found</h2>
      <Link to="/blog" className="btn-primary">Back to Journal</Link>
    </div>
  );

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`;

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container" style={{ maxWidth: '780px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
          <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link> /
          <Link to="/blog" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Journal</Link> /
          <span style={{ color: 'var(--primary)' }}>{post.title}</span>
        </div>

        {/* Share top */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button onClick={handleShare} className="btn-ghost" style={{ fontSize: '11px', padding: '8px 16px' }}>🔗 {copied ? 'Link Copied!' : 'Share'}</button>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '11px', padding: '8px 16px', textDecoration: 'none' }}>💬 WhatsApp</a>
        </div>

        {/* Cover */}
        {post.image && <img src={post.image} alt={post.title} style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px', marginBottom: '40px', border: '1px solid var(--border)' }} />}

        {/* Meta */}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {post.tags.map((t) => <span key={t} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--primary)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '2px', letterSpacing: '1px', textTransform: 'uppercase' }}>{t}</span>)}
          </div>
        )}

        <h1 className="section-title" style={{ fontSize: 'clamp(24px, 3vw, 40px)', marginBottom: '12px', lineHeight: 1.15 }}>{post.title}</h1>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', marginBottom: '40px', letterSpacing: '1px' }}>{post.author} · {post.publishedAt}</div>

        <hr className="divider" style={{ marginBottom: '40px' }} />

        {/* Content */}
        <article>{renderContent(post.content)}</article>

        <hr className="divider" style={{ margin: '48px 0 32px' }} />

        {/* Share bottom */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleShare} className="btn-ghost">🔗 {copied ? 'Link Copied!' : 'Share Article'}</button>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ghost" style={{ textDecoration: 'none' }}>💬 Share on WhatsApp</a>
          <Link to="/blog" className="btn-secondary" style={{ fontSize: '12px', padding: '8px 20px' }}>← Back to Journal</Link>
        </div>
      </div>
    </main>
  );
}

import React from 'react';
