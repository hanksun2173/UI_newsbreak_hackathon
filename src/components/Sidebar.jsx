import { NavLink } from 'react-router-dom';
import { c, serif } from '../theme.js';

const NAV = [
  { to: '/home', label: 'Home' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/plan', label: 'Plan' },
  { to: '/events', label: 'Events' },
  { to: '/people', label: 'People' },
  { to: '/follow-ups', label: 'Follow-ups' },
];

const linkStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 48,
  padding: '0 14px',
  borderRadius: 14,
  textDecoration: 'none',
  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
  color: active ? '#ffffff' : c.textSoft,
  fontWeight: active ? 700 : 500,
});

/**
 * Left navigation shared by every app page.
 * `activePath` forces a nav item active (e.g. the Prep drawer belongs to Plan).
 * `sticky` pins the sidebar for long pages; pass false for full-height pages.
 */
export default function Sidebar({ user = 'Hank', activePath, sticky = true, hide = [] }) {
  return (
    <div
      style={{
        width: 250,
        flexShrink: 0,
        ...(sticky ? { position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start' } : {}),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 20px',
        background: c.bgSidebar,
        borderRight: `1px solid ${c.line}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ padding: '0 14px', fontFamily: serif, fontSize: 30, letterSpacing: '-0.01em', color: '#ffffff' }}>
          Minerva
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 17 }}>
          {NAV.filter((n) => !hide.includes(n.to)).map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => linkStyle(activePath ? activePath === n.to : isActive)}
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px' }}>
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
          {user[0]}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>{user}</div>
      </div>
    </div>
  );
}
