import { useState } from 'react';

export default function ProductCard({ product, showBadDisclaimer, onDetailsClick, cartItem, onAddToCart, onUpdateQty }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = product.imageUrls || [];

  const nextSlide = (e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev + 1) % images.length); };
  const prevSlide = (e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev - 1 + images.length) % images.length); };
  const goToSlide = (e, index) => { e.stopPropagation(); setCurrentSlide(index); };

  const isInCart = cartItem && cartItem.quantity > 0;
  const isMaxQty = cartItem?.quantity >= product.stock;
  const isOutOfStock = product.stock <= 0;

  const discount = product.discount || 0;
  const oldPrice = product.price;
  const newPrice = oldPrice - (oldPrice * discount / 100);
  const hasDiscount = discount > 0;

  return (
    <div className="product-card glass-card">
      {product.stock === 0 && <div className="stock-badge out-stock">Закончилось</div>}
      {product.stock > 0 && product.stock < 5 && <div className="stock-badge low-stock">Заканчивается</div>}

      <div className="product-slider">
        <div className="slider-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {images.map((url, i) => (
            <div className="slider-slide" key={i}>
              <img src={url} alt={`${product.title} ${i + 1}`} />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="slider-nav">
            <button className="slider-btn" onClick={prevSlide}>❮</button>
            <div className="slider-dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${currentSlide === i ? 'active' : ''}`}
                  onClick={(e) => goToSlide(e, i)}
                ></span>
              ))}
            </div>
            <button className="slider-btn" onClick={nextSlide}>❯</button>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3>{product.title}</h3>

        {showBadDisclaimer && (
          <div className="bad-disclaimer">БАД не является лекарственным средством</div>
        )}

        <p className="product-description">{product.description}</p>

        {hasDiscount ? (
          <div className="product-price-block">
            <span className="price-old">{oldPrice} ₽</span>
            <span className="price-new">{newPrice.toFixed(0)} ₽</span>
            <span className="price-discount-badge">-{discount}%</span>
          </div>
        ) : (
          <div className="product-price">{oldPrice} ₽</div>
        )}

        {product.features && (
          <div className="product-features">
            {product.features.map((feature, idx) => (
              <div className="feature-item" key={idx}>{feature}</div>
            ))}
          </div>
        )}

        <div className="product-buttons">
          <button className="info-btn" onClick={() => onDetailsClick(product)}>Подробнее</button>

          {!isInCart ? (
            <button
              className={`product-link ${isOutOfStock ? 'out-of-stock' : ''}`}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Нет в наличии' : 'Купить'}
            </button>
          ) : (
            <div className="qty-stepper">
              <button className="qty-btn" onClick={() => onUpdateQty(product.id, cartItem.quantity - 1)}>−</button>
              <span className="qty-value">{cartItem.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => onUpdateQty(product.id, cartItem.quantity + 1)}
                disabled={isMaxQty}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}