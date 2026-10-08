export default function About() {
  return (
    <section id="about" className="about">
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
      <div className="container">
        <div className="section-header fade-in">
          <div className="section-badge glass-card">
            <span>Наша миссия</span>
          </div>
          <h2>Здоровье — это инвестиция в будущее</h2>
          <p>Мы предлагаем только проверенные натуральные продукты для поддержания вашего здоровья</p>
        </div>

        <div className="about-grid">
          <div className="about-card glass-card slide-up">
            <div className="card-icon-complex">
              <div className="card-pill-bg"></div>
              <div className="card-icon">🌿</div>
            </div>
            <h3>Натуральность</h3>
            <p>Только природные компоненты без синтетических добавок</p>
            <div className="card-formula">C₆H₁₂O₆</div>
          </div>
          <div className="about-card glass-card slide-up">
            <div className="card-icon-complex">
              <div className="card-pill-bg"></div>
              <div className="card-icon">✓</div>
            </div>
            <h3>Качество</h3>
            <p>Все товары проходят строгий контроль качества</p>
            <div className="card-formula">H₂O₂</div>
          </div>
          <div className="about-card glass-card slide-up">
            <div className="card-icon-complex">
              <div className="card-pill-bg"></div>
              <div className="card-icon">🚚</div>
            </div>
            <h3>Доставка</h3>
            <p>Быстрая и надежная доставка по всей России</p>
            <div className="card-formula">C₈H₁₁NO₂</div>
          </div>
        </div>
      </div>
    </section>
  );
}