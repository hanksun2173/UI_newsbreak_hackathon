import { Link } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import { c, serif, h1, eyebrow } from '../theme.js';

const KINDS = {
  event: { label: 'Event', date: { background: c.purple, color: '#ffffff' }, pill: { background: c.purpleSoft, color: c.lilac } },
  meeting: { label: 'Coffee', date: { background: c.teal, color: c.ink }, pill: { background: c.tealDeep, color: c.tealBright } },
  follow: { label: 'Follow-up', date: { background: c.coral, color: c.ink }, pill: { background: c.coralDeep, color: c.coralSoft } },
};

const PLAN = [
  { kind: 'follow', day: 'Sat', date: '19', title: 'Send Priya the article on onboarding tools', meta: 'Today · 10 min' },
  { kind: 'event', day: 'Tue', date: '22', title: 'Founders & Friends Meetup', meta: '6:30 pm · Priya, Ana and Maya are going' },
  { kind: 'meeting', day: 'Thu', date: '24', title: 'Coffee with Maya Chen', meta: '3:30 pm · Corner Café' },
  { kind: 'event', day: 'Sat', date: '26', title: 'Climate Tech Demo Morning', meta: '10:00 am · Daniel Okafor is speaking' },
];

const TILES = [
  { to: '/people', label: 'People met', n: '3', cta: 'View people', bg: c.purple, fg: '#ffffff' },
  { to: '/events', label: 'Events attended', n: '3', cta: 'View past events', bg: c.teal, fg: c.ink },
  { to: '/plan', label: 'Events ahead', n: '3', cta: 'See your plan', bg: c.yellow, fg: c.ink },
  { to: '/follow-ups', label: 'Follow-ups open', n: '3', cta: 'View follow-ups', bg: c.coral, fg: c.ink },
];

export default function Home() {
  return (
    <Shell>
      <div
        style={{
          flexGrow: 1,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
          padding: '56px 64px 64px 64px',
        }}
      >
        {/* Greeting + ask bar */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h1 style={h1}>Good morning, Hank.</h1>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: 440,
              height: 60,
              boxSizing: 'border-box',
              padding: '0 8px 0 24px',
              background: c.card,
              border: `2px solid ${c.lineStrong}`,
              borderRadius: 999,
            }}
          >
            <label
              htmlFor="ask"
              style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
            >
              Ask your companion
            </label>
            <input
              id="ask"
              type="text"
              placeholder="Ask: who should I meet on Tuesday?"
              style={{
                flexGrow: 1,
                minWidth: 0,
                height: 40,
                border: 0,
                outline: 0,
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: 16,
                color: c.text,
              }}
            />
            <button
              type="button"
              aria-label="Ask"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                border: 0,
                borderRadius: 999,
                background: c.purple,
                cursor: 'pointer',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 28,
                minHeight: 216,
                boxSizing: 'border-box',
                padding: 32,
                borderRadius: 28,
                background: t.bg,
                color: t.fg,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700 }}>{t.label}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: serif, fontSize: 96, lineHeight: 0.85 }}>{t.n}</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{t.cta}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Plan summary + Next up */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 32 }}>
          <div
            style={{
              gridColumn: 'span 8',
              display: 'flex',
              flexDirection: 'column',
              padding: 36,
              background: c.card,
              border: `1px solid ${c.lineCard}`,
              borderRadius: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, paddingBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: c.purple }} />
                  <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 400, fontSize: 34, letterSpacing: '-0.01em' }}>
                    Your proposed plan
                  </h2>
                </div>
                <div style={{ fontSize: 16, color: c.textMuted }}>Put together by your companion for Sep 19 to 26.</div>
              </div>
              <Link
                to="/plan"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  minHeight: 48,
                  padding: '0 24px',
                  borderRadius: 999,
                  background: c.purple,
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Review full plan
              </Link>
            </div>
            {PLAN.map((item) => {
              const k = KINDS[item.kind];
              return (
                <div
                  key={item.title}
                  style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '22px 0', borderTop: `1px solid ${c.line}` }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      borderRadius: 16,
                      ...k.date,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {item.day}
                    </div>
                    <div style={{ fontFamily: serif, fontSize: 26, lineHeight: 1 }}>{item.date}</div>
                  </div>
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 19, fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: 15, color: c.textMuted }}>{item.meta}</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 34,
                      padding: '0 16px',
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      ...k.pill,
                    }}
                  >
                    {k.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              gridColumn: 'span 4',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              padding: 36,
              background: c.cardAlt,
              border: `1px solid ${c.lineStrong}`,
              borderRadius: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, background: c.teal }} />
              <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 400, fontSize: 30, letterSpacing: '-0.01em' }}>Next up</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: serif, fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                Founders & Friends Meetup
              </div>
              <div style={{ fontSize: 16, color: c.textMuted }}>Tue, Sep 22 · 6:30 pm · [Venue], [Neighborhood]</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={eyebrow}>Common ground</div>
              <div style={{ fontSize: 16, lineHeight: 1.55 }}>
                You know Priya Nair from Demo Night, and two other people you have met are on the guest list.
              </div>
            </div>
            <Link
              to="/events"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start',
                minHeight: 48,
                padding: '0 24px',
                borderRadius: 999,
                border: `2px solid ${c.teal}`,
                color: c.tealBright,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open prep brief
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
