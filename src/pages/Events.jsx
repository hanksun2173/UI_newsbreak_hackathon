import { useState } from 'react';
import Shell from '../components/Shell.jsx';
import { c, serif, h1, eyebrow } from '../theme.js';

const ALL = [
  { id: 'e1', kind: 'up', day: 'Tue', date: '22', title: 'Founders & Friends Meetup', meta: 'Tue, Sep 22 · 6:30 pm · [Venue], [Neighborhood]', who: ['Priya Nair', 'Ana Ruiz', 'Maya Chen'], aLabel: 'Common ground', aText: 'You know Priya Nair from Demo Night, and two other people you have met are on the guest list.', bLabel: 'Recent context', bText: 'The host announced a lightning-talk slot this month.', listLabel: 'Good questions to ask', items: ['What are you building right now?', 'Who here should I be talking to?'] },
  { id: 'e2', kind: 'up', day: 'Thu', date: '24', title: 'Coffee with Maya Chen', meta: 'Thu, Sep 24 · 3:30 pm · Corner Café', who: ['Maya Chen'], aLabel: 'Common ground', aText: 'You both organize small local meetups and care about onboarding for small teams.', bLabel: 'Recent context', bText: 'Maya recently posted about moving her team to a four-day week.', listLabel: 'Good questions to ask', items: ['What changed for you after the last launch?', 'Who else in the local scene should I be meeting?'] },
  { id: 'e3', kind: 'up', day: 'Sat', date: '26', title: 'Climate Tech Demo Morning', meta: 'Sat, Sep 26 · 10:00 am · [Community hall]', who: ['Daniel Okafor'], aLabel: 'Common ground', aText: 'Three of the demoing teams match interests you saved last month.', bLabel: 'Recent context', bText: 'Daniel Okafor is listed as a speaker.', listLabel: 'Good questions to ask', items: ['What is the hardest part of getting your first customers?', 'What would you build next with more time?'] },
  { id: 'x1', kind: 'sug', day: 'Wed', date: '30', title: 'Product People Happy Hour', meta: 'Wed, Sep 30 · 6:00 pm · [Venue]', who: ['Maya Chen', 'Priya Nair'], aLabel: 'Why it fits', aText: 'Your Wednesday evening is open, and the topics match what you follow.', bLabel: 'Who might be there', bText: 'People you already know have been to earlier editions.', listLabel: 'Worth bringing up', items: ['The onboarding article you plan to send Priya.', 'Your idea for a shared meetup calendar.'] },
  { id: 'x2', kind: 'sug', day: 'Thu', date: '1', title: 'Design Systems Study Group', meta: 'Thu, Oct 1 · 12:15 pm · [Venue]', who: ['Sofia Lindqvist'], aLabel: 'Why it fits', aText: 'It is a short lunch slot near where you will be that day.', bLabel: 'Who might be there', bText: 'Sofia Lindqvist has hosted sessions like this before.', listLabel: 'Worth bringing up', items: ['Ask how the group shares work between meetings.'] },
  { id: 'p0', kind: 'past', day: 'Thu', date: '27', title: 'Founders & Friends Meetup', meta: 'Thu, Aug 27 · [Venue], [Neighborhood]', who: ['Ana Ruiz'], aLabel: 'What you captured', aText: 'You met Ana, who runs the meetup. She asked to see your deck.', bLabel: 'Still open', bText: 'One follow-up is waiting on you.', listLabel: 'Follow-ups from this event', items: ['Share the deck with Ana'] },
  { id: 'p1', kind: 'past', day: 'Sat', date: '5', title: 'Demo Night', meta: 'Sat, Sep 5 · [Venue]', who: ['Priya Nair'], aLabel: 'What you captured', aText: 'You met Priya and talked about onboarding for small teams. She asked to see the article you mentioned.', bLabel: 'Still open', bText: 'One follow-up is waiting on you.', listLabel: 'Follow-ups from this event', items: ['Send Priya the article on onboarding tools'] },
  { id: 'p2', kind: 'past', day: 'Tue', date: '8', title: 'Coffee with Marcus Webb', meta: 'Tue, Sep 8 · [Café]', who: ['Marcus Webb'], aLabel: 'What you captured', aText: 'Marcus offered to introduce you to two founders and asked for a short summary of what you are building.', bLabel: 'Still open', bText: 'Your thank-you note is done. One introduction is still to make.', listLabel: 'Follow-ups from this event', items: ['Introduce Daniel to Sofia', 'Thank Marcus for the referral (done)'] },
];

const TABS = [
  { id: 'up', label: 'Upcoming' },
  { id: 'sug', label: 'Suggested' },
  { id: 'past', label: 'Past' },
];

const KIND = {
  up: { date: { background: c.purple, color: '#ffffff' }, pill: { background: c.tealDeep, color: c.tealBright }, label: 'Prep ready' },
  sug: { date: { background: c.teal, color: c.ink }, pill: { background: c.yellowDeep, color: c.yellowSoft }, label: 'Suggested' },
  past: { date: { background: '#cfc6fb', color: c.ink }, pill: { background: c.purpleSoft, color: c.lilac }, label: 'Captured' },
};

const firstOf = (k) => ALL.filter((e) => e.kind === k)[0].id;

const pillBase = {
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  height: 36,
  padding: '0 16px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const labelStyle = { ...eyebrow };

export default function Events() {
  const [tab, setTab] = useState('up');
  const [selId, setSelId] = useState('e1');
  const [added, setAdded] = useState({ x1: false, x2: false });

  const events = ALL.filter((e) => e.kind === tab);
  const sel = ALL.find((e) => e.id === selId) || ALL[0];
  const selKs = KIND[sel.kind];
  const selAdded = !!added[sel.id];
  const whoLabel = (e) =>
    e.kind === 'past' ? 'People you met' : e.kind === 'sug' ? 'People you know who may go' : 'People to meet';
  const pillLabel = (e) => (e.kind === 'sug' && added[e.id] ? 'On your schedule' : KIND[e.kind].label);

  return (
    <Shell>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
          padding: '56px 64px 64px 64px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={h1}>Events</h1>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* List */}
          <div
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              padding: 36,
              background: c.card,
              border: `1px solid ${c.lineCard}`,
              borderRadius: 28,
            }}
          >
            <div style={{ display: 'flex', gap: 8, padding: 6, background: c.cardAlt, borderRadius: 999 }}>
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setTab(t.id);
                      setSelId(firstOf(t.id));
                    }}
                    style={{
                      flex: 1,
                      minHeight: 48,
                      border: 0,
                      borderRadius: 999,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: active ? c.purple : 'transparent',
                      color: active ? '#ffffff' : c.lilac,
                    }}
                  >
                    {t.label} ({ALL.filter((e) => e.kind === t.id).length})
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {events.map((ev) => {
                const ks = KIND[ev.kind];
                const selected = selId === ev.id;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelId(ev.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 22,
                      width: '100%',
                      padding: '22px 24px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: c.text,
                      borderRadius: 22,
                      background: selected ? c.cardAlt : c.cardDeep,
                      border: `2px solid ${selected ? c.purple : c.line}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        flexShrink: 0,
                        borderRadius: 18,
                        ...ks.date,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {ev.day}
                      </div>
                      <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1 }}>{ev.date}</div>
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{ev.title}</div>
                      <div style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.4 }}>{ev.meta}</div>
                    </div>
                    <div style={{ ...pillBase, ...ks.pill }}>{pillLabel(ev)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail */}
          <div
            style={{
              gridColumn: 'span 6',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              padding: 40,
              background: c.card,
              border: `1px solid ${c.lineCard}`,
              borderRadius: 28,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ ...pillBase, ...selKs.pill }}>{pillLabel(sel)}</div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 42,
                  lineHeight: 1.05,
                  letterSpacing: '-0.015em',
                }}
              >
                {sel.title}
              </h2>
              <div style={{ fontSize: 17, color: c.textMuted }}>{sel.meta}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={labelStyle}>{whoLabel(sel)}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {sel.who.map((name) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 40,
                      padding: '0 16px',
                      borderRadius: 999,
                      background: c.purpleSoft,
                      color: c.lilac,
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={labelStyle}>{sel.aLabel}</div>
              <div style={{ fontSize: 17, lineHeight: 1.55 }}>{sel.aText}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={labelStyle}>{sel.bLabel}</div>
              <div style={{ fontSize: 17, lineHeight: 1.55 }}>{sel.bText}</div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                padding: 24,
                background: c.cardAlt,
                borderRadius: 20,
              }}
            >
              <div style={labelStyle}>{sel.listLabel}</div>
              {sel.items.map((text) => (
                <div
                  key={text}
                  style={{
                    padding: '16px 18px',
                    background: c.card,
                    border: `1px solid ${c.lineStrong}`,
                    borderRadius: 14,
                    fontSize: 16,
                    lineHeight: 1.45,
                  }}
                >
                  {text}
                </div>
              ))}
            </div>

            {sel.kind === 'sug' && (
              <button
                type="button"
                aria-pressed={selAdded}
                onClick={() => setAdded((a) => ({ ...a, [sel.id]: !a[sel.id] }))}
                style={{
                  alignSelf: 'flex-start',
                  minHeight: 52,
                  padding: '0 28px',
                  borderRadius: 999,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selAdded ? c.teal : c.purple,
                  color: selAdded ? c.ink : '#ffffff',
                  border: `2px solid ${selAdded ? c.teal : c.purple}`,
                }}
              >
                {selAdded ? 'Added to your schedule' : 'Add to my schedule'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
