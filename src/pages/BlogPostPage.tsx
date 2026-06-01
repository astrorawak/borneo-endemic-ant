import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

function renderContent(content: string): React.ReactNode[] {
  return content.split('\n').map((line, i) => {
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) return <img key={i} src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', borderRadius: '8px', margin: '16px 0' }} />;
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 700, margin: '32px 0 12px' }}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', fontWeight: 600, margin: '24px 0 8px' }}>{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', fontSize: '15px', lineHeight: 1.8 }}>{line.slice(2)}</li>;
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return <p key={i} style={{ fontSize: '15px', lineHeight: 1.9, marginBottom: '16px' }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--primary)' }}>{p}</strong> : p)}</p>;
    }
    if (line.trim()) return <p key={i} style={{ fontSize: '15px', lineHeight: 1.9, marginBottom: '16px', color: 'var(--muted)' }}>{line}</p>;
    return <br key={i} />;
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useAdminStore();
  const post = blogPosts.find((p) => p.slug === slug && p.isPublished);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { await navigator.share({ title: post?.title ?? '', url }); }
    else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (!post) return (<div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}><h2 className="section-title" style={{ fontSize: '24px', marginBottom: '16px' }}>Article Not Found</h2><Link to="/blog" className="btn-primary">Back to Journal</Link></div>);

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`;

  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '32px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
          <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link> / <Link to="/blog" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Journal</Link> / <span style={{ color: 'var(--primary)' }}>{post.title}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <button onClick={handleShare} className="btn-ghost">🔗 {copied ? 'Copied!' : 'Share'}</button>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ghost" style={{ textDecoration: 'none' }}>💬 WhatsApp</a>
        </div>
        {post.image && <img src={post.image} alt={post.title} style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px', marginBottom: '40px' }} />}
        <h1 className="section-title" style={{ fontSize: 'clamp(24px, 3vw, 40px)', marginBottom: '12px', lineHeight: 1.15 }}>{post.title}</h1>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--muted)', marginBottom: '40px' }}>{post.author} · {post.publishedAt}</div>
        <hr className="divider" style={{ marginBottom: '40px' }} />
        <article>{renderContent(post.content)}</article>
        <hr className="divider" style={{ margin: '48px 0 32px' }} />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={handleShare} className="btn-ghost">🔗 {copied ? 'Copied!' : 'Share Article'}</button>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-ghost" style={{ textDecoration: 'none' }}>💬 WhatsApp</a>
          <Link to="/blog" className="btn-secondary" style={{ fontSize: '12px', padding: '8px 20px' }}>← Back to Journal</Link>
        </div>
      </div>
    </main>
  );
}
