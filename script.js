(() => {
  const config = window.SHOP_CONFIG || {};
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');
  const contactLink = document.querySelector('[data-contact-link]');
  const contactHint = document.querySelector('[data-contact-hint]');

  document.querySelector('#year').textContent = new Date().getFullYear();

  const setText = (selector, value, fallback) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value || fallback;
    });
  };
  setText('[data-shop-address]', config.address, 'ठेगाना थप्नुहोस्');
  setText('[data-shop-hours]', config.hours, 'पसलको समय थप्नुहोस्');
  setText('[data-map-address]', config.address, 'यहाँ पसलको नक्सा राख्नुहोस्');

  const mapLink = document.querySelector('[data-map-link]');
  if (mapLink && config.mapUrl) {
    mapLink.href = config.mapUrl;
    mapLink.target = '_blank';
    mapLink.rel = 'noopener noreferrer';
  }

  if (contactLink && config.phone) {
    contactLink.href = `tel:${config.phone.replace(/[^+\d]/g, '')}`;
    contactLink.innerHTML = 'फोन गरेर सोध्नुहोस् <span>↗</span>';
    contactHint.textContent = config.phone;
  } else if (contactLink && config.email) {
    contactLink.href = `mailto:${config.email}?subject=${encodeURIComponent('कृषि औजारबारे सोधपुछ')}`;
    contactLink.innerHTML = 'इमेल गरेर सोध्नुहोस् <span>↗</span>';
    contactHint.textContent = config.email;
  }

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      menu.setAttribute('aria-label', open ? 'मेनु खोल्नुहोस्' : 'मेनु बन्द गर्नुहोस्');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'मेनु खोल्नुहोस्');
    }));
  }

  const updateScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    const y = Math.min(window.scrollY * 0.12, 48);
    const photo = document.querySelector('.hero-photo');
    if (photo && window.scrollY < window.innerHeight) photo.style.transform = `scale(1.04) translate3d(0, ${y}px, 0)`;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const revealTargets = document.querySelectorAll('.section-heading, .product-card, .parts-note, .story-copy, .service-item, .visit-copy, .map-card, .contact-inner');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((item) => { item.classList.add('reveal'); observer.observe(item); });
  }

  const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (finePointer.matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 2.2}deg) rotateX(${-y * 2.2}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();
