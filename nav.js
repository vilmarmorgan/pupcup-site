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
      '<span class="nmf-copy">© Vilmar Morgan LLC.</span>' +
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

  if (!document.getElementById('nav-menu-footer-style')) {
    var style = document.createElement('style');
    style.id = 'nav-menu-footer-style';
    style.textContent = [
      '.nav-menu-footer{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;',
      'justify-content:space-between;flex-wrap:wrap;gap:10px 24px;padding:18px 40px;',
      'border-top:1px solid rgba(255,255,255,0.12);font-size:12px;line-height:1.45;',
      'color:var(--text-muted,#9a9a9e);}',
      '.nav-menu-footer-left{display:flex;flex-wrap:wrap;gap:4px 20px;flex:1 1 340px;min-width:0;}',
      '.nav-menu-footer .nmf-copy{white-space:nowrap;}',
      '.nav-menu-footer-right{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}',
      '.nav-menu-footer .nmf-heart{display:inline-block;vertical-align:middle;}',
      '@media (max-width:600px){.nav-menu-footer{padding:14px 18px;font-size:11px;gap:8px;}',
      '.nav-menu-footer-left{flex-basis:100%;}}'
    ].join('');
    document.head.appendChild(style);
  }
})();
