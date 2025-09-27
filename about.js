const aboutCards = [
  {
    icon: '🌿',
    title: 'Натуральность',
    description: 'Только природные компоненты без синтетических добавок',
    formula: 'C₆H₁₂O₆'
  },
  {
    icon: '✓',
    title: 'Качество',
    description: 'Все товары проходят строгий контроль качества',
    formula: 'H₂O₂'
  },
  {
    icon: '🚚',
    title: 'Доставка',
    description: 'Быстрая и надежная доставка через Ozon',
    formula: 'C₈H₁₁NO₂'
  }
];

// Рисуем карточки преимуществ с анимацией
function renderAboutSection() {
  const grid = document.querySelector('.about-grid');
  if (!grid) return;

  grid.innerHTML = aboutCards.map((card, idx) => `
    <div class="about-card glass-card slide-up" style="animation-delay:${idx * 160}ms">
      <div class="card-icon-complex">
        <div class="card-pill-bg"></div>
        <div class="card-icon">${card.icon}</div>
      </div>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <div class="card-formula">${card.formula}</div>
    </div>
  `).join('');

  animateAboutCards();
}

// Анимируем появление карточек slide-up при скролле. 
function animateAboutCards() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        entry.target.classList.add('visible');
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10px 0px' });

  document.querySelectorAll('.about-card').forEach(card => observer.observe(card));
}

function initAbout() {
  renderAboutSection();
}