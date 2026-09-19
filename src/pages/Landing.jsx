import { useEffect } from 'react';

const serif = "'Instrument Serif', Georgia, serif";
const sans = "'Hanken Grotesk', system-ui, sans-serif";

const green = '#2e5e4e';
const ink = '#1c1a16';
const cream = '#f6f1e9';
const body = '#504b42';
const muted = '#6b655a';

const eyebrow = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: green,
};

const cardLabel = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: muted,
};

const ctaPill = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 44,
  padding: '0 22px',
  background: green,
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: 999,
  fontWeight: 500,
};

const journeyCard = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  padding: '36px 32px 40px 32px',
  background: cream,
  borderRadius: 20,
};

const journeyNumber = { fontFamily: serif, fontSize: 64, lineHeight: 1, color: green };
const journeyTag = { fontSize: 14, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: muted };
const journeyTitle = { fontFamily: serif, fontSize: 36, lineHeight: 1.1 };
const journeyText = { margin: 0, fontSize: 18, lineHeight: 1.55, color: body, textWrap: 'pretty' };

const STEPS = [
  {
    n: '1',
    tag: 'Schedule',
    title: 'Where should I go?',
    text: 'It understands your existing schedule, your interests, the events around you, and, if you allow it, where you are. Then it helps you decide which events and meetings actually fit.',
  },
  {
    n: '2',
    tag: 'Prep',
    title: 'Who am I meeting, and what should we talk about?',
    text: 'Before an event or a coffee chat, it prepares the relevant people, your common ground, recent context, and suggested questions. You walk in already warm.',
  },
  {
    n: '3',
    tag: 'Capture',
    title: 'Who did I meet, and what did we say?',
    text: 'Afterward, it automatically remembers the relationships you build, so the next conversation with the same person picks up where the last one ended.',
  },
];

export default function Landing() {
  useEffect(() => {
    document.body.classList.add('light');
    return () => document.body.classList.remove('light');
  }, []);

  return (
    <div
      style={{
        width: '100%',
        background: cream,
        color: ink,
        fontFamily: sans,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* NAV */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 80px' }}>
        <div style={{ fontFamily: serif, fontSize: 28, letterSpacing: '-0.01em' }}>Minerva</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, fontSize: 16 }}>
          <a href="#journey" style={{ color: ink, textDecoration: 'none' }}>How it works</a>
          <a href="#not-crm" style={{ color: ink, textDecoration: 'none' }}>Why it's different</a>
          <a href="#join" style={ctaPill}>Get early access</a>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 72,
          alignItems: 'center',
          padding: '72px 80px 112px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={eyebrow}>An AI companion for local events and relationships</div>
          <h1
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 88,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}
          >
            Know where to go, who you'll meet, and who you already know.
          </h1>
          <p style={{ margin: 0, fontSize: 21, lineHeight: 1.55, color: body, maxWidth: 540, textWrap: 'pretty' }}>
            It helps you decide which events are worth your evening, prepares you for the people you'll meet, and
            remembers the relationships you build, so you don't have to.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a
              href="#join"
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: 56,
                padding: '0 32px',
                background: green,
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Get early access
            </a>
            <a href="#journey" style={{ fontSize: 17, fontWeight: 500 }}>See how it works</a>
          </div>
        </div>

        {/* Example prep card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            background: '#ffffff',
            border: '1px solid #ddd5c6',
            borderRadius: 20,
            boxShadow: '0 24px 60px -30px rgba(28,26,22,0.35)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px',
              background: '#ebf0ea',
              borderBottom: '1px solid #d6dfd5',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: green }}>
              Prep
            </div>
            <div style={{ fontSize: 14, color: body }}>Example</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '32px 28px 36px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: serif, fontSize: 34, lineHeight: 1.1 }}>Coffee chat, Thursday 3:30 pm</div>
              <div style={{ fontSize: 16, color: body }}>[Name], [Role] at [Company]</div>
            </div>
            <div style={{ height: 1, background: '#e7e0d2' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={cardLabel}>Common ground</div>
              <div style={{ fontSize: 17, lineHeight: 1.5 }}>
                You both organize or attend local founder meetups, and you met the same person at last month's demo night.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={cardLabel}>Recent context</div>
              <div style={{ fontSize: 17, lineHeight: 1.5 }}>
                [Something they recently shipped, posted, or said, pulled in for you.]
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={cardLabel}>Good questions to ask</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['What changed for you after the last launch?', 'Who else in the local scene should I be meeting?'].map((q) => (
                  <div
                    key={q}
                    style={{ padding: '14px 18px', background: cream, borderRadius: 12, fontSize: 16, lineHeight: 1.45 }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JOURNEY */}
      <div id="journey" style={{ display: 'flex', flexDirection: 'column', gap: 56, padding: '112px 80px', background: '#ebe4d6' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820 }}>
          <div style={eyebrow}>Schedule, Prep, Capture</div>
          <h2
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 64,
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              textWrap: 'balance',
            }}
          >
            One companion for the whole journey, not two separate tools.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 32 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={journeyCard}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={journeyNumber}>{s.n}</div>
                <div style={journeyTag}>{s.tag}</div>
              </div>
              <div style={journeyTitle}>{s.title}</div>
              <p style={journeyText}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NOT A CRM */}
      <div
        id="not-crm"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 72,
          alignItems: 'start',
          padding: '120px 80px',
          background: ink,
          color: cream,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 80,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}
        >
          More than a personal CRM.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
          <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5, color: cream, textWrap: 'pretty' }}>
            Storing contacts isn't the point. The point is helping you before, during, and after real-world interactions.
          </p>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.6, color: '#cfc8ba', textWrap: 'pretty' }}>
            An AI companion that helps you decide where to go, prepares you for the people you'll meet, and remembers the
            relationships you build.
          </p>
        </div>
      </div>

      {/* JOIN */}
      <div
        id="join"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: '120px 80px', textAlign: 'center' }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 72,
            lineHeight: 1.02,
            letterSpacing: '-0.015em',
            maxWidth: 900,
            textWrap: 'balance',
          }}
        >
          Show up ready for the people worth meeting.
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <label htmlFor="email" style={{ fontSize: 14, fontWeight: 500, color: body }}>Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              style={{
                boxSizing: 'border-box',
                width: 360,
                height: 56,
                padding: '0 20px',
                fontFamily: 'inherit',
                fontSize: 17,
                color: ink,
                background: '#ffffff',
                border: '1px solid #c9bfab',
                borderRadius: 999,
              }}
            />
          </div>
          <button
            type="button"
            style={{
              height: 56,
              padding: '0 32px',
              fontFamily: 'inherit',
              fontSize: 18,
              fontWeight: 500,
              color: '#ffffff',
              background: green,
              border: 0,
              borderRadius: 999,
              cursor: 'pointer',
            }}
          >
            Get early access
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 80px',
          borderTop: '1px solid #ddd5c6',
          fontSize: 15,
          color: body,
        }}
      >
        <div style={{ fontFamily: serif, fontSize: 22, color: ink }}>Minerva</div>
        <div>© [YEAR] [Company name]</div>
      </div>
    </div>
  );
}
