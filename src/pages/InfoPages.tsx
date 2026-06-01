import { useState } from 'react';
import { useAdminStore } from '../store/adminStore';

type InfoPage = 'about' | 'shipping' | 'faq';

const FAQS = [
  { q: 'Do you ship to my country?', a: 'We ship worldwide. It is your responsibility to check the import regulations for live insects/reptiles in your country before ordering. We provide CITES-compliant documentation where applicable.' },
  { q: 'How do you guarantee live arrival?', a: 'Every shipment is packed with climate-appropriate insulation and live feeders where needed. In case of DOA, send us a photo within 2 hours of delivery and we will arrange a replacement or refund.' },
  { q: 'What payment methods do you accept?', a: 'We accept PayPal (Friends & Family or Goods & Services), USDT cryptocurrency (TRC20/ERC20), and Western Union money transfer.' },
  { q: 'How long does shipping take?', a: 'DHL Express: 5-7 business days. EMS International: 7-14 business days. Shipping times may vary depending on your country and customs processing.' },
  { q: 'Can I track my order?', a: 'Yes! Once shipped, we will send you a tracking number via WhatsApp or email. You can track your parcel directly on the DHL or EMS website.' },
  { q: 'Are your specimens ethically sourced?', a: 'Absolutely. We work with licensed local collectors in Borneo and prioritize sustainable collection methods. Many of our ant species are bred in captivity.' },
  { q: 'I am a beginner. Which species should I start with?', a: 'We recommend Diacamma rugosum or Deroplatys dessicata for beginners. Check the difficulty level on each product page.' },
];

export function InfoPages({ page }: { page: InfoPage }) {
  const { settings } = useAdminStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (page === 'about') return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container" style={{ maxWidth: '780px' }}>
        <div className="section-eyebrow">Our Story</div>
        <h1 className="section-title" style={{ fontSize: '40px', marginBottom: '32px' }}>About Borneo Endemic Ant</h1>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)', padding: '32px', borderRadius: '4px', marginBottom: '40px' }}>
          <p style={{ fontSize: '16px', lineHeight: 2, color: 'var(--muted)', fontStyle: 'italic' }}>
            "From the ancient rainforests of Borneo, we bring the world's most extraordinary endemic species to dedicated collectors worldwide."
          </p>
        </div>
        {[['Who We Are', 'Borneo Endemic Ant is a specialist supplier of live endemic ants, exotic insects, and rare reptiles from the island of Borneo — one of the world\'s most biodiverse regions. We are based in Malaysia and have been connecting international hobbyists with Borneo\'s incredible endemic fauna since 2024.'], ['Our Mission', 'We believe that sustainable, ethical collection and the passion of the keeper community plays an important role in raising awareness of Borneo\'s endangered ecosystems. Every purchase supports local collectors and promotes conservation awareness.'], ['Why Borneo?', 'Borneo is home to thousands of endemic species found nowhere else on Earth. Its ancient rainforests have been isolated for millions of years, producing unique evolutionary adaptations you will not find anywhere else. From the explosive Camponotus saundersi to the gliding Draco volans, Borneo\'s fauna is truly extraordinary.']].map(([title, text]) => (
          <div key={title} style={{ marginBottom: '32px' }}>
            <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '12px' }}>{title}</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--muted)' }}>{text}</p>
          </div>
        ))}
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[['Email', settings.storeEmail, '✉️'], ['WhatsApp', settings.whatsapp, '💬'], ['Location', 'Borneo, Malaysia', '📍'], ['Shipping', 'Worldwide', '🌍']].map(([k, v, icon]) => (
            <div key={k}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>{icon} {k}</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  if (page === 'shipping') return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container" style={{ maxWidth: '780px' }}>
        <div className="section-eyebrow">International Delivery</div>
        <h1 className="section-title" style={{ fontSize: '40px', marginBottom: '32px' }}>Shipping & Packaging</h1>
        {[['Shipping Methods', [['DHL Express', '5-7 business days — Tracked & insured. Best for tropical destinations.'], ['EMS International', '7-14 business days — Economical option. Available to most countries.']]], ['Packaging', [['Insulated Box', 'Double-walled insulated box with ice pack or heat pack (seasonal).'], ['Ventilated Container', 'Each specimen in escape-proof, ventilated container with substrate.'], ['Live Guarantee', 'DOA claim: send photo within 2 hours of delivery for replacement/refund.']]], ['Customs & Import', [['Your Responsibility', 'Check your country\'s import laws for live insects and reptiles before ordering.'], ['Documentation', 'We provide health certificates and CITES documents for compliant species.'], ['Customs Delays', 'We are not responsible for delays caused by customs. Tracking number provided.']]]].map(([title, items]) => (
          <div key={title as string} style={{ marginBottom: '32px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '24px' }}>
            <h2 className="section-title" style={{ fontSize: '20px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>{title as string}</h2>
            {(items as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--primary)', letterSpacing: '1px' }}>{k}</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>{v}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );

  // FAQ
  return (
    <main style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="page-container" style={{ maxWidth: '780px' }}>
        <div className="section-eyebrow">Common Questions</div>
        <h1 className="section-title" style={{ fontSize: '40px', marginBottom: '48px' }}>FAQ</h1>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--text)', textAlign: 'left', gap: '16px' }}
            >
              <span className="section-title" style={{ fontSize: '16px', flex: 1 }}>{faq.q}</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: 300, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 0 20px', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.9 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
