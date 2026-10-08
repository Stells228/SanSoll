import { useState } from 'react';
import { showToast } from './Toast';

export default function CheckoutModal({ show, onClose, orderItems, savedAddresses, savedCards, onConfirmOrder }) {
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || null);
  const [selectedCardId, setSelectedCardId] = useState(savedCards[0]?.id || null);
  const [showAddAddress, setShowAddAddress] = useState(savedAddresses.length === 0);
  const [showAddCard, setShowAddCard] = useState(savedCards.length === 0);

  const [newAddress, setNewAddress] = useState({ city: '', zip: '', street: '', house: '', apartment: '' });
  const [newCard, setNewCard] = useState({ cardNumber: '', cardExpiry: '', cardCvv: '' });

  const [addrErrors, setAddrErrors] = useState({});
  const [cardErrors, setCardErrors] = useState({});

  if (!show) return null;

  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddrChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'city' || name === 'street') val = val.replace(/[^a-zA-Zа-яА-ЯёЁ\s.-]/g, '');
    if (name === 'zip') val = val.replace(/\D/g, '').substring(0, 6);
    if (name === 'house' || name === 'apartment') val = val.replace(/[^a-zA-Zа-яА-Я0-9]/g, '').substring(0, 5);
    setNewAddress(prev => ({ ...prev, [name]: val }));
    setAddrErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleCardChange = (e) => {
    let val = e.target.value;
    const name = e.target.name;
    if (name === 'cardNumber') val = val.replace(/\D/g, '').substring(0, 16).match(/.{1,4}/g)?.join(' ') || '';
    if (name === 'cardExpiry') {
      val = val.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
    }
    if (name === 'cardCvv') val = val.replace(/\D/g, '').substring(0, 3);
    setNewCard(prev => ({ ...prev, [name]: val }));
    setCardErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!selectedAddressId && !showAddAddress) {
      showToast('Выберите адрес', 'error');
      return;
    }

    if (showAddAddress) {
      const errs = {};
      if (!newAddress.city) errs.city = 'Укажите город';
      if (!newAddress.zip) errs.zip = 'Укажите индекс';
      if (!newAddress.street) errs.street = 'Укажите улицу';
      if (!newAddress.house) errs.house = 'Укажите дом';
      setAddrErrors(errs);
      if (Object.keys(errs).length > 0) isValid = false;
    }

    if (!selectedCardId && !showAddCard) {
      showToast('Выберите карту', 'error');
      return;
    }

    if (showAddCard) {
      const errs = {};
      const num = newCard.cardNumber.replace(/\s/g, '');
      if (num.length !== 16) errs.cardNumber = 'Введите 16 цифр';
      if (!newCard.cardExpiry || newCard.cardExpiry.length < 5) {
        errs.cardExpiry = 'Формат ММ/ГГ';
      } else {
        const [month, year] = newCard.cardExpiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (parseInt(month) > 12 || parseInt(month) < 1) errs.cardExpiry = 'Неверный месяц';
        else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) errs.cardExpiry = 'Карта истекла';
      }
      if (!newCard.cardCvv || newCard.cardCvv.length < 3) errs.cardCvv = '3 цифры';
      setCardErrors(errs);
      if (Object.keys(errs).length > 0) isValid = false;
    }

    if (!isValid) return;

    onConfirmOrder({
      selectedAddressId: !showAddAddress ? selectedAddressId : null,
      newAddress: showAddAddress ? newAddress : null,
      selectedCardId: !showAddCard ? selectedCardId : null,
      newCard: showAddCard ? newCard : null,
    });
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="auth-title">Оформление заказа</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="modal-body checkout-modal-body">
          <form onSubmit={handleSubmit}>

            {/* Адрес */}
            <div className="checkout-block">
              <h3 className="checkout-section-title">
                <img src="/icons/adres.svg" alt="" className="checkout-section-icon" />
                Адрес доставки
              </h3>
              <div className="methods-grid">
                {savedAddresses.map(addr => (
                  <div
                    key={addr.id}
                    className={`method-block ${selectedAddressId === addr.id && !showAddAddress ? 'selected' : ''}`}
                    onClick={() => { setSelectedAddressId(addr.id); setShowAddAddress(false); }}
                  >
                    <strong>{addr.city}, {addr.street} {addr.house}</strong>
                    <span>{addr.zip}, кв. {addr.apartment || '-'}</span>
                  </div>
                ))}
                <div
                  className={`method-block add-block ${showAddAddress ? 'hidden' : ''}`}
                  onClick={() => { setShowAddAddress(true); setSelectedAddressId(null); }}
                >
                  <span className="plus-icon">＋</span>
                </div>
              </div>

              {showAddAddress && (
                <div className="checkout-form-block">
                  <div className="checkout-form-grid">
                    <div>
                      <label className="checkout-label">Город *</label>
                      <input
                        type="text" name="city" placeholder="Москва"
                        value={newAddress.city} onChange={handleAddrChange}
                        className={`form-control ${addrErrors.city ? 'error-input' : ''}`}
                      />
                      {addrErrors.city && <div className="error-text">{addrErrors.city}</div>}
                    </div>
                    <div>
                      <label className="checkout-label">Индекс *</label>
                      <input
                        type="text" name="zip" placeholder="123456"
                        value={newAddress.zip} onChange={handleAddrChange}
                        className={`form-control ${addrErrors.zip ? 'error-input' : ''}`}
                      />
                      {addrErrors.zip && <div className="error-text">{addrErrors.zip}</div>}
                    </div>
                  </div>

                  <div className="checkout-form-row">
                    <label className="checkout-label">Улица *</label>
                    <input
                      type="text" name="street" placeholder="ул. Пушкина"
                      value={newAddress.street} onChange={handleAddrChange}
                      className={`form-control ${addrErrors.street ? 'error-input' : ''}`}
                    />
                    {addrErrors.street && <div className="error-text">{addrErrors.street}</div>}
                  </div>

                  <div className="checkout-form-grid-2">
                    <div>
                      <label className="checkout-label">Дом *</label>
                      <input
                        type="text" name="house" placeholder="10"
                        value={newAddress.house} onChange={handleAddrChange}
                        className={`form-control ${addrErrors.house ? 'error-input' : ''}`}
                      />
                      {addrErrors.house && <div className="error-text">{addrErrors.house}</div>}
                    </div>
                    <div>
                      <label className="checkout-label">Квартира</label>
                      <input
                        type="text" name="apartment" placeholder="15"
                        value={newAddress.apartment} onChange={handleAddrChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      className="cart-clear-btn checkout-cancel-btn"
                      onClick={() => { setShowAddAddress(false); setAddrErrors({}); }}
                    >
                      Отмена
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Оплата */}
            <div className="checkout-block">
              <h3 className="checkout-section-title">
                <img src="/icons/wallet.svg" alt="" className="checkout-section-icon" />
                Способ оплаты
              </h3>
              <div className="methods-grid">
                {savedCards.map(card => (
                  <div
                    key={card.id}
                    className={`method-block ${selectedCardId === card.id && !showAddCard ? 'selected' : ''}`}
                    onClick={() => { setSelectedCardId(card.id); setShowAddCard(false); }}
                  >
                    <strong>**** {card.cardNumber.slice(-4)}</strong>
                    <span>{card.cardExpiry}</span>
                  </div>
                ))}
                <div
                  className={`method-block add-block ${showAddCard ? 'hidden' : ''}`}
                  onClick={() => { setShowAddCard(true); setSelectedCardId(null); }}
                >
                  <span className="plus-icon">＋</span>
                </div>
              </div>

              {showAddCard && (
                <div className="checkout-form-block">
                  <div className="checkout-form-row">
                    <label className="checkout-label">Номер карты *</label>
                    <input
                      type="text" name="cardNumber" placeholder="0000 0000 0000 0000"
                      value={newCard.cardNumber} onChange={handleCardChange} maxLength="19"
                      className={`form-control ${cardErrors.cardNumber ? 'error-input' : ''}`}
                    />
                    {cardErrors.cardNumber && <div className="error-text">{cardErrors.cardNumber}</div>}
                  </div>

                  <div className="checkout-form-grid-2">
                    <div>
                      <label className="checkout-label">Срок *</label>
                      <input
                        type="text" name="cardExpiry" placeholder="ММ/ГГ"
                        value={newCard.cardExpiry} onChange={handleCardChange} maxLength="5"
                        className={`form-control ${cardErrors.cardExpiry ? 'error-input' : ''}`}
                      />
                      {cardErrors.cardExpiry && <div className="error-text">{cardErrors.cardExpiry}</div>}
                    </div>
                    <div>
                      <label className="checkout-label">CVV *</label>
                      <input
                        type="password" name="cardCvv" placeholder="•••"
                        value={newCard.cardCvv} onChange={handleCardChange} maxLength="3"
                        className={`form-control ${cardErrors.cardCvv ? 'error-input' : ''}`}
                      />
                      {cardErrors.cardCvv && <div className="error-text">{cardErrors.cardCvv}</div>}
                    </div>
                  </div>

                  {savedCards.length > 0 && (
                    <button
                      type="button"
                      className="cart-clear-btn checkout-cancel-btn"
                      onClick={() => { setShowAddCard(false); setCardErrors({}); }}
                    >
                      Отмена
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Заказ */}
            <div className="checkout-block">
              <h3 className="checkout-section-title">
                <img src="/icons/ord.svg" alt="" className="checkout-section-icon" />
                Ваш заказ
              </h3>
              {orderItems.map(item => (
                <div key={item.id} className="checkout-order-item">
                  <span>{item.title} <strong>x{item.quantity}</strong></span>
                  <span className="checkout-item-price">{(item.price * item.quantity).toFixed(2)} ₽</span>
                </div>
              ))}
              <div className="checkout-total-row">
                <strong className="checkout-total-label">Итого к оплате:</strong>
                <strong className="checkout-total-price">{totalPrice.toFixed(2)} ₽</strong>
              </div>
            </div>

            <button type="submit" className="cart-checkout-btn checkout-submit-btn">
              Подтвердить и оплатить {totalPrice.toFixed(2)} ₽
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}