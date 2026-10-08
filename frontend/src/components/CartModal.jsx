import { useState, useEffect } from 'react';

function CartItemRow({ item, isSelected, isPinned, isUnavailable, isOutOfStock, allProducts, toggleSelect, togglePin, onUpdateQty, onRemove }) {
  const productData = allProducts?.find(p => p.id === item.id);
  const discount = productData?.discount || 0;
  const stock = productData?.stock || 0;

  const actualPrice = item.price - (item.price * discount / 100);
  const totalPrice = (actualPrice * item.quantity).toFixed(0);
  const isMaxQtyReached = item.quantity >= stock;

  return (
    <div className={`cart-item ${isSelected ? 'selected' : ''} ${isUnavailable || isOutOfStock ? 'unavailable' : ''}`}>
      <div
        className={`custom-checkbox ${isSelected ? 'checked' : ''}`}
        onClick={() => !isUnavailable && !isOutOfStock && toggleSelect(item.id)}
      >
        {isSelected && <span className="check-mark">✓</span>}
      </div>

      <img
        src={item.imageUrls?.[0] || '/images/placeholder.webp'}
        alt={item.title}
        className="cart-item-img"
      />

      <div className="cart-item-info">
        <h4>{item.title}</h4>
        {isUnavailable ? (
          <p className="cart-status-text">Недоступен</p>
        ) : isOutOfStock ? (
          <p className="cart-status-text">Закончился</p>
        ) : (
          <>
            {discount > 0 && (
              <div className="cart-discount-info">
                <span className="cart-old-price">{item.price} ₽</span>
                <span className="cart-discount-badge">-{discount}%</span>
              </div>
            )}
            {item.quantity > 1 && (
              <span className="cart-item-piece-price">{actualPrice.toFixed(0)} ₽ / шт</span>
            )}
            <p className="cart-item-total-price">{totalPrice} ₽</p>
          </>
        )}
      </div>

      {!isUnavailable && !isOutOfStock && (
        <div className="cart-qty-stepper">
          <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)}>−</button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            disabled={isMaxQtyReached}
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      )}

      <div className="cart-item-actions">
        <button
          className={`cart-action-btn ${isPinned ? 'pinned' : ''}`}
          onClick={() => togglePin(item.id)}
        >
          <img src="/icons/pin.svg" alt="pin" className="action-icon" />
        </button>
        <button className="cart-action-btn delete" onClick={() => onRemove(item.id)}>
          <img src="/icons/trash.svg" alt="delete" className="action-icon" />
        </button>
      </div>
    </div>
  );
}

export default function CartModal({ show, onClose, cartItems, pinnedItems, allProducts, onTogglePin, onUpdateQty, onRemove, onClearCart, onCheckout }) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems(prev => prev.filter(id => cartItems.some(item => item.id === id)));
  }, [cartItems]);

  if (!show) return null;

  const toggleSelect = (id) =>
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => onRemove(id));
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    const availableIds = cartItems.filter(item => {
      const p = allProducts?.find(prod => prod.id === item.id);
      return p && p.stock > 0;
    }).map(item => item.id);

    if (selectedItems.length === availableIds.length) setSelectedItems([]);
    else setSelectedItems(availableIds);
  };

  const pinned = cartItems.filter(item => pinnedItems.includes(item.id));
  const unpinned = cartItems.filter(item => !pinnedItems.includes(item.id));

  const availableItems = unpinned.filter(item => {
    const p = allProducts?.find(prod => prod.id === item.id);
    return p && p.stock > 0;
  });

  const outOfStockItems = unpinned.filter(item => {
    const p = allProducts?.find(prod => prod.id === item.id);
    return p && p.stock === 0;
  });

  const unavailableItems = unpinned.filter(item => !allProducts?.some(p => p.id === item.id));

  const totalPrice = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const discount = allProducts?.find(p => p.id === item.id)?.discount || 0;
      const actualPrice = item.price - (item.price * discount / 100);
      return sum + (actualPrice * item.quantity);
    }, 0);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="auth-title">Корзина</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="modal-body cart-modal-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <h3>Ваша корзина пуста</h3>
              <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
            </div>
          ) : (
            <>
              <div className="cart-actions-top">
                <label className="cart-select-all">
                  <div
                    className={`custom-checkbox ${selectedItems.length === availableItems.length && availableItems.length > 0 ? 'checked' : ''}`}
                    onClick={handleSelectAll}
                  >
                    {selectedItems.length === availableItems.length && availableItems.length > 0 && (
                      <span className="check-mark">✓</span>
                    )}
                  </div>
                  Выбрать все доступные
                </label>
                {selectedItems.length > 0 && (
                  <button className="cart-delete-selected" onClick={handleDeleteSelected}>
                    Удалить выбранные ({selectedItems.length})
                  </button>
                )}
              </div>

              <div className="cart-items-list">
                {pinned.length > 0 && <div className="cart-section-title">Закреплённые</div>}
                {pinned.map(item => (
                  <CartItemRow
                    key={item.id} item={item}
                    isSelected={selectedItems.includes(item.id)} isPinned={true}
                    allProducts={allProducts}
                    toggleSelect={toggleSelect} togglePin={onTogglePin}
                    onUpdateQty={onUpdateQty} onRemove={onRemove}
                  />
                ))}

                {pinned.length > 0 && availableItems.length > 0 && <hr className="cart-divider" />}

                {availableItems.map(item => (
                  <CartItemRow
                    key={item.id} item={item}
                    isSelected={selectedItems.includes(item.id)} isPinned={false}
                    allProducts={allProducts}
                    toggleSelect={toggleSelect} togglePin={onTogglePin}
                    onUpdateQty={onUpdateQty} onRemove={onRemove}
                  />
                ))}

                {outOfStockItems.length > 0 && (
                  <>
                    <hr className="cart-divider" />
                    <div className="cart-section-title out-of-stock">Закончились</div>
                    {outOfStockItems.map(item => (
                      <CartItemRow
                        key={item.id} item={item}
                        isSelected={false} isOutOfStock={true}
                        allProducts={allProducts}
                        toggleSelect={toggleSelect} togglePin={onTogglePin}
                        onUpdateQty={onUpdateQty} onRemove={onRemove}
                      />
                    ))}
                  </>
                )}

                {unavailableItems.length > 0 && (
                  <>
                    <hr className="cart-divider" />
                    <div className="cart-section-title unavailable">Недоступные</div>
                    {unavailableItems.map(item => (
                      <CartItemRow
                        key={item.id} item={item}
                        isSelected={false} isUnavailable={true}
                        allProducts={allProducts}
                        toggleSelect={toggleSelect} togglePin={onTogglePin}
                        onUpdateQty={onUpdateQty} onRemove={onRemove}
                      />
                    ))}
                  </>
                )}
              </div>

              <div className="cart-footer">
                <button className="cart-clear-btn" onClick={onClearCart}>Очистить корзину</button>
                <div className="cart-total-block">
                  <span className="cart-total-label">Итого:</span>
                  <strong className="cart-total-price">{totalPrice.toFixed(0)} ₽</strong>
                </div>
                <button
                  className="cart-checkout-btn"
                  disabled={selectedItems.length === 0}
                  onClick={() => onCheckout(cartItems.filter(item => selectedItems.includes(item.id)))}
                >
                  Оформить заказ ({selectedItems.length})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}