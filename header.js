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
    var was = isl.className; isl.classList.remove('is-practice', 'is-grid'); // the regular layout: the most crowded
    var last = pill.querySelector('.hero-actions') || pill.lastElementChild;
    for (var i = 0; i < STEPS.length; i++) {
      isl.style.setProperty('--logo-h', 'var(' + STEPS[i] + ')');
      var room = pill.getBoundingClientRect().right - parseFloat(getComputedStyle(pill).paddingRight);
      if (last.getBoundingClientRect().right <= room + .5) break;
    }
    isl.className = was;
  }
  var pause = null;
  function set(modes) {
    var isl = island(); if (!isl) return;
    Object.keys(MODES).forEach(function (k) { if (k in modes) isl.classList.toggle(MODES[k], !!modes[k]); });
    if ('practice' in modes) {
      // the marker carries bone-lick's 'overlay' class but must never draw: on the homepage .overlay is the full-screen
      // card popup (display: flex beats the hidden attribute), so it is switched off inline with !important
      if (!pause) { pause = document.createElement('span'); pause.className = 'overlay pup-lick-pause'; pause.hidden = true; pause.style.setProperty('display', 'none', 'important'); document.body.appendChild(pause); }
      pause.classList.toggle('active', !!modes.practice);
    }
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
