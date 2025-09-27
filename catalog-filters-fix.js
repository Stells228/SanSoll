const CATEGORY_MAPPING = {
    'gastro': 'detox',
    'detox': 'detox',
    'immunity': 'immunity',
    'beauty': 'pretty',
    'pretty': 'pretty',
    'cardiovascular': 'cardio',
    'cardio': 'cardiovascular' 
};

// Карта соответствия производителей
const PARTNER_MAPPING = {
    'Биолит': 'biolit',
    'AD Medicine': 'admedicine',
    'Апифарм': 'apifarm',
    'ФитоЛайн': 'fitoline',
    'НПФ Новь': 'nov'
};

const FILTER_DATA = {
    categories: [
        { id: 'detox', name: 'Пищеварение и очищение', count: 12 },
        { id: 'immunity', name: 'Иммунитет и защита', count: 6 },
        { id: 'beauty', name: 'Красота и фигура', count: 4 },
        { id: 'cardiovascular', name: 'Сердце и сосуды', count: 3 }
    ],
    partners: [
        { id: 'biolit', name: 'Биолит', count: 11 },
        { id: 'admedicine', name: 'AD Medicine', count: 5 },
        { id: 'apifarm', name: 'Апифарм', count: 3 },
        { id: 'fitoline', name: 'ФитоЛайн', count: 1 },
        { id: 'nov', name: 'НПФ Новь', count: 2 }
    ],
    priceRanges: [
        { id: 'budget', name: 'До 1,500₽', min: 0, max: 1500, count: 8 },
        { id: 'medium', name: '1,500-3,000₽', min: 1500, max: 3000, count: 10 },
        { id: 'premium', name: 'От 3,000₽', min: 3000, max: 10000, count: 3 }
    ]
};


// Текущие активные фильтры
let activeFilters = {
    categories: [],
    partners: [],
    priceRanges: [],
    search: ''
};

// Функция для поиска (заменяет performSearch из HTML)
function performSearch(searchTerm) {
    activeFilters.search = searchTerm.toLowerCase();
    applyFilters();
}

// Инициализация фильтров
function initCatalogFilters() {
    console.log('Инициализация фильтров...');

    if (typeof products === 'undefined') {
        console.error('Ошибка: Массив products не найден!');
        return;
    }

    updateFilterCounts();
    setupFilterEventListeners();

    // При инициализации показываем все товары
    applyFilters();

    console.log('Фильтры инициализированы успешно');
}

// Обновление счетчиков в фильтрах 
function updateFilterCounts() {
    if (typeof products === 'undefined') return;

    // Подсчет по категориям с учетом маппинга
    const categoryCounts = {};
    FILTER_DATA.categories.forEach(cat => {
        const count = products.filter(product => {
            const productCategory = CATEGORY_MAPPING[product.category] || product.category;
            return productCategory === cat.id;
        }).length;
        categoryCounts[cat.id] = count;
    });

    // Подсчет по производителям с учетом маппинга
    const partnerCounts = {};
    FILTER_DATA.partners.forEach(partner => {
        const count = products.filter(product => {
            const productPartner = PARTNER_MAPPING[product.partner] ||
                product.partner.toLowerCase().replace(/\s+/g, '');
            return productPartner === partner.id ||
                product.partner === partner.name;
        }).length;
        partnerCounts[partner.id] = count;
    });

    // Подсчет по ценам
    const priceCounts = {
        budget: products.filter(p => getPriceValue(p.price) <= 1500).length,
        medium: products.filter(p => getPriceValue(p.price) > 1500 && getPriceValue(p.price) <= 3000).length,
        premium: products.filter(p => getPriceValue(p.price) > 3000).length
    };

    // Обновление интерфейса
    updateFilterUI(categoryCounts, partnerCounts, priceCounts);
}

function updateFilterUI(categoryCounts, partnerCounts, priceCounts) {
    // Категории
    FILTER_DATA.categories.forEach(cat => {
        const button = document.querySelector(`[data-category="${cat.id}"]`);
        if (button) {
            const countSpan = button.querySelector('.count') ||
                button.querySelector('span:last-child');
            if (countSpan) {
                countSpan.textContent = `(${categoryCounts[cat.id] || 0})`;
            }
        }
    });

    // Производители
    FILTER_DATA.partners.forEach(partner => {
        const button = document.querySelector(`[data-partner="${partner.id}"]`);
        if (button) {
            const countSpan = button.querySelector('.count') ||
                button.querySelector('span:last-child');
            if (countSpan) {
                countSpan.textContent = `(${partnerCounts[partner.id] || 0})`;
            }
        }
    });

    // Цены
    Object.keys(priceCounts).forEach(rangeId => {
        const button = document.querySelector(`[data-price-range="${rangeId}"]`);
        if (button) {
            const countSpan = button.querySelector('.count') ||
                button.querySelector('span:last-child');
            if (countSpan) {
                countSpan.textContent = `(${priceCounts[rangeId]})`;
            }
        }
    });
}

// Настройка обработчиков событий
function setupFilterEventListeners() {
    console.log('Настройка обработчиков событий...');

    // Фильтры категорий
    document.querySelectorAll('[data-category]').forEach(btn => {
        // Удаляем старые обработчики
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = document.querySelector(`[data-category="${btn.dataset.category}"]`);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const category = newBtn.dataset.category;
            console.log('Клик по категории:', category);
            toggleFilter('categories', category, newBtn);
            applyFilters();
        });
    });

    // Фильтры производителей
    document.querySelectorAll('[data-partner]').forEach(btn => {
        // Удаляем старые обработчики
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = document.querySelector(`[data-partner="${btn.dataset.partner}"]`);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const partner = newBtn.dataset.partner;
            console.log('Клик по производителю:', partner);
            toggleFilter('partners', partner, newBtn);
            applyFilters();
        });
    });

    // Фильтры цен
    document.querySelectorAll('[data-price-range]').forEach(btn => {
        // Удаляем старые обработчики
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = document.querySelector(`[data-price-range="${btn.dataset.priceRange}"]`);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const priceRange = newBtn.dataset.priceRange;
            console.log('Клик по цене:', priceRange);
            toggleFilter('priceRanges', priceRange, newBtn);
            applyFilters();
        });
    });

    // Поиск
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
        searchInput.removeEventListener('input', performSearch);
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.trim().toLowerCase();
            console.log('Поиск:', activeFilters.search);
            applyFilters();
        });
    }

    // Сброс фильтров
    const resetBtn = document.querySelector('.clear-all-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAllFilters();
        });
    }
}

// Переключение фильтра
function toggleFilter(filterType, value, button) {
    console.log('Переключение фильтра:', filterType, value);

    const index = activeFilters[filterType].indexOf(value);

    if (index === -1) {
        activeFilters[filterType].push(value);
        button.classList.add('active');
        console.log('Добавлен фильтр:', value);
    } else {
        activeFilters[filterType].splice(index, 1);
        button.classList.remove('active');
        console.log('Убран фильтр:', value);
    }

    console.log('Активные фильтры:', activeFilters);

    // Визуальная обратная связь
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = 'scale(1)', 150);
}

// Применение всех активных фильтров
function applyFilters() {
    if (typeof products === 'undefined') {
        console.error('Products не найден при применении фильтров');
        return;
    }

    console.log('Применение фильтров:', activeFilters);

    let filteredProducts = [...products];

    // Фильтр по поиску
    if (activeFilters.search) {
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(activeFilters.search) ||
            product.description.toLowerCase().includes(activeFilters.search)
        );
        console.log('После поиска:', filteredProducts.length);
    }

    // Фильтр по категориям
    if (activeFilters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const productCategory = CATEGORY_MAPPING[product.category] || product.category;
            return activeFilters.categories.includes(productCategory);
        });
        console.log('После фильтра категорий:', filteredProducts.length);
    }

    // Фильтр по производителям
    if (activeFilters.partners.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const productPartner = PARTNER_MAPPING[product.partner] ||
                product.partner.toLowerCase().replace(/\s+/g, '');
            return activeFilters.partners.some(partnerFilter =>
                productPartner === partnerFilter || product.partner === partnerFilter
            );
        });
        console.log('После фильтра производителей:', filteredProducts.length);
    }

    // Фильтр по цене
    if (activeFilters.priceRanges.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const price = getPriceValue(product.price);
            return activeFilters.priceRanges.some(range => {
                const rangeData = FILTER_DATA.priceRanges.find(r => r.id === range);
                return rangeData && price >= rangeData.min && price <= rangeData.max;
            });
        });
        console.log('После фильтра цен:', filteredProducts.length);
    }

    console.log('Финальный результат фильтрации:', filteredProducts.length, 'товаров');

    renderFilteredProducts(filteredProducts);
    updateActiveFiltersDisplay();
    updateResultsCounter(filteredProducts.length);
}

// Преобразование цены в число
function getPriceValue(priceString) {
    if (typeof priceString === 'number') return priceString;
    return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
}

// Отображение отфильтрованных товаров
function renderFilteredProducts(filteredProducts) {
    console.log('Рендеринг товаров:', filteredProducts.length);

    const grid = document.getElementById('products-grid');
    if (!grid) {
        console.error('Элемент products-grid не найден');
        return;
    }

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products-message">
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить критерии поиска или сбросить фильтры</p>
                <button class="reset-filters-btn" onclick="resetAllFilters()">Сбросить фильтры</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    animateProductCards();
}

// Отображение активных фильтров
function updateActiveFiltersDisplay() {
    const container = document.getElementById('active-filters');
    const list = document.getElementById('active-filters-list');

    if (!container || !list) return;

    const activeFiltersList = [];

    // активные фильтры категорий
    activeFilters.categories.forEach(catId => {
        const cat = FILTER_DATA.categories.find(c => c.id === catId);
        if (cat) {
            activeFiltersList.push({ type: 'categories', value: catId, text: cat.name, icon: cat.icon });
        }
    });

    // активные фильтры производителей
    activeFilters.partners.forEach(partnerId => {
        const partner = FILTER_DATA.partners.find(p => p.id === partnerId);
        if (partner) {
            activeFiltersList.push({ type: 'partners', value: partnerId, text: partner.name });
        }
    });

    // активные фильтры цен
    activeFilters.priceRanges.forEach(rangeId => {
        const range = FILTER_DATA.priceRanges.find(r => r.id === rangeId);
        if (range) {
            activeFiltersList.push({ type: 'priceRanges', value: rangeId, text: range.name });
        }
    });

    if (activeFiltersList.length > 0) {
        container.style.display = 'block';
        list.innerHTML = activeFiltersList.map(filter => `
            <button class="active-filter-tag" onclick="removeActiveFilter('${filter.type}', '${filter.value}')">
                ${filter.icon || ''} ${filter.text}
                <span class="remove-icon">×</span>
            </button>
        `).join('');
    } 
    else {
        container.style.display = 'none';
    }
}

// Получение активных фильтров по типу
function getActiveFilters(filterType) {
    let selector;
    let attributeName;

    switch (filterType) {
        case 'category':
            selector = '.category-filters .filter-btn.active';
            attributeName = 'category';
            break;
        case 'partner':
            selector = '.partner-filters .filter-btn.active';
            attributeName = 'partner';
            break;
        case 'price-range':
            selector = '.price-filters .filter-btn.active';
            attributeName = 'priceRange';
            break;
        default:
            return [];
    }

    const activeButtons = document.querySelectorAll(selector);
    return Array.from(activeButtons).map(button =>
        button.dataset[attributeName]
    );
}

// Нормализация названий партнеров
function normalizePartnerName(partnerName) {
    if (!partnerName) return '';

    const mapping = {
        'biolit': 'Биолит',
        'Биолит': 'Биолит',
        'admedicine': 'AD Medicine',
        'AD Medicine': 'AD Medicine',
        'apifarm': 'Апифарм',
        'Апифарм': 'Апифарм',
        'fitoline': 'ФитоЛайн',
        'ФитоЛайн': 'ФитоЛайн',
        'nov': 'НПФ Новь',
        'НПФ Новь': 'НПФ Новь'
    };

    return mapping[partnerName] || partnerName;
}

// Проверка принадлежности цены к диапазону
function isPriceInRange(price, rangeId) {
    const ranges = {
        'budget': { min: 0, max: 1500 },
        'medium': { min: 1500, max: 3000 },
        'premium': { min: 3000, max: 10000 }
    };

    const range = ranges[rangeId];
    if (!range) return false;

    return price >= range.min && price <= range.max;
}

// Отображение отфильтрованных продуктов 
function renderFilteredProducts(filteredProducts) {
    const grid = document.getElementById('products-grid');
    if (!grid) {
        console.warn('Элемент products-grid не найден');
        return;
    }

    console.log('Отображение товаров:', filteredProducts.length);

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products-message">
                <div class="no-products-icon">🔍</div>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
                <button class="reset-filters-btn" onclick="resetAllFilters()">
                    Сбросить фильтры
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // Анимация появления карточек
    setTimeout(() => {
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 50);
}

// Создание карточки продукта - СОБАКА СУТУЛАЯ, ВСЕ НЕРВЫ ВЫПИЛА!
function createProductCard(product) {
    const images = Array.isArray(product.images) ? product.images : [product.images].filter(Boolean);

    const slides = images.map((image, index) => `
        <div class="slider-slide ${index === 0 ? 'active' : ''}">
            <img src="${image}" alt="${product.title}" ${index > 0 ? 'loading="lazy"' : ''}>
        </div>
    `).join('');

    const dots = images.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${product.id}, ${index})"></span>
    `).join('');

    // Список продуктов, для которых нужно показать плашку БАД
    const badProducts = [
        'Лесмин', 'Артро Комплекс', 'Биоклинзинг', 'Брейн Бустер', 'Гастро Комплекс',
        'Детокс', 'Литовит-М', 'Оптисорб', 'Гепатосол', 'Очищение', 'Лимфодренаж',
        'Экстракт корня лопуха', 'Экорсол', 'Популин'
    ];

    // Проверяем, нужно ли показывать плашку для этого продукта
    const showBadDisclaimer = badProducts.some(badProduct =>
        product.title.toLowerCase().includes(badProduct.toLowerCase())
    );

    return `
        <div class="product-card glass-card" data-category="${product.category}" data-product-id="${product.id}">
            <div class="product-slider">
                <div class="slider-container" id="slider-${product.id}">
                    ${slides}
                </div>
                <div class="slider-nav">
                    <button class="slider-btn prev" onclick="changeSlide(${product.id}, -1)">❮</button>
                    <div class="slider-dots">${dots}</div>
                    <button class="slider-btn next" onclick="changeSlide(${product.id}, 1)">❯</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                ${showBadDisclaimer ?
            '<div class="bad-disclaimer">БАД не является лекарственным средством</div>' :
            ''}
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}₽</div>
                <div class="product-features">
                    ${product.features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
                </div>
                <div class="product-buttons">
                    <button class="info-btn" onclick="openProductInfo(${product.id})">Подробнее</button>
                    <a href="${product.link1}" target="_blank" class="product-link">
                        Купить на Ozon
                    </a>
                    <a href="${product.link2}" target="_blank" class="product-link">
                        Купить с -30%
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Обновление счетчика результатов
function updateResultsCounter(count) {
    let counter = document.getElementById('results-counter');
    if (!counter) {
        // Создаем счётчик, если его нет
        counter = document.createElement('div');
        counter.id = 'results-counter';
        counter.className = 'results-counter';

        const filtersContainer = document.querySelector('.catalog-filters');
        if (filtersContainer) {
            filtersContainer.appendChild(counter);
        }
    }

    counter.innerHTML = `
        <span class="results-text">Найдено товаров: <strong>${count}</strong></span>
    `;
}

// Сброс всех фильтров
function resetAllFilters() {
    console.log('Сброс всех фильтров');

    // Убираем активные классы со всех фильтров
    document.querySelectorAll('.filter-btn.active').forEach(button => {
        button.classList.remove('active');
    });

    // Очищаем поиск
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Показываем все продукты
    if (typeof products !== 'undefined') {
        renderFilteredProducts(products);
        updateResultsCounter(products.length);
    }

    // Визуальный эффект
    const grid = document.getElementById('products-grid');
    if (grid) {
        grid.style.opacity = '0.5';
        setTimeout(() => {
            grid.style.opacity = '1';
        }, 300);
    }
}

// Поиск по тексту
function performSearch(searchTerm) {
    console.log('Выполнение поиска:', searchTerm);

    if (typeof products === 'undefined') {
        console.warn('Массив products недоступен для поиска');
        return;
    }

    if (!searchTerm.trim()) {
        applyFilters(); // Применяем текущие фильтры без поиска
        return;
    }

    const term = searchTerm.toLowerCase().trim();
    const searchResults = products.filter(product => {
        return product.title.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            (product.features && product.features.some(feature =>
                feature.toLowerCase().includes(term)
            ));
    });

    console.log('Найдено по поиску:', searchResults.length, 'товаров');
    renderFilteredProducts(searchResults);
    updateResultsCounter(searchResults.length);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, начинаем инициализацию фильтров');

    // Даём время на загрузку других скриптов
    setTimeout(() => {
        initCatalogFilters();

        // Изначально показываем все продукты
        if (typeof products !== 'undefined') {
            updateResultsCounter(products.length);
        }
    }, 100);
});

// Экспорт функций для глобального доступа
window.initCatalogFilters = initCatalogFilters;
window.applyFilters = applyFilters;
window.resetAllFilters = resetAllFilters;
window.performSearch = performSearch;
window.toggleFilter = toggleFilter;
window.renderFilteredProducts = renderFilteredProducts;

console.log('Модуль фильтров каталога загружен - ИСПРАВЛЕННАЯ ВЕРСИЯ');

function normalizeCategoryId(category) {
    const mapping = {
        'gastro': 'detox',
        'detox': 'detox',
        'immunity': 'immunity',
        'beauty': 'beauty',
        'cardiovascular': 'cardiovascular'
    };
    return mapping[category] || category;
}

function enhanceFilters() {
    // эффекты при взаимодействии
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        btn.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });

        btn.addEventListener('click', function () {
            // эффект пульсации при клике
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// CSS для пульсации
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle);

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(enhanceFilters, 1000);
});