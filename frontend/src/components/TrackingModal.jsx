import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUSES = ['PENDING', 'ASSEMBLING', 'SHIPPED', 'DELIVERED'];
const STATUS_TRANSLATE = {
  PENDING: 'В обработке',
  ASSEMBLING: 'Собирается',
  SHIPPED: 'В пути',
  DELIVERED: 'Доставлен'
};

export default function TrackingModal({ show, onClose, orders, currentUser }) {
  const [dbOrders, setDbOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (show && currentUser) {
      axios.get(`/api/orders/user/${currentUser}`)
        .then(res => {
          // Сортируем: новые сверху
          const sorted = [...res.data].sort((a, b) => {
            // Сначала по id (у новых id больше), потом по дате как резерв
            if (b.id && a.id) return b.id - a.id;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setDbOrders(sorted);
        })
        .catch(err => console.error("Ошибка загрузки заказов", err));
    }
  }, [show, currentUser]);

  if (!show) return null;

  const getStepIndex = (status) => STATUSES.indexOf(status);
  const toggleExpand = (index) => setExpandedOrders(prev => ({ ...prev, [index]: !prev[index] }));

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content tracking-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Отслеживание заказов</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="modal-body tracking-modal-body">
          {dbOrders.length === 0 ? (
            <div className="cart-empty">
              <h3>У вас пока нет заказов</h3>
              <p>Оформите первый заказ, чтобы увидеть его здесь.</p>
            </div>
          ) : (
            <div className="tracking-list">
              {dbOrders.map((order, index) => {
                const currentStep = getStepIndex(order.status);
                const isExpanded = expandedOrders[index];

                return (
                  <div key={index} className="tracking-order-card">
                    <div className="tracking-order-header">
                      <div>
                        <span className="tracking-date">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                        <h4 className="tracking-track-num">Заказ: {order.trackNumber}</h4>
                      </div>
                      <div className="tracking-total">
                        <span>Сумма:</span>
                        <strong>{order.totalAmount} ₽</strong>
                      </div>
                    </div>

                    <div className="status-timeline">
                      {STATUSES.map((status, i) => (
                        <div key={i} className={`status-step ${i <= currentStep ? 'active' : ''} ${i === currentStep ? 'current' : ''}`}>
                          <div className="status-dot"></div>
                          <span>{STATUS_TRANSLATE[status]}</span>
                        </div>
                      ))}
                    </div>

                    <div className="tracking-items">
                      <button className="tracking-toggle-btn" onClick={() => toggleExpand(index)}>
                        {isExpanded ? 'Скрыть товары' : `Показать состав заказа (${order.items?.length || 0})`}
                      </button>

                      {isExpanded && order.items && order.items.map((item, i) => (
                        <div key={i} className="tracking-item-row">
                          <span>{item.product?.title || 'Товар удалён'} <strong>x{item.quantity}</strong></span>
                          <span className="tracking-price">{item.priceAtPurchase * item.quantity} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}