import { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingElements from './components/FloatingElements';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Science from './components/Science';
import Certificates from './components/Certificates';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import SuccessModal from './components/SuccessModal';
import TrackingModal from './components/TrackingModal';
import TrackerModal from './components/TrackerModal';
import SettingsModal from './components/SettingsModal';
import AdminPanel from './components/AdminPanel';
import Toast, { showToast } from './components/Toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('username') || '');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [categories, setCategories] = useState([]);
  const [partners, setPartners] = useState([]);

  const [activeCategories, setActiveCategories] = useState([]);
  const [activePartners, setActivePartners] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const safeParse = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  const [cart, setCart] = useState(() => {
    const user = localStorage.getItem('username');
    return user ? safeParse('cart_' + user) : [];
  });
  const [pinnedItems, setPinnedItems] = useState(() => {
    const user = localStorage.getItem('username');
    return user ? safeParse('pinnedItems_' + user) : [];
  });
  const [userOrders, setUserOrders] = useState(() => {
    const user = localStorage.getItem('username');
    return user ? safeParse('userOrders_' + user) : [];
  });
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const user = localStorage.getItem('username');
    return user ? safeParse('savedAddresses_' + user) : [];
  });
  const [savedCards, setSavedCards] = useState(() => {
    const user = localStorage.getItem('username');
    return user ? safeParse('savedCards_' + user) : [];
  });

  const [showCartModal, setShowCartModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [userStreak, setUserStreak] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleProfileUpdate = (newUsername) => {
    setCurrentUser(newUsername);
    localStorage.setItem('username', newUsername);
  };

  // Проверка валидности токена при старте
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      setCurrentUser('');
      return;
    }

    axios.get(`/api/users/profile?username=${encodeURIComponent(username)}`)
      .catch((err) => {
        console.warn('Не удалось подтвердить сессию:', err.message);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
    axios.get('/api/partners').then(res => setPartners(res.data));

    const fetchAllProducts = () =>
      axios.get('/api/products?size=1000').then(res => setAllProducts(res.data.content));
    fetchAllProducts();

    const interval = setInterval(fetchAllProducts, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('size', 6);
    params.append('minPrice', minPrice);
    params.append('maxPrice', maxPrice);
    if (searchQuery) params.append('search', searchQuery);

    activeCategories.forEach(id => params.append('categoryIds', id));
    activePartners.forEach(id => params.append('partnerIds', id));

    axios.get(`/api/products?${params.toString()}`)
      .then(response => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при получении товаров:', error);
        setLoading(false);
      });
  }, [currentPage, activeCategories, activePartners, minPrice, maxPrice, searchQuery]);

  useEffect(() => {
    if (allProducts.length > 0 && cart.length > 0) {
      const validCart = cart.filter(item => allProducts.some(p => p.id === item.id));
      if (validCart.length !== cart.length) {
        setCart(validCart);
        setPinnedItems(prev => prev.filter(id => validCart.some(p => p.id === id)));
      }
    }
  }, [allProducts, cart]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('cart_' + currentUser, JSON.stringify(cart));
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('pinnedItems_' + currentUser, JSON.stringify(pinnedItems));
  }, [pinnedItems, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      axios.get(`/api/tracker/streak?username=${currentUser}`)
        .then(res => setUserStreak(res.data.streak || 0))
        .catch(err => console.error('Ошибка загрузки streak', err));
    } else {
      setUserStreak(0);
    }
  }, [isAuthenticated, currentUser]);

  const toggleArrayFilter = (setter, array, id) => {
    if (array.includes(id)) {
      setter(array.filter(item => item !== id));
    } else {
      setter([...array, id]);
    }
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCartItem = (productId) => cart.find(item => item.id === productId);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const cartItem = cart.find(item => item.id === product.id);
    const currentQtyInCart = cartItem ? cartItem.quantity : 0;
    const stock = product.stock || 0;

    if (currentQtyInCart >= stock) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId, newQty) => {
    const stock = allProducts.find(p => p.id === productId)?.stock || 0;
    if (newQty > stock) return;

    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item => (item.id === productId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setPinnedItems(prev => prev.filter(id => id !== productId));
  };

  const handleDeleteAccount = () => {
    handleLogout();
    setShowSettingsModal(false);
  };

  const handleTogglePin = (productId) => {
    setPinnedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleClearCart = () => {
    setCart([]);
    setPinnedItems([]);
  };

  const handleCheckout = (items) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setCheckoutItems(items);
    setShowCartModal(false);
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = async (orderData) => {
    let finalAddress = orderData.address;
    let finalCard = orderData.card;

    if (orderData.selectedAddressId) {
      finalAddress = savedAddresses.find(a => a.id === orderData.selectedAddressId);
    } else if (orderData.newAddress) {
      const newAddr = { ...orderData.newAddress, id: Date.now() };
      const updatedAddrs = [...savedAddresses, newAddr];
      setSavedAddresses(updatedAddrs);
      if (currentUser) localStorage.setItem('savedAddresses_' + currentUser, JSON.stringify(updatedAddrs));
      finalAddress = newAddr;
    }

    if (orderData.selectedCardId) {
      finalCard = savedCards.find(c => c.id === orderData.selectedCardId);
    } else if (orderData.newCard) {
      const newCrd = { ...orderData.newCard, id: Date.now() };
      const updatedCrds = [...savedCards, newCrd];
      setSavedCards(updatedCrds);
      if (currentUser) localStorage.setItem('savedCards_' + currentUser, JSON.stringify(updatedCrds));
      finalCard = newCrd;
    }

    const addressString = `${finalAddress.city}, ${finalAddress.street} ${finalAddress.house}, кв. ${finalAddress.apartment || '-'}, Индекс: ${finalAddress.zip}`;

    try {
      const response = await axios.post('/api/orders', {
        username: currentUser,
        address: addressString,
        items: checkoutItems.map(item => ({ id: item.id, quantity: item.quantity }))
      });

      const trackNum = response.data.trackNumber;

      const newOrder = {
        trackNumber: trackNum,
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'В обработке',
        total: checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: checkoutItems.map(item => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const updatedOrders = [newOrder, ...userOrders];
      setUserOrders(updatedOrders);
      if (currentUser) localStorage.setItem('userOrders_' + currentUser, JSON.stringify(updatedOrders));

      setTrackingNumber(trackNum);

      setCart(prev => prev.filter(item => !checkoutItems.find(ci => ci.id === item.id)));
      setPinnedItems(prev => prev.filter(id => !checkoutItems.find(ci => ci.id === id)));

      setCheckoutItems([]);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      showToast('Ошибка при оформлении заказа', 'error');
      console.error(err);
    }
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    setShowAuthModal(false);

    setCart(safeParse('cart_' + username));
    setPinnedItems(safeParse('pinnedItems_' + username));
    setUserOrders(safeParse('userOrders_' + username));
    setSavedAddresses(safeParse('savedAddresses_' + username));
    setSavedCards(safeParse('savedCards_' + username));
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Ошибка logout на бэке:', err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCart([]);
    setPinnedItems([]);
    setUserOrders([]);
    setSavedAddresses([]);
    setSavedCards([]);
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  const handleAddAddress = (newAddress) => {
    const addrToAdd = { ...newAddress, id: Date.now() };
    const updatedAddrs = [...savedAddresses, addrToAdd];
    setSavedAddresses(updatedAddrs);
    if (currentUser) localStorage.setItem('savedAddresses_' + currentUser, JSON.stringify(updatedAddrs));
  };

  const handleRemoveAddress = (id) => {
    const updatedAddrs = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updatedAddrs);
    if (currentUser) localStorage.setItem('savedAddresses_' + currentUser, JSON.stringify(updatedAddrs));
  };

  const handleAddCard = (newCard) => {
    const cardToAdd = { ...newCard, id: Date.now() };
    const updatedCrds = [...savedCards, cardToAdd];
    setSavedCards(updatedCrds);
    if (currentUser) localStorage.setItem('savedCards_' + currentUser, JSON.stringify(updatedCrds));
  };

  const handleRemoveCard = (id) => {
    const updatedCrds = savedCards.filter(c => c.id !== id);
    setSavedCards(updatedCrds);
    if (currentUser) localStorage.setItem('savedCards_' + currentUser, JSON.stringify(updatedCrds));
  };

  const isAdmin = currentUser === 'ADMIN_228_1';

  // === АДМИН-ПАНЕЛЬ (отдельный экран) ===
  if (isAuthenticated && isAdmin) {
    return <AdminPanel show={true} onClose={handleLogout} />;
  }

  return (
    <div className="App">
      <Toast />
      <FloatingElements />
      <Navbar
        isAuthenticated={isAuthenticated}
        username={currentUser}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        cartCount={
          cart.filter(item => {
            const p = allProducts.find(prod => prod.id === item.id);
            return p && p.stock > 0;
          }).length
        }
        onCartClick={() => setShowCartModal(true)}
        onTrackClick={() => setShowTrackingModal(true)}
        onPillsClick={() => setShowTrackerModal(true)}
        onSettingsClick={() => setShowSettingsModal(true)}
        isAdmin={isAdmin}
        onAdminClick={() => setShowAdminPanel(true)}
      />
      <Hero />
      <About />

      <section id="products" className="products">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-badge glass-card">
              <span>Наш каталог</span>
            </div>
            <h2>Популярные товары</h2>
          </div>

          <div className="catalog-filters">
            <div className="filters-header">
              <div className="filters-search-wrapper" onClick={() => setShowFilters(!showFilters)}>
                <h2 className="filters-title">Фильтры {showFilters ? '▲' : '▼'}</h2>
                <input
                  type="text"
                  placeholder="Поиск товара..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
                  onClick={(e) => e.stopPropagation()}
                  className="catalog-search-input catalog-search-input-inline"
                />
              </div>

              <button
                className="clear-all-filters"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCategories([]);
                  setActivePartners([]);
                  setMinPrice(0);
                  setMaxPrice(10000);
                  setSearchQuery('');
                  setCurrentPage(0);
                }}
              >
                <span>✖</span>Очистить всё
              </button>
            </div>

            {showFilters && (
              <div className="filters-body">
                <div className="filter-section">
                  <h3>Категории</h3>
                  <div className="filter-buttons category-filters">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        className={`filter-btn ${activeCategories.includes(cat.id) ? 'active' : ''}`}
                        onClick={() => toggleArrayFilter(setActiveCategories, activeCategories, cat.id)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Производители</h3>
                  <div className="filter-buttons partner-filters">
                    {partners.map(part => (
                      <button
                        key={part.id}
                        className={`filter-btn ${activePartners.includes(part.id) ? 'active' : ''}`}
                        onClick={() => toggleArrayFilter(setActivePartners, activePartners, part.id)}
                      >
                        {part.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Цена</h3>
                  <div className="price-slider-container">
                    <div className="price-inputs">
                      <span>От: {minPrice} ₽</span>
                      <span>До: {maxPrice} ₽</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(Math.min(e.target.value, maxPrice - 100));
                        setCurrentPage(0);
                      }}
                      className="price-slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(Math.max(e.target.value, minPrice + 100));
                        setCurrentPage(0);
                      }}
                      className="price-slider"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="products-grid">
            {loading ? (
              <div className="products-loading-text">Загрузка...</div>
            ) : products.length === 0 ? (
              <div className="products-loading-text">Товары не найдены</div>
            ) : (
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showBadDisclaimer={product.isBad === true}
                  onDetailsClick={setSelectedProduct}
                  cartItem={getCartItem(product.id)}
                  onAddToCart={handleAddToCart}
                  onUpdateQty={handleUpdateQty}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ← Назад
              </button>
              {[...Array(totalPages).keys()].map(num => (
                <button
                  key={num}
                  className={`page-btn ${currentPage === num ? 'active' : ''}`}
                  onClick={() => handlePageChange(num)}
                >
                  {num + 1}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Вперёд →
              </button>
            </div>
          )}
        </div>
      </section>

      <Science />
      <Certificates />
      <Reviews />
      <Faq />
      <Contact />
      <Footer />
      <BackToTop />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
      />

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <CartModal
        show={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cart}
        pinnedItems={pinnedItems}
        allProducts={allProducts}
        onTogglePin={handleTogglePin}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        show={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderItems={checkoutItems}
        savedAddresses={savedAddresses}
        savedCards={savedCards}
        onConfirmOrder={handleConfirmOrder}
      />

      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        trackingNumber={trackingNumber}
      />

      <TrackingModal
        show={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        currentUser={currentUser}
      />

      <TrackerModal
        show={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        currentUser={currentUser}
      />

      <SettingsModal
        show={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={{ username: currentUser, email: 'test@mail.com', phone: '' }}
        streak={userStreak}
        onDeleteAccount={handleDeleteAccount}
        onProfileUpdate={handleProfileUpdate}
        savedAddresses={savedAddresses}
        savedCards={savedCards}
        onAddAddress={handleAddAddress}
        onRemoveAddress={handleRemoveAddress}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
      />
    </div>
  );
}

export default App;