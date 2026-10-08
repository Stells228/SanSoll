export default function ProfileModal({ show, onClose, onLogout }) {
  if (!show) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Личный кабинет</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="product-info-section">
            <h3>Добро пожаловать!</h3>
            <p>Вы успешно вошли в свой аккаунт. Здесь будет отображаться история ваших заказов и личная информация.</p>
          </div>

          <div className="product-info-section">
            <h3>Мои заказы</h3>
            <p>У вас пока нет оформленных заказов.</p>
          </div>

          <button className="cart-delete-selected settings-btn-full" onClick={onLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}