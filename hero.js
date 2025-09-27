document.addEventListener('DOMContentLoaded', () => {
  const heroSlides = [
    {
      img: 'https://ir.ozone.ru/s3/multimedia-1/wc1000/6666028744.jpg',
      title: 'Экстракт корня лопуха',
      desc: 'Поддержка печени и ЖКТ. Натурально, удобно, для всей семьи!',
      link: 'https://www.ozon.ru/product/ekstrakt-kornya-lopuha-75-ml-1668227000/'
    }
  ];

  // Функция для рендера hero-слайдера
  function renderHeroSlider() {
    const slider = document.getElementById('hero-slider');
    slider.innerHTML = heroSlides.map((slide, i) => `
    <div class="hero-slide${i === 0 ? ' active' : ''}">
      <img src="${slide.img}" alt="${slide.title}">
      <h3>${slide.title}</h3>
      <p>${slide.desc}</p>
      <button class="slide-btn" onclick="window.open('${slide.link}', '_blank')">Подробнее</button>
    </div>
  `).join('');

    createHeroSliderControls();
  }

  // Контролы (стрелки/точки) для hero-слайдера
  function createHeroSliderControls() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    const controls = document.createElement('div');
    controls.className = 'hero-slider-controls';

    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'hero-slider-dot';
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => activateHeroSlide(idx));
      controls.appendChild(dot);
    });

    slider.parentElement.appendChild(controls);
  }

  // Активация слайда
  function activateHeroSlide(idx) {
    const slider = document.getElementById('hero-slider');
    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.parentElement.querySelectorAll('.hero-slider-dot');
    slides.forEach(sl => sl.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
  }

  // Анимация заголовков hero (fade-in, slide-up)
  function animateHeroTitle() {
    const lines = document.querySelectorAll('.hero-title .title-line');
    lines.forEach((line, idx) => {
      setTimeout(() => {
        line.style.opacity = 1;
        line.style.transform = 'translateY(0)';
      }, 300 + idx * 200);
    });
  }

  // Анимация статистики hero
  function animateHeroStats() {
    document.querySelectorAll('.hero-stats .stat-item').forEach((item, idx) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, 600 + idx * 150);
    });
  }

  // Анимация кнопок hero
  function animateHeroButtons() {
    document.querySelectorAll('.hero-cta button').forEach((btn, idx) => {
      setTimeout(() => {
        btn.classList.add('visible');
      }, 800 + idx * 120);
    });
  }

  // Активация летающих пилюль 
  function initHeroPills() {
    document.querySelectorAll('.hero-pill').forEach(pill => {
      pill.classList.add('active');
    });
    document.querySelectorAll('.hero-formula').forEach(formula => {
      formula.classList.add('active');
    });
  }

  // Основная инициализация hero-секции
  function initHeroSection() {
    renderHeroSlider();
    animateHeroTitle();
    animateHeroStats();
    animateHeroButtons();
    initHeroPills();
  }

  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', function () {
    initHeroSection();
  });

});