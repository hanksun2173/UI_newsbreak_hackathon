# Networking Companion

React prototype of the networking companion UI: a landing page plus the app
screens (Home, Schedule, Plan, Events, People map, Follow-ups, Goal setup and
the Prep drawer).

## Run it

```sh
pnpm install
pnpm dev
```

Then open the URL Vite prints (http://localhost:5173 by default).

## Routes

| Path           | Screen                        |
| -------------- | ----------------------------- |
| `/`            | Landing page                  |
| `/home`        | Home                          |
| `/schedule`    | Schedule (week view)          |
| `/plan`        | Proposed plan                 |
| `/events`      | Events                        |
| `/people`      | People map                    |
| `/follow-ups`  | Follow-ups                    |
| `/goal-setup`  | Goal setup (MVP screen 1)     |
| `/prep`        | Prep drawer (MVP screen 2)    |

## Layout

- `src/pages/` one component per screen
- `src/components/` shared `Shell` (frame) and `Sidebar`
- `src/data/` static data used by the People map
- `src/theme.js` shared colours and type tokens
- `src/styles/global.css` fonts, keyframes and hover rules

All data is static placeholder content. The "ask your companion" box on the
Schedule page calls `askCompanion()` in `src/pages/Schedule.jsx`, which is the
hook for a real backend.
