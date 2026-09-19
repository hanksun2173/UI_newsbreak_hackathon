// People map data, lifted verbatim from the prototype. Scene coordinates are in
// design pixels (1062x940); the page scales them with CSS custom properties.

export const W = 1062;
export const H = 940;
export const CX = 531;
export const CY = 470;
export const R1 = 285;
export const R2 = 400;
export const R3 = 462;

export const tones = [
  { bg: '#5b3df5', fg: '#ffffff' },
  { bg: '#ff5a4e', fg: '#1a1440' },
  { bg: '#14c8a8', fg: '#1a1440' },
  { bg: '#ffc93c', fg: '#1a1440' },
];

const Q = (a, b) => [a, b];

// ---------- Inner ring (act this week) ----------
export const inner = [
{ id: 'ana', x: 838, y: 452, sz: 88, tone: 2, name: 'Ana Ruiz', role: 'Community organizer', pill: 'Deck requested', pillKind: 'hot', status: 'In your network', calLabel: 'View in calendar', whyTitle: 'Why you should talk to Ana', why: 'Ana runs the Founders & Friends meetup and knows most of the people on this map. She asked to see your deck, which is a chance to be introduced to the room instead of working it alone.', common: ['Founders & Friends', 'Community building', 'Local scene'], bring: ['Your deck, which she asked for', 'A lightning-talk pitch for this month\'s slot', 'Help with the meetup sign-up flow'], learn: ['Which regulars are small-team founders', 'Whether she would host a design-partner night', 'Who is new to the scene this month'], questions: ['Which regulars would you introduce me to if I only had time for three?', 'Would a five-minute lightning talk on onboarding fit this month?', 'What do most first-time attendees get wrong?'] },
{ id: 'daniel', x: 742, y: 742, sz: 74, tone: 3, name: 'Daniel Okafor', role: 'Engineer turned founder', pill: 'Suggested', pillKind: 'cool', status: 'Suggested', calLabel: 'Add to prep', whyTitle: 'Why you should meet Daniel', why: 'Daniel is speaking at Saturday\'s demo morning and builds the climate tooling you told your companion you were curious about. Marcus knows him, so a warm intro is one message away.', common: ['Climate tooling', 'Marcus\'s circle', 'Demo Morning'], bring: ['The intro to Sofia you promised', 'A question about his talk', 'Your onboarding notes for developer tools'], learn: ['How he onboarded his first users', 'Whether his team needs an onboarding partner', 'What the climate scene needs'], questions: ['What is the hardest part of getting your first customers?', 'How do new users get set up today, and where do they drop off?', 'What would you build next with more time?'] },
{ id: 'sofia', x: 352, y: 748, sz: 72, tone: 0, name: 'Sofia Lindqvist', role: 'Community lead, [Organization]', pill: 'Suggested', pillKind: 'cool', status: 'Suggested', calLabel: 'Schedule', whyTitle: 'Why you should meet Sofia', why: 'Sofia hosts a monthly dinner for community builders near you. You promised to introduce her to Daniel, so the first conversation already has a reason.', common: ['Community dinners', 'Ana\'s circle', 'Marcus\'s circle'], bring: ['The intro to Daniel you promised', 'An invite to Tuesday\'s meetup', 'Your shared meetup calendar idea'], learn: ['Who attends her dinners', 'Whether a dinner could host design partners', 'How she keeps a community engaged'], questions: ['Who at your dinners is building for small teams?', 'What would make a dinner about onboarding worth hosting?', 'How did you get your first twenty regulars?'] },
{ id: 'marcus', x: 262, y: 430, sz: 80, tone: 1, name: 'Marcus Webb', role: 'Angel investor', pill: 'Intro promised', pillKind: 'warm', status: 'In your network', calLabel: 'Schedule', whyTitle: 'Why you should talk to Marcus', why: 'Marcus backs early local teams and offered to introduce you to two founders. He also knows Daniel and Sofia, so he is the shortest route to both of them.', common: ['Early-stage teams', 'Local founders', 'Coffee on Sep 8'], bring: ['A one-paragraph summary of what you are building', 'The Daniel-to-Sofia intro you promised', 'Progress since your coffee'], learn: ['Which of his founders need better onboarding', 'What he wants to see before a pre-seed check', 'Who else angels locally'], questions: ['Which of your portfolio teams struggles most with onboarding new users?', 'What would you want to see from me in the next 60 days?', 'Who else locally writes early checks?'] },
{ id: 'maya', x: 400, y: 232, sz: 84, tone: 2, name: 'Maya Chen', role: 'Head of growth, [Company]', pill: 'Coffee chat (Thu)', pillKind: 'warm', status: 'Coffee on Thursday', calLabel: 'View in calendar', whyTitle: 'Why you should talk to Maya', why: 'Maya runs growth for a small team that is exactly the profile you want as a design partner. You already have coffee on Thursday, and she is on Tuesday\'s guest list, so you can turn one meeting into two touchpoints.', common: ['Onboarding', 'Small teams', 'Local meetups', 'Growth loops'], bring: ['Your onboarding research on small teams', 'An intro to Priya, who she has met once', 'Your shared meetup calendar idea'], learn: ['How her team evaluates new tools', 'What broke when they moved to a four-day week', 'Whether growth would sponsor a pilot'], questions: ['What was the last tool your team adopted, and who pushed for it?', 'If you piloted an onboarding tool, what would you need to see in 30 days?', 'Who else in growth should I be talking to locally?'] },
{ id: 'priya', x: 688, y: 210, sz: 84, tone: 0, name: 'Priya Nair', role: 'Product designer, [Company]', pill: 'Follow-up due', pillKind: 'hot', status: 'In your network', calLabel: 'View in calendar', whyTitle: 'Why you should talk to Priya', why: 'Priya designs onboarding for small teams and asked for your article at Demo Night. That is an open door to a design-partner conversation, and she will be at Tuesday\'s meetup.', common: ['Onboarding', 'Small teams', 'Demo Night', 'Tuesday meetup'], bring: ['The onboarding article she asked for', 'Your small-team research notes', 'An intro to Maya\'s growth team'], learn: ['How her team evaluates new tools', 'What a design-partner deal needs to include', 'Who else at [Company] cares about onboarding'], questions: ['When you redesigned onboarding, what did you wish you had measured earlier?', 'What would make a design partnership worth your team\'s time?', 'Who at [Company] decides which tools get piloted?'] }
];
// ---------- Data: warm ring (compact), each anchored to who or what reaches them ----------

// ---------- Warm ring (compact), each anchored to who or what reaches them ----------
export const warm = [
{ id: 'leo', x: 830, y: 118, sz: 50, via: 'meetup', tone: 0, name: 'Leo Park', role: 'Founder, [Startup]', tag: 'Via Founders & Friends', why: 'Leo is a regular at Founders & Friends and is building for two-person teams. He fits the design-partner profile, and Ana can introduce you on Tuesday.', common: ['Small teams', 'Founders & Friends'], bring: ['Your onboarding research', 'A seat at Thursday\'s coffee with Maya'], learn: ['How he onboards customers today', 'Whether he would pilot for free'], questions: Q('How do your first users get set up today?', 'What would a pilot need to prove in 30 days?') },
{ id: 'nadia', x: 300, y: 120, sz: 46, via: 'meetup', tone: 2, name: 'Nadia Haddad', role: 'Ops lead, [Company]', tag: 'Via Founders & Friends', why: 'Nadia runs operations for a 12-person team and complained about onboarding tools at the last meetup. She is attending on Tuesday.', common: ['Onboarding', 'Small teams'], bring: ['A demo of your onboarding flow', 'Notes from Priya\'s team'], learn: ['Which tools her team dropped and why', 'Who owns onboarding on her side'], questions: Q('Which onboarding tool did you drop last, and why?', 'Who would need to sign off on a pilot?') },
{ id: 'tom', x: 975, y: 300, sz: 52, via: 'ana', tone: 3, name: 'Tom Becker', role: 'Founder, [Company]', tag: 'Ana can introduce', why: 'Tom co-hosts the meetup with Ana and just hired his first customer-success person, which usually means onboarding is on fire.', common: ['Founders & Friends', 'Customer success'], bring: ['An intro to Nadia', 'Your customer-discovery notes'], learn: ['How he measures activation', 'Whether he would be a design partner'], questions: Q('What does a good first week look like for your customers?', 'Where do new users get stuck today?') },
{ id: 'grace', x: 990, y: 520, sz: 48, via: 'ana', tone: 1, name: 'Grace Liu', role: 'Product lead, [Company]', tag: 'Ana can introduce', why: 'Grace leads product at a 20-person startup and asked Ana for onboarding recommendations last month.', common: ['Product management', 'Onboarding'], bring: ['A short teardown of their onboarding', 'An intro to Priya'], learn: ['What she has already tried', 'Her timeline for fixing it'], questions: Q('What did you try last quarter, and what stuck?', 'What would make you switch tools?') },
{ id: 'omar', x: 930, y: 660, sz: 44, via: 'ana', tone: 0, name: 'Omar Farouk', role: 'Designer, freelance', tag: 'Ana can introduce', why: 'Omar designs onboarding flows for early-stage teams and could send design partners your way.', common: ['Onboarding UX', 'Freelance network'], bring: ['A referral arrangement', 'Your research notes'], learn: ['Which clients need tooling', 'What he charges for onboarding work'], questions: Q('Which of your clients struggles most with onboarding?', 'What do you wish a tool did for you?') },
{ id: 'elena', x: 140, y: 610, sz: 50, via: 'marcus', tone: 2, name: 'Elena Rossi', role: 'Founder, [Startup]', tag: 'Marcus can introduce', why: 'Elena is one of the two founders Marcus offered to introduce. Her team is small and selling to other small teams.', common: ['Marcus\'s portfolio', 'B2B for small teams'], bring: ['The intro Marcus promised', 'Your deck'], learn: ['How she runs onboarding with two engineers', 'What she would pay for'], questions: Q('How much of your week goes to onboarding customers by hand?', 'What would you automate first?') },
{ id: 'jonas', x: 130, y: 300, sz: 46, via: 'marcus', tone: 3, name: 'Jonas Weber', role: 'CTO, [Startup]', tag: 'Marcus can introduce', why: 'Jonas is the second founder Marcus mentioned. He is technical, so a developer-onboarding conversation lands well.', common: ['Marcus\'s portfolio', 'Developer tools'], bring: ['Your notes on developer onboarding', 'An intro to Daniel'], learn: ['Where their integration setup fails', 'Whether they would pilot'], questions: Q('Where do developers drop off during setup?', 'What would a pilot need to show your team?') }
];
// ---------- Data: groups (collapsed) ----------

// ---------- Groups (collapsed) ----------
export const groups = [
{ id: 'g-climate', x: 880, y: 820, via: 'demo', name: 'Climate scene', tag: 'Meet at Demo Morning', viaText: 'Reached through Climate Tech Demo Morning and Daniel', why: 'Early climate teams demoing on Saturday. Small teams with first customers, which is the profile that needs onboarding help. Grouped until Saturday, when your companion will promote whoever you meet.', ctaLabel: 'Open Demo Morning', people: [
{ id: 'ravi', tone: 2, name: 'Ravi Menon', role: 'Founder, [Climate startup]', note: 'Demoing Saturday. Three customers so far.' },
{ id: 'sara', tone: 0, name: 'Sara Kim', role: 'Cofounder, [Climate startup]', note: 'Asked on the event page about onboarding.' },
{ id: 'ben', tone: 3, name: 'Ben Adler', role: 'Product, [Climate startup]', note: 'Knows Daniel from a previous job.' } ] },
{ id: 'g-community', x: 250, y: 860, via: 'sofia', name: 'Community builders', tag: 'Sofia\'s dinners', viaText: 'Reached through Sofia Lindqvist', why: 'Organizers who attend Sofia\'s monthly dinner. Not design partners themselves, but each one runs a room full of small-team founders.', ctaLabel: 'See Sofia\'s dinner', people: [
{ id: 'ines', tone: 1, name: 'Ines Costa', role: 'Organizer, [Meetup]', note: 'Runs a product meetup across town.' },
{ id: 'yuki', tone: 2, name: 'Yuki Tanaka', role: 'Community, [Coworking space]', note: 'Hosts 40 small teams in one building.' },
{ id: 'paul', tone: 0, name: 'Paul Nguyen', role: 'Organizer, [Newsletter]', note: 'Writes a local founders newsletter.' } ] },
{ id: 'g-founders', x: 95, y: 455, via: 'marcus', name: 'Marcus\'s founders', tag: 'Intro on request', viaText: 'Reached through Marcus Webb', why: 'The rest of Marcus\'s local portfolio. He offered two intros; these four are the ones your companion would ask for next, ranked by team size and onboarding pain.', ctaLabel: 'Ask Marcus', people: [
{ id: 'hannah', tone: 3, name: 'Hannah Berg', role: 'Founder, [Startup]', note: 'Sells to accountants. Manual onboarding.' },
{ id: 'diego', tone: 0, name: 'Diego Alvarez', role: 'Founder, [Startup]', note: 'Hiring a customer-success lead.' },
{ id: 'mei', tone: 2, name: 'Mei Wong', role: 'CEO, [Startup]', note: 'Posted about churn in week one.' },
{ id: 'chris', tone: 1, name: 'Chris Olsen', role: 'Founder, [Startup]', note: 'Met Marcus at the same coffee spot.' } ] }
];

// ---------- Events ----------
export const events = [
{ id: 'meetup', x: 600, y: 78, title: 'Founders & Friends Meetup', meta: 'Tue, Sep 22 · 6:30 pm · [Venue]', metaLong: 'Tue, Sep 22 · 6:30 to 9:00 pm · [Venue], [Neighborhood]', tag: '5 people you know', who: ['priya', 'ana', 'maya', 'leo', 'nadia'], whoNotes: { priya: 'Owes her the article. Pick the thread back up.', ana: 'Runs the room. Ask for three introductions.', maya: 'Say hello, so Thursday\'s coffee is warm.', leo: 'Ask Ana to introduce you.', nadia: 'She complained about onboarding tools last time.' }, why: 'Five people on this map will be in one room, and Ana can introduce you to the rest. This is the densest hour of your week for design-partner conversations.', steps: ['Arrive early and find Ana. Ask who she would introduce you to.', 'Find Priya and hand her the article in person.', 'Say hello to Maya, then leave her a reason to continue on Thursday.'] },
{ id: 'demo', x: 560, y: 885, title: 'Climate Tech Demo Morning', meta: 'Sat, Sep 26 · 10:00 am · [Community hall]', metaLong: 'Sat, Sep 26 · 10:00 am to 12:30 pm · [Community hall]', tag: 'Daniel is speaking', who: ['daniel'], whoNotes: { daniel: 'Speaking. Ask one question after his talk.' }, why: 'Three demoing teams match interests you saved last month, and Daniel is speaking. Early climate teams are exactly the kind of small team that needs onboarding help.', steps: ['Sit near the front for Daniel\'s talk and note one specific question.', 'Visit the three demo tables your companion flagged.', 'Mention Marcus when you introduce yourself to Daniel.'] }
];


// ---------- Lenses ----------
export const anchorEdges = warm.map((p) => ({ a: p.via, b: p.id, kind: 'anchor' })).concat(groups.map((g) => ({ a: g.via, b: g.id, kind: 'anchor' })));
export const lensDefs = {
goal: { label: 'Paths to your goal', hint: 'Say hello to Maya on Tuesday, so Thursday\'s coffee is already a design-partner conversation. Ask Ana for Leo and Nadia while you are there.', edges: [
{ a: 'me', b: 'maya', label: 'Design partner', t: 0.36 }, { a: 'me', b: 'priya', label: 'Warmest lead', t: 0.46 },
{ a: 'me', b: 'marcus', label: 'Route to 6 founders', t: 0.5 }, { a: 'me', b: 'ana', label: 'Knows the whole room', t: 0.5 },
{ a: 'me', b: 'sofia', label: 'Intro promised', t: 0.74 }, { a: 'me', b: 'daniel', label: 'Ask after his talk', t: 0.74 },
{ a: 'me', b: 'meetup', label: '5 people you know', t: 0.6 }, { a: 'me', b: 'demo', label: 'Daniel is speaking', t: 0.7 } ].concat(anchorEdges) },
who: { label: 'Who knows whom', hint: 'Ana reaches five people here in one evening. Marcus reaches six more. Ask them first.', edges: [
{ a: 'ana', b: 'priya', label: 'Both at Founders & Friends', t: 0.5 }, { a: 'ana', b: 'sofia', label: 'Organizer circle', t: 0.4 },
{ a: 'marcus', b: 'sofia', label: 'Marcus can introduce', t: 0.5 }, { a: 'marcus', b: 'daniel', label: 'Marcus knows him', t: 0.28 },
{ a: 'priya', b: 'maya', label: 'Met once', t: 0.5 }, { a: 'me', b: 'marcus', label: 'Coffee, Sep 8', t: 0.5 }, { a: 'me', b: 'ana', label: 'Met Aug 27', t: 0.5 } ].concat(anchorEdges.map((e) => ({ ...e, kind: 'who' }))) },
where: { label: 'Where you\'ll meet them', hint: 'Tuesday covers seven people. Saturday covers Daniel and the climate group. Sofia still needs an intro from Marcus.', edges: [
{ a: 'meetup', b: 'priya', label: '', t: 0.5 }, { a: 'meetup', b: 'ana', label: '', t: 0.5 }, { a: 'meetup', b: 'maya', label: '', t: 0.5 },
{ a: 'meetup', b: 'leo', label: '', t: 0.5 }, { a: 'meetup', b: 'nadia', label: '', t: 0.5 }, { a: 'demo', b: 'daniel', label: '', t: 0.5 }, { a: 'demo', b: 'g-climate', label: '', t: 0.5 },
{ a: 'me', b: 'maya', label: 'Coffee, Thu 3:30 pm', t: 0.4 }, { a: 'me', b: 'meetup', label: 'You are going', t: 0.6 }, { a: 'me', b: 'demo', label: 'On your plan', t: 0.7 } ] }
};
