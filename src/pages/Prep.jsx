import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import { c, serif, eyebrow } from '../theme.js';
import { loadGoal } from '../goal.js';

const PREPS = {
  person: {
    label: 'Priya Patel',
    title: 'Priya Patel',
    subtitle: 'AI Product Manager, Series D B2B AI Startup · Wednesday 4:00 PM',
    why: 'Priya sits exactly where you want to be: an AI PM shipping enterprise products at a B2B company that takes PM interns. A strong conversation with her turns a cold application into a warm referral.',
    sections: [
      { label: 'What to bring', items: [
        'A two-minute story about a B2B SaaS feature you shipped, framed around the customer discovery and GTM work you led.',
        'One concrete opinion about how AI changes enterprise PM work, so the conversation goes beyond asking for a job.',
        'A specific ask: whether her team is taking PM interns and who owns that decision.' ] },
      { label: 'What to learn', items: [
        'How her team splits work between PMs and ML engineers on AI features.',
        'What her company looks for when it evaluates PM intern candidates.',
        'Which enterprise AI problems she thinks are still unsolved.' ] },
      { label: 'Questions to ask', numbered: true, items: [
        'When you moved into AI product work, what part of your enterprise SaaS experience transferred and what did you have to relearn?',
        "How do you scope an AI feature when the model's behavior is not fully predictable?",
        'If I wanted to be a strong intern candidate on your team next summer, what would you want to see from me in the next three months?' ] },
    ],
  },
  event: {
    label: 'Physical AI & Robotics Panel',
    title: 'Physical AI & Robotics Panel',
    subtitle: 'Saturday 5:00 PM · Innovation Hub, Main Hall',
    why: 'The panel is the fastest way to get a real read on the Physical AI industry from people shipping robots, and the mixer afterward is where product roles in robotics get discussed candidly.',
    sections: [
      { label: 'What to explore', items: [
        'How robotics teams handle product decisions when deployment is physical and slow to iterate.',
        'Which companies on the panel have product managers at all, and what those PMs actually own.',
        'Where simulation and VLA models are changing the pace of product work.' ] },
      { label: 'Priorities, in order', numbered: true, items: [
        'Note one specific question during the panel and ask it in the Q&A.',
        'Talk to at least one panelist and one attendee who works on the product side.',
        'Ask each person you meet who else you should be talking to in Physical AI.' ] },
      { label: 'Questions to ask', numbered: true, items: [
        'What does a product manager do differently at a robotics company compared to a pure software company?',
        'Where does customer discovery break down when the product is a robot in a warehouse?',
        'Which skills from enterprise SaaS product work would you want a new hire to bring into Physical AI?' ] },
    ],
  },
};

const CARDS = [
  { id: 'person', kind: 'Person to meet', status: 'BOOKED ✓', title: 'Priya Patel', when: 'Wednesday 4:00 PM' },
  { id: 'event', kind: 'Event to attend', status: 'REGISTERED ✓', title: 'Physical AI & Robotics Panel', when: 'Saturday 5:00 PM' },
];

const KIND_PILL = {
  person: { background: c.purpleSoft, color: c.lilac },
  event: { background: c.tealDeep, color: c.tealBright },
};

const kindPillStyle = (id) => ({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  padding: '0 14px',
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  ...KIND_PILL[id],
});

const sectionLabel = { ...eyebrow };

export default function Prep() {
  const saved = loadGoal();
  const navigate = useNavigate();
  const [kind, setKind] = useState('person');
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const load = (k) => {
    setKind(k);
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 900);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const close = () => navigate('/plan');
  const p = PREPS[kind];

  return (
    <Shell fullHeight user="Alex" activePath="/plan" hide={['/schedule']}>
      {/* BACKDROP: plan page stand-in, dimmed under the drawer */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 36, padding: '56px 64px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...eyebrow, letterSpacing: '0.14em' }}>Step 2 of 2 · This week</div>
          <h1 style={{ margin: 0, fontFamily: serif, fontWeight: 400, fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Your networking plan
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '26px 28px',
              borderRadius: 24,
              background: c.purple,
              color: '#ffffff',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>
              Primary goal
            </div>
            <div style={{ fontFamily: serif, fontSize: 28, lineHeight: 1.15 }}>{saved?.goal || 'Find an AI B2B PM internship'}</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '26px 28px',
              borderRadius: 24,
              background: c.cardAlt,
              border: `1px solid ${c.lineStrong}`,
            }}
          >
            <div style={eyebrow}>Secondary interest</div>
            <div style={{ fontFamily: serif, fontSize: 28, lineHeight: 1.15 }}>{saved?.secondary || 'Explore the Physical AI industry'}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28 }}>
          {CARDS.map((card) => (
            <div
              key={card.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                padding: 32,
                borderRadius: 28,
                background: c.card,
                border: `1px solid ${c.lineCard}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={kindPillStyle(card.id)}>{card.kind}</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 34,
                    padding: '0 14px',
                    borderRadius: 999,
                    background: c.teal,
                    color: c.ink,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                  }}
                >
                  {card.status}
                </div>
              </div>
              <div style={{ fontFamily: serif, fontSize: 36, lineHeight: 1.05 }}>{card.title}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{card.when}</div>
              <button
                type="button"
                onClick={() => load(card.id)}
                style={{
                  alignSelf: 'flex-start',
                  minHeight: 52,
                  padding: '0 26px',
                  borderRadius: 999,
                  border: `2px solid ${c.purple}`,
                  background: c.purple,
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Prepare
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SCRIM */}
      <div
        className="pd-scrim"
        onClick={close}
        style={{ position: 'absolute', inset: 0, background: 'rgba(6,4,20,0.62)', cursor: 'pointer' }}
      />

      {/* DRAWER */}
      <div
        className="pd-drawer"
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 580,
          display: 'flex',
          flexDirection: 'column',
          background: c.card,
          borderLeft: `1px solid ${c.lineStrong}`,
          boxShadow: '-30px 0 80px -30px rgba(0,0,0,0.85)',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            padding: '32px 36px 22px 36px',
            borderBottom: `1px solid ${c.lineCard}`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['person', 'event'].map((k) => {
                const active = kind === k;
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      if (!active) load(k);
                    }}
                    style={{
                      height: 36,
                      padding: '0 16px',
                      border: 0,
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: active ? c.purple : c.cardAlt,
                      color: active ? '#ffffff' : c.lilac,
                    }}
                  >
                    {k === 'person' ? 'Person prep' : 'Event prep'}
                  </button>
                );
              })}
            </div>
            <h2
              style={{
                margin: '6px 0 0 0',
                fontFamily: serif,
                fontWeight: 400,
                fontSize: 36,
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
              }}
            >
              {p.title}
            </h2>
            <div style={{ fontSize: 15, color: c.textMuted }}>{p.subtitle}</div>
          </div>
          <Link
            to="/plan"
            className="pd-close"
            aria-label="Close"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: 999,
              border: `2px solid ${c.lineStrong}`,
              color: c.lilac,
              fontSize: 22,
              textDecoration: 'none',
            }}
          >
            ×
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '28px 36px 48px 36px' }}>
            <div style={sectionLabel}>Writing your briefing…</div>
            <div className="pd-sk" style={{ height: 96 }} />
            <div className="pd-sk" style={{ height: 14, width: 120 }} />
            <div className="pd-sk" style={{ height: 52 }} />
            <div className="pd-sk" style={{ height: 52 }} />
            <div className="pd-sk" style={{ height: 14, width: 150 }} />
            <div className="pd-sk" style={{ height: 52 }} />
            <div className="pd-sk" style={{ height: 52 }} />
            <div className="pd-sk" style={{ height: 14, width: 160 }} />
            <div className="pd-sk" style={{ height: 60 }} />
            <div className="pd-sk" style={{ height: 60 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '28px 36px 48px 36px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={sectionLabel}>Why this matters</div>
              <div
                style={{
                  padding: '22px 24px',
                  borderRadius: 20,
                  background: c.cardAlt,
                  border: `1px solid ${c.lineStrong}`,
                  fontSize: 17,
                  lineHeight: 1.55,
                }}
              >
                {p.why}
              </div>
            </div>

            {p.sections.map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={sectionLabel}>{s.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.items.map((text, i) => (
                    <div
                      key={text}
                      style={{
                        display: 'flex',
                        gap: 14,
                        padding: '14px 18px',
                        borderRadius: 14,
                        fontSize: 15,
                        lineHeight: 1.5,
                        border: `1px solid ${c.lineStrong}`,
                        background: s.numbered ? c.cardAlt : c.bg,
                      }}
                    >
                      {s.numbered && (
                        <div
                          style={{
                            width: 22,
                            flexShrink: 0,
                            fontFamily: serif,
                            fontSize: 22,
                            lineHeight: 1,
                            color: c.yellow,
                          }}
                        >
                          {i + 1}
                        </div>
                      )}
                      <div>{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 8 }}>
              <Link
                to="/plan"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 52,
                  padding: '0 26px',
                  borderRadius: 999,
                  background: c.purple,
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Back to plan
              </Link>
              <button
                type="button"
                onClick={() => load(kind)}
                style={{
                  minHeight: 52,
                  padding: '0 22px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: c.lilac,
                  border: `2px solid ${c.lineStrong}`,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
