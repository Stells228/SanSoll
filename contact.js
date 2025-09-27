// Кнопка "Наверх": появление при прокрутке и плавный скролл
function initBackToTopBtn() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Анимация контактов при появлении 
function animateContactsOnScroll() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        contactSection.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  observer.observe(contactSection);
}

// Обработка кликов по контактным кнопкам 
function initContactButtons() {
  const telegramBtn = document.querySelector('.contact-method[href*="t.me"]');
  const ozonBtn = document.querySelector('.contact-method[href*="ozon.ru"]');
  if (telegramBtn) {
    telegramBtn.addEventListener('click', () => {
    });
  }
  if (ozonBtn) {
    ozonBtn.addEventListener('click', () => {
    });
  }
}

// Инициализация после DOM
document.addEventListener('DOMContentLoaded', () => {
  initBackToTopBtn();
  animateContactsOnScroll();
  initContactButtons();
  pulseFooterLogo();
});
