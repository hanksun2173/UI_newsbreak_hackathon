import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import { c, serif } from '../theme.js';
import { W, H, CX, CY, R2, tones, inner, warm, groups, events, lensDefs } from '../data/people.js';

// ---------- Scene helpers (lengths scale with the stage via --u / --ux / --uy) ----------
const U = (n) => `calc(${Number(n).toFixed(1)} * var(--u))`;
const X = (n) => `calc(${Number(n).toFixed(1)} * var(--ux))`;
const Y = (n) => `calc(${Number(n).toFixed(1)} * var(--uy))`;
// anchor a w-wide box (sized in u) at scene point (x,y) with its top-left offset (ox,oy) in u
const at = (x, y, ox, oy) => ({
  left: `calc(${x.toFixed(1)} * var(--ux) - ${ox.toFixed(1)} * var(--u))`,
  top: `calc(${y.toFixed(1)} * var(--uy) - ${oy.toFixed(1)} * var(--u))`,
});
const box = (x, y, w, h) => ({ left: X(x), top: Y(y), width: X(w), height: Y(h) });
const initials = (n) => n.split(' ').map((w) => w[0]).join('');
const Q = (a, b) => [a, b];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const angOf = (o) => (Math.atan2(o.y - CY, o.x - CX) * 180) / Math.PI;
const angDist = (a, b) => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
};

const pillTones = {
  hot: { background: '#4a1d1f', color: '#ff8d84' },
  warm: { background: '#3d3210', color: '#ffd86b' },
  cool: { background: '#0d3d3a', color: '#4be3c6' },
};

// ---------- Lookup tables (static) ----------
const byId = {};
inner.forEach((p) => {
  byId[p.id] = { ...p, tier: 'inner' };
});
warm.forEach((p) => {
  byId[p.id] = {
    ...p,
    tier: 'warm',
    status: 'Warm',
    calLabel: 'Schedule',
    whyTitle: 'Why ' + p.name.split(' ')[0] + ' is on your map',
    pill: p.tag,
    pillKind: 'cool',
  };
});
groups.forEach((g) => {
  g.people.forEach((m) => {
    byId[m.id] = {
      ...m,
      tier: 'member',
      group: g.id,
      tag: g.tag,
      status: 'Not yet met',
      calLabel: 'Add to prep',
      whyTitle: 'Why ' + m.name.split(' ')[0] + ' is in ' + g.name,
      why: m.note + ' ' + g.why,
      common: [g.name, 'Small teams'],
      bring: ['An intro through ' + g.viaText.replace('Reached through ', ''), 'Your onboarding research'],
      learn: ['How they onboard customers today', 'Whether they would pilot'],
      questions: Q('How do your first users get set up today?', 'What would a pilot need to prove?'),
      pill: g.tag,
      pillKind: 'cool',
    };
  });
});
const groupById = {};
groups.forEach((g) => {
  groupById[g.id] = g;
});
const eventById = {};
events.forEach((e) => {
  eventById[e.id] = e;
});
const ang = {};
inner.forEach((p) => (ang[p.id] = angOf(p)));
warm.forEach((p) => (ang[p.id] = angOf(p)));
groups.forEach((g) => (ang[g.id] = angOf(g)));
events.forEach((e) => (ang[e.id] = angOf(e)));

const total = inner.length + warm.length + groups.reduce((n, g) => n + g.people.length, 0);
const countLine = total + ' people · ' + inner.length + ' to act on this week';

// ---------- Small icons ----------
const ArrowRight = ({ stroke = '#ffffff' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b7a7ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', height: 36, padding: '0 12px 0 6px', border: 0, borderRadius: 999, background: 'transparent', color: c.lilac, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b7a7ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
    Back to network
  </button>
);

const panelStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 10,
  width: 500,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  background: c.bgSidebar,
  borderLeft: `1px solid ${c.lineStrong}`,
  boxShadow: '-40px 0 80px -30px rgba(0,0,0,0.7)',
  animation: 'nm-slide .5s cubic-bezier(.2,.8,.2,1) both',
};
const panelBody = { flexGrow: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22, padding: '24px 28px 28px 28px' };
const panelFoot = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, padding: '16px 28px 20px 28px', borderTop: `1px solid ${c.lineCard}`, background: c.bgSidebar };
const eyebrow = { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.lilac };
const smallAv = (tone) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 40, height: 40, borderRadius: 999, fontSize: 14, fontWeight: 700, background: tone.bg, color: tone.fg });
const rowBtn = { display: 'flex', alignItems: 'center', gap: 14, width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: `1px solid ${c.lineCard}`, borderRadius: 14, background: c.card, color: c.text, textAlign: 'left', cursor: 'pointer' };
const toggleBtn = (on) => ({
  height: 50,
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  ...(on
    ? { background: c.teal, color: c.ink, border: `2px solid ${c.teal}` }
    : { background: c.text, color: c.ink, border: `2px solid ${c.text}` }),
});
const outlineLink = (color) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 999, border: `2px solid ${color}`, color: color === c.teal ? c.tealBright : '#ffffff', fontSize: 15, fontWeight: 700, textDecoration: 'none' });

// ---------- Panels ----------
function PersonPanel({ p, done, onToggleDone, onBack }) {
  const tone = tones[p.tone];
  const statusTone =
    p.status === 'In your network' || p.status === 'Coffee on Thursday'
      ? { background: '#173d2a', color: '#5fe3a0' }
      : { background: '#0d3d3a', color: '#4be3c6' };
  return (
    <div style={panelStyle}>
      <div style={panelBody}>
        <BackButton onClick={onBack} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 76, height: 76, borderRadius: 999, fontSize: 26, fontWeight: 700, background: tone.bg, color: tone.fg }}>
            {initials(p.name)}
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: serif, fontSize: 34, lineHeight: 1, letterSpacing: '-0.01em' }}>{p.name}</div>
            <div style={{ fontSize: 15, color: c.textMuted }}>{p.role}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, height: 30, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', ...statusTone }}>
            {p.status}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          <Link to="/plan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: 12, background: c.purpleSoft, color: '#ffffff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="3" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            {p.calLabel}
          </Link>
          <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, border: `1px solid ${c.lineStrong}`, borderRadius: 12, background: 'transparent', color: c.text, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
            </svg>
            Message
          </button>
          <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, border: `1px solid ${c.lineStrong}`, borderRadius: 12, background: 'transparent', color: c.text, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f0ff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4h16v16H4zM8 9h8M8 13h6" />
            </svg>
            Add note
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', background: c.yellowDeep, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: c.yellowSoft }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd86b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
            </svg>
            {p.whyTitle}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>{p.why}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={eyebrow}>Common ground</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {p.common.map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', height: 32, padding: '0 14px', borderRadius: 999, background: c.purpleSoft, color: c.lilacLight, fontSize: 14, fontWeight: 600 }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, background: c.card, border: `1px solid ${c.lineCard}`, borderRadius: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: c.tealBright }}>What you can bring</div>
            {p.bring.map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: 1.4 }}>
                <div style={{ flexShrink: 0, width: 8, height: 8, marginTop: 6, borderRadius: 999, background: c.teal }} />
                <div>{t}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, background: c.card, border: `1px solid ${c.lineCard}`, borderRadius: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: c.lilac }}>What you want to learn</div>
            {p.learn.map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, lineHeight: 1.4 }}>
                <div style={{ flexShrink: 0, width: 8, height: 8, marginTop: 6, borderRadius: 999, background: c.purple }} />
                <div>{t}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={eyebrow}>Suggested questions</div>
          {p.questions.map((t, i) => (
            <div key={t} className="nm-q" style={{ display: 'flex', gap: 12, padding: '12px 14px', background: c.cardAlt, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: c.purple, color: '#ffffff', fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.45 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={panelFoot}>
        <button type="button" onClick={onToggleDone} aria-pressed={done} style={toggleBtn(done)}>
          {done ? 'Completed' : 'Mark as completed'}
        </button>
        <Link to="/follow-ups" style={outlineLink(c.purple)}>
          Add follow-up
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

function EventPanel({ e, added, onToggleAdd, onPick, onBack }) {
  return (
    <div style={panelStyle}>
      <div style={panelBody}>
        <BackButton onClick={onBack} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', height: 32, padding: '0 14px', borderRadius: 999, background: c.tealDeep, color: c.tealBright, fontSize: 13, fontWeight: 700 }}>
            Event · {e.tag}
          </div>
          <div style={{ fontFamily: serif, fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.01em' }}>{e.title}</div>
          <div style={{ fontSize: 15, color: c.textMuted }}>{e.metaLong}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', background: c.tealDeep, borderRadius: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: c.tealBright }}>Why it moves your goal</div>
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>{e.why}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={eyebrow}>People on this map who will be there</div>
          {e.who.map((id) => {
            const q = byId[id];
            return (
              <button key={id} type="button" onClick={() => onPick(id)} style={rowBtn}>
                <div style={smallAv(tones[q.tone])}>{initials(q.name)}</div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{q.name}</div>
                  <div style={{ fontSize: 13, color: c.textMuted }}>{e.whoNotes[id]}</div>
                </div>
                <Chevron />
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={eyebrow}>Plan for the night</div>
          {e.steps.map((t, i) => (
            <div key={t} className="nm-q" style={{ display: 'flex', gap: 12, padding: '12px 14px', background: c.cardAlt, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: c.teal, color: c.ink, fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.45 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={panelFoot}>
        <button type="button" onClick={onToggleAdd} aria-pressed={added} style={toggleBtn(added)}>
          {added ? 'On your plan' : 'Add to plan'}
        </button>
        <Link to="/events" style={outlineLink(c.teal)}>
          Open prep brief
          <ArrowRight stroke="#4be3c6" />
        </Link>
      </div>
    </div>
  );
}

function GroupPanel({ g, promoted, onTogglePromote, onPick, onBack }) {
  return (
    <div style={panelStyle}>
      <div style={panelBody}>
        <BackButton onClick={onBack} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', height: 32, padding: '0 14px', borderRadius: 999, background: c.purpleSoft, color: c.lilacLight, fontSize: 13, fontWeight: 700 }}>
            Group · {g.people.length} people
          </div>
          <div style={{ fontFamily: serif, fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.01em' }}>{g.name}</div>
          <div style={{ fontSize: 15, color: c.textMuted }}>{g.viaText}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', background: c.purpleSoft, borderRadius: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: c.lilacLight }}>Why they are grouped</div>
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>{g.why}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={eyebrow}>People in this group</div>
          {g.people.map((m) => (
            <button key={m.id} type="button" onClick={() => onPick(m.id)} style={rowBtn}>
              <div style={smallAv(tones[m.tone])}>{initials(m.name)}</div>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: c.textMuted }}>{m.role + ' · ' + m.note}</div>
              </div>
              <Chevron />
            </button>
          ))}
        </div>
      </div>
      <div style={panelFoot}>
        <button type="button" onClick={onTogglePromote} aria-pressed={promoted} style={toggleBtn(promoted)}>
          {promoted ? 'Watching this group' : 'Watch this group'}
        </button>
        <Link to="/events" style={outlineLink(c.purple)}>
          {g.ctaLabel}
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

// ---------- List view ----------
const first = (t) => {
  const f = t.split('. ')[0];
  return f.endsWith('.') ? f : f + '.';
};

function ListView({ sel, onPick }) {
  const row = (p, line) => {
    const tone = tones[p.tone];
    const selected = sel === p.id;
    return (
      <button
        key={p.id}
        className="nm-row"
        type="button"
        onClick={() => onPick(p)}
        aria-pressed={selected}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%', boxSizing: 'border-box', padding: '14px 16px', border: `1px solid ${selected ? c.yellow : c.lineCard}`, borderRadius: 16, background: c.card, color: c.text, textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 44, height: 44, borderRadius: 999, fontSize: 15, fontWeight: 700, background: tone.bg, color: tone.fg }}>
          {initials(p.name)}
        </div>
        <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', height: 22, padding: '0 9px', borderRadius: 999, fontSize: 11, fontWeight: 700, ...pillTones[p.pillKind || 'cool'] }}>
              {p.pill || p.tag || ''}
            </div>
          </div>
          <div style={{ fontSize: 13, color: c.textMuted }}>{p.role}</div>
          <div style={{ fontSize: 14, lineHeight: 1.4, color: c.textSoft }}>{line}</div>
        </div>
      </button>
    );
  };
  const sections = [
    { title: 'Act on this week', sub: inner.length + ' people on the inner ring', rows: inner.map((p) => row(p, first(p.why))) },
    { title: 'Warm', sub: warm.length + ' people, each one introduction away', rows: warm.map((p) => row(byId[p.id], first(p.why))) },
  ].concat(
    groups.map((g) => ({
      title: g.name,
      sub: g.people.length + ' people · ' + g.viaText.toLowerCase(),
      rows: g.people.map((m) => row(byId[m.id], m.note)),
    }))
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', boxSizing: 'border-box', padding: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {sections.map((sec) => (
        <div key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontFamily: serif, fontSize: 26, lineHeight: 1 }}>{sec.title}</div>
            <div style={{ fontSize: 14, color: c.textMuted }}>{sec.sub}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>{sec.rows}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Page ----------
export default function People() {
  const [st, setSt] = useState({ lens: 'goal', view: 'map', sel: null, open: null, gen: 0, intro: true, relens: false, done: {}, added: {}, promoted: {} });
  const go = (patch) => setSt((prev) => ({ ...prev, ...patch, intro: false }));

  const { sel, open, intro } = st;
  const drawing = intro || st.relens;

  // ---------- Positions ----------
  const pos = { me: { x: CX, y: CY } };
  inner.forEach((p) => {
    pos[p.id] = { x: p.x, y: p.y };
  });
  warm.forEach((p) => {
    pos[p.id] = { x: p.x, y: p.y };
  });
  groups.forEach((g) => {
    const isOpen = open === g.id;
    const d = Math.sqrt((g.x - CX) * (g.x - CX) + (g.y - CY) * (g.y - CY));
    const ux = (CX - g.x) / d;
    const uy = (CY - g.y) / d;
    pos[g.id] = isOpen ? { x: g.x + ux * 60, y: g.y + uy * 60 } : { x: g.x, y: g.y };
    g.people.forEach((m, i) => {
      const off = (i - (g.people.length - 1) / 2) * 74;
      const wob = i % 2 ? 12 : -12;
      pos[m.id] = { x: g.x - uy * off + ux * wob, y: g.y + ux * off + uy * wob };
    });
  });
  events.forEach((e) => {
    pos[e.id] = { x: e.x, y: e.y };
  });
  const openG = open ? groupById[open] : null;
  const hiddenByFan = (a) => !!openG && angDist(a, ang[openG.id]) < 45;

  // ---------- Lenses / edges ----------
  const lens = lensDefs[st.lens];
  let edgeList = lens.edges.slice();
  if (open && groupById[open]) edgeList = edgeList.concat(groupById[open].people.map((m) => ({ a: open, b: m.id, kind: 'fan' })));
  const linkedTo = (id) => edgeList.some((e) => (e.a === sel && e.b === id) || (e.b === sel && e.a === id));
  const isDim = (id) => sel && sel !== id && !linkedTo(id);

  const lensButtons = ['goal', 'who', 'where'].map((id) => ({
    id,
    label: lensDefs[id].label,
    active: st.lens === id,
    pick: () => go({ lens: id, sel: null, open: null, gen: st.gen + 1, relens: true }),
  }));
  const viewButtons = [
    { id: 'map', label: 'Map' },
    { id: 'list', label: 'List' },
  ].map((v) => ({ ...v, active: st.view === v.id, pick: () => go({ view: v.id, sel: null, open: null, relens: false }) }));

  // ---------- Orbits ----------
  const glowStyle = { position: 'absolute', ...box(CX - 300, CY - 300, 600, 600), borderRadius: 999, background: 'radial-gradient(circle, rgba(255,201,60,0.14) 0%, rgba(255,201,60,0) 62%)', pointerEvents: 'none' };
  const sweepStyle = {
    position: 'absolute',
    ...at(CX, CY, R2, R2),
    width: U(R2 * 2),
    height: U(R2 * 2),
    borderRadius: 999,
    background: 'conic-gradient(from 0deg, rgba(183,167,255,0) 0deg, rgba(183,167,255,0.16) 48deg, rgba(183,167,255,0) 70deg)',
    animation: 'nm-orbit 16s linear infinite',
    pointerEvents: 'none',
  };

  // ---------- Edges ----------
  const edges = edgeList
    .map((e, i) => {
      const A = pos[e.a];
      const B = pos[e.b];
      if (!A || !B) return null;
      const dx = B.x - A.x;
      const dy = B.y - A.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const hot = sel && (e.a === sel || e.b === sel);
      const dim = sel && !hot;
      const thin = e.kind === 'anchor' || e.kind === 'fan';
      const color = hot ? '#ffc93c' : st.lens === 'where' ? '#4be3c6' : '#b7a7ff';
      const t = e.t || 0.5;
      const mx = A.x + dx * t;
      const my = A.y + dy * t;
      const delay = (intro ? 500 : 60) + i * 60;
      const travel = (2.6 + (len / 400) * 1.6).toFixed(2);
      const op = dim ? 0.12 : 1;
      return {
        key: e.a + '-' + e.b + '-' + (e.kind || 'lens'),
        label: e.label || '',
        x1: A.x.toFixed(1),
        y1: A.y.toFixed(1),
        x2: B.x.toFixed(1),
        y2: B.y.toFixed(1),
        baseStyle: {
          stroke: color,
          strokeWidth: hot ? 2.5 : 1.5,
          strokeOpacity: (op * (hot ? 0.9 : thin ? 0.22 : 0.4)).toFixed(2),
          strokeDasharray: '1 1',
          ...(drawing ? { animation: `nm-draw2 .8s cubic-bezier(.2,.7,.2,1) ${delay}ms both` } : { strokeDashoffset: 0 }),
          ...(hot ? { filter: 'drop-shadow(0 0 6px rgba(255,201,60,.8))' } : {}),
        },
        flowStyle: {
          stroke: color,
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeOpacity: (op * (hot ? 1 : thin ? 0.35 : 0.7)).toFixed(2),
          strokeDasharray: '0.015 0.045',
          animation: 'nm-flow2 1.4s linear infinite' + (drawing ? `,nm-fade .6s ease ${delay + 500}ms both` : ''),
        },
        dotStyle: {
          position: 'absolute',
          '--ax': X(A.x),
          '--ay': Y(A.y),
          '--bx': X(B.x),
          '--by': Y(B.y),
          width: U(6),
          height: U(6),
          margin: `${U(-3)} 0 0 ${U(-3)}`,
          borderRadius: 999,
          background: hot ? '#ffd86b' : '#ffffff',
          boxShadow: `0 0 ${U(10)} ${color}`,
          animation: `nm-travel ${travel}s cubic-bezier(.45,0,.55,1) ${(drawing ? delay + 700 : 0) + i * 370}ms infinite`,
          opacity: 0,
          pointerEvents: 'none',
          ...(thin && !hot ? { display: 'none' } : {}),
        },
        labelStyle: {
          position: 'absolute',
          left: X(mx),
          top: Y(my),
          transform: 'translate(-50%,-50%)',
          boxSizing: 'border-box',
          height: U(26),
          display: e.label ? 'flex' : 'none',
          alignItems: 'center',
          padding: `0 ${U(11)}`,
          borderRadius: 999,
          fontSize: U(12),
          fontWeight: 600,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: dim ? 0.1 : 1,
          ...(drawing ? { animation: `nm-fade .5s ease ${delay + 450}ms both` } : {}),
          ...(hot
            ? { background: '#3d3210', border: '1px solid #ffc93c', color: '#ffd86b' }
            : { background: '#100c30', border: '1px solid #2c2360', color: '#cdc6ee' }),
        },
      };
    })
    .filter(Boolean);

  // ---------- Nodes ----------
  const miniNode = (p, i, extra) => {
    const tone = tones[p.tone];
    const P = pos[p.id];
    const selected = sel === p.id;
    const sz = p.sz || 48;
    return {
      key: p.id,
      name: p.name,
      tag: p.tag || '',
      initials: initials(p.name),
      selected,
      style: {
        position: 'absolute',
        ...at(P.x, P.y, 60, sz / 2),
        width: U(120),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: U(3),
        padding: 0,
        border: 0,
        background: 'transparent',
        color: c.text,
        cursor: 'pointer',
        textAlign: 'center',
        opacity: isDim(p.id) ? 0.25 : 1,
        animation: `nm-drift ${(3.8 + (i % 5) * 0.7).toFixed(1)}s ease-in-out ${(-(i * 0.9)).toFixed(1)}s infinite alternate`,
        ...extra,
      },
      avStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: U(sz),
        height: U(sz),
        marginBottom: U(3),
        borderRadius: 999,
        fontSize: U(sz * 0.31),
        fontWeight: 700,
        background: tone.bg,
        color: tone.fg,
        ...(selected
          ? { transform: 'scale(1.15)', animation: 'nm-selpulse 1.6s ease-out infinite' }
          : { boxShadow: `0 0 0 3px #100c30,0 0 0 4px ${tone.bg}66` }),
      },
      tagStyle: { fontSize: U(10.5), fontWeight: 600, color: c.textMuted, lineHeight: 1.2 },
      pick: () => go({ sel: selected ? null : p.id, open: p.group || null, relens: false }),
    };
  };

  const people = inner.map((p, i) => {
    const tone = tones[p.tone];
    const P = pos[p.id];
    const selected = sel === p.id;
    const sz = p.sz || 80;
    return {
      key: p.id,
      name: p.name,
      role: p.role,
      pill: p.pill,
      initials: initials(p.name),
      selected,
      style: {
        position: 'absolute',
        ...at(P.x, P.y, 95, sz / 2),
        width: U(190),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: U(3),
        padding: 0,
        border: 0,
        background: 'transparent',
        color: c.text,
        cursor: 'pointer',
        textAlign: 'center',
        opacity: isDim(p.id) ? 0.28 : 1,
        animation:
          (intro ? `nm-pop .6s cubic-bezier(.2,.8,.2,1) ${300 + i * 80}ms both,` : '') +
          `nm-drift ${(4.2 + i * 0.6).toFixed(1)}s ease-in-out ${(-(i * 1.3)).toFixed(1)}s infinite alternate`,
      },
      avStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: U(sz),
        height: U(sz),
        marginBottom: U(6),
        borderRadius: 999,
        fontSize: U(sz * 0.31),
        fontWeight: 700,
        background: tone.bg,
        color: tone.fg,
        ...(selected
          ? { transform: 'scale(1.1)', animation: 'nm-selpulse 1.6s ease-out infinite' }
          : { boxShadow: `0 0 0 4px #100c30,0 0 0 6px ${tone.bg}66,0 18px 40px -16px rgba(0,0,0,.8)` }),
      },
      pillStyle: { display: 'flex', alignItems: 'center', height: U(24), marginTop: U(3), padding: `0 ${U(11)}`, borderRadius: 999, fontSize: U(11.5), fontWeight: 700, ...pillTones[p.pillKind] },
      pick: () => go({ sel: selected ? null : p.id, open: null, relens: false }),
    };
  });

  const minis = warm.map((p, i) =>
    miniNode(p, i, {
      ...(hiddenByFan(ang[p.id]) ? { display: 'none' } : {}),
      ...(intro
        ? { animation: `nm-pop .5s cubic-bezier(.2,.8,.2,1) ${900 + i * 60}ms both,nm-drift ${(3.8 + (i % 5) * 0.7).toFixed(1)}s ease-in-out ${(-(i * 0.9)).toFixed(1)}s infinite alternate` }
        : {}),
    })
  );

  const groupsOut = groups.map((g, i) => {
    const P = pos[g.id];
    const selected = sel === g.id;
    const isOpen = open === g.id;
    return {
      key: g.id,
      name: g.name,
      tag: g.tag,
      count: '+' + g.people.length,
      selected,
      style: {
        position: 'absolute',
        ...at(P.x, P.y, 60, 28),
        width: U(120),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: U(3),
        padding: 0,
        border: 0,
        background: 'transparent',
        color: c.text,
        cursor: 'pointer',
        textAlign: 'center',
        opacity: sel && !selected && !isOpen && !linkedTo(g.id) ? 0.25 : 1,
        ...(!isOpen && hiddenByFan(ang[g.id]) ? { display: 'none' } : {}),
        ...(intro ? { animation: `nm-pop .5s cubic-bezier(.2,.8,.2,1) ${1100 + i * 80}ms both` } : {}),
      },
      avStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: U(56),
        height: U(56),
        marginBottom: U(3),
        borderRadius: 999,
        background: '#1a1350',
        color: c.lilacLight,
        border: `1.5px dashed ${selected || isOpen ? '#ffc93c' : '#b7a7ff'}`,
        ...(selected ? { animation: 'nm-selpulse 1.6s ease-out infinite' } : {}),
      },
      tagStyle: { fontSize: U(10.5), fontWeight: 600, color: c.textMuted, lineHeight: 1.2 },
      pick: () => go({ sel: isOpen && selected ? null : g.id, open: isOpen && selected ? null : g.id, relens: false }),
    };
  });

  const members =
    open && groupById[open]
      ? groupById[open].people.map((m, i) => {
          const G = pos[open];
          const P = pos[m.id];
          return miniNode({ ...m, tag: '' }, i, {
            '--fx': X(G.x - P.x),
            '--fy': Y(G.y - P.y),
            animation: `nm-fan .5s cubic-bezier(.2,.8,.2,1) ${i * 70}ms both`,
          });
        })
      : [];

  const eventsOut = events.map((e, i) => {
    const P = pos[e.id];
    const selected = sel === e.id;
    return {
      key: e.id,
      title: e.title,
      meta: e.meta,
      tag: e.tag,
      selected,
      style: {
        position: 'absolute',
        ...at(P.x, P.y, 140, 40),
        width: U(280),
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: U(3),
        padding: `${U(11)} ${U(14)}`,
        borderRadius: U(18),
        background: c.card,
        border: `1px solid ${selected ? '#ffc93c' : '#2c2360'}`,
        color: c.text,
        cursor: 'pointer',
        opacity: isDim(e.id) ? 0.28 : 1,
        boxShadow: selected ? '0 0 0 4px rgba(255,201,60,.3)' : '0 24px 48px -20px rgba(0,0,0,.8)',
        ...(intro ? { animation: `nm-pop .6s cubic-bezier(.2,.8,.2,1) ${800 + i * 120}ms both` } : {}),
      },
      pick: () => go({ sel: selected ? null : e.id, open: null, relens: false }),
    };
  });

  // ---------- Camera ----------
  let worldStyle = { position: 'absolute', inset: 0, transformOrigin: '0 0', '--tx': '0px', '--ty': '0px', '--s': 1, transform: 'translate(0px,0px) scale(1)' };
  if (sel && pos[sel]) {
    const s = 0.86;
    const P = pos[sel];
    const tx = clamp(290 - s * P.x, 562 - W * s, 0);
    const ty = clamp(H / 2 - s * P.y, 0, H - H * s);
    worldStyle = {
      position: 'absolute',
      inset: 0,
      transformOrigin: '0 0',
      '--tx': X(tx),
      '--ty': Y(ty),
      '--s': s,
      transform: `translate(${X(tx)},${Y(ty)}) scale(${s})`,
      animation: 'nm-zoom .7s cubic-bezier(.2,.8,.2,1) both',
    };
  }
  const meStyle = {
    position: 'absolute',
    ...at(CX, CY, 160, 58),
    width: U(320),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: U(4),
    textAlign: 'center',
    pointerEvents: 'none',
    opacity: sel && !linkedTo('me') ? 0.35 : 1,
    ...(intro ? { animation: 'nm-pop .7s cubic-bezier(.2,.8,.2,1) both' } : {}),
  };
  const goalStyle = { display: st.lens === 'goal' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', gap: U(8), marginTop: U(10) };
  const veilStyle = { position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg,rgba(13,10,36,0) 40%,rgba(13,10,36,.55) 100%)', transition: 'opacity .5s ease', opacity: sel ? 1 : 0 };
  const showList = st.view === 'list';
  const legendStyle = { position: 'absolute', right: 20, top: 18, zIndex: 5, display: showList ? 'none' : 'flex', alignItems: 'center', gap: 16, height: 34, padding: '0 16px', background: 'rgba(13,10,36,0.8)', border: `1px solid ${c.lineCard}`, borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#cdc6ee', whiteSpace: 'nowrap' };

  // ---------- Panels ----------
  const selPerson = sel && byId[sel] ? byId[sel] : null;
  const selEvent = sel && eventById[sel] ? eventById[sel] : null;
  const selGroup = sel && groupById[sel] ? groupById[sel] : null;
  const back = () => go({ sel: null, open: null, relens: false });
  const pickRow = (p) => go({ sel: p.id, open: p.group || null, relens: false });

  return (
    <Shell fullHeight>
      {/* MAIN */}
      <div style={{ flexGrow: 1, minWidth: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '40px 64px 40px 64px' }}>
        {/* Header: title + lens switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <h1 style={{ margin: 0, fontFamily: serif, fontWeight: 400, fontSize: 48, lineHeight: 1, letterSpacing: '-0.02em' }}>People</h1>
            <div style={{ display: 'flex', alignItems: 'center', height: 34, padding: '0 14px', borderRadius: 999, background: c.card, border: `1px solid ${c.lineCard}`, fontSize: 14, fontWeight: 600, color: '#cdc6ee', whiteSpace: 'nowrap' }}>
              {countLine}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', flexShrink: 0, gap: 4, padding: 4, background: c.card, border: `1px solid ${c.lineCard}`, borderRadius: 999 }}>
              {viewButtons.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={v.pick}
                  aria-pressed={v.active}
                  style={{ height: 42, padding: '0 18px', border: 0, borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: 'pointer', ...(v.active ? { background: c.purpleSoft, color: '#ffffff' } : { background: 'transparent', color: c.lilac }) }}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexShrink: 0, gap: 6, padding: 6, background: c.card, border: `1px solid ${c.lineCard}`, borderRadius: 999 }}>
              {lensButtons.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={l.pick}
                  aria-pressed={l.active}
                  style={{ height: 42, padding: '0 20px', border: 0, borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', ...(l.active ? { background: c.purple, color: '#ffffff' } : { background: 'transparent', color: c.lilac }) }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STAGE (fills whatever height is left) */}
        <div className="nm-stage" style={{ position: 'relative', flexGrow: 1, minHeight: 0, overflow: 'hidden', borderRadius: 28, background: c.stage, border: `1px solid ${c.lineCard}` }}>
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(183,167,255,0.13) 1px, transparent 1.2px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: -160, top: -160, width: 520, height: 520, borderRadius: 999, background: 'radial-gradient(circle, rgba(91,61,245,0.22) 0%, rgba(91,61,245,0) 62%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: -160, bottom: -160, width: 520, height: 520, borderRadius: 999, background: 'radial-gradient(circle, rgba(20,200,168,0.14) 0%, rgba(20,200,168,0) 62%)', pointerEvents: 'none' }} />

          {/* Legend */}
          <div style={legendStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: c.yellow }} />
              You
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: c.purple }} />
              Act on this week
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: c.purple, opacity: 0.7 }} />
              Warm
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 11, height: 11, borderRadius: 999, border: '1px dashed #b7a7ff' }} />
              Group
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: c.teal }} />
              Event
            </div>
          </div>

          {/* SCENE (design size 1062x940, scaled by --u) */}
          <div className="nm-scene" style={showList ? { display: 'none' } : undefined}>
            {/* WORLD (pans and zooms toward the selection) */}
            <div className="nm-world" style={worldStyle}>
              {/* Glow, radar sweep and orbits */}
              <div style={glowStyle} />
              <div style={sweepStyle} />

              {/* Edges (svg stretches with the stage; strokes stay 2px) */}
              <svg className="nm-svg" viewBox="0 0 1062 940" preserveAspectRatio="none" aria-hidden="true">
                {edges.map((e) => (
                  <g key={e.key}>
                    <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} pathLength="1" vectorEffect="non-scaling-stroke" style={e.baseStyle} />
                    <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} pathLength="1" vectorEffect="non-scaling-stroke" style={e.flowStyle} />
                  </g>
                ))}
              </svg>
              {edges.map((e) => (
                <Fragment key={e.key}>
                  <div className="nm-edge" style={e.dotStyle} />
                  <div className="nm-edge" style={e.labelStyle}>
                    {e.label}
                  </div>
                </Fragment>
              ))}

              {/* Warm contacts (compact) */}
              {minis.map((m) => (
                <button key={m.key} className="nm-mini" type="button" onClick={m.pick} aria-pressed={m.selected} style={m.style}>
                  <div className="nm-mav" style={m.avStyle}>
                    {m.initials}
                  </div>
                  <div style={{ fontSize: U(12), fontWeight: 700, lineHeight: 1.2 }}>{m.name}</div>
                  <div style={m.tagStyle}>{m.tag}</div>
                </button>
              ))}

              {/* Groups (collapsed people) */}
              {groupsOut.map((g) => (
                <button key={g.key} className="nm-mini" type="button" onClick={g.pick} aria-pressed={g.selected} style={g.style}>
                  <div className="nm-mav" style={g.avStyle}>
                    <div style={{ display: 'flex', marginBottom: U(2) }}>
                      <div style={{ width: U(9), height: U(9), borderRadius: 999, background: '#b7a7ff' }} />
                      <div style={{ width: U(9), height: U(9), marginLeft: U(-3), borderRadius: 999, background: '#8f7cf5' }} />
                      <div style={{ width: U(9), height: U(9), marginLeft: U(-3), borderRadius: 999, background: '#5b3df5' }} />
                    </div>
                    <div style={{ fontSize: U(13), fontWeight: 700 }}>{g.count}</div>
                  </div>
                  <div style={{ fontSize: U(12), fontWeight: 700, lineHeight: 1.2 }}>{g.name}</div>
                  <div style={g.tagStyle}>{g.tag}</div>
                </button>
              ))}

              {/* Expanded group members */}
              {members.map((m) => (
                <button key={m.key} className="nm-mini" type="button" onClick={m.pick} aria-pressed={m.selected} style={m.style}>
                  <div className="nm-mav" style={m.avStyle}>
                    {m.initials}
                  </div>
                  <div style={{ fontSize: U(12), fontWeight: 700, lineHeight: 1.2 }}>{m.name}</div>
                </button>
              ))}

              {/* Event nodes */}
              {eventsOut.map((ev) => (
                <button key={ev.key} className="nm-ev" type="button" onClick={ev.pick} aria-pressed={ev.selected} style={ev.style}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: U(10) }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: U(30), height: U(30), borderRadius: U(9), background: c.teal, color: c.ink }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1440" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: U(16), height: U(16) }}>
                        <rect x="3" y="5" width="18" height="16" rx="3" />
                        <path d="M3 10h18M8 3v4M16 3v4" />
                      </svg>
                    </div>
                    <div style={{ fontSize: U(16), fontWeight: 700, lineHeight: 1.2, textAlign: 'left' }}>{ev.title}</div>
                  </div>
                  <div style={{ fontSize: U(13), color: c.textMuted, textAlign: 'left' }}>{ev.meta}</div>
                  <div style={{ fontSize: U(13), fontWeight: 600, color: c.tealBright, textAlign: 'left' }}>{ev.tag}</div>
                </button>
              ))}

              {/* Person nodes */}
              {people.map((n) => (
                <button key={n.key} className="nm-node" type="button" onClick={n.pick} aria-pressed={n.selected} style={n.style}>
                  <div className="nm-av" style={n.avStyle}>
                    {n.initials}
                  </div>
                  <div style={{ fontSize: U(17), fontWeight: 700, lineHeight: 1.15 }}>{n.name}</div>
                  <div style={{ fontSize: U(13), color: c.textMuted, lineHeight: 1.3 }}>{n.role}</div>
                  <div style={n.pillStyle}>{n.pill}</div>
                </button>
              ))}

              {/* You (center) */}
              <div style={meStyle}>
                <div style={{ position: 'relative', width: U(116), height: U(116) }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '2px solid #ffc93c', animation: 'nm-pulse 2.8s ease-out infinite' }} />
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '2px solid #ffc93c', animation: 'nm-pulse 2.8s ease-out 1.4s infinite' }} />
                  <div style={{ position: 'absolute', inset: U(-14), borderRadius: 999, border: '1px dashed rgba(255,201,60,0.5)', animation: 'nm-orbit 24s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: c.yellow, color: c.ink, fontFamily: serif, fontSize: U(52), boxShadow: `0 0 0 ${U(8)} rgba(255,201,60,0.18), 0 30px 60px -20px rgba(255,201,60,0.7)` }}>
                    H
                  </div>
                </div>
                <div style={{ fontSize: U(20), fontWeight: 700 }}>Hank (you)</div>
                <div style={{ fontSize: U(14), color: c.textMuted }}>Founder · [Product name]</div>
                <div style={goalStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: U(8), height: U(38), padding: `0 ${U(18)}`, borderRadius: 999, background: c.yellowDeep, border: '1px solid #7a6420', color: c.yellowSoft, fontSize: U(15), fontWeight: 700, whiteSpace: 'nowrap' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd86b" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ width: U(16), height: U(16) }}>
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4.5" />
                      <circle cx="12" cy="12" r="1" />
                    </svg>
                    Goal: 5 design partners
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIST VIEW */}
          {showList && <ListView sel={sel} onPick={pickRow} />}

          {/* Dim veil when a panel is open */}
          <div style={veilStyle} />

          {/* GROUP PANEL */}
          {selGroup && (
            <GroupPanel
              g={selGroup}
              promoted={!!st.promoted[selGroup.id]}
              onTogglePromote={() => go({ promoted: { ...st.promoted, [selGroup.id]: !st.promoted[selGroup.id] } })}
              onPick={(id) => go({ sel: id, open: selGroup.id, relens: false })}
              onBack={back}
            />
          )}

          {/* PERSON PANEL */}
          {selPerson && (
            <PersonPanel
              p={selPerson}
              done={!!st.done[selPerson.id]}
              onToggleDone={() => go({ done: { ...st.done, [selPerson.id]: !st.done[selPerson.id] } })}
              onBack={back}
            />
          )}

          {/* EVENT PANEL */}
          {selEvent && (
            <EventPanel
              e={selEvent}
              added={!!st.added[selEvent.id]}
              onToggleAdd={() => go({ added: { ...st.added, [selEvent.id]: !st.added[selEvent.id] } })}
              onPick={(id) => go({ sel: id, open: null, relens: false })}
              onBack={back}
            />
          )}
        </div>

        {/* Companion hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, boxSizing: 'border-box', flexShrink: 0, minHeight: 72, padding: '12px 20px 12px 20px', background: c.card, border: `1px solid ${c.lineCard}`, borderRadius: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 44, height: 44, borderRadius: 999, background: c.yellow, color: c.ink }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1440" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
              <path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
            </svg>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.yellowSoft }}>Shortest path this week</div>
            <div style={{ fontSize: 16, lineHeight: 1.45 }}>{lens.hint}</div>
          </div>
          <Link to="/plan" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, height: 46, padding: '0 22px', borderRadius: 999, background: c.purple, color: '#ffffff', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            See it in your plan
          </Link>
        </div>
      </div>
    </Shell>
  );
}
