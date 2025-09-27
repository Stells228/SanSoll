function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in, .slide-up');
  const observerOptions = {
    threshold: 0.13,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}

// Поочередный анимированный вывод коллекции карточек 
function animateCards(selector, delay = 100) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.19,1,0.22,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * delay);
  });
}

function animateCounterNumber(el, target, duration = 1200) {
  let start = 0;
  const step = Math.abs(target) > 0 && typeof target === "number" ? Math.ceil(target / (duration / 24)) : 1;
  const interval = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = start;
    }
  }, 24);
}

// Анимация плавного появления кнопки "Наверх"
function initBackToTopFade() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
}

// Подключение всех анимаций
function animationsInit() {
  initScrollAnimations();
  initBackToTopFade();
}

function initScrollAnimations() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.fade-in, .slide-up, .hero-slide, .review-card, .service-card, .science-card, .argo-product-card, .product-card, .contact-method')
    .forEach(el => observer.observe(el));
}

// Анимация поочередного появления карточек
function animateCards(selector, delay = 120) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.19,1,0.22,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * delay);
  });
}

// Анимация счетчиков в секции hero-statistics
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const options = { threshold: 0.5 };
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent, 10);
        let count = 0;
        const step = Math.ceil(target / 50);
        const interval = setInterval(() => {
          count += step;
          if (count >= target) {
            el.textContent = target;
            clearInterval(interval);
          } else {
            el.textContent = count;
          }
        }, 20);
        observer.unobserve(el);
      }
    });
  }, options);

  counters.forEach(counter => obs.observe(counter));
}

// Плавное появление/скрытие кнопки "Наверх"
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Плавный для фоновых элементов
function initFloatingParallax() {
  const floats = document.querySelectorAll('.floating-pill, .floating-formula, .medical-icon, .hero-pill');
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    floats.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
      el.style.transform = `translate3d(${-x * speed}px, ${-y * speed}px, 0)`;
    });
  });
}

// Общая инициализация анимаций
function animationsInit() {
  initScrollAnimations();
  animateCards('.service-card', 200);
  animateCards('.argo-product-card', 180);
  animateCards('.science-card', 200);
  animateCards('.product-card', 150);
  animateCards('.review-card', 180);
  initCounters();
  initBackToTop();
  initFloatingParallax();
}
