import { useState } from 'react';
import Shell from '../components/Shell.jsx';
import { c, serif, h1 } from '../theme.js';

const KINDS = {
  event: { label: 'Event', pill: { background: c.purpleSoft, color: c.lilac } },
  meeting: { label: 'Coffee', pill: { background: c.tealDeep, color: c.tealBright } },
  follow: { label: 'Follow-up', pill: { background: c.coralDeep, color: c.coralSoft } },
};

const ALL = [
  { id: 'p1', day: 'Sat', date: '19', kind: 'follow', time: 'Today · about 10 min', title: 'Send Priya the article on onboarding tools', why: 'You are still fresh from Demo Night, and you will see Priya again on Tuesday.', who: ['Priya Nair'] },
  { id: 'p2', day: 'Mon', date: '21', kind: 'follow', time: 'About 15 min', title: 'Introduce Daniel to Sofia', why: 'You promised Marcus, and Daniel speaks on Saturday, so an early introduction helps.', who: ['Daniel Okafor', 'Sofia Lindqvist'] },
  { id: 'p3', day: 'Tue', date: '22', kind: 'event', time: '6:30 pm', title: 'Founders & Friends Meetup', why: 'Your evening is free, and three people you know are going.', who: ['Priya Nair', 'Ana Ruiz', 'Maya Chen'] },
  { id: 'p4', day: 'Wed', date: '23', kind: 'follow', time: 'Due Wed · about 10 min', title: 'Share the deck with Ana', why: 'She asked for it at the last meetup, and you will have just seen her.', who: ['Ana Ruiz'] },
  { id: 'p5', day: 'Wed', date: '23', kind: 'follow', time: 'About 5 min', title: 'Send Maya a note before Thursday', why: 'A short hello makes your first coffee feel less like a cold start.', who: ['Maya Chen'] },
  { id: 'p6', day: 'Thu', date: '24', kind: 'meeting', time: '3:30 pm · Corner Café', title: 'Coffee with Maya Chen', why: 'You both care about onboarding and organize local meetups.', who: ['Maya Chen'] },
  { id: 'p7', day: 'Sat', date: '26', kind: 'event', time: '10:00 am', title: 'Climate Tech Demo Morning', why: 'Three demoing teams match your saved interests, and Daniel Okafor is speaking.', who: ['Daniel Okafor'] },
  { id: 'p8', day: 'Sat', date: '26', kind: 'meeting', time: '11:30 am', title: 'Ask Daniel for 20 minutes after his talk', why: 'With the introduction behind you, this can be a real conversation.', who: ['Daniel Okafor'], isNew: true },
];

const ORDER = ['19', '21', '22', '23', '24', '26'];

const statRow = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 18,
  padding: '20px 0',
  borderTop: `1px solid ${c.lineStrong}`,
};

const statNum = (color) => ({
  width: 64,
  fontFamily: serif,
  fontSize: 56,
  lineHeight: 1,
  color,
});

export default function Plan() {
  const [skipped, setSkipped] = useState({});
  const [approved, setApproved] = useState(false);

  const isSkipped = (id) => !!skipped[id];
  const toggleSkip = (id) => {
    setSkipped((s) => ({ ...s, [id]: !s[id] }));
    setApproved(false);
  };

  const days = ORDER.map((d) => {
    const items = ALL.filter((p) => p.date === d);
    return { day: items[0].day, date: d, items };
  });

  const kept = ALL.filter((p) => !isSkipped(p.id));
  const people = {};
  kept.forEach((p) => p.who.forEach((n) => { people[n] = true; }));
  const eventCount = kept.filter((p) => p.kind !== 'follow').length;
  const followCount = kept.filter((p) => p.kind === 'follow').length;
  const peopleCount = Object.keys(people).length;

  return (
    <Shell>
      {/* MAIN */}
      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
          padding: '56px 64px 64px 64px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={h1}>Proposed plan</h1>
          <div style={{ fontSize: 19, color: c.textMuted }}>Sep 19 to 26.</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Agenda */}
          <div
            style={{
              gridColumn: 'span 8',
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              padding: 40,
              background: c.card,
              border: `1px solid ${c.lineCard}`,
              borderRadius: 28,
            }}
          >
            {days.map((day) => (
              <div key={day.date} style={{ display: 'flex', alignItems: 'flex-start', gap: 28 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 72,
                    height: 72,
                    flexShrink: 0,
                    borderRadius: 20,
                    background: day.date === '19' ? c.coral : c.purple,
                    color: day.date === '19' ? c.ink : '#ffffff',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {day.day}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: 32, lineHeight: 1 }}>{day.date}</div>
                </div>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {day.items.map((it) => {
                    const sk = isSkipped(it.id);
                    const k = KINDS[it.kind];
                    return (
                      <div
                        key={it.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 24,
                          padding: '24px 26px',
                          borderRadius: 20,
                          background: c.cardAlt,
                          border: `1px solid ${c.lineStrong}`,
                          ...(sk ? { opacity: 0.55 } : {}),
                        }}
                      >
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 32,
                                padding: '0 14px',
                                borderRadius: 999,
                                fontSize: 14,
                                fontWeight: 600,
                                ...k.pill,
                              }}
                            >
                              {k.label}
                            </div>
                            {!!it.isNew && (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: 32,
                                  padding: '0 14px',
                                  borderRadius: 999,
                                  background: c.yellowDeep,
                                  color: c.yellowSoft,
                                  fontSize: 14,
                                  fontWeight: 600,
                                }}
                              >
                                New idea
                              </div>
                            )}
                            <div style={{ fontSize: 15, color: c.textMuted }}>{it.time}</div>
                          </div>
                          <div
                            style={{
                              fontSize: 21,
                              fontWeight: 700,
                              lineHeight: 1.3,
                              ...(sk ? { textDecoration: 'line-through' } : {}),
                            }}
                          >
                            {it.title}
                          </div>
                          <div style={{ fontSize: 15, lineHeight: 1.55, color: c.textMuted }}>{it.why}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSkip(it.id)}
                          aria-pressed={sk}
                          style={{
                            flexShrink: 0,
                            minHeight: 44,
                            padding: '0 20px',
                            borderRadius: 999,
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: c.card,
                            color: c.lilac,
                            border: `2px solid ${sk ? c.teal : c.lineStrong}`,
                          }}
                        >
                          {sk ? 'Restore' : 'Skip'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              gridColumn: 'span 4',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              padding: 36,
              background: c.cardAlt,
              border: `1px solid ${c.lineStrong}`,
              borderRadius: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, background: c.yellow }} />
              <h2
                style={{
                  margin: 0,
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: 30,
                  letterSpacing: '-0.01em',
                }}
              >
                This plan
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={statRow}>
                <div style={statNum(c.lilac)}>{eventCount}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Events and meetings</div>
              </div>
              <div style={statRow}>
                <div style={statNum(c.tealBright)}>{peopleCount}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>People you'll see</div>
              </div>
              <div style={statRow}>
                <div style={statNum(c.coralSoft)}>{followCount}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Follow-ups to send</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setApproved((a) => !a)}
              aria-pressed={approved}
              style={{
                minHeight: 60,
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                background: approved ? c.teal : c.purple,
                color: approved ? c.ink : '#ffffff',
                border: `2px solid ${approved ? c.teal : c.purple}`,
              }}
            >
              {approved ? 'Plan approved' : 'Approve this plan'}
            </button>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: c.textMuted }}>
              {approved
                ? 'Your companion will remind you and have a prep brief ready before each event.'
                : 'Approving adds these to your schedule and follow-ups. You can change it any time.'}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
