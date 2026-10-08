import { useState, useEffect, useRef } from 'react';

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar({
  isAuthenticated,
  username,
  onLoginClick,
  onLogout,
  cartCount,
  onCartClick,
  onTrackClick,
  onPillsClick,
  onSettingsClick,
  isAdmin,
  onAdminClick
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="nav-bar glass-effect" id="navbar">
      <div className="nav-container">
        <div className="logo">
          <div className="logo-complex">
            <div className="logo-pill"></div>
            <div className="logo-molecules">
              <div className="molecule-dot"></div>
              <div className="molecule-dot"></div>
              <div className="molecule-dot"></div>
            </div>
          </div>
          <span>SanSoll</span>
        </div>

        <div className="nav-menu" id="nav-menu">
          <span className="nav-link" onClick={() => scrollToSection('hero')}>Главная</span>
          <span className="nav-link" onClick={() => scrollToSection('about')}>О нас</span>
          <span className="nav-link" onClick={() => scrollToSection('products')}>Товары</span>
          <span className="nav-link" onClick={() => scrollToSection('science')}>Наука</span>
          <span className="nav-link" onClick={() => scrollToSection('certificates')}>Сертификаты</span>
          <span className="nav-link" onClick={() => scrollToSection('reviews')}>Отзывы</span>
          <span className="nav-link" onClick={() => scrollToSection('contact')}>Контакты</span>
        </div>

        {!isAuthenticated ? (
          <button className="cta-button" onClick={onLoginClick}>
            <span>Войти</span>
            <div className="button-pill"></div>
          </button>
        ) : (
          <div className="user-menu-container" ref={menuRef}>
            <button className="cta-button" onClick={() => setMenuOpen(!menuOpen)}>
              <span>Здравствуйте, {username}!</span>
            </button>

            {menuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-item" onClick={() => { onSettingsClick(); setMenuOpen(false); }}>
                  <img src="/icons/gear.svg" alt="settings" className="dropdown-icon" />
                  <span>Настройки аккаунта</span>
                </div>

                <div className="dropdown-item" onClick={() => { onCartClick(); setMenuOpen(false); }}>
                  <img src="/icons/cart.svg" alt="cart" className="dropdown-icon" />
                  <span>Корзина {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</span>
                </div>

                <div className="dropdown-item" onClick={() => { onTrackClick(); setMenuOpen(false); }}>
                  <img src="/icons/truck.svg" alt="track" className="dropdown-icon" />
                  <span>Отслеживание заказов</span>
                </div>

                <div className="dropdown-item" onClick={() => { onPillsClick(); setMenuOpen(false); }}>
                  <img src="/icons/pills.svg" alt="tracker" className="dropdown-icon" />
                  <span>Трекер приёма БАДов</span>
                </div>

                {isAdmin && (
                  <>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item" onClick={() => { onAdminClick(); setMenuOpen(false); }}>
                      <img src="/icons/gear.svg" alt="admin" className="dropdown-icon" />
                      <span>Панель администратора</span>
                    </div>
                  </>
                )}

                <div className="dropdown-divider"></div>

                <div className="logout-btn" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  <img src="/icons/exit.svg" alt="exit" className="dropdown-icon logout-icon" />
                  <span>Выйти из аккаунта</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}