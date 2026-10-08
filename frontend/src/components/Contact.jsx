export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content glass-card">
          <div className="contact-info">
            <h2>Свяжитесь с нами</h2>
            <p>Готовы ответить на ваши вопросы и помочь с выбором</p>

            <div className="contact-methods">
              <a href="https://t.me/SanSoll_bot?start=1" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">📱</div>
                <div className="method-info">
                  <h4>Telegram</h4>
                  <span>@SanSoll_bot</span>
                </div>
                <div className="method-pills">
                  <div className="contact-pill"></div>
                  <div className="contact-pill"></div>
                </div>
              </a>

              <a href="https://argo.company/" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">🛒</div>
                <div className="method-info">
                  <h4>Наш магазин</h4>
                  <span>Argo Company</span>
                </div>
                <div className="method-pills">
                  <div className="contact-pill"></div>
                  <div className="contact-pill"></div>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-visual">
            <div className="contact-logo-complex">
              <div className="logo-structure">
                <div className="structure-pill main-pill"></div>
                <div className="structure-molecules">
                  <div className="mol-1"></div>
                  <div className="mol-2"></div>
                  <div className="mol-3"></div>
                  <div className="mol-4"></div>
                </div>
              </div>
            </div>
            <div className="floating-pills-contact">
              <div className="pill pill-1"></div>
              <div className="pill pill-2"></div>
              <div className="pill pill-3"></div>
              <div className="pill pill-4"></div>
              <div className="pill pill-5"></div>
              <div className="pill pill-6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}