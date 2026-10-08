const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg"></div>
      <div className="hero-pills">
        <div className="hero-pill pill-1"></div>
        <div className="hero-pill pill-2"></div>
        <div className="hero-pill pill-3"></div>
        <div className="hero-pill pill-4"></div>
        <div className="hero-pill pill-5"></div>
      </div>
      <div className="hero-formulas">
        <div className="hero-formula formula-hero-1">C₆H₁₂O₆</div>
        <div className="hero-formula formula-hero-2">H₂O</div>
        <div className="hero-formula formula-hero-3">C₂₁H₃₀O₂</div>
      </div>
      <div className="hero-content fade-in">
        <div className="hero-badge glass-card">
          <span>Научный подход к здоровью</span>
        </div>
        <h1 className="hero-title">
          <span className="title-line">Магазин</span>
          <span className="title-line highlight">
            <div className="title-logo">
              <div className="title-pill"></div>
              SanSoll
            </div>
          </span>
          <span className="title-line">для вашего здоровья</span>
        </h1>
        <p className="hero-subtitle">
          Высококачественные БАДы, экстракты и добавки для поддержания здоровья всей семьи
        </p>
        <div className="hero-cta">
          <button className="primary-btn" onClick={() => scrollToSection('products')}>
            <span>Посмотреть товары</span>
            <div className="btn-arrow">→</div>
            <div className="btn-pills">
              <div className="btn-pill"></div>
              <div className="btn-pill"></div>
            </div>
          </button>
          <button className="secondary-btn glass-card" onClick={() => scrollToSection('science')}>
            <span>Научная база</span>
            <div className="btn-formula">C₆H₈O₆</div>
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item glass-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">4.8</div>
            <div className="stat-label">Рейтинг</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-icon">📦</div>
            <div className="stat-number">150+</div>
            <div className="stat-label">Заказов</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-icon">💬</div>
            <div className="stat-number">60</div>
            <div className="stat-label">Отзывов</div>
          </div>
        </div>
      </div>
    </section>
  );
}