/* =========================================================
   Thaísa Daher — site oficial de fã
   JavaScript compartilhado entre todas as páginas
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  markActiveNavLink();
  initTabs();
  initTimelineReveal();
  initCountUp();
  initBackToTop();
});

/* ---------- Menu mobile ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Destaca o link da página atual no menu ---------- */
function markActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ---------- Sistema de abas (Carreira, Clubes, Seleção, Títulos, Estatísticas) ---------- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach((tabGroup) => {
    const buttons = Array.from(tabGroup.querySelectorAll('.tab-list button'));
    const panels = Array.from(tabGroup.querySelectorAll('.tab-panel'));

    function activate(index) {
      buttons.forEach((b, i) => b.setAttribute('aria-selected', String(i === index)));
      panels.forEach((p, i) => p.classList.toggle('is-active', i === index));
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(index));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') activate((index + 1) % buttons.length);
        if (e.key === 'ArrowLeft') activate((index - 1 + buttons.length) % buttons.length);
      });
    });

    // Permite abrir uma aba direto por hash na URL, ex: clubes.html#titulos
    const hash = window.location.hash.replace('#', '');
    const hashIndex = buttons.findIndex((b) => b.dataset.tab === hash);
    activate(hashIndex >= 0 ? hashIndex : 0);
  });
}

/* ---------- Revela itens da linha do tempo ao rolar a página ---------- */
function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Contagem animada para os números de estatísticas ---------- */
function initCountUp() {
  const boxes = document.querySelectorAll('[data-count-to]');
  if (!boxes.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    boxes.forEach((el) => animate(el));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  boxes.forEach((el) => observer.observe(el));
}

/* ---------- Botão voltar ao topo ---------- */
function initBackToTop() {
  const btn = document.querySelector('.to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
