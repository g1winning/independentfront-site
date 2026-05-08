/* ============================================================
   THE INDEPENDENT FRONT — site interactions
   ============================================================ */

/* --- Mobile nav toggle --- */
(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
})();

/* --- Gate: FIX EVERYTHING button click reveal --- */
(function () {
  const btn = document.querySelector('[data-fix-button]');
  const gate = document.querySelector('[data-gate]');
  const hub = document.querySelector('[data-hub]');
  const flash = document.querySelector('[data-flash]');
  if (!btn || !gate || !hub) return;

  function trigger() {
    if (gate.classList.contains('gate--revealed')) return;
    gate.classList.add('gate--revealed');
    if (flash) {
      flash.classList.remove('is-active');
      // force reflow to restart animation
      void flash.offsetWidth;
      flash.classList.add('is-active');
    }
    setTimeout(() => {
      gate.style.display = 'none';
      hub.hidden = false;
      // Move focus to hub for keyboard / screen reader users
      const heading = hub.querySelector('h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: false });
      }
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }, 760);
  }

  btn.addEventListener('click', trigger);
  // Allow Space / Enter when focused — already handled by native button
  // Allow pressing Enter anywhere on the gate to trigger
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !gate.classList.contains('gate--revealed')) {
      // only if gate is in view
      if (document.querySelector('[data-gate]:not([style*="display: none"])')) {
        e.preventDefault();
        trigger();
      }
    }
  });
})();

/* --- Smooth scroll for in-page anchors --- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  a.addEventListener('click', (e) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  });
});

/* --- Reveal on scroll (subtle) --- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  els.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = 'opacity 600ms cubic-bezier(.17,.84,.44,1), transform 600ms cubic-bezier(.17,.84,.44,1)'; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
})();

/* --- Chart.js theme + helpers --- */
window.IF = window.IF || {};
window.IF.charts = window.IF.charts || {};

window.IF.applyChartDefaults = function () {
  if (!window.Chart) return;
  const Chart = window.Chart;
  const css = getComputedStyle(document.documentElement);
  const ink   = css.getPropertyValue('--ink').trim() || '#0a0a0a';
  const ash   = css.getPropertyValue('--ash').trim() || '#2a2a2a';
  const smoke = css.getPropertyValue('--smoke').trim() || '#6b6b6b';
  const blood = css.getPropertyValue('--blood').trim() || '#c8102e';
  const gold  = css.getPropertyValue('--gold').trim() || '#c9a227';
  const bone  = css.getPropertyValue('--bone').trim() || '#ebe7de';
  const paper = css.getPropertyValue('--paper').trim() || '#f4f1ea';

  Chart.defaults.font.family = '"Archivo", "Helvetica Neue", Arial, sans-serif';
  Chart.defaults.font.size = 13;
  Chart.defaults.color = ash;
  Chart.defaults.borderColor = 'rgba(10,10,10,0.12)';
  Chart.defaults.plugins.legend.position = 'bottom';
  Chart.defaults.plugins.legend.labels.boxWidth = 14;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.legend.labels.font = { weight: '600', size: 12 };

  window.IF.colors = {
    ink, ash, smoke, blood, gold, bone, paper,
    bloodSoft: 'rgba(200,16,46,0.16)',
    bloodLine: 'rgba(200,16,46,0.85)',
    series: [blood, ink, gold, '#3a4f6f', '#7a3b56', '#476b51', '#a36a2c', '#475569', '#2f4f4f', '#7c4d2a']
  };
};

/* Render shorthand */
window.IF.render = function (canvasId, type, data, opts) {
  const c = document.getElementById(canvasId);
  if (!c || !window.Chart) return;
  if (!window.IF.colors) window.IF.applyChartDefaults();
  const merged = Object.assign({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { tooltip: { backgroundColor: window.IF.colors.ink, padding: 10, cornerRadius: 0, displayColors: true, titleFont: { weight: '700', size: 13 }, bodyFont: { size: 12 } } },
    scales: undefined,
    animation: { duration: 700, easing: 'easeOutCubic' }
  }, opts || {});
  return new window.Chart(c.getContext('2d'), { type, data, options: merged });
};

/* Apply defaults once script is parsed (Chart.js may load after) */
document.addEventListener('DOMContentLoaded', function () {
  if (window.Chart) window.IF.applyChartDefaults();
});

/* --- Active nav highlight --- */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav] a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
