import { useState } from 'react';
import Shell from '../components/Shell.jsx';
import { c, serif, h1, eyebrow } from '../theme.js';

const BASE = [
  { id: 't1', text: 'Send Priya the article on onboarding tools', person: 'Priya Nair', source: 'Demo Night', due: 'Today', bucket: 'Today', draft: 'Hi Priya, it was great talking onboarding with you at Demo Night. Here is the article I mentioned: [link]. I would love to hear what you think, and I will see you at the meetup on Tuesday.' },
  { id: 't2', text: 'Introduce Daniel to Sofia', person: 'Marcus Webb', source: 'Coffee with Marcus', due: 'Mon', bucket: 'This week', draft: 'Hi Daniel, meet Sofia Lindqvist, who hosts a monthly dinner for community builders near you. Sofia, Daniel is speaking on Saturday about the tools he is building. I think you two will have plenty to talk about.' },
  { id: 't3', text: 'Share the deck with Ana', person: 'Ana Ruiz', source: 'Founders & Friends', due: 'Wed', bucket: 'This week', draft: 'Hi Ana, as promised, here is the deck: [link]. Happy to walk you through it whenever suits you.' },
  { id: 't4', text: 'Thank Marcus for the referral', person: 'Marcus Webb', source: 'Coffee with Marcus', due: 'Done', bucket: 'This week', draft: '' },
  { id: 'a1', text: 'Ask Ana about the October venue', person: 'Ana Ruiz', source: 'Founders & Friends', due: 'Thu', bucket: 'This week', draft: 'Hi Ana, is the October meetup staying at the same venue? I would like to bring a couple of people along.', ext: true },
  { id: 'a2', text: 'Send Maya a note before Thursday', person: 'Maya Chen', source: 'Coffee with Maya', due: 'Wed', bucket: 'This week', draft: 'Hi Maya, looking forward to Thursday. I read your post about the four-day week and would love to hear how it went.', ext: true },
];

const IDEAS = [
  { id: 'a1', text: 'Ask Ana about the October venue', why: 'You mentioned bringing people to the next meetup.' },
  { id: 'a2', text: 'Send Maya a note before Thursday', why: 'A short hello before your first coffee usually helps.' },
];

const SECTION_DEFS = [
  { label: 'Today', color: c.coral, pick: (t, done) => !done(t) && t.bucket === 'Today' },
  { label: 'This week', color: c.purple, pick: (t, done) => !done(t) && t.bucket === 'This week' },
  { label: 'Completed', color: c.teal, pick: (t, done) => done(t) },
];

const h2Style = { margin: 0, fontFamily: serif, fontWeight: 400, fontSize: 30, letterSpacing: '-0.01em' };

export default function FollowUps() {
  const [filter, setFilter] = useState('all');
  const [done, setDone] = useState({ t1: false, t2: false, t3: false, t4: true, a1: false, a2: false });
  const [added, setAdded] = useState({ a1: false, a2: false });
  const [drafts, setDrafts] = useState({ t1: true });

  const live = BASE.filter((t) => !t.ext || added[t.id]);
  const isDone = (t) => !!done[t.id];
  const openCount = live.filter((t) => !isDone(t)).length;
  const doneCount = live.filter(isDone).length;

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'open', label: `Open (${openCount})` },
    { id: 'done', label: `Done (${doneCount})` },
  ];

  const sections = SECTION_DEFS.filter(
    (s) => !(filter === 'open' && s.label === 'Completed') && !(filter === 'done' && s.label !== 'Completed')
  )
    .map((s) => ({ ...s, tasks: live.filter((t) => s.pick(t, isDone)) }))
    .filter((s) => s.tasks.length > 0);

  const toggleDone = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const toggleDraft = (id) => setDrafts((d) => ({ ...d, [id]: !d[id] }));
  const toggleAdded = (id) => setAdded((a) => ({ ...a, [id]: !a[id] }));
  const copyDraft = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
  };

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
          <h1 style={h1}>Follow-ups</h1>
          <div style={{ fontSize: 19, color: c.textMuted }}>
            {openCount} open, {doneCount} done. Most come from people you met this month.
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Task list */}
          <div
            style={{
              gridColumn: 'span 8',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              padding: '36px 40px 40px 40px',
              background: c.card,
              border: `1px solid ${c.lineCard}`,
              borderRadius: 28,
            }}
          >
            <div style={{ display: 'flex', gap: 8, padding: 6, background: '#3a1a22', borderRadius: 999, width: 420 }}>
              {tabs.map((t) => {
                const active = filter === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(t.id)}
                    style={{
                      flex: 1,
                      minHeight: 48,
                      border: 0,
                      borderRadius: 999,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: active ? c.coral : 'transparent',
                      color: active ? c.ink : c.coralSoft,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {sections.map((sec) => (
              <div key={sec.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: sec.color }} />
                  <h2 style={h2Style}>{sec.label}</h2>
                </div>
                {sec.tasks.map((task) => {
                  const tDone = isDone(task);
                  const dOpen = !!drafts[task.id];
                  const canDraft = !tDone && !!task.draft;
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                        padding: '28px 0',
                        borderTop: `1px solid ${c.line}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <button
                          type="button"
                          onClick={() => toggleDone(task.id)}
                          aria-pressed={tDone}
                          aria-label={(tDone ? 'Mark not done: ' : 'Mark done: ') + task.text}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 44,
                            height: 44,
                            margin: '-10px 0 -10px -10px',
                            flexShrink: 0,
                            border: 0,
                            background: 'transparent',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 24,
                              height: 24,
                              borderRadius: 8,
                              border: `2px solid ${tDone ? c.purple : '#8a80c9'}`,
                              background: tDone ? c.purple : '#ffffff',
                            }}
                          >
                            {tDone && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            )}
                          </span>
                        </button>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div
                            style={{
                              fontSize: 19,
                              fontWeight: 600,
                              lineHeight: 1.4,
                              color: tDone ? '#8d87b5' : c.text,
                              textDecoration: tDone ? 'line-through' : 'none',
                            }}
                          >
                            {task.text}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 32,
                                padding: '0 14px',
                                borderRadius: 999,
                                background: c.purpleSoft,
                                color: c.lilac,
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              {task.person}
                            </div>
                            <div style={{ fontSize: 15, color: c.textMuted }}>{task.source}</div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            padding: '6px 12px',
                            borderRadius: 999,
                            background: task.bucket === 'Today' && !tDone ? c.coralDeep : c.purpleSoft,
                            color: task.bucket === 'Today' && !tDone ? c.coralSoft : c.lilac,
                          }}
                        >
                          {tDone ? 'Done' : task.due}
                        </div>
                      </div>
                      {canDraft && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginLeft: 40 }}>
                          <button
                            type="button"
                            onClick={() => toggleDraft(task.id)}
                            aria-expanded={dOpen}
                            style={{
                              alignSelf: 'flex-start',
                              minHeight: 44,
                              padding: '0 20px',
                              borderRadius: 999,
                              border: `2px solid ${c.purple}`,
                              background: c.card,
                              color: c.lilac,
                              fontSize: 15,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {dOpen ? 'Hide draft' : 'Draft with companion'}
                          </button>
                          {dOpen && (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 18,
                                padding: '24px 26px',
                                background: c.cardAlt,
                                borderRadius: 18,
                              }}
                            >
                              <div style={eyebrow}>Draft from your companion</div>
                              <div style={{ fontSize: 16, lineHeight: 1.6 }}>{task.draft}</div>
                              <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                  type="button"
                                  onClick={() => toggleDone(task.id)}
                                  style={{
                                    minHeight: 48,
                                    padding: '0 24px',
                                    border: 0,
                                    borderRadius: 999,
                                    background: c.purple,
                                    color: '#ffffff',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Mark as sent
                                </button>
                                <button
                                  type="button"
                                  onClick={() => copyDraft(task.draft)}
                                  style={{
                                    minHeight: 48,
                                    padding: '0 24px',
                                    border: `2px solid ${c.lineStrong}`,
                                    borderRadius: 999,
                                    background: c.card,
                                    color: c.lilac,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Copy draft
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Side column */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: 28,
                  background: c.coral,
                  borderRadius: 24,
                  color: c.ink,
                }}
              >
                <div style={{ fontFamily: serif, fontSize: 64, lineHeight: 1 }}>{openCount}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Open</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: 28,
                  background: c.teal,
                  borderRadius: 24,
                  color: c.ink,
                }}
              >
                <div style={{ fontFamily: serif, fontSize: 64, lineHeight: 1 }}>{doneCount}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Done</div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: '32px 32px 16px 32px',
                background: c.card,
                border: `1px solid ${c.lineCard}`,
                borderRadius: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12 }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, background: c.yellow }} />
                <h2 style={{ ...h2Style, fontSize: 28 }}>Suggested for you</h2>
              </div>
              {IDEAS.map((idea) => {
                const isAdded = !!added[idea.id];
                return (
                  <div
                    key={idea.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      padding: '24px 0',
                      borderTop: `1px solid ${c.line}`,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>{idea.text}</div>
                      <div style={{ fontSize: 15, lineHeight: 1.45, color: c.textMuted }}>{idea.why}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAdded(idea.id)}
                      aria-pressed={isAdded}
                      style={{
                        alignSelf: 'flex-start',
                        minHeight: 46,
                        padding: '0 20px',
                        borderRadius: 999,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: isAdded ? c.teal : c.card,
                        color: isAdded ? c.ink : c.lilac,
                        border: `2px solid ${isAdded ? c.teal : c.purple}`,
                      }}
                    >
                      {isAdded ? 'Added to your list' : 'Add to follow-ups'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
