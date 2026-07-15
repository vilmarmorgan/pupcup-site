/*
 * Shared navigation menu for Pupcup (playpupcup.com).
 *
 * SINGLE SOURCE OF TRUTH: edit the LINKS list below and every page's menu
 * overlay updates automatically (homepage, Kickstarter Backers, etc).
 *
 * Each page has an empty <nav class="nav-menu-links"></nav> followed by
 * <script src="/nav.js"></script>. This script runs during parse (before the
 * page's own menu wiring) and fills in the links, so the existing open/close
 * and click-to-close handlers find them normally.
 *
 * URLs are root-relative ("/", "/howtoplay/") so they work from any page depth.
 */
(function () {
  var LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Buy Now', href: 'https://shop.playpupcup.com/', external: true },
    { label: 'How to Play', href: '/howtoplay/' },
    { label: 'Kickstarter Backers', href: '/kickstarter/' },
    { label: 'Rated Arf', href: 'https://ratedarf.com/', external: true, newTab: true, sub: 'Adult-Only NSFW Game' }
  ];

  var html = LINKS.map(function (l) {
    var attrs = l.external ? ' rel="noopener"' : '';
    if (l.newTab) attrs += ' target="_blank"';
    if (l.sub) {
      return '<div class="nav-menu-arf"><a href="' + l.href + '"' + attrs + '>' + l.label + '</a>' +
             '<span class="nav-menu-arf-sub">' + l.sub + '</span></div>';
    }
    return '<a href="' + l.href + '"' + attrs + '>' + l.label + '</a>';
  }).join('\n    ');

  var nav = document.querySelector('.nav-menu-links');
  if (nav) nav.innerHTML = html;

  // ── Footer: divider + disclaimer pinned to the bottom of the menu overlay ──
  var FOOTER_HTML =
    '<div class="nav-menu-footer-left">' +
      '<span class="nmf-copy">©2026 Vilmar Morgan LLC</span>' +
      '<span class="nmf-note">Please note: the videos shown on this site include moments from the early building stages of Pupcup. The cards you see in those videos may be prototypes and not the final product.</span>' +
    '</div>' +
    '<div class="nav-menu-footer-right">Made with ' +
      '<svg class="nmf-heart" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>' +
      ' by Vilmar Morgan</div>';

  var menu = document.querySelector('.nav-menu');
  if (menu && !menu.querySelector('.nav-menu-footer')) {
    var footer = document.createElement('div');
    footer.className = 'nav-menu-footer';
    footer.innerHTML = FOOTER_HTML;
    menu.appendChild(footer);
  }

  // Animated prism glow behind the menu (same drifting blobs as the Kickstarter page).
  if (menu && !menu.querySelector('.nav-menu-prism')) {
    var prism = document.createElement('div');
    prism.className = 'nav-menu-prism';
    prism.setAttribute('aria-hidden', 'true');
    prism.innerHTML = '<span class="kc-blob b1"></span><span class="kc-blob b2"></span>' +
                      '<span class="kc-blob b3"></span><span class="kc-blob b4"></span>' +
                      '<span class="kc-blob b5"></span><span class="kc-blob b6"></span>';
    menu.insertBefore(prism, menu.firstChild);
  }

  if (!document.getElementById('nav-menu-footer-style')) {
    var style = document.createElement('style');
    style.id = 'nav-menu-footer-style';
    style.textContent = [
      '.nav-menu-footer{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;',
      'justify-content:space-between;flex-wrap:wrap;gap:10px 24px;padding:18px 40px;',
      'border-top:1px solid rgba(255,255,255,0.12);font-size:14px;line-height:1.45;',
      'color:var(--text-muted,#9a9a9e);}',
      '.nav-menu-footer-left{display:flex;flex-wrap:wrap;gap:4px 20px;flex:1 1 340px;min-width:0;}',
      '.nav-menu-footer .nmf-copy{white-space:nowrap;}',
      '.nav-menu-footer-right{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}',
      '.nav-menu-footer .nmf-heart{display:inline-block;vertical-align:middle;}',
      '@media (max-width:600px){.nav-menu-footer{padding:14px 18px;font-size:14px;gap:8px;}',
      '.nav-menu-footer-left{flex-basis:100%;}',
      '.nav-menu{align-items:flex-start;}',
      '.nav-menu-links{margin-top:80px;}}',
      '.nav-menu-prism{position:absolute;inset:0;overflow:hidden;z-index:0;background:#1e2028;pointer-events:none;}',
      '.nav-menu-links,.nav-menu-footer{position:relative;z-index:1;}',
      '.nav-menu-close{z-index:2;}',
      '.nav-menu .kc-blob{position:absolute;top:0;left:0;width:98vmax;height:40vmax;border-radius:50%;filter:blur(70px);opacity:0.5;mix-blend-mode:screen;will-change:transform;}',
      '.nav-menu .kc-blob.b1{background:radial-gradient(ellipse at center,#ff2d78 0%,rgba(255,45,120,0) 60%);animation:kcDrift1 20s ease-in-out infinite;}',
      '.nav-menu .kc-blob.b2{background:radial-gradient(ellipse at center,#1e8fff 0%,rgba(30,143,255,0) 60%);animation:kcDrift2 25s ease-in-out infinite;}',
      '.nav-menu .kc-blob.b3{background:radial-gradient(ellipse at center,#37d67a 0%,rgba(55,214,122,0) 60%);animation:kcDrift3 22s ease-in-out infinite;}',
      '.nav-menu .kc-blob.b4{background:radial-gradient(ellipse at center,#ffcf3f 0%,rgba(255,207,63,0) 60%);animation:kcDrift4 27s ease-in-out infinite;}',
      '.nav-menu .kc-blob.b5{background:radial-gradient(ellipse at center,#ff8d1e 0%,rgba(255,141,30,0) 60%);animation:kcDrift5 23s ease-in-out infinite;}',
      '.nav-menu .kc-blob.b6{background:radial-gradient(ellipse at center,#9b5cff 0%,rgba(155,92,255,0) 60%);animation:kcDrift6 31s ease-in-out infinite;}',
      '.nav-menu:not(.active) .kc-blob{animation-play-state:paused;}',
      '@keyframes kcDrift1{0%,100%{transform:translate(-34vw,-30vh) rotate(15deg) scale(1,1)}33%{transform:translate(38vw,4vh) rotate(-25deg) scale(1.3,0.7)}66%{transform:translate(64vw,52vh) rotate(55deg) scale(0.85,1.25)}}',
      '@keyframes kcDrift2{0%,100%{transform:translate(60vw,-28vh) rotate(-20deg) scale(1.1,0.9)}33%{transform:translate(18vw,44vh) rotate(30deg) scale(0.8,1.3)}66%{transform:translate(-30vw,20vh) rotate(70deg) scale(1.25,0.8)}}',
      '@keyframes kcDrift3{0%,100%{transform:translate(52vw,58vh) rotate(40deg) scale(0.9,1.15)}33%{transform:translate(-20vw,64vh) rotate(-30deg) scale(1.3,0.75)}66%{transform:translate(6vw,-24vh) rotate(10deg) scale(1,1)}}',
      '@keyframes kcDrift4{0%,100%{transform:translate(-28vw,50vh) rotate(-10deg) scale(1.2,0.85)}33%{transform:translate(46vw,60vh) rotate(45deg) scale(0.85,1.3)}66%{transform:translate(58vw,-16vh) rotate(-40deg) scale(1.15,0.9)}}',
      '@keyframes kcDrift5{0%,100%{transform:translate(20vw,-30vh) rotate(25deg) scale(1,1.1)}33%{transform:translate(62vw,30vh) rotate(-35deg) scale(1.3,0.75)}66%{transform:translate(-24vw,56vh) rotate(60deg) scale(0.9,1.25)}}',
      '@keyframes kcDrift6{0%,100%{transform:translate(-30vw,10vh) rotate(-30deg) scale(1.15,0.9)}33%{transform:translate(30vw,64vh) rotate(20deg) scale(0.85,1.3)}66%{transform:translate(64vw,-20vh) rotate(-55deg) scale(1.25,0.8)}}',
      '@media (prefers-reduced-motion:reduce){.nav-menu .kc-blob{animation:none !important;}}'
    ].join('');
    document.head.appendChild(style);
  }
})();
