/* ============================================================
   Portfolio interactions
   ============================================================ */

/* ---------- Custom cursor (dot + trailing ring) ---------- */
(function () {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;   // real mouse position
  let ringX = 0, ringY = 0;     // eased ring position

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smoothly trail the ring behind the dot
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow the ring over interactive elements
  document.querySelectorAll('[data-cursor], a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ---------- Typewriter rotating roles ---------- */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = [
    'scalable APIs.',
    'Laravel apps.',
    'WordPress sites.',
    'CI frameworks.',
    'React front-ends.',
    'clean backends.',
  ];
  let w = 0, c = 0, deleting = false;

  function tick() {
    const word = words[w];
    el.textContent = word.substring(0, c);

    if (!deleting && c < word.length) {
      c++;
    } else if (deleting && c > 0) {
      c--;
    } else if (!deleting && c === word.length) {
      deleting = true;
      setTimeout(tick, 1400);   // pause on full word
      return;
    } else {
      deleting = false;
      w = (w + 1) % words.length;
    }
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();

/* ---------- Smooth scrolling (JS-driven, offset for fixed nav) ---------- */
(function () {
  const nav = document.querySelector('.nav');

  function scrollToTarget(hash) {
    // "#top" (the fixed navbar) => go all the way up
    if (hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(hash);
    if (!target) return;
    const navH = nav ? nav.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash.length < 2) return; // ignore bare "#"
      e.preventDefault();
      scrollToTarget(hash);
    });
  });
})();

/* ---------- Mobile nav toggle ---------- */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    })
  );
})();

/* ---------- Navbar bg + scroll progress bar ---------- */
(function () {
  const nav = document.querySelector('.nav');
  const bar = document.getElementById('progressBar');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / h) * 100 + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Reveal on scroll + trigger counters/bars ---------- */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document
    .querySelectorAll('.section, .work-card, .service-card, .stack-card')
    .forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
})();

/* ---------- Animated number counters ---------- */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const run = () => {
        cur += step;
        if (cur >= target) {
          el.textContent = target + '+';
        } else {
          el.textContent = cur;
          requestAnimationFrame(run);
        }
      };
      run();
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => io.observe(c));
})();

/* ---------- Magnetic buttons ---------- */
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ---------- 3D tilt on cards ---------- */
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(700px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();
