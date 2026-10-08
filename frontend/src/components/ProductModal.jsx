import { useState } from 'react';
import axios from 'axios';

export default function ProductModal({ product, onClose, isAuthenticated, currentUser }) {
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewMsgType, setReviewMsgType] = useState('');
  const [reviewError, setReviewError] = useState('');

  if (!product) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewMsg('');

    if (!reviewText.trim()) {
      setReviewError('Пожалуйста, напишите отзыв');
      return;
    }

    setReviewMsg('Отправка...');
    setReviewMsgType('info');
    try {
      await axios.post('/api/reviews', {
        productId: product.id,
        username: currentUser,
        rating: reviewRating,
        text: reviewText
      });
      setReviewMsg('Отзыв отправлен на модерацию! Спасибо :)');
      setReviewMsgType('success');
      setReviewText('');
    } catch (err) {
      setReviewMsg(err.response?.data?.error || 'Ошибка отправки отзыва.');
      setReviewMsgType('error');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content product-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{product.title}</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="product-info-section">
            <h3>Информация</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-info-section">
            <h3>Состав</h3>
            <p>{product.composition}</p>
          </div>
          <div className="product-info-section">
            <h3>Показания к применению</h3>
            <p>{product.indications}</p>
          </div>
          <div className="product-info-section">
            <h3>Способ применения</h3>
            <p>{product.dosage}</p>
          </div>
          <div className="product-info-section">
            <h3>Противопоказания</h3>
            <p>{product.contraindications}</p>
          </div>
          <div className="product-info-section">
            <h3>Сертификат</h3>
            <p>{product.certificate}</p>
          </div>
          <div className="product-info-section">
            <h3>Производитель</h3>
            <p>{product.manufacturer}</p>
          </div>

          <div className="product-info-section">
            <h3>Оставить отзыв</h3>
            {!isAuthenticated ? (
              <p className="review-auth-hint">Войдите в аккаунт, чтобы оставить отзыв.</p>
            ) : (
              <form onSubmit={handleReviewSubmit} noValidate>
                <div className="form-group">
                  <label className="review-stars-label">Оценка:</label>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`review-star ${reviewRating >= star ? 'active' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Напишите ваш отзыв..."
                  value={reviewText}
                  onChange={(e) => { setReviewText(e.target.value); setReviewError(''); }}
                  className={`review-textarea ${reviewError ? 'error-input' : ''}`}
                />
                {reviewError && <div className="error-text">{reviewError}</div>}

                <button type="submit" className="cart-checkout-btn review-submit-btn">
                  Отправить отзыв
                </button>

                {reviewMsg && (
                  <p className={`review-msg ${reviewMsgType}`}>{reviewMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}