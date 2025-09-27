// Плавная прокрутка
function scrollToSection(sectionId, offset = 80) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = section.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

// Плавно наверх
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Кнопка "Наверх": отображение/скрытие
function handleBackToTopButton() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  btn.onclick = scrollToTop;
}

window.addEventListener('scroll', handleBackToTopButton);

// Показать/скрыть элемент (универс)
function show(el) {
  if (typeof el === 'string') el = document.querySelector(el);
  if (el) el.style.display = '';
}

function hide(el) {
  if (typeof el === 'string') el = document.querySelector(el);
  if (el) el.style.display = 'none';
}

// Очистка содержимого блока
function clearContent(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) el.innerHTML = '';
}

// Оптимизация
function debounce(fn, ms = 200) {
  let timeout;
  return function () {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Ленивая анимация через IntersectionObserver
function lazyAnimate(selector, animationClass = 'visible', threshold = 0.1) {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
      }
    });
  }, { threshold: threshold });
  elements.forEach(el => observer.observe(el));
}

// Универсальные функции для мобильного меню 
function toggleMobileMenu(menuId = 'nav-menu') {
  const navMenu = document.getElementById(menuId);
  if (navMenu) navMenu.classList.toggle('active');
}

function closeMobileMenu(menuId = 'nav-menu') {
  const navMenu = document.getElementById(menuId);
  if (navMenu) navMenu.classList.remove('active');
}

// Функция для добавления классов по таймеру (лайт-анимация)
function animateSequentially(selector, className = 'visible', delay = 100) {
  const items = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add(className);
    }, i * delay);
  });
}

// Универсальный Event Listener 
function on(selector, event, handler) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) el.addEventListener(event, handler);
}

// Проверка ширины экрана 
function isMobile() {
  return window.innerWidth < 768;
}

