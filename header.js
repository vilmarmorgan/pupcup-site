/*
 * Pupcup's header, the script half of the component (with header.css). Loaded on every page that has the header,
 * with a relative path (header.js, or ../header.js on subpages). Two jobs:
 *
 *  1. On phones the logo is as large as fits beside the buttons: the largest library step from the homepage's
 *     phone size (32px) down to 20px, never smaller (Vilmar, 25 Nov 2026). Sized in the regular layout, the most crowded.
 *  2. PupHeader.set({ compact, practice, grid }) switches the modes described at the top of header.css.
 *     In the practice game it also pauses the bone and tongue: bone-lick.js skips its turn while an .overlay.active exists.
 */
(function () {
  var STEPS = ['--size-sm', '--sp-7', '--size-xs', '--sp-5']; // 32, 28, 24, 20px
  var MODES = { compact: 'is-compact', practice: 'is-practice', grid: 'is-grid' };
  function island() { return document.querySelector('.hero-island'); }
  function fit() {
    var isl = island(), pill = isl && isl.querySelector('.hero-pill');
    if (!pill) return;
    if (getComputedStyle(isl).getPropertyValue('--phone').trim() !== '1') { isl.style.removeProperty('--logo-h'); return; }
    var was = isl.className; isl.classList.remove('is-practice', 'is-grid'); isl.classList.add('hero-measuring'); // the regular layout: the most crowded
    var last = pill.querySelector('.hero-actions') || pill.lastElementChild;
    for (var i = 0; i < STEPS.length; i++) {
      isl.style.setProperty('--logo-h', 'var(' + STEPS[i] + ')');
      var room = pill.getBoundingClientRect().right - parseFloat(getComputedStyle(pill).paddingRight);
      if (last.getBoundingClientRect().right <= room + .5) break;
    }
    isl.className = was;
  }
  // ── moving between modes: the outgoing buttons fade where they stood, the incoming ones fade in, the logo glides ──
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function dur(name) { var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; }
  var PARTS = '.hero-burger, .hero-actions, .hero-side';
  function shown(isl) { return [].filter.call(isl.querySelectorAll(PARTS), function (e) { return getComputedStyle(e).display !== 'none'; }); }
  function snapshot(isl) {
    var cs = getComputedStyle(isl);
    return { cls: isl.className, logo: isl.querySelector('.hero-logo').getBoundingClientRect(),
      parts: shown(isl).map(function (e) { return { el: e, r: e.getBoundingClientRect(), d: getComputedStyle(e).display }; }),
      vars: ['--btn-box', '--lgap', '--logo-h'].map(function (v) { return [v, cs.getPropertyValue(v)]; }) };
  }
  function morph(isl, was) {
    if (reduce) return;
    var now = shown(isl), fade = dur('--dur-300');
    was.parts.forEach(function (p) {
      if (now.indexOf(p.el) >= 0) return;
      var g = p.el.cloneNode(true); g.classList.add('hero-ghost'); g.setAttribute('aria-hidden', 'true');
      [].forEach.call(g.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); }); g.removeAttribute('id');
      was.vars.forEach(function (v) { g.style.setProperty(v[0], v[1]); });
      g.style.display = p.d; g.style.left = p.r.left + 'px'; g.style.top = p.r.top + 'px'; g.style.width = p.r.width + 'px'; g.style.height = p.r.height + 'px';
      document.body.appendChild(g); void g.offsetWidth; g.style.opacity = '0';
      setTimeout(function () { g.remove(); }, fade);
    });
    now.forEach(function (e) {
      if (was.parts.some(function (p) { return p.el === e; })) return;
      e.classList.remove('hero-in'); void e.offsetWidth; e.classList.add('hero-in');
      setTimeout(function () { e.classList.remove('hero-in'); }, fade + dur('--dur-150'));
    });
    var logo = isl.querySelector('.hero-logo'), r = logo.getBoundingClientRect(), dx = (was.logo.left + was.logo.width / 2) - (r.left + r.width / 2);
    if (Math.abs(dx) > .5 && logo.animate) logo.animate([{ translate: dx + 'px 0' }, { translate: '0 0' }], { duration: dur('--dur-500'), easing: getComputedStyle(document.documentElement).getPropertyValue('--ease-in-out').trim() });
  }
  var pause = null;
  function set(modes) {
    var isl = island(); if (!isl) return;
    var was = isl.isConnected && !isl.classList.contains('hero-measuring') ? snapshot(isl) : null;
    Object.keys(MODES).forEach(function (k) { if (k in modes) isl.classList.toggle(MODES[k], !!modes[k]); });
    if ('practice' in modes) {
      // the marker carries bone-lick's 'overlay' class but must never draw: on the homepage .overlay is the full-screen
      // card popup (display: flex beats the hidden attribute), so it is switched off inline with !important
      if (!pause) { pause = document.createElement('span'); pause.className = 'overlay pup-lick-pause'; pause.hidden = true; pause.style.setProperty('display', 'none', 'important'); document.body.appendChild(pause); }
      pause.classList.toggle('active', !!modes.practice);
    }
    if (was && was.cls !== isl.className) morph(isl, was);
  }
  window.PupHeader = { set: set, fit: fit };
  function start() {
    fit();
    addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    var img = document.querySelector('.hero-logo'); if (img && !img.complete) img.addEventListener('load', fit);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
