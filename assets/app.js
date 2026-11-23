(() => {
  const menuToggle = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const closeMenu = () => {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  menuToggle.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuToggle.focus(); }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const slides = [
    { title: 'Powering industry.<br>Building <span class="text-brand">confidence.</span>', description: 'Electrical expertise. Civil excellence. One trusted partner for installation, maintenance, and complete project execution.', label: 'Built for your industry' },
    { title: 'Strong foundations.<br>Lasting <span class="text-brand">possibilities.</span>', description: 'From concrete and steel to flooring and finishing, dependable civil works built around the needs of your facility.', label: 'Built to stand the test of time' },
    { title: 'Keeping you ready.<br>Keeping you <span class="text-brand">moving.</span>', description: 'Electrical and building maintenance, troubleshooting, and repairs that support your facility, every step of the way.', label: 'Care beyond completion' }
  ];
  const hero = document.querySelector('.hero');
  const images = document.querySelectorAll('.hero-image');
  const dots = document.querySelectorAll('[data-slide]');
  const pause = document.querySelector('#slider-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let timer;
  let pointerOver = false;
  let focused = false;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    document.querySelector('#hero-heading').innerHTML = slides[current].title;
    document.querySelector('#hero-description').textContent = slides[current].description;
    document.querySelector('#slide-label').textContent = slides[current].label;
    document.querySelector('#slide-count').textContent = `0${current + 1} / 03`;
    images.forEach((image, index) => {
      image.classList.toggle('is-current', index === current);
      image.setAttribute('aria-hidden', String(index !== current));
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === current);
      dot.setAttribute('aria-pressed', String(index === current));
    });
  }
  function schedule() {
    clearInterval(timer);
    if (!paused && !pointerOver && !focused && !document.hidden) timer = setInterval(() => showSlide(current + 1), 6500);
  }
  function updatePause() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    document.querySelector('#pause-icon').textContent = paused ? '▷' : 'Ⅱ';
    document.querySelector('.hero-copy').setAttribute('aria-live', paused || focused ? 'polite' : 'off');
    schedule();
  }
  function manualSlide(index) { paused = true; updatePause(); showSlide(index); }
  dots.forEach(dot => dot.addEventListener('click', () => manualSlide(Number(dot.dataset.slide))));
  document.querySelector('#slide-prev').addEventListener('click', () => manualSlide(current - 1));
  document.querySelector('#slide-next').addEventListener('click', () => manualSlide(current + 1));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  hero.addEventListener('mouseenter', () => { pointerOver = true; schedule(); });
  hero.addEventListener('mouseleave', () => { pointerOver = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; updatePause(); });
  hero.addEventListener('focusout', event => { if (!hero.contains(event.relatedTarget)) { focused = false; updatePause(); } });
  hero.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); manualSlide(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); manualSlide(current - 1); }
  });
  reducedMotion.addEventListener('change', event => { paused = event.matches; updatePause(); });
  document.addEventListener('visibilitychange', schedule);
  showSlide(0);
  updatePause();
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    document.querySelectorAll('.service-details')[Number(link.dataset.service)].open = true;
  }));
  const navigationLinks = [...document.querySelectorAll('.nav-link')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navigationLinks.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
