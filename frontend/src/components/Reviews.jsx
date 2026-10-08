import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('/api/reviews').then(res => setReviews(res.data));
  }, []);

  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <div className="section-header fade-in">
          <div className="section-badge glass-card"><span>Отзывы</span></div>
          <h2>Что говорят наши покупатели</h2>
        </div>
        <div className="reviews-slider" id="reviews-slider">
          {reviews.length === 0 ? (
            <p className="reviews-empty">Отзывов пока нет.</p>
          ) : reviews.map((review, idx) => (
            <div className="review-card glass-card" key={idx}>
              <div className="review-rating">{'★'.repeat(review.rating)}</div>
              <div className="review-text">{review.text}</div>
              <div className="review-author">
                {review.user?.avatarUrl ? (
                  <img
                    src={review.user.avatarUrl}
                    alt={review.user.username}
                    className="author-avatar-img"
                  />
                ) : (
                  <div className="author-avatar">
                    {review.user?.username?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
                <div className="author-info">
                  <h4>{review.user?.username || 'Покупатель SanSoll'}</h4>
                  <p>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}