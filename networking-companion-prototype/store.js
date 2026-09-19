/*
 * Shared plan store for the prototype pages.
 *
 * The Plan page owns the week's blocks and the Schedule page draws them, so the
 * two read and write this one list. It persists to localStorage, which is the
 * closest thing to a backend the prototype has: open both pages from the same
 * origin (the local server, or the same folder on disk) and an edit on one shows
 * up on the other. Where storage is blocked the list still works for the page
 * you are on, it just does not travel between them.
 */
(function () {
  'use strict';

  var KEY = 'companion.plan.v1';

  // The week both pages render. Wednesday is "today".
  var DAYS = [
    { d: 0, day: 'Mon', date: '21', past: true },
    { d: 1, day: 'Tue', date: '22', past: true },
    { d: 2, day: 'Wed', date: '23', past: false, today: true },
    { d: 3, day: 'Thu', date: '24', past: false },
    { d: 4, day: 'Fri', date: '25', past: false }
  ];

  var KINDS = { event: 'Event', meeting: 'Coffee chat', follow: 'Follow-up' };

  // What the companion proposed. A timed block lands on the schedule grid; a
  // follow-up has no time, so it stays a task on the plan.
  var SEED = [
    { id: 's1', kind: 'event', title: 'ACM Club info session', d: 0, start: 12.5, end: 13.5, where: 'Union hall', why: 'Priya runs sign-ups here, and the hackathon list opens tonight.', who: ['Priya Nair', 'Ana Ruiz'] },
    { id: 's2', kind: 'follow', title: 'Send Priya the article on onboarding tools', d: 0, start: null, end: null, where: '', why: 'You are still fresh from Demo Night, and you see her again this week.', who: ['Priya Nair'], effort: 'about 10 min' },
    { id: 's3', kind: 'follow', title: 'Introduce Daniel to Sofia', d: 1, start: null, end: null, where: '', why: 'You promised Marcus, and Daniel judges on Friday, so an early introduction helps.', who: ['Daniel Okafor', 'Sofia Lindqvist'], effort: 'about 15 min' },
    { id: 's4', kind: 'follow', title: 'Send Maya a note before Wednesday', d: 1, start: null, end: null, where: '', why: 'A short hello makes the first coffee less of a cold start.', who: ['Maya Chen'], effort: 'about 5 min' },
    { id: 's5', kind: 'meeting', title: 'Coffee with Maya Chen', d: 2, start: 11, end: 11.75, where: 'Corner Café', why: 'You both care about onboarding, and she is quietly hiring contract help.', who: ['Maya Chen'] },
    { id: 's6', kind: 'follow', title: 'Share the deck with Ana', d: 2, start: null, end: null, where: '', why: 'She asked for it at the last meetup and has not chased you yet.', who: ['Ana Ruiz'], effort: 'about 10 min' },
    { id: 's7', kind: 'event', title: 'Career fair · Climate tech row', d: 3, start: 12.5, end: 14, where: 'Field house', why: 'Verdant and Lumen both have booths, and Daniel asked you to find him.', who: ['Daniel Okafor', 'Ana Ruiz'] },
    { id: 's8', kind: 'event', title: 'Hackathon kickoff', d: 4, start: 15, end: 16.75, where: 'Innovation lab', why: 'You still need two teammates, and Priya has one seat left.', who: ['Priya Nair', 'Maya Chen', 'Daniel Okafor'] }
  ];

  var memory = null;
  var listeners = [];

  function clone(list) { return JSON.parse(JSON.stringify(list)); }

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : null;
    } catch (e) {
      return memory;
    }
  }

  function write(list) {
    memory = list;
    try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    listeners.forEach(function (fn) { fn(list); });
    return list;
  }

  function hm(t) {
    var h = Math.floor(t);
    var m = Math.round((t - h) * 60);
    var hr = h > 12 ? h - 12 : h;
    return hr + ':' + (m < 10 ? '0' + m : m);
  }

  window.PlanStore = {
    DAYS: DAYS,
    KINDS: KINDS,

    load: function () {
      var list = read();
      if (!list) list = write(clone(SEED));
      memory = list;
      return list;
    },

    add: function (item) {
      var list = this.load().slice();
      item.id = item.id || 'u' + Date.now().toString(36);
      list.push(item);
      return write(list);
    },

    remove: function (id) {
      return write(this.load().filter(function (i) { return i.id !== id; }));
    },

    update: function (id, patch) {
      return write(this.load().map(function (i) {
        return i.id === id ? Object.assign({}, i, patch) : i;
      }));
    },

    reset: function () { return write(clone(SEED)); },

    // Timed, unskipped blocks — what the schedule grid draws.
    blocks: function () {
      return this.load().filter(function (i) { return !i.skipped && i.start != null; });
    },

    day: function (d) { return DAYS[d] || DAYS[0]; },
    hm: hm,
    range: function (a, b) { return hm(a) + '–' + hm(b); },
    clock: function (t) { return hm(t) + (t < 12 ? ' am' : ' pm'); },

    // Called when another page or tab writes.
    subscribe: function (fn) { listeners.push(fn); }
  };

  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var list = read();
    listeners.forEach(function (fn) { fn(list); });
  });
})();
