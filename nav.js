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
    { label: 'Rated Arf', href: 'https://ratedarf.com/', external: true, sub: 'Adult-Only NSFW Game' }
  ];

  var html = LINKS.map(function (l) {
    var rel = l.external ? ' rel="noopener"' : '';
    if (l.sub) {
      return '<div class="nav-menu-arf"><a href="' + l.href + '"' + rel + '>' + l.label + '</a>' +
             '<span class="nav-menu-arf-sub">' + l.sub + '</span></div>';
    }
    return '<a href="' + l.href + '"' + rel + '>' + l.label + '</a>';
  }).join('\n    ');

  var nav = document.querySelector('.nav-menu-links');
  if (nav) nav.innerHTML = html;
})();
