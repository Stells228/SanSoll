export default function SuccessModal({ show, onClose, trackingNumber }) {
  if (!show) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body success-modal-body">
          <img src="/icons/sucscess.svg" alt="" className="success-icon" />
          <h2 className="success-title">Покупка успешно совершена!</h2>
          <p className="success-text">Ваш заказ принят в обработку.</p>
          <p className="success-text">
            Номер отслеживания: <br />
            <strong className="success-track-num">{trackingNumber}</strong>
          </p>
          <div className="success-info">
            <p>
              Вы можете отследить статус заказа в разделе <strong>"Отслеживание заказов"</strong> в вашем личном кабинете.
            </p>
          </div>
          <button className="cart-checkout-btn success-close-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}