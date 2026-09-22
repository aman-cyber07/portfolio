(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var navbar = document.getElementById('navbar');
  var scrollProgress = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY;
    if (y > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (scrollProgress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (y / docH) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = Array.prototype.slice.call(el.parentElement.children);
          var idx = siblings.indexOf(el);
          var delay = Math.min(idx * 80, 400);
          setTimeout(function () { el.classList.add('visible'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  var heroTitle = document.getElementById('typedText');
  if (heroTitle && !reduceMotion) {
    var phrases = [
      'SOC Analyst: Always Watching.',
      'Always Ready. Always Learning.',
      'Threat Detection. Incident Response.',
      'Blue Team. 24/7 Mindset.'
    ];
    var pIndex = 0, cIndex = 0, deleting = false;
    function type() {
      var current = phrases[pIndex];
      if (!deleting) {
        heroTitle.textContent = current.slice(0, ++cIndex);
        if (cIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        heroTitle.textContent = current.slice(0, --cIndex);
        if (cIndex === 0) { deleting = false; pIndex = (pIndex + 1) % phrases.length; }
      }
      setTimeout(type, deleting ? 35 : 70);
    }
    type();
  } else if (heroTitle) {
    heroTitle.textContent = 'SOC Analyst: Always Watching, Always Ready.';
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); counterIO.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { counterIO.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.count; });
  }
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    var duration = 1400;
    var start = performance.now();
    if (reduceMotion) { el.textContent = target; return; }
    function step(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var glow = document.getElementById('cursorGlow');
  if (glow && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function animateGlow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(animateGlow);
    })();
  }

  if (!reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px, ' + (y * 0.28) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });

    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }
})();
