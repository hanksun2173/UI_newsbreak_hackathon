import { useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import { c, sans } from '../theme.js';

/**
 * Page frame: sidebar on the left, page content on the right.
 * `fullHeight` locks the frame to the viewport (used by Schedule / People / Prep,
 * which lay their content out to fill the screen instead of scrolling).
 */
export default function Shell({ children, user, activePath, fullHeight = false, hide, style }) {
  useEffect(() => {
    document.body.classList.remove('light');
  }, []);
  return (
    <div
      style={{
        width: '100%',
        minWidth: 1280,
        ...(fullHeight ? { height: '100vh', minHeight: 860, overflow: 'hidden' } : { minHeight: '100vh' }),
        display: 'flex',
        background: c.bg,
        color: c.text,
        fontFamily: sans,
        position: 'relative',
        ...style,
      }}
    >
      <Sidebar user={user} activePath={activePath} sticky={!fullHeight} hide={hide} />
      {children}
    </div>
  );
}
