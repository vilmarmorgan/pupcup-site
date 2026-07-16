/*
 * Shared navigation menu for Pupcup (playpupcup.com).
 *
 * SINGLE SOURCE OF TRUTH: edit the LINKS list below and every page's menu
 * overlay updates automatically (homepage, Kickstarter Backers, etc).
 *
 * Each page has an empty <nav class="nav-menu-links"></nav> followed by
 * <script src="nav.js"></script>. This script runs during parse (before the
 * page's own menu wiring) and fills in the links, so the existing open/close
 * and click-to-close handlers find them normally.
 *
 * Desktop layout: the overlay splits into two equal halves. Left half holds
 * the menu links (centered); right half holds the parody-universe story in a
 * rounded, outlined box. The animated prism sits behind BOTH halves and shows
 * through the transparent story box. On mobile the halves stack.
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

  // Parody-universe story shown in the right half of the menu.
  var STORY_HTML =
    '<p>In a parallel universe, dogs rule the world&hellip;</p>' +
    '<p>They run the cities, host the talk shows, win the medals, and yes, they still knock things off the counter.</p>' +
    '<p>And just like our world, this one has its icons: the celebrity pups.</p>' +
    '<p>From a flower-crowned artist in Mexico City to a wild-haired genius in Berlin, every card in Pupcup is one of these famous faces, reimagined with four paws and a wagging tail.</p>' +
    '<p>They&rsquo;re all originals, born in our little dog-run universe. Any likeness to real people is affectionate parody, nothing more.</p>' +
    '<p>We hope you enjoy playing Pupcup!</p>';

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

  var menu = document.querySelector('.nav-menu');

  // ── Two-column layout: move the links into a left half, add the story on the
  //    right half. Both sit above the prism (transparent, so it shows through). ──
  if (nav && menu && !menu.querySelector('.nav-menu-inner')) {
    var inner = document.createElement('div');
    inner.className = 'nav-menu-inner';

    var left = document.createElement('div');
    left.className = 'nav-menu-left';

    var right = document.createElement('div');
    right.className = 'nav-menu-right';
    right.innerHTML = '<div class="nav-menu-story">' + STORY_HTML + '</div>';

    nav.parentNode.insertBefore(inner, nav);
    left.appendChild(nav);       // relocate the links into the left half
    inner.appendChild(left);
    inner.appendChild(right);
  }

  // ── Footer: divider + disclaimer pinned to the bottom of the menu overlay ──
  var FOOTER_HTML =
    '<div class="nav-menu-footer-left">' +
      '<span class="nmf-copy">©2026 <a href="https://vilmarmorgan.com" target="_blank" rel="noopener">Vilmar Morgan LLC</a></span>' +
      '<span class="nmf-note">Please note: The videos shown on this site may include behind-the-scenes moments from the early building stages of Pupcup. The cards you see in those videos may be prototypes and not the final product.</span>' +
    '</div>' +
    '<div class="nav-menu-footer-right">Made with ' +
      '<svg class="nmf-heart" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>' +
      ' by Vilmar Morgan</div>';

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
      // ── Desktop: the overlay itself does not scroll. The links stay put on the
      //    left; the RIGHT half scrolls so the story box can expand to full height
      //    without ever scrolling inside the box. Footer is the last item at bottom. ──
      '.nav-menu{flex-direction:column;align-items:stretch;justify-content:flex-start;overflow:hidden;}',
      '.nav-menu-inner{position:relative;z-index:1;display:flex;flex-direction:row;align-items:stretch;width:100%;flex:1 1 auto;min-height:0;}',
      '.nav-menu-left{flex:1 1 50%;display:flex;align-items:center;justify-content:center;padding:24px;overflow:hidden;}',
      '.nav-menu-right{flex:1 1 50%;display:flex;flex-direction:column;align-items:stretch;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;padding:80px;}',
      // Story box grows to fit its content (margin:auto centers it, and lets it
      // scroll from the top within the right half when it is taller than the view).
      '.nav-menu-story{width:100%;max-width:700px;margin:auto;box-sizing:border-box;',
      'border:2px solid rgba(255,255,255,0.12);border-radius:40px;',
      'display:flex;flex-direction:column;align-items:flex-start;justify-content:center;',
      'gap:20px;padding:56px;text-align:left;}',
      '.nav-menu-story p{margin:0;max-width:560px;font-size:24px;line-height:1.5;color:var(--text,#f0ece4);}',
      // ── Glass top-bar header: the same blurred strip the card overlay uses.
      //    The menu content scrolls underneath it; the existing circular close X
      //    (kept as-is) sits on top of it. ──
      '.nav-menu::before{content:"";position:fixed;top:0;left:0;right:0;height:74px;background:rgba(20,20,24,0.2);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);z-index:2;pointer-events:none;}',
      // ── Footer ──
      // Footer is a normal flex item (the last one), not position-pinned.
      '.nav-menu-footer{position:relative;flex:0 0 auto;display:flex;align-items:center;',
      'justify-content:space-between;flex-wrap:wrap;gap:10px 24px;padding:18px 40px;',
      'border-top:1px solid rgba(255,255,255,0.12);font-size:14px;line-height:1.45;',
      'color:var(--text-muted,#9a9a9e);z-index:1;}',
      '.nav-menu-footer-left{display:flex;flex-wrap:wrap;gap:4px 20px;flex:1 1 340px;min-width:0;}',
      '.nav-menu-footer .nmf-copy{white-space:nowrap;}',
      '.nav-menu-footer-right{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}',
      '.nav-menu-footer .nmf-heart{display:inline-block;vertical-align:middle;}',
      '.nav-menu-footer a{color:inherit;font-weight:700;text-decoration:underline;text-underline-offset:2px;}',
      '.nav-menu-footer a:hover{color:#f0ece4;}',
      // ── Mobile: stack the two halves, allow the overlay to scroll ──
      '@media (max-width:600px){',
      // Mobile: the whole overlay scrolls normally; halves stack (links, story, footer).
      // touch-action/overscroll re-enable touch scrolling, which the homepage blocks
      // globally for the infinite-canvas drag (same opt-in the card overlay uses).
      '.nav-menu{overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;}',
      // Natural height (do NOT grow to fill) so the footer just follows as the last
      // item on the page rather than being pushed to the bottom of the screen.
      '.nav-menu-inner{flex-direction:column;flex:none;min-height:0;}',
      // Both halves become simple full-width, content-height blocks when stacked.
      // (Leaving the left at its desktop flex:1 1 50% collapsed the story box.)
      // 120px above the links (clears the close button); 80px gap beneath.
      '.nav-menu-left{flex:none;width:100%;padding:120px 24px 80px;}',
      // Menu links centered on mobile (story body below stays left-aligned).
      '.nav-menu-links{margin-top:0;align-items:center;text-align:center;}',
      '.nav-menu-arf{align-items:center;}',
      // Story flows in the page (no separate scroll, natural top position); 160px gap below.
      '.nav-menu-right{flex:none;width:100%;overflow:visible;padding:0 24px 160px;}',
      '.nav-menu-story{margin:0;padding:40px 28px;border-radius:28px;}',
      '.nav-menu-story p{font-size:18px;max-width:none;}',
      '.nav-menu-footer{padding:24px 18px 32px;font-size:14px;gap:8px;}',
      '.nav-menu-footer-left{flex-basis:100%;}',
      '}',
      // ── Prism (behind both halves) ──
      '.nav-menu-prism{position:fixed;inset:0;overflow:hidden;z-index:0;background:#1e2028;pointer-events:none;isolation:isolate;-webkit-clip-path:inset(0);clip-path:inset(0);}',
      // Links left-aligned to each other; the block stays centered in the left half.
      '.nav-menu-links{position:relative;z-index:1;align-items:flex-start;text-align:left;}',
      '.nav-menu-arf{align-items:flex-start;}',
      '.nav-menu-close{z-index:3;}',
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
