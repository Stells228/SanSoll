// Плавная прокрутка к секции по id
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const navbar = document.getElementById('navbar');
  const navHeight = navbar ? navbar.offsetHeight : 0;
  const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navHeight;

  window.scrollTo({
    top: sectionTop,
    behavior: 'smooth'
  });
}

// Мобильное меню (гамбургер)
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.toggle('active');
}

// Закрытие мобильного меню при клике на ссылку
function closeMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('active');
}

// Динамический цвет навбара при скролле
function setNavbarScrolled() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 90) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Инициализация событий навбара
function initNavbarEvents() {
  // Скролл
  window.addEventListener('scroll', setNavbarScrolled);

  // Гамбургер
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

  // Клик по любой nav-link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
  document.querySelector('.close-menu-btn').addEventListener('click', closeMobileMenu);
}

// Автоматически закрывать меню при ресайзе окна
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    // Скрыть мобильное меню при возвращении на десктоп
    closeMobileMenu();
  }
});
