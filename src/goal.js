// The goal the user typed on the Goal setup screen. Stored locally so the app
// knows whether to open on Goal setup (first run) or Home.
const KEY = 'nc-goal';

export function loadGoal() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveGoal(goal) {
  localStorage.setItem(KEY, JSON.stringify(goal));
}

export function clearGoal() {
  localStorage.removeItem(KEY);
}

export function hasGoal() {
  return !!loadGoal();
}
