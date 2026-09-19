import { useState } from 'react';
import Shell from '../components/Shell.jsx';
import { c, serif } from '../theme.js';

// --- AI integration point -------------------------------------------------
// Replace the canned reply with a call to the companion backend once it
// exists. The schedule for the visible week is passed along as context so the
// answer can reference real blocks; shape of the response is { text }.
export function askCompanion(query, context) {
  return Promise.resolve({
    text:
      'Connect the companion backend to answer this. It will have your ' +
      context.items.length +
      ' blocks for ' +
      context.week +
      ' as context, so it can suggest times, flag conflicts and prep you for people you are about to meet.',
  });
}

const START = 9;
const END = 17; // 9 am to 5 pm, the whole grid, never scrolled
const SPAN = END - START;
const pct = (t) => ((t - START) / SPAN) * 100;

const KINDS = {
  class: { bg: '#2a2660', border: '#4b4691', text: '#d6d2ee', meta: '#9994bf' },
  event: { bg: '#14e0bb', border: '#ffffff', text: '#03291f', meta: '#0a4a3c' },
  study: { bg: '#2d2b3d', border: '#67637f', text: '#d0cde0', meta: '#928eab' },
  meeting: { bg: '#ff6a5c', border: '#ffffff', text: '#3a0805', meta: '#5c1710' },
};

// Monday Sep 21 through Friday Sep 25. "Now" is Wednesday at 11:20 am, so
// Monday and Tuesday are shown as past.
const TODAY_INDEX = 2;
const NOW_TIME = 11.33;

const DAYS = [
  { day: 'Mon', date: '21', note: '3 classes' },
  { day: 'Tue', date: '22', note: '2 classes · 1 event' },
  { day: 'Wed', date: '23', note: 'Today · 4 blocks' },
  { day: 'Thu', date: '24', note: '2 classes · 1 event' },
  { day: 'Fri', date: '25', note: '2 classes · 1 event' },
];

const ITEMS = [
  // Monday
  { d: 0, kind: 'class', start: 9.5, end: 10.75, title: 'CS 348 · Distributed Systems', meta: '9:30–10:45 · Gates 104' },
  { d: 0, kind: 'class', start: 11, end: 12.25, title: 'ECON 202 · Macroeconomics', meta: '11:00–12:15 · Hobbs 210' },
  { d: 0, kind: 'event', start: 12.5, end: 13.5, title: 'ACM Club info session', meta: '12:30–1:30 · Union hall' },
  { d: 0, kind: 'class', start: 14, end: 15.25, title: 'CS 348 Lab', meta: '2:00–3:15 · Gates B12' },

  // Tuesday
  { d: 1, kind: 'class', start: 10, end: 11.33, title: 'STAT 210 · Inference', meta: '10:00–11:20 · Rhodes 301' },
  { d: 1, kind: 'study', start: 12, end: 13, title: 'Study group · problem set', meta: '12:00–1:00 · Library 2F' },
  { d: 1, kind: 'class', start: 15, end: 16.33, title: 'PHIL 105 · Ethics of Tech', meta: '3:00–4:20 · Sage 120' },

  // Wednesday (today)
  { d: 2, kind: 'class', start: 9.5, end: 10.75, title: 'CS 348 · Distributed Systems', meta: '9:30–10:45 · Gates 104' },
  { d: 2, kind: 'meeting', start: 11, end: 11.75, title: 'Coffee with Maya Chen', meta: '11:00–11:45 · Corner Café' },
  { d: 2, kind: 'class', start: 13, end: 14.25, title: 'ECON 202 · Macroeconomics', meta: '1:00–2:15 · Hobbs 210' },
  { d: 2, kind: 'study', start: 15.5, end: 16.5, title: 'Office hours · Prof. Alvarez', meta: '3:30–4:30 · Gates 417' },

  // Thursday
  { d: 3, kind: 'class', start: 10, end: 11.33, title: 'STAT 210 · Inference', meta: '10:00–11:20 · Rhodes 301' },
  { d: 3, kind: 'event', start: 12.5, end: 14, title: 'Career fair · Climate tech row', meta: '12:30–2:00 · Field house' },
  { d: 3, kind: 'class', start: 15, end: 16.33, title: 'PHIL 105 · Ethics of Tech', meta: '3:00–4:20 · Sage 120' },

  // Friday
  { d: 4, kind: 'class', start: 9.5, end: 10.75, title: 'CS 348 · Distributed Systems', meta: '9:30–10:45 · Gates 104' },
  { d: 4, kind: 'class', start: 11, end: 12.25, title: 'ECON 202 · Macroeconomics', meta: '11:00–12:15 · Hobbs 210' },
  { d: 4, kind: 'event', start: 15, end: 16.75, title: 'Hackathon kickoff', meta: '3:00–4:45 · Innovation lab' },
];

const HOURS = [];
for (let h = START; h <= END; h++) {
  const hr = h > 12 ? h - 12 : h;
  HOURS.push({ h, top: pct(h), label: hr + (h < 12 ? ' am' : ' pm'), edge: h === START || h === END });
}

const WEEK_LABEL = 'Mon Sep 21 – Fri Sep 25';
const SUGGESTIONS = ['Where is my next free hour?', 'Who am I seeing this week?', 'Prep me for the career fair'];

const navBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 999,
  background: c.card,
  border: `2px solid ${c.lineStrong}`,
  color: c.lilac,
  cursor: 'pointer',
};

const legendSwatch = (bg) => ({ width: 11, height: 11, borderRadius: 4, background: bg });
const legendItem = { display: 'flex', alignItems: 'center', gap: 9 };

export default function Schedule() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState(null);
  const [pending, setPending] = useState(false);

  const runAsk = (q) => {
    if (!q || !q.trim()) return;
    setPending(true);
    askCompanion(q.trim(), { items: ITEMS, week: WEEK_LABEL })
      .then((res) => {
        setPending(false);
        setAnswer(res.text);
      })
      .catch(() => {
        setPending(false);
        setAnswer('The companion is not connected yet.');
      });
  };

  const onAsk = (e) => {
    e.preventDefault();
    runAsk(query);
  };

  const hasAnswer = !!answer || pending;
  const shownAnswer = pending ? 'Thinking…' : answer;

  return (
    <Shell fullHeight>
      {/* MAIN */}
      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          padding: '40px 48px 40px 48px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: 48,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Schedule
            </h1>
            <div style={{ fontSize: 17, color: c.textMuted }}>{WEEK_LABEL} · your week at a glance, 9 am to 5 pm.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" aria-label="Previous week" style={navBtn}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 44,
                padding: '0 22px',
                borderRadius: 999,
                background: c.cardAlt,
                border: `2px solid ${c.lineStrong}`,
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Today
            </button>
            <button type="button" aria-label="Next week" style={navBtn}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* AI bar: the single hook the backend fills in later */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '18px 22px',
            background: c.card,
            border: `1px solid ${c.lineCard}`,
            borderRadius: 22,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: 999,
                background: c.purple,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
              </svg>
            </div>
            <form
              onSubmit={onAsk}
              style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 52,
                padding: '0 6px 0 20px',
                background: c.cardInput,
                border: `2px solid ${c.lineStrong}`,
                borderRadius: 999,
              }}
            >
              <label
                htmlFor="ask"
                style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
              >
                Ask your companion about this week
              </label>
              <input
                id="ask"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your week…"
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
                type="submit"
                aria-label="Ask"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  border: 0,
                  borderRadius: 999,
                  background: c.purple,
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="16"
                  height="16"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {SUGGESTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setQuery(label);
                    runAsk(label);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 40,
                    padding: '0 16px',
                    borderRadius: 999,
                    background: c.cardAlt,
                    border: `1px solid ${c.lineStrong}`,
                    color: '#cfc6ff',
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {hasAnswer && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '14px 18px',
                background: c.cardAlt,
                border: `1px solid ${c.lineStrong}`,
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  paddingTop: 2,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: c.lilac,
                }}
              >
                Companion
              </div>
              <div
                style={{
                  flexGrow: 1,
                  maxHeight: 48,
                  overflow: 'hidden',
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: c.textSoft,
                }}
              >
                {shownAnswer}
              </div>
            </div>
          )}
        </div>

        {/* Calendar: fills the rest of the screen, no scrolling */}
        <div
          style={{
            flexGrow: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px 24px 24px',
            background: c.card,
            border: `1px solid ${c.lineCard}`,
            borderRadius: 28,
          }}
        >
          {/* Day headers */}
          <div style={{ display: 'flex', gap: 0, paddingBottom: 14 }}>
            <div style={{ width: 66, flexShrink: 0 }} />
            {DAYS.map((d, i) => {
              const past = i < TODAY_INDEX;
              const isToday = i === TODAY_INDEX;
              const note = isToday ? d.note : past ? 'Done' : d.note;
              return (
                <div
                  key={d.day}
                  style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    padding: '0 8px',
                    ...(past ? { opacity: 0.4 } : {}),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: c.textMuted,
                      }}
                    >
                      {d.day}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 30,
                        height: 30,
                        padding: '0 8px',
                        borderRadius: 10,
                        fontFamily: serif,
                        fontSize: 20,
                        lineHeight: 1,
                        background: isToday ? c.purple : c.cardAlt,
                        color: isToday ? '#ffffff' : c.textSoft,
                      }}
                    >
                      {d.date}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: c.textFaint }}>{note}</div>
                </div>
              );
            })}
          </div>

          {/* Hour grid */}
          <div style={{ flexGrow: 1, minHeight: 0, display: 'flex' }}>
            {/* time gutter */}
            <div style={{ position: 'relative', width: 66, flexShrink: 0 }}>
              {HOURS.map((h) => (
                <div
                  key={h.h}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: `${h.top}%`,
                    transform: 'translateY(-50%)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: c.textDim,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h.label}
                </div>
              ))}
            </div>
            {/* columns */}
            <div style={{ position: 'relative', flexGrow: 1, minWidth: 0 }}>
              {HOURS.map((h) => (
                <div
                  key={h.h}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${h.top}%`,
                    height: 1,
                    background: h.edge ? c.lineStrong : c.cardAlt,
                  }}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                }}
              >
                {DAYS.map((d, i) => {
                  const past = i < TODAY_INDEX;
                  const isToday = i === TODAY_INDEX;
                  return (
                    <div
                      key={d.day}
                      style={{
                        position: 'relative',
                        height: '100%',
                        padding: '0 6px',
                        borderLeft: `1px solid ${c.cardAlt}`,
                        ...(past ? { opacity: 0.34 } : {}),
                        ...(isToday ? { background: 'rgba(91,61,245,0.07)' } : {}),
                      }}
                    >
                      {isToday && (
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: `${pct(NOW_TIME)}%`,
                            height: 2,
                            background: c.coral,
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              left: -5,
                              top: -4,
                              width: 10,
                              height: 10,
                              borderRadius: 999,
                              background: c.coral,
                            }}
                          />
                        </div>
                      )}
                      {ITEMS.filter((it) => it.d === i).map((it) => {
                        const k = KINDS[it.kind];
                        const top = pct(it.start);
                        const height = pct(it.end) - pct(it.start);
                        // Short blocks lose the second line rather than clipping it; the full
                        // detail stays in the tooltip.
                        const tight = it.end - it.start <= 0.8;
                        return (
                          <div
                            key={it.title + it.start}
                            title={it.title + ' · ' + it.meta}
                            style={{
                              position: 'absolute',
                              left: 4,
                              right: 4,
                              top: `${top}%`,
                              height: `calc(${height}% - 4px)`,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              gap: 3,
                              overflow: 'hidden',
                              borderRadius: 12,
                              background: k.bg,
                              borderLeft: `3px solid ${k.border}`,
                              padding: tight ? '4px 10px' : '8px 10px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                lineHeight: 1.25,
                                overflow: 'hidden',
                                color: k.text,
                              }}
                            >
                              {it.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                lineHeight: 1.3,
                                color: k.meta,
                                ...(tight ? { display: 'none' } : {}),
                              }}
                            >
                              {it.meta}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              paddingTop: 16,
              fontSize: 14,
              color: c.textMuted,
            }}
          >
            <div style={legendItem}>
              <div style={legendSwatch('#4b4691')} />
              Class
            </div>
            <div style={legendItem}>
              <div style={legendSwatch('#14e0bb')} />
              Event
            </div>
            <div style={legendItem}>
              <div style={legendSwatch('#67637f')} />
              Study & office hours
            </div>
            <div style={legendItem}>
              <div style={legendSwatch('#ff6a5c')} />
              Coffee chat
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 13, color: c.textDim }}>Faded days have already passed.</div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
