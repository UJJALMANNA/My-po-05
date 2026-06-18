// ============================================================
// REVEAL — lightweight scroll-triggered fade/rise animation.
// No dependencies. Respects prefers-reduced-motion.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = document.querySelectorAll(
    '.section__head, .about__text, .about__card, .timeline__item, .gate-card, .news-item, .contact__grid > *'
  );

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));

  // Re-observe dynamically injected nodes (news items, gate cards load via fetch)
  const dynamicContainers = [document.getElementById('newsList'), document.getElementById('gateGrid')];
  dynamicContainers.forEach(container => {
    if (!container) return;
    const mo = new MutationObserver(() => {
      container.querySelectorAll(':scope > *').forEach(el => {
        if (!el.classList.contains('reveal') && !el.classList.contains('is-visible')) {
          el.classList.add('reveal');
          observer.observe(el);
        }
      });
    });
    mo.observe(container, { childList: true });
  });
});
