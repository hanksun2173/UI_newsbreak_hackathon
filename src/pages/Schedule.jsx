import { useEffect, useState } from 'react';
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
].map((it, idx) => ({ ...it, id: 'b' + idx }));

// Placeholder detail records, keyed by block title. A meeting carries the
// person, an event carries the event, a class carries the course. Swap the
// whole map for backend data later; the shape is what the popup renders.
const BLOCK_DETAILS = {
  'Coffee with Maya Chen': {
    badge: 'Coffee chat',
    person: { initials: 'MC', name: 'Maya Chen', role: 'Design lead · Lumen Labs' },
    fields: [
      { label: 'How you met', value: 'Demo Night on Sep 12, introduced by Priya Nair' },
      { label: 'Last contact', value: 'Sep 14 · you sent the onboarding article' },
      { label: 'Mutual connections', value: 'Priya Nair, Ana Ruiz, Tom Beck' },
      { label: 'Works on', value: 'Onboarding, design systems, local meetups' },
      { label: 'Looking for', value: 'A front-end contractor for the Q4 rebuild' },
      { label: 'You can offer', value: 'An intro to Daniel Okafor at Verdant' },
      { label: 'Contact', value: 'maya.chen@lumenlabs.example · @mayacchen' },
      { label: 'Where', value: 'Corner Café, 2 blocks from Gates' },
      { label: 'Companion note', value: 'She mentioned an onboarding revamp last time. Ask how it landed, then offer the Daniel intro before you leave.', span: true },
    ],
    actions: ['Open prep brief', 'Send a message'],
  },
  'Career fair · Climate tech row': {
    badge: 'Event',
    fields: [
      { label: 'Host', value: 'University Career Center' },
      { label: 'Format', value: 'Booth fair, drop in any time' },
      { label: 'Where', value: 'Field house, north entrance' },
      { label: 'Turnout', value: '14 employers · 380 students registered' },
      { label: 'People you know', value: 'Daniel Okafor (recruiter, Verdant), Ana Ruiz' },
      { label: 'Focus areas', value: 'Climate tech, energy, hardware' },
      { label: 'Cost', value: 'Free with student ID' },
      { label: 'Your RSVP', value: 'Registered on Sep 8' },
      { label: 'Companion note', value: 'Verdant and Lumen both have booths in this row. Six résumés is enough, and Daniel said to find him before 1:30.', span: true },
    ],
    actions: ['Open prep brief', 'See who is going'],
  },
  'Hackathon kickoff': {
    badge: 'Event',
    fields: [
      { label: 'Host', value: 'Northwind Labs with the ACM chapter' },
      { label: 'Format', value: 'Kickoff talk, then team formation' },
      { label: 'Where', value: 'Innovation lab, building C' },
      { label: 'Turnout', value: '120 registered · 31 teams so far' },
      { label: 'People you know', value: 'Priya Nair, Maya Chen, Daniel Okafor (judge)' },
      { label: 'Tracks', value: 'Climate, health, developer tools' },
      { label: 'Prizes', value: 'Interview slots with four sponsors' },
      { label: 'Bring', value: 'Laptop, charger, one idea worth pitching' },
      { label: 'Companion note', value: 'You still need two teammates. Priya is forming a climate team and has one seat left.', span: true },
    ],
    actions: ['Open prep brief', 'See who is going'],
  },
  'ACM Club info session': {
    badge: 'Event',
    fields: [
      { label: 'Host', value: 'ACM student chapter' },
      { label: 'Format', value: 'Short talk, then pizza' },
      { label: 'Where', value: 'Union hall, room 2B' },
      { label: 'Turnout', value: '48 going · 12 maybe' },
      { label: 'People you know', value: 'Priya Nair (organizer), Ana Ruiz' },
      { label: 'Topics', value: 'Club projects, hackathon teams, officer roles' },
      { label: 'Cost', value: 'Free · pizza provided' },
      { label: 'Your RSVP', value: 'Going · added Sep 16' },
      { label: 'Companion note', value: 'This one has passed. Priya ran sign-ups, so message her if you still want on the hackathon list.', span: true },
    ],
    actions: ['Open recap', 'See who went'],
  },
  'CS 348 · Distributed Systems': {
    badge: 'Class',
    fields: [
      { label: 'Instructor', value: 'Prof. Renata Alvarez' },
      { label: 'Room', value: 'Gates 104, third floor' },
      { label: 'Format', value: 'Lecture · slides posted after' },
      { label: 'This week', value: 'Lecture 12 — consensus and Raft' },
      { label: 'Next deadline', value: 'PS4 due Friday, 11:59 pm' },
      { label: 'Grading', value: 'Problem sets 40% · project 35% · final 25%' },
      { label: 'Classmates you know', value: 'Ana Ruiz, Tom Beck, and nine others', span: true },
    ],
    actions: ['Open course page', 'Add a reminder'],
  },
  'ECON 202 · Macroeconomics': {
    badge: 'Class',
    fields: [
      { label: 'Instructor', value: 'Prof. Ian Whitfield' },
      { label: 'Room', value: 'Hobbs 210' },
      { label: 'Format', value: 'Lecture plus Thursday section' },
      { label: 'This week', value: 'Monetary policy, part two' },
      { label: 'Next deadline', value: 'Essay draft due Monday' },
      { label: 'Grading', value: 'Essays 50% · midterms 40% · attendance 10%' },
      { label: 'Classmates you know', value: 'Jordan Pike, Sofia Lindqvist', span: true },
    ],
    actions: ['Open course page', 'Add a reminder'],
  },
  'STAT 210 · Inference': {
    badge: 'Class',
    fields: [
      { label: 'Instructor', value: 'Prof. Dara Osei' },
      { label: 'Room', value: 'Rhodes 301' },
      { label: 'Format', value: 'Lecture · laptops closed' },
      { label: 'This week', value: 'Hypothesis testing II' },
      { label: 'Next deadline', value: 'Lab report due Thursday' },
      { label: 'Grading', value: 'Labs 35% · quizzes 25% · final 40%' },
      { label: 'Classmates you know', value: 'Tom Beck, Mei Tanaka', span: true },
    ],
    actions: ['Open course page', 'Add a reminder'],
  },
  'PHIL 105 · Ethics of Tech': {
    badge: 'Class',
    fields: [
      { label: 'Instructor', value: 'Prof. Nils Hagen' },
      { label: 'Room', value: 'Sage 120' },
      { label: 'Format', value: 'Seminar · students lead discussion' },
      { label: 'This week', value: 'Reading: Nissenbaum on privacy' },
      { label: 'Next deadline', value: 'Response paper due Tuesday' },
      { label: 'Grading', value: 'Papers 55% · participation 25% · lead 20%' },
      { label: 'Classmates you know', value: 'Ana Ruiz, Jordan Pike', span: true },
    ],
    actions: ['Open course page', 'Add a reminder'],
  },
  'CS 348 Lab': {
    badge: 'Class',
    fields: [
      { label: 'Led by', value: 'Sam Whitaker, teaching assistant' },
      { label: 'Room', value: 'Gates B12' },
      { label: 'Format', value: 'Hands on · bring a laptop' },
      { label: 'This week', value: 'Lab 6 — replication and failover' },
      { label: 'Next deadline', value: 'Check off before you leave' },
      { label: 'Pairing', value: 'Paired with Tom Beck this week' },
      { label: 'Classmates you know', value: 'Tom Beck, Mei Tanaka', span: true },
    ],
    actions: ['Open course page', 'Add a reminder'],
  },
  'Study group · problem set': {
    badge: 'Study',
    fields: [
      { label: 'Who is coming', value: 'Ana Ruiz, Tom Beck, Jordan Pike' },
      { label: 'Where', value: 'Library 2F · room held until 1:15' },
      { label: 'Focus', value: 'PS4, problems three through five' },
      { label: 'Bring', value: 'Laptop and lecture notes' },
      { label: 'Booked by', value: 'You, on Sep 15' },
      { label: 'Recurring', value: 'Every Tuesday this term' },
      { label: 'Companion note', value: 'Ana asked for your notes from lecture 11. Bring them and you can skip the recap.', span: true },
    ],
    actions: ['Open notes', 'Add a reminder'],
  },
  'Office hours · Prof. Alvarez': {
    badge: 'Study',
    fields: [
      { label: 'Instructor', value: 'Prof. Renata Alvarez' },
      { label: 'Room', value: 'Gates 417' },
      { label: 'Format', value: 'Drop in · queue sheet on the door' },
      { label: 'Your question', value: 'Scope for the term project' },
      { label: 'Typical wait', value: 'About 10 minutes' },
      { label: 'Sign up', value: 'Sheet posts Wednesday at 9 am' },
      { label: 'Companion note', value: 'Bring the one page outline. She turns away vague project questions.', span: true },
    ],
    actions: ['Open course page', 'Add a reminder'],
  },
};

const ACCENT = { class: '#8f88ff', event: '#14e0bb', study: '#a49fc4', meeting: '#ff6a5c' };

// Detail popup: opens on a block click, closes on the scrim, the X or Escape.
function BlockDetail({ item, onClose }) {
  const accent = ACCENT[item.kind];
  const rec = BLOCK_DETAILS[item.title] || { badge: 'Block', fields: [], actions: [] };
  const d = DAYS[item.d];
  // Sit the popup on the far side of the week from the block that is open,
  // so the highlighted block is never behind it.
  const side = item.d <= 1 ? 'flex-end' : 'flex-start';
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: side,
        padding: 32,
        background: 'rgba(5,3,18,0.45)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Block details"
        style={{
          width: 580,
          maxHeight: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: 26,
          borderRadius: 28,
          background: c.card,
          border: `1px solid ${c.lineStrong}`,
          boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                height: 30,
                padding: '0 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.04em',
                background: accent,
                color: c.bg,
              }}
            >
              {rec.badge}
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: 28,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              {item.title}
            </h2>
            <div style={{ fontSize: 15, color: c.textMuted }}>
              {d.day} Sep {d.date} · {item.meta}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 999,
              background: c.cardAlt,
              border: `1px solid ${c.lineStrong}`,
              color: '#cfc6ff',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Person, for a meeting */}
        {rec.person && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 18, borderBottom: `1px solid ${c.lineCard}` }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: 999,
                fontSize: 19,
                fontWeight: 700,
                background: accent,
                color: c.bg,
              }}
            >
              {rec.person.initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{rec.person.name}</div>
              <div style={{ fontSize: 15, color: c.textMuted }}>{rec.person.role}</div>
            </div>
          </div>
        )}

        {/* Fields: every one labelled and accented so the shape is obvious */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 32, rowGap: 18 }}>
          {rec.fields.map((f) => (
            <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 3, ...(f.span ? { gridColumn: 'span 2' } : {}) }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.textFaint }}>{f.label}</div>
              <div style={{ fontSize: 15, lineHeight: 1.45, color: c.text }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {rec.actions.map((label, i) => (
            <button
              key={label}
              type="button"
              style={{
                minHeight: 46,
                padding: '0 22px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                ...(i === 0
                  ? { background: c.purple, color: '#ffffff', border: `2px solid ${c.purple}` }
                  : { background: 'transparent', color: '#cfc6ff', border: `2px solid ${c.lineStrong}` }),
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: 13, color: c.textDim }}>Sample data · fields fill from the backend later.</div>
        </div>
      </div>
    </div>
  );
}

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
  // `selected` holds the id of the block whose details are open.
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const selectedItem = ITEMS.find((it) => it.id === selected) || null;

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
                        const isSel = selected === it.id;
                        return (
                          <div
                            key={it.id}
                            title={it.title + ' · ' + it.meta}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSel}
                            onClick={() => setSelected(it.id)}
                            onKeyDown={(e) => {
                              if (e.key !== 'Enter' && e.key !== ' ') return;
                              e.preventDefault();
                              setSelected(it.id);
                            }}
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
                              cursor: 'pointer',
                              ...(past && !isSel ? { opacity: 0.38 } : {}),
                              ...(isSel
                                ? { outline: '2px solid #ffffff', outlineOffset: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.55)', zIndex: 5 }
                                : {}),
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
      {selectedItem && <BlockDetail item={selectedItem} onClose={() => setSelected(null)} />}
    </Shell>
  );
}
