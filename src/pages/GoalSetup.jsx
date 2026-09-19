import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { c, serif, sans } from '../theme.js';
import { loadGoal, saveGoal } from '../goal.js';

const STEPS = [
  {
    n: '1',
    title: 'Decide',
    text: 'Ranks people and events by how much they close the gap between your background and your goal.',
  },
  { n: '2', title: 'Schedule', text: 'Finds an open slot in your week and books the meeting and the event for you.' },
  {
    n: '3',
    title: 'Prepare',
    text: 'Writes a briefing for each: why it matters, what to bring, what to learn, what to ask.',
  },
];

const STATUS_STEPS = [
  'Ranking people and events against your goal…',
  'Checking your calendar for open slots…',
  'Booking Priya Patel and registering for the panel…',
];

const fieldBase = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 16,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: c.lineStrong,
  background: c.bg,
  color: c.text,
  fontSize: 16,
};

function useFocusBorder() {
  const [focused, setFocused] = useState(false);
  return {
    style: focused ? { borderColor: c.purple } : {},
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}

export default function GoalSetup() {
  const navigate = useNavigate();
  const [building, setBuilding] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const timers = useRef({ tick: null, done: null });

  const saved = loadGoal();
  const [background, setBackground] = useState(
    saved?.background ?? 'B2B SaaS PM with experience in enterprise products, MarTech, customer discovery and GTM.'
  );
  const [goal, setGoal] = useState(saved?.goal ?? 'Find an AI B2B PM internship');
  const [secondary, setSecondary] = useState(saved?.secondary ?? 'Explore the Physical AI industry');

  const bgFocus = useFocusBorder();
  const goalFocus = useFocusBorder();
  const secFocus = useFocusBorder();

  useEffect(() => {
    document.body.classList.remove('light');
    return () => {
      clearInterval(timers.current.tick);
      clearTimeout(timers.current.done);
    };
  }, []);

  const build = () => {
    if (building) return;
    setBuilding(true);
    setStatusIndex(0);
    saveGoal({ background, goal, secondary });
    let i = 0;
    timers.current.tick = setInterval(() => {
      i += 1;
      if (STATUS_STEPS[i]) setStatusIndex(i);
    }, 700);
    timers.current.done = setTimeout(() => {
      clearInterval(timers.current.tick);
      navigate('/plan');
    }, 2300);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        background: c.bg,
        color: c.text,
        fontFamily: sans,
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 64px',
          borderBottom: `1px solid ${c.line}`,
        }}
      >
        <div style={{ fontFamily: serif, fontSize: 30, letterSpacing: '-0.01em', color: '#ffffff' }}>[Product name]</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Alex</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 999,
              background: c.yellow,
              color: c.ink,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            A
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
          gap: 64,
          alignItems: 'start',
          padding: '64px 64px 96px 64px',
        }}
      >
        {/* Left: intro */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.lilac }}>
            Step 1 of 2
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 56,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}
          >
            Where should your networking time go this week?
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: 19, lineHeight: 1.5, color: c.textMuted, textWrap: 'pretty' }}>
            Tell your companion who you are and what you are after. It picks the one person and one event that move you
            closest to the goal, books them around your calendar, and preps you for each.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28 }}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '20px 0', borderTop: `1px solid ${c.line}` }}
              >
                <div style={{ width: 40, flexShrink: 0, fontFamily: serif, fontSize: 36, lineHeight: 1, color: c.lilac }}>
                  {s.n}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: c.textMuted }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: 40,
            background: c.card,
            border: `1px solid ${c.lineCard}`,
            borderRadius: 28,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="background" style={{ fontSize: 15, fontWeight: 600 }}>Your background</label>
            <div style={{ fontSize: 14, color: c.textMuted }}>Role, industry, and the experience you bring.</div>
            <textarea
              id="background"
              rows={4}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              onFocus={bgFocus.onFocus}
              onBlur={bgFocus.onBlur}
              style={{ ...fieldBase, padding: '16px 18px', lineHeight: 1.5, resize: 'vertical', ...bgFocus.style }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="goal" style={{ fontSize: 15, fontWeight: 600 }}>Networking goal</label>
            <div style={{ fontSize: 14, color: c.textMuted }}>The one outcome you want this week's networking to serve.</div>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onFocus={goalFocus.onFocus}
              onBlur={goalFocus.onBlur}
              style={{ ...fieldBase, height: 56, padding: '0 18px', ...goalFocus.style }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label htmlFor="secondary" style={{ fontSize: 15, fontWeight: 600 }}>
              Also curious about <span style={{ color: c.textMuted, fontWeight: 500 }}>(optional)</span>
            </label>
            <input
              id="secondary"
              type="text"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              onFocus={secFocus.onFocus}
              onBlur={secFocus.onBlur}
              style={{ ...fieldBase, height: 56, padding: '0 18px', ...secFocus.style }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 8 }}>
            <button
              id="build"
              className="gs-build"
              type="button"
              onClick={build}
              disabled={building}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                minHeight: 60,
                padding: '0 30px',
                borderRadius: 999,
                border: `2px solid ${c.purple}`,
                background: c.purple,
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform .12s ease, opacity .12s ease',
              }}
            >
              {building && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    border: '3px solid rgba(255,255,255,0.35)',
                    borderTopColor: '#ffffff',
                    animation: 'gs-spin .8s linear infinite',
                  }}
                />
              )}
              <span>{building ? 'Building your plan…' : 'Build My Networking Plan ✨'}</span>
            </button>
            {!building && <div style={{ fontSize: 14, color: c.textMuted }}>Takes about 10 seconds.</div>}
          </div>

          {building && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 20px',
                borderRadius: 16,
                background: c.cardAlt,
                border: `1px solid ${c.lineStrong}`,
                fontSize: 15,
                color: c.lilacLight,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 999, background: c.teal }} />
              <span>{STATUS_STEPS[statusIndex]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
