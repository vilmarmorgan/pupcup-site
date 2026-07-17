/*
 * Shared header micro-interaction for Pupcup.
 *
 * Every ~12s a bone drops onto the header's mission bar and the tongue pokes
 * down from under the pill to scoop it up (tongue + bone retract together).
 * Runs on any page that has a .hero-island containing a .hero-mission — the
 * homepage, How to Play, and Kickstarter Backers. The mission text differs per
 * page; that's fine, the animation only uses the bar's position/size.
 *
 * Loaded via <script src> with a RELATIVE path (bone-lick.js on the homepage,
 * ../bone-lick.js on subpages) so it works both deployed and from a local file.
 */
(function () {
  function start() {
    var island  = document.querySelector('.hero-island');
    var mission = document.querySelector('.hero-mission');
    if (!island || !mission) return;
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
    if (island.querySelector('.hero-lick-stage')) return;   // already running

    // Inject styles once. The stage clips only the TOP edge, so nothing shows
    // above the mission bar (behind the pill / off the top of the window), while
    // the bottom stays open so the tongue can dip a touch below the bar.
    if (!document.getElementById('bone-lick-style')) {
      var st = document.createElement('style');
      st.id = 'bone-lick-style';
      st.textContent = [
        '.hero-lick-stage{position:absolute;overflow:visible;',
        '-webkit-clip-path:inset(0 0 -400px 0);clip-path:inset(0 0 -400px 0);',
        'pointer-events:none;z-index:1;}',
        '.bone-toss,.tongue-lick{position:absolute;pointer-events:none;will-change:transform;opacity:0;}',
        '.tongue-lick.visible,.bone-toss.visible{opacity:1;}',
        '@media (prefers-reduced-motion:reduce){.hero-lick-stage{display:none !important;}}'
      ].join('');
      document.head.appendChild(st);
    }

    // Figure out the images/ directory from the page's own logo, so the SVG
    // paths resolve correctly from any page depth ('images/' or '../images/').
    var base = 'images/';
    var logo = document.querySelector('.hero-logo');
    if (logo) base = (logo.getAttribute('src') || '').replace(/[^\/]*$/, '') || 'images/';

    var BONE_W = 60, BONE_H = 60 * (16.29815 / 23.62716);   // keep bone aspect (~41px tall)
    var TONGUE_W = 96, TONGUE_H = 117;
    var rand = function (a, b) { return a + Math.random() * (b - a); };

    var stage = document.createElement('div');
    stage.className = 'hero-lick-stage';

    var tongue = document.createElement('img');
    tongue.src = base + 'tongue.svg'; tongue.className = 'tongue-lick';
    tongue.alt = ''; tongue.setAttribute('aria-hidden', 'true');
    tongue.style.width = TONGUE_W + 'px';
    tongue.style.top = (-TONGUE_H) + 'px';   // parked just above the stage (clipped away)

    var bone = document.createElement('img');
    bone.src = base + 'bone.svg'; bone.className = 'bone-toss';
    bone.alt = ''; bone.setAttribute('aria-hidden', 'true');
    bone.style.width = BONE_W + 'px';

    stage.appendChild(tongue);   // tongue first → beneath
    stage.appendChild(bone);     // bone after  → on top
    island.appendChild(stage);

    var lastBx = null;
    var covered = function () {
      return document.hidden ||
        !!document.querySelector('.nav-menu.active, .overlay.active, .video-overlay.active');
    };

    function cycle() {
      if (covered()) { setTimeout(cycle, 3000); return; }

      var mTop = mission.offsetTop, mH = mission.offsetHeight, islandW = island.clientWidth;
      stage.style.top = mTop + 'px';
      stage.style.left = '0px';
      stage.style.width = islandW + 'px';
      stage.style.height = mH + 'px';

      var pad = 46, bx, tries = 0;   // random landing x, avoiding the previous spot
      do { bx = rand(pad, Math.max(pad, islandW - pad - BONE_W)); tries++; }
      while (lastBx !== null && Math.abs(bx - lastBx) < islandW * 0.22 && tries < 12);
      lastBx = bx;

      // Bone rests ~5px lower than the tongue's start; the tongue then reaches
      // 20-40px further down than the bone (dipping below the bar) and lifts it.
      var boneDrop = rand(40, 50);
      var boneTop = Math.max(2, Math.min(boneDrop - BONE_H + 5, mH - BONE_H));
      var dropDist = boneDrop + rand(20, 40);
      var boneCenterX = bx + BONE_W / 2;
      var scoopStep = -(dropDist + 10);   // shared upward retract (both exit the top)

      // Bone drops in from the top (starts above, out of the clipped view),
      // sliding downward at a slight angle and rotating to a varied resting angle.
      var startX = rand(-40, 40);
      var startY = -(boneTop + BONE_H + 30);
      var landRot = rand(0, 360);
      var startRot = landRot + (Math.random() < 0.5 ? -1 : 1) * rand(35, 85);
      bone.style.transition = 'none';
      bone.style.left = bx + 'px';
      bone.style.top  = boneTop + 'px';
      bone.style.transform = 'translate(' + startX + 'px,' + startY + 'px) rotate(' + startRot + 'deg)';
      bone.classList.remove('visible');

      var tx = boneCenterX - TONGUE_W / 2;
      tx = Math.max(0, Math.min(tx, Math.max(0, islandW - TONGUE_W)));
      tongue.style.transition = 'none';
      tongue.style.transform = 'translateY(0)';
      tongue.style.left = tx + 'px';

      // 1) bone falls in from the top and eases to a smooth stop
      void bone.offsetWidth;
      bone.style.transition = 'transform 900ms cubic-bezier(0.17,0.84,0.35,1), opacity 240ms ease-out';
      bone.classList.add('visible');
      bone.style.transform = 'translate(0,0) rotate(' + landRot + 'deg)';

      setTimeout(function () {                 // 2) bone sits ~2s, then the tongue licks down
        tongue.classList.add('visible');
        tongue.style.transition = 'transform 700ms cubic-bezier(0.22,0.61,0.36,1)';
        tongue.style.transform = 'translateY(' + dropDist + 'px)';

        setTimeout(function () {               // 3) after a 1s dwell, scoop both up together
          var scoopEase = 'transform 760ms cubic-bezier(0.5,0.05,0.4,1)';
          tongue.style.transition = scoopEase;
          bone.style.transition   = scoopEase;
          tongue.style.transform  = 'translateY(' + (dropDist + scoopStep) + 'px)';
          bone.style.transform    = 'translate(0,' + scoopStep + 'px) rotate(' + landRot + 'deg)';

          setTimeout(function () {             // 4) clear and schedule the next
            bone.classList.remove('visible');
            tongue.classList.remove('visible');
            bone.style.transition = 'none';   tongue.style.transition = 'none';
            bone.style.transform = '';        tongue.style.transform = 'translateY(0)';
            setTimeout(cycle, 12000);          // 12s between drops
          }, 820);
        }, 700 + 1000);                        // tongue-down + 1s dwell
      }, 850 + 2000);                          // slide-in + ~2s sit before the tongue
    }

    setTimeout(cycle, 2600);                   // first drop shortly after load
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
