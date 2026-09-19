// Shared design tokens for the app pages (dark "companion" theme).
// The landing page uses its own light palette; see pages/Landing.jsx.

export const serif = "'Instrument Serif', Georgia, serif";
export const sans = "'Hanken Grotesk', system-ui, sans-serif";

export const c = {
  bg: '#0d0a24',
  bgSidebar: '#120c38',
  card: '#161141',
  cardAlt: '#241c52',
  cardDeep: '#1a1449',
  cardInput: '#0f0b2e',
  stage: '#100c30',
  line: '#2a2360',
  lineCard: '#2c2360',
  lineStrong: '#3a3080',
  text: '#f3f0ff',
  textSoft: '#e4defc',
  textMuted: '#a9a3cf',
  textFaint: '#8e88b8',
  textDim: '#6f6a99',
  ink: '#1a1440',
  purple: '#5b3df5',
  purpleSoft: '#2e2470',
  lilac: '#b7a7ff',
  lilacLight: '#d3c9ff',
  teal: '#14c8a8',
  tealBright: '#4be3c6',
  tealDeep: '#0d3d3a',
  yellow: '#ffc93c',
  yellowSoft: '#ffd86b',
  yellowDeep: '#3d3210',
  coral: '#ff5a4e',
  coralSoft: '#ff8d84',
  coralDeep: '#4a1d1f',
};

// Common text styles
export const h1 = {
  margin: 0,
  fontFamily: serif,
  fontWeight: 400,
  fontSize: 56,
  lineHeight: 1,
  letterSpacing: '-0.02em',
};

export const h2 = {
  margin: 0,
  fontFamily: serif,
  fontWeight: 400,
  fontSize: 30,
  letterSpacing: '-0.01em',
};

export const eyebrow = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: c.lilac,
};

// Rounded pill button/label base
export const pill = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 999,
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

export const card = {
  background: c.card,
  border: `1px solid ${c.lineCard}`,
  borderRadius: 28,
};

export const cardAlt = {
  background: c.cardAlt,
  border: `1px solid ${c.lineStrong}`,
  borderRadius: 28,
};
