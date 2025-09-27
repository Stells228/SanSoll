const reviews = [
  {
    name: 'Раиса Б.',
    date: '8 сентября 2025',
    text: 'отличное средство пользуюсь не 1ый раз (Популин с дигидрокверцетином, 75 мл)',
    rating: 5
  },
  {
    name: 'Светлана С.',
    date: '8 сентября 2025',
    text: 'Гель беру не первый раз. Отзывы только положительные. Но вот упаковка опять совсем не радует. Если бы и туба была мятая, был бы отказ. (Мамавит)',
    rating: 5
  },
  {
    name: 'Наталья Г.',
    date: '7 сентября 2025',
    text: 'Купите, попробуйте — не пожалеете. Рекомендую! (Экстракт корня лопуха, 75 мл)',
    rating: 5
  },

  {
    name: 'Татьяна К.',
    date: '6 августа 2025',
    text: 'Решила попробовать,по отзывам,пришла в надлежащем виде,попробуем, Спасибо продавцу (Полимедэл)',
    rating: 5
  },
  {
    name: 'Екатерина С.',
    date: '16 мая 2025',
    text: 'Использовать этот препарат я стала давно по совету врача, когда была беременна. Как источник микро и макроэлементов. Потом оказалось, что хорошо помогает при изжоге. А потом стала давать маленькому сыну. При коликах в животе. А потом пошло и поехало. Аллергия, проблемы со стулом и еще всякая всячина. Уже много много лет этот препарат у меня есть в аптечке. Рекомендую!(Литовит-М)',
    rating: 5
  },
  {
    name: 'Елена В.',
    date: '16 мая 2025',
    text: 'Мне понравилось. Вроде бы простая пленка, а помогает. Причем при разных проблемах: при кашле, при давлении, при болях в пояснице. Заказала еще маме и бабушке. Спасибо) (Полимедэл)',
    rating: 5
  },
  {
    name: 'Николай',
    date: '30 апреля 2025',
    text: 'Люблю острое и жареное, но потом желудок бунтует. Принимаю Литовит и теперь желудок меня не беспокоит (Литовит-М) ',
    rating: 5
  }

];

// Индекс текущего отзыва
let reviewsIndex = 0;

// Рендер отзывов (слайдер)
function renderReviews() {
  const slider = document.getElementById('reviews-slider');
  slider.innerHTML = reviews.map((review, idx) => `
    <div class="review-card glass-card${reviewsIndex === idx ? ' active' : ''}">
      <div class="review-rating">${'★'.repeat(review.rating)}</div>
      <div class="review-text">${review.text}</div>
      <div class="review-author">
        <div class="author-avatar">${review.name.charAt(0)}</div>
        <div class="author-info">
          <h4>${review.name}</h4>
          <p>${review.date}</p>
        </div>
      </div>
    </div>
  `).join('');
  updateReviewsActive();
}

// Прокрутка слайдера отзывов вперед/назад
function nextReview() {
  reviewsIndex = (reviewsIndex + 1) % reviews.length;
  updateReviewsActive();
}

function prevReview() {
  reviewsIndex = (reviewsIndex - 1 + reviews.length) % reviews.length;
  updateReviewsActive();
}

// Подсветить активный отзыв
function updateReviewsActive() {
  const cards = document.querySelectorAll('.review-card');
  cards.forEach((card, idx) => {
    card.classList.toggle('active', idx === reviewsIndex);
  });
}


// Навигация отзывов
function addReviewsNav() {
  const slider = document.getElementById('reviews-slider');
  const nav = document.createElement('div');
  nav.className = 'reviews-nav';
  nav.innerHTML = `
    <button class="reviews-prev" title="Назад">←</button>
    <button class="reviews-next" title="Вперёд">→</button>
  `;
  slider.parentNode.insertBefore(nav, slider);

  nav.querySelector('.reviews-prev').onclick = prevReview;
  nav.querySelector('.reviews-next').onclick = nextReview;
}


// Инициализация секции отзывов при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  renderReviews();
  addReviewsNav();
  startReviewsAutoplay();

  // Остановка автопрокрутки при наведении на отзывы
  const slider = document.getElementById('reviews-slider');
  slider.addEventListener('mouseenter', () => {
    clearInterval(reviewsTimer);
  });
  slider.addEventListener('mouseleave', () => {
    startReviewsAutoplay();
  });
});

// Слайдер сертификатов 
const certificatesSwiper = new Swiper('#certificates-slider', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: '.cert-next',
    prevEl: '.cert-prev',
  },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});
