'use strict';

// ---- UTILS --------------------------------------------------
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
const isMobile = () => window.innerWidth <= 768;

// ---- PARTICLES CANVAS --------------------------------------
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], rafId;
  const COUNT_DESK = 40, COUNT_MOB = 16;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.4 + 0.35;
      this.vx = (Math.random() - 0.5) * 0.22;
      this.vy = (Math.random() - 0.5) * 0.22;
      this.alpha = Math.random() * 0.38 + 0.08;
      const hue = Math.random() > 0.6 ? 215 : 265;
      this.color = `hsla(${hue},72%,66%,${this.alpha})`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function build() {
    const n = isMobile() ? COUNT_MOB : COUNT_DESK;
    particles = Array.from({ length: n }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    const maxD = isMobile() ? 80 : 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${0.055 * (1 - d / maxD)})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    rafId = requestAnimationFrame(loop);
  }

  function init() {
    resize(); build();
    if (rafId) cancelAnimationFrame(rafId);
    loop();
  }

  window.addEventListener('resize', debounce(init, 300));
  init();
})();


// ---- NAVBAR SCROLL -----------------------------------------
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = debounce(() => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, 16);
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ---- MOBILE MENU -------------------------------------------
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-mobile');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


// ---- SMOOTH SCROLL -----------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.startsWith('http')) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});


// ---- BARRAS HERO (vc-bar-fill) -----------------------------
(function initBars() {
  const bars = document.querySelectorAll('.vc-bar-fill[data-fill]');
  bars.forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.fill + '%'; }, 700);
  });
})();


// ---- FAQ ---------------------------------------------------
(function initFaq() {
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('open');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });
})();


// ---- SCROLL REVEAL -----------------------------------------
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });
  els.forEach(el => obs.observe(el));
})();


// ---- CARD CURSOR GLOW (desktop only) -----------------------
(function initCardGlow() {
  if (isMobile()) return;
  document.querySelectorAll('.prop-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0.03) 60%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });
})();


// ---- ACTIVE NAV LINK ON SCROLL ----------------------------
(function initActiveNav() {
  const sections = [
    { id: 'propiedades', sel: '.nav-link[href="#propiedades"]' },
    { id: 'proceso', sel: '.nav-link[href="#proceso"]' },
    { id: 'preguntas', sel: '.nav-link[href="#preguntas"]' },
  ];

  const onScroll = debounce(() => {
    const midY = window.scrollY + window.innerHeight / 3;
    sections.forEach(({ id, sel }) => {
      const el = document.getElementById(id);
      const link = document.querySelector(sel);
      if (!el || !link) return;
      link.classList.toggle('active-link', midY >= el.offsetTop && midY < el.offsetTop + el.offsetHeight);
    });
  }, 60);

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ---- PASO ICONS HIGHLIGHT ----------------------------------
(function initPasos() {
  document.querySelectorAll('.proceso-step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      step.querySelector('.paso-icon')?.style.setProperty('transform', 'scale(1.08)');
    });
    step.addEventListener('mouseleave', () => {
      step.querySelector('.paso-icon')?.style.removeProperty('transform');
    });
  });
})();
