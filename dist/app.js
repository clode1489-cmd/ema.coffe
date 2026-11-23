const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sections = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reduceMotion.matches) entry.target.classList.add('revealing');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  sections.forEach(section => observer.observe(section));
}

const heroImage = document.querySelector('[data-parallax]');
if (heroImage) {
  const desktop = window.matchMedia('(min-width: 740px)');
  let frame = 0;

  function paintOffset() {
    const distance = desktop.matches && !reduceMotion.matches ? Math.min(28, Math.max(0, scrollY) * 0.045) : 0;
    heroImage.style.setProperty('--offset', `${distance}px`);
    frame = 0;
  }

  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(paintOffset);
  }, { passive: true });
  desktop.addEventListener('change', paintOffset);
  reduceMotion.addEventListener('change', paintOffset);
}

const mapButton = document.querySelector('#load-map');
if (mapButton) {
  mapButton.hidden = false;
  mapButton.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Кафе Ема на Яндекс Картах';
    frame.src = 'https://yandex.ru/map-widget/v1/?ol=biz&oid=35121025020';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    document.querySelector('#map-stage').replaceChildren(frame);
    frame.focus();
  }, { once: true });
}
