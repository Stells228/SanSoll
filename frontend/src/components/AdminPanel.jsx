import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CustomSelect from './CustomSelect';
import { showToast } from './Toast';

// === ОКНО УДАЛЕНИЯ ===
function DeleteConfirmModal({ show, onClose, onConfirm, name, type }) {
  if (!show) return null;
  return (
    <div className="modal admin-modal-overlay" onClick={onClose}>
      <div className="modal-content admin-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body admin-delete-body">
          <p className="admin-delete-text">
            Удалить {type} "<strong>{name}</strong>"?
          </p>
          <div className="admin-delete-actions">
            <button className="admin-btn-confirm" onClick={onClose}>Нет</button>
            <button className="cart-delete-selected admin-btn-delete" onClick={onConfirm}>Да, удалить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === ДЕТАЛИ ЗАКАЗА / ИСТОРИЯ ПОЛЬЗОВАТЕЛЯ ===
function OrderDetailsModal({ show, onClose, title, orders }) {
  if (!show) return null;
  const sortedOrders = orders
    ? [...orders].sort((a, b) => (b.id || 0) - (a.id || 0))
    : [];
  return (
    <div className="modal admin-modal-overlay" onClick={onClose}>
      <div className="modal-content cart-modal-content admin-order-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body admin-order-body">
          {sortedOrders.length === 0 ? (
            <p className="admin-empty-text">Заказов нет.</p>
          ) : (
            <div className="admin-orders-list">
              {sortedOrders.map(order => (
                <div key={order.id} className="admin-order-card">
                  <div className="admin-order-header">
                    <span className="admin-order-id">Заказ #{order.id}</span>
                    <span className="admin-order-date">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  {order.items?.map((item, i) => (
                    <div key={i} className="admin-order-item">
                      <span>
                        {item.product?.title || 'Товар удалён'}{' '}
                        <strong className="admin-order-qty">x{item.quantity}</strong>
                      </span>
                      <span className="admin-order-price">
                        {item.priceAtPurchase * item.quantity} ₽
                      </span>
                    </div>
                  ))}
                  <div className="admin-order-total">
                    <span>Итого:</span>
                    <span className="admin-order-price">{order.totalAmount} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// === ОКНО ДОБАВЛЕНИЯ СПРАВОЧНИКА ===
function DictAddModal({ show, onClose, onSave, type }) {
  const [name, setName] = useState('');
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onSave(name);
    setName('');
  };

  return (
    <div className="modal admin-modal-overlay" onClick={onClose}>
      <div className="modal-content admin-dict-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Добавить {type}</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body admin-modal-body">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={`Название ${type}...`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="admin-dict-input"
            />
            <button type="submit" className="cart-checkout-btn admin-dict-submit">
              Добавить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// === ФОРМА ТОВАРА ===
function ProductFormModal({ show, onClose, onSave, editingProduct, categories, partners }) {
  const emptyProduct = {
    title: '', price: '', description: '', composition: '', indications: '',
    dosage: '', contraindications: '', manufacturer: '', dosageForm: '',
    defaultDosage: '', stock: '', discount: '', isBad: false,
    categoryId: '', partnerId: ''
  };

  const [product, setProduct] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const fileInputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        ...editingProduct,
        categoryId: editingProduct.categoryId || '',
        partnerId: editingProduct.partnerId || ''
      });
      setImageUrls(editingProduct.imageUrls || []);
    } else {
      setProduct(emptyProduct);
      setImageUrls([]);
    }
    setErrors({});
  }, [editingProduct, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'price' || name === 'discount' || name === 'stock') {
      val = val.replace(/[^0-9.]/g, '');
    }
    setProduct(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;
    const uploaded = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('/api/admin/products/upload-image', formData);
        uploaded.push(res.data.url);
      } catch {
        showToast('Ошибка загрузки картинки', 'error');
      }
    }
    setImageUrls(prev => [...prev, ...uploaded]);
  };

  const handleDragStart = (e, index) => { dragItem.current = index; };
  const handleDragEnter = (e, index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    const copyListItems = [...imageUrls];
    const dragItemContent = copyListItems.splice(dragItem.current, 1)[0];
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImageUrls(copyListItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!product.title) errs.title = 'Введите название';
    if (!product.price) errs.price = 'Укажите цену';
    else if (parseFloat(product.price) < 0) errs.price = 'Цена не может быть отрицательной';
    if (!product.stock && product.stock !== 0) errs.stock = 'Укажите остаток';
    else if (parseInt(product.stock) < 0) errs.stock = 'Остаток не может быть отрицательным';
    if (product.discount && parseFloat(product.discount) < 0) errs.discount = 'Скидка не может быть отрицательной';
    else if (product.discount && parseFloat(product.discount) > 100) errs.discount = 'Скидка не может быть больше 100%';
    if (!product.description) errs.description = 'Введите описание';
    if (!product.composition) errs.composition = 'Укажите состав';
    if (!product.indications) errs.indications = 'Укажите показания';
    if (!product.dosage) errs.dosage = 'Укажите способ применения';
    if (!product.dosageForm) errs.dosageForm = 'Укажите форму выпуска';
    if (!product.categoryId) errs.categoryId = 'Выберите категорию';
    if (!product.partnerId) errs.partnerId = 'Выберите производителя';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSave({
      ...product,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      discount: parseFloat(product.discount) || 0,
      isActive: true,
      imageUrls,
      categoryId: parseInt(product.categoryId),
      partnerId: parseInt(product.partnerId)
    });
  };

  return (
    <div className="modal admin-modal-overlay" onClick={onClose}>
      <div className="modal-content admin-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingProduct ? 'Редактирование товара' : 'Добавление товара'}</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body admin-modal-body admin-modal-scroll">
          <form onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <label className="admin-label">Название *</label>
              <input
                type="text" name="title" value={product.title}
                onChange={handleChange} className="modal-input"
              />
              {errors.title && <div className="admin-error-text">{errors.title}</div>}
            </div>

            <div className="admin-form-grid">
              <div>
                <label className="admin-label">Категория *</label>
                <CustomSelect
                  value={product.categoryId}
                  onChange={(val) => setProduct(prev => ({ ...prev, categoryId: val }))}
                  options={[
                    { value: '', label: 'Выберите категорию' },
                    ...categories.map(c => ({ value: c.id, label: c.name }))
                  ]}
                  className="modal-select"
                />
                {errors.categoryId && <div className="admin-error-text">{errors.categoryId}</div>}
              </div>
              <div>
                <label className="admin-label">Производитель *</label>
                <CustomSelect
                  value={product.partnerId}
                  onChange={(val) => setProduct(prev => ({ ...prev, partnerId: val }))}
                  options={[
                    { value: '', label: 'Выберите производителя' },
                    ...partners.map(p => ({ value: p.id, label: p.name }))
                  ]}
                  className="modal-select"
                />
                {errors.partnerId && <div className="admin-error-text">{errors.partnerId}</div>}
              </div>
            </div>

            <div className="admin-form-grid">
              <div>
                <label className="admin-label">Цена (₽) *</label>
                <input type="text" inputMode="decimal" name="price" value={product.price} onChange={handleChange} className="modal-input" />
                {errors.price && <div className="admin-error-text">{errors.price}</div>}
              </div>
              <div>
                <label className="admin-label">Скидка (%)</label>
                <input type="text" inputMode="decimal" name="discount" placeholder="0-100" value={product.discount} onChange={handleChange} className="modal-input" />
                {errors.discount && <div className="admin-error-text">{errors.discount}</div>}
              </div>
              <div>
                <label className="admin-label">На складе (шт) *</label>
                <input type="text" inputMode="numeric" name="stock" value={product.stock} onChange={handleChange} className="modal-input" />
                {errors.stock && <div className="admin-error-text">{errors.stock}</div>}
              </div>
            </div>

            <div className="admin-form-row">
              <label className="admin-label">Картинки товара</label>
              <button type="button" className="admin-upload-btn" onClick={() => fileInputRef.current.click()}>
                + Загрузить картинки
              </button>
              <input type="file" accept="image/*" multiple ref={fileInputRef} className="admin-hidden-input" onChange={handleImageUpload} />
              <div className="admin-image-list">
                {imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="admin-image-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragEnter={(e) => handleDragEnter(e, idx)}
                    onDragEnd={handleDragEnd}
                  >
                    <img src={url} alt={`product-${idx}`} className="admin-image-preview" />
                    <button
                      type="button"
                      onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== idx))}
                      className="admin-image-remove"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-form-row">
              <label className="admin-label">Описание (кратко) *</label>
              <textarea name="description" value={product.description} onChange={handleChange} className="modal-input admin-textarea" />
              {errors.description && <div className="admin-error-text">{errors.description}</div>}
            </div>

            <div className="admin-form-row">
              <label className="admin-label">Состав *</label>
              <textarea name="composition" value={product.composition} onChange={handleChange} className="modal-input admin-textarea" />
              {errors.composition && <div className="admin-error-text">{errors.composition}</div>}
            </div>

            <div className="admin-form-row">
              <label className="admin-label">Показания *</label>
              <textarea name="indications" value={product.indications} onChange={handleChange} className="modal-input admin-textarea" />
              {errors.indications && <div className="admin-error-text">{errors.indications}</div>}
            </div>

            <div className="admin-form-row">
              <label className="admin-label">Способ применения *</label>
              <input type="text" name="dosage" value={product.dosage} onChange={handleChange} className="modal-input" />
              {errors.dosage && <div className="admin-error-text">{errors.dosage}</div>}
            </div>

            <div className="admin-form-row">
              <label className="admin-label">Противопоказания</label>
              <input type="text" name="contraindications" value={product.contraindications} onChange={handleChange} className="modal-input" />
            </div>

            <div className="admin-form-grid-2">
              <div>
                <label className="admin-label">Форма выпуска *</label>
                <input type="text" name="dosageForm" value={product.dosageForm} onChange={handleChange} className="modal-input" />
                {errors.dosageForm && <div className="admin-error-text">{errors.dosageForm}</div>}
              </div>
              <div>
                <label className="admin-label">Дозировка по умолчанию</label>
                <input type="text" name="defaultDosage" value={product.defaultDosage} onChange={handleChange} className="modal-input" />
              </div>
            </div>

            <div className="bad-checkbox-container">
              <input type="checkbox" id="isBad" name="isBad" checked={product.isBad} onChange={handleChange} />
              <label htmlFor="isBad" className="bad-checkbox-label"></label>
              <span>Добавить плашку "БАД не является лекарством"</span>
            </div>

            <button type="submit" className="cart-checkout-btn admin-submit">
              Сохранить товар
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// === ИКОНКИ ДЛЯ САЙДБАРА ===
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Дашборд',       icon: '/icons/dash.svg' },
  { key: 'orders',    label: 'Заказы',        icon: '/icons/orders.svg' },
  { key: 'products',  label: 'Товары',        icon: '/icons/product.svg' },
  { key: 'users',     label: 'Пользователи',  icon: '/icons/users.svg' },
  { key: 'reviews',   label: 'Отзывы',        icon: '/icons/review.svg' },
  { key: 'certs',     label: 'Сертификаты',   icon: '/icons/certficate.svg' },
  { key: 'dicts',     label: 'Справочники',   icon: '/icons/dicts.svg' }
];

// === ГЛАВНАЯ АДМИН-ПАНЕЛЬ ===
export default function AdminPanel({ show, onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [partners, setPartners] = useState([]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState('');

  const [showDictModal, setShowDictModal] = useState(null);
  const [dictType, setDictType] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [visitsData, setVisitsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [activeVisitIndex, setActiveVisitIndex] = useState(null);
  const visitChartRef = useRef(null);
  const [reviewRatingFilter, setReviewRatingFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Сертификаты
  const certFileRef = useRef(null);
  const [certTitle, setCertTitle] = useState('');
  const dragCertItem = useRef(null);
  const dragOverCertItem = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (show) fetchAll();
  }, [show]);

  const fetchAll = () => {
    axios.get('/api/admin/orders').then(res => setOrders(res.data)).catch(console.error);
    axios.get('/api/admin/products').then(res => setProducts(res.data)).catch(console.error);
    axios.get('/api/admin/users').then(res => setUsers(res.data)).catch(console.error);
    axios.get('/api/admin/reviews').then(res => setReviews(res.data)).catch(console.error);
    axios.get('/api/categories').then(res => setCategories(res.data)).catch(console.error);
    axios.get('/api/partners').then(res => setPartners(res.data)).catch(console.error);
    axios.get('/api/admin/certificates').then(res => setCertificates(res.data)).catch(console.error);

    axios.get('/api/admin/analytics/visits?days=7').then(res => setVisitsData(res.data)).catch(console.error);
    axios.get('/api/admin/analytics/revenue?days=7').then(res => setRevenueData(res.data)).catch(console.error);
    axios.get('/api/admin/analytics/top-products?limit=5').then(res => setTopProductsData(res.data)).catch(console.error);
  };

  // --- Заказы ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      showToast('Статус обновлён', 'success');
      fetchAll();
    } catch {
      showToast('Ошибка смены статуса', 'error');
    }
  };

  const handleViewOrder = (order) => setSelectedOrder(order);

  const handleViewUserOrders = (user) => {
    const userOrds = orders
      .filter(o => o.user?.username === user.username)
      .sort((a, b) => b.id - a.id);
    setSelectedUserOrders(userOrds);
    setSelectedUsername(user.username);
  };

  // --- Товары ---
  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/admin/products/${deleteTarget.id}`);
      showToast('Товар удалён', 'success');
      setDeleteTarget(null);
      fetchAll();
    } catch {
      showToast('Ошибка удаления товара', 'error');
    }
  };

  const handleSaveProduct = async (prodData) => {
    try {
      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, prodData);
      } else {
        await axios.post('/api/admin/products', prodData);
      }
      showToast('Товар сохранён', 'success');
      setShowProductForm(false);
      setEditingProduct(null);
      fetchAll();
    } catch (err) {
      showToast('Ошибка при сохранении товара', 'error');
      console.error(err);
    }
  };

  const toggleProductActive = async (product) => {
    try {
      await axios.put(`/api/admin/products/${product.id}/visibility`, { isActive: !product.isActive });
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast('Ошибка смены видимости товара', 'error');
    }
  };

  // --- Отзывы ---
  const handleApproveReview = async (id) => {
    try {
      await axios.put(`/api/admin/reviews/${id}/approve`);
      showToast('Отзыв одобрен', 'success');
      fetchAll();
    } catch {
      showToast('Ошибка одобрения отзыва', 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      showToast('Отзыв удалён', 'success');
      fetchAll();
    } catch {
      showToast('Ошибка удаления отзыва', 'error');
    }
  };

  // --- Справочники ---
  const handleAddDict = async (name) => {
    try {
      if (dictType === 'category') {
        await axios.post('/api/admin/categories', {
          name,
          slug: name.toLowerCase().replace(/\s/g, '-')
        });
      } else {
        await axios.post('/api/admin/partners', { name, specialty: '' });
      }
      setShowDictModal(null);
      fetchAll();
    } catch {
      showToast('Ошибка добавления', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      fetchAll();
    } catch {
      showToast('Ошибка удаления категории', 'error');
    }
  };

  const handleDeletePartner = async (id) => {
    try {
      await axios.delete(`/api/admin/partners/${id}`);
      fetchAll();
    } catch {
      showToast('Ошибка удаления производителя', 'error');
    }
  };

  // --- Сертификаты ---
  const handleCertUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', certTitle || 'Сертификат');
    try {
      await axios.post('/api/admin/certificates', formData);
      showToast('Сертификат загружен', 'success');
      setCertTitle('');
      fetchAll();
    } catch {
      showToast('Ошибка загрузки сертификата', 'error');
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await axios.delete(`/api/admin/certificates/${id}`);
      showToast('Сертификат удалён', 'success');
      fetchAll();
    } catch {
      showToast('Ошибка удаления сертификата', 'error');
    }
  };

  const handleCertDragStart = (e, index) => { dragCertItem.current = index; };
  const handleCertDragEnter = (e, index) => { dragOverCertItem.current = index; };

  const handleCertDragEnd = async () => {
    const copyListItems = [...certificates];
    const dragItemContent = copyListItems.splice(dragCertItem.current, 1)[0];
    copyListItems.splice(dragOverCertItem.current, 0, dragItemContent);
    const updated = copyListItems.map((cert, idx) => ({ ...cert, position: idx + 1 }));
    setCertificates(updated);
    dragCertItem.current = null;
    dragOverCertItem.current = null;
    try {
      await axios.put('/api/admin/certificates/reorder', updated.map(c => ({ id: c.id, position: c.position })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCertTitleUpdate = async (id, newTitle) => {
    try {
      await axios.put(`/api/admin/certificates/${id}`, { title: newTitle });
    } catch (err) {
      console.error(err);
    }
  };

  // --- Пользователи ---
  const handleToggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await axios.put(`/api/admin/users/${user.id}/role`, { role: newRole });
      showToast('Роль обновлена', 'success');
      fetchAll();
    } catch {
      showToast('Ошибка смены роли', 'error');
    }
  };

  // --- Сортировка и фильтрация ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredOrders = orders
    .filter(o => {
      const matchesSearch =
        o.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(o.id).includes(searchQuery);
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.id - a.id);

  // --- Статистика ---
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'В обработке', value: statusCounts.PENDING || 0, color: '#ffa500' },
    { name: 'Собирается', value: statusCounts.ASSEMBLING || 0, color: '#00bcd4' },
    { name: 'В пути', value: statusCounts.SHIPPED || 0, color: '#2196f3' },
    { name: 'Доставлен', value: statusCounts.DELIVERED || 0, color: '#4CAF50' },
    { name: 'Отменён', value: statusCounts.CANCELLED || 0, color: '#ff4d4d' }
  ].filter(d => d.value > 0);

  if (!show) return null;

  const getNavBadge = (key) => {
    if (key === 'orders') return ` (${orders.length})`;
    if (key === 'products') return ` (${products.length})`;
    if (key === 'users') return ` (${users.length})`;
    if (key === 'reviews') return ` (${reviews.filter(r => !r.isApproved).length})`;
    if (key === 'certs') return ` (${certificates.length})`;
    return '';
  };

  return (
    <div className="admin-fullscreen">

      <button
        className="admin-theme-toggle admin-theme-toggle--desktop"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      >
        <img
          src={theme === 'dark' ? '/icons/light.svg' : '/icons/dark.svg'}
          alt="theme"
        />
      </button>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="admin-panel-container">
        <div className={`admin-sidebar ${sidebarOpen ? 'active' : ''}`}>
          <h2 className="admin-logo">SanSoll Admin</h2>

          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`admin-nav-btn ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
            >
              <img src={item.icon} alt="" className="admin-nav-icon" />
              <span>{item.label}{getNavBadge(item.key)}</span>
            </button>
          ))}

          <button className="admin-close-btn" onClick={onClose}>
            <img src="/icons/exit_admin.svg" alt="" className="admin-nav-icon" />
            <span>Выйти из админки</span>
          </button>
        </div>

        <div className="admin-content">
          <div className="admin-mobile-header sticky-header">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>☰</button>
            <h3 className="admin-title">
              {activeTab === 'dashboard' ? 'Дашборд' :
                activeTab === 'orders' ? 'Заказы' :
                  activeTab === 'products' ? 'Товары' :
                    activeTab === 'users' ? 'Пользователи' :
                      activeTab === 'reviews' ? 'Отзывы' :
                        activeTab === 'certs' ? 'Сертификаты' : 'Справочники'}
            </h3>
          </div>

          {/* === ДАШБОРД === */}
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="admin-title">Статистика</h3>
              <div className="admin-stats-grid">
                <div className="dashboard-card"><h4>Общая выручка</h4><span>{totalRevenue.toFixed(0)} ₽</span></div>
                <div className="dashboard-card"><h4>Заказов в обработке</h4><span>{pendingOrders}</span></div>
                <div className="dashboard-card"><h4>Всего пользователей</h4><span>{users.length}</span></div>
                <div className="dashboard-card"><h4>Товаров заканчивается</h4><span>{lowStockProducts}</span></div>
              </div>

              <div className="dashboard-charts-grid">
                {/* График заходов */}
                <div className="dashboard-chart-container">
                  <h4 className="admin-chart-title">Заходы пользователей (за неделю)</h4>
                  {visitsData.length === 0 ? (
                    <div className="dashboard-empty">Нет данных</div>
                  ) : (
                    <div
                      className="line-chart-wrapper"
                      ref={visitChartRef}
                      onMouseMove={(e) => {
                        const rect = visitChartRef.current.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const ratio = Math.max(0, Math.min(1, x / rect.width));
                        const index = Math.round(ratio * (visitsData.length - 1));
                        setActiveVisitIndex(index);
                      }}
                      onMouseLeave={() => setActiveVisitIndex(null)}
                    >
                      {(() => {
                        const max = Math.max(...visitsData.map(d => d.count), 1);
                        const points = visitsData.map((d, i) => {
                          const x = (i / (visitsData.length - 1 || 1)) * 100;
                          const y = 50 - (d.count / max) * 45;
                          return { x, y, data: d, i };
                        });
                        const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
                        const areaPoints = `0,50 ${linePoints} 100,50`;
                        const activePoint = activeVisitIndex !== null ? points[activeVisitIndex] : null;

                        return (
                          <>
                            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="admin-line-chart">
                              {activePoint && (
                                <line
                                  x1={activePoint.x}
                                  y1="0"
                                  x2={activePoint.x}
                                  y2="50"
                                  stroke="var(--primary-color)"
                                  strokeWidth="0.3"
                                  strokeDasharray="1.5 1.5"
                                  opacity="0.7"
                                />
                              )}

                              <polyline fill="none" stroke="var(--primary-color)" strokeWidth="1.2" points={linePoints} />
                              <polyline fill="var(--primary-color-soft)" stroke="none" points={areaPoints} />

                              {points.map((p, i) => (
                                <circle
                                  key={i}
                                  cx={p.x}
                                  cy={p.y}
                                  r={activeVisitIndex === i ? '3' : '1.8'}
                                  fill="var(--primary-color)"
                                  style={{ transition: 'r 0.15s' }}
                                />
                              ))}
                            </svg>

                            <div className="line-chart-labels">
                              {visitsData.map((d, i) => {
                                const date = new Date(d.date);
                                const day = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][date.getDay()];
                                return <span key={i}>{day}</span>;
                              })}
                            </div>

                            {activePoint && (
                              <div
                                className="chart-tooltip"
                                style={{ left: `${activePoint.x}%` }}
                              >
                                <strong>{activePoint.data.date}</strong>
                                <span>{activePoint.data.count} заходов</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Круговая диаграмма статусов */}
                <div className="dashboard-chart-container">
                  <h4 className="admin-chart-title">Статусы заказов</h4>
                  <div className="pie-chart-wrapper">
                    <div
                      className="pie-chart"
                      style={{
                        background: (() => {
                          if (pieData.length === 0) return '#333';
                          let cumulative = 0;
                          const stops = pieData.map(d => {
                            const start = cumulative;
                            const end = cumulative + (d.value / orders.length * 360);
                            cumulative = end;
                            return `${d.color} ${start}deg ${end}deg`;
                          }).join(', ');
                          return `conic-gradient(${stops})`;
                        })()
                      }}
                    >
                      <div className="pie-chart-hole">
                        <span>{orders.length}</span>
                        <small>Всего</small>
                      </div>
                    </div>
                    <div className="pie-legend">
                      {pieData.map((d, i) => (
                        <div key={i} className="legend-item">
                          <span className="legend-dot" style={{ background: d.color }}></span>
                          <span className="legend-text">{d.name} ({d.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Гистограмма */}
                <div className="dashboard-chart-container">
                  <h4 className="admin-chart-title">Выручка за последние 7 дней</h4>
                  {revenueData.length === 0 ? (
                    <div className="dashboard-empty">Нет данных</div>
                  ) : (
                    <div className="bar-chart-wrapper">
                      {(() => {
                        const max = Math.max(...revenueData.map(d => d.revenue), 1);
                        return revenueData.map((d, i) => {
                          const date = new Date(d.date);
                          const day = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
                          const height = (d.revenue / max) * 100;
                          return (
                            <div key={i} className="bar-chart-col">
                              <div className="bar-chart-bar" style={{ height: `${height}%` }}>
                                <span className="bar-chart-val">{d.revenue.toFixed(0)}₽</span>
                              </div>
                              <span className="bar-chart-label">{day}</span>
                            </div>
                          );
                        });
                      })()}

                    </div>
                  )}
                </div>

                {/* Топ-5 товаров */}
                <div className="dashboard-chart-container">
                  <h4 className="admin-chart-title">Топ-{Math.min(5, topProductsData.length || 5)} продаваемых товаров</h4>
                  {topProductsData.length === 0 ? (
                    <div className="dashboard-empty">Нет данных</div>
                  ) : (
                    <div className="pie-chart-wrapper">
                      {(() => {
                        const colors = ['#FFD700', '#FFA500', '#ff4d4d', '#4CAF50', '#00bcd4'];
                        const topProducts = topProductsData.map((p, i) => ({
                          name: p.title,
                          value: p.quantity,
                          color: colors[i % colors.length]
                        }));
                        const total = topProducts.reduce((s, p) => s + p.value, 0);

                        let cumulative = 0;
                        const stops = topProducts.map(d => {
                          const start = cumulative;
                          const end = cumulative + (d.value / total * 360);
                          cumulative = end;
                          return `${d.color} ${start}deg ${end}deg`;
                        }).join(', ');

                        return (
                          <>
                            <div className="pie-chart" style={{ background: `conic-gradient(${stops})` }}>
                              <div className="pie-chart-hole">
                                <span>{total}</span>
                                <small>Продаж</small>
                              </div>
                            </div>
                            <div className="pie-legend">
                              {topProducts.map((d, i) => (
                                <div key={i} className="legend-item">
                                  <span className="legend-dot" style={{ background: d.color }}></span>
                                  <span className="legend-text">{d.name} ({d.value})</span>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === ЗАКАЗЫ === */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="admin-title">Управление заказами</h3>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Поиск по клиенту или ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
                <div className="admin-select-wrapper">
                  <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: 'ALL', label: 'Все статусы' },
                      { value: 'PENDING', label: 'В обработке' },
                      { value: 'ASSEMBLING', label: 'Собирается' },
                      { value: 'SHIPPED', label: 'В пути' },
                      { value: 'DELIVERED', label: 'Доставлен' },
                      { value: 'CANCELLED', label: 'Отменён' }
                    ]}
                    className="admin-select"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <p className="admin-empty-text">Заказов не найдено.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Дата</th><th>Покупатель</th>
                        <th>Сумма</th><th>Статус</th><th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                          <td className="admin-clickable-username" onClick={() => handleViewUserOrders(order.user)}>
                            {order.user?.username || 'Гость'}
                          </td>
                          <td>{order.totalAmount} ₽</td>
                          <td>
                            <CustomSelect
                              value={order.status}
                              onChange={(val) => handleStatusChange(order.id, val)}
                              options={[
                                { value: 'PENDING', label: 'В обработке' },
                                { value: 'ASSEMBLING', label: 'Собирается' },
                                { value: 'SHIPPED', label: 'В пути' },
                                { value: 'DELIVERED', label: 'Доставлен' },
                                { value: 'CANCELLED', label: 'Отменен' }
                              ]}
                              className="status-select"
                              usePortal={true}
                            />
                          </td>
                          <td>
                            <button className="admin-action-btn edit" onClick={() => handleViewOrder(order)}>
                              Подробнее
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* === ТОВАРЫ === */}
          {activeTab === 'products' && (
            <div>
              <h3 className="admin-title">Управление товарами</h3>
              <button className="admin-add-btn" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
                ＋ Добавить товар
              </button>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('title')}>Название ↕</th>
                      <th onClick={() => handleSort('price')}>Цена ↕</th>
                      <th onClick={() => handleSort('stock')}>Остаток ↕</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.price} ₽</td>
                        <td>{product.stock} шт</td>
                        <td>
                          {(() => {
                            if (!product.isActive) return <span className="status-badge status-hidden">Скрыт</span>;
                            if (product.stock === 0) return <span className="status-badge out-stock">Нет товара</span>;
                            if (product.stock <= 5) return <span className="status-badge low-stock">Заканчивается</span>;
                            return <span className="status-badge active">Активен</span>;
                          })()}
                        </td>
                        <td>
                          <div className="admin-actions-group">
                            <button className="admin-action-btn edit" onClick={() => toggleProductActive(product)}>
                              {product.isActive ? 'Скрыть' : 'Показать'}
                            </button>
                            <button className="admin-action-btn edit" onClick={() => { setEditingProduct(product); setShowProductForm(true); }}>
                              Изменить
                            </button>
                            <button className="admin-action-btn delete" onClick={() => setDeleteTarget(product)}>
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === ПОЛЬЗОВАТЕЛИ === */}
          {activeTab === 'users' && (
            <div>
              <h3 className="admin-title">Пользователи системы</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Логин</th><th>Email</th><th>Роль</th><th>Действия</th></tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                        <td>
                          <div className="admin-actions-group">
                            <button className="admin-action-btn edit" onClick={() => handleViewUserOrders(user)}>Заказы</button>
                            {user.username !== 'ADMIN_228_1' && (
                              <button
                                className={`admin-action-btn ${user.role === 'ADMIN' ? 'delete' : 'edit'}`}
                                onClick={() => handleToggleRole(user)}
                              >
                                {user.role === 'ADMIN' ? 'Снять админа' : 'Сделать админом'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === ОТЗЫВЫ === */}
          {activeTab === 'reviews' && (() => {
            const sortedReviews = [...reviews].sort((a, b) => b.id - a.id);
            const filteredReviews = reviewRatingFilter === 'ALL'
              ? sortedReviews
              : sortedReviews.filter(r => r.rating === reviewRatingFilter);

            return (
              <div>
                <h3 className="admin-title">Модерация отзывов</h3>

                <div className="admin-filters">
                  <div className="admin-select-wrapper">
                    <CustomSelect
                      value={reviewRatingFilter}
                      onChange={setReviewRatingFilter}
                      options={[
                        { value: 'ALL', label: 'Все рейтинги' },
                        { value: 5, label: '★★★★★ (5)' },
                        { value: 4, label: '★★★★ (4)' },
                        { value: 3, label: '★★★ (3)' },
                        { value: 2, label: '★★ (2)' },
                        { value: 1, label: '★ (1)' }
                      ]}
                      className="admin-select"
                    />
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Текст отзыва</th><th>Рейтинг</th><th>Статус</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                      {filteredReviews.map(review => (
                        <tr key={review.id}>
                          <td>#{review.id}</td>
                          <td className="admin-review-text">{review.text}</td>
                          <td>{'★'.repeat(review.rating)}</td>
                          <td>
                            {review.isApproved
                              ? <span className="admin-status-approved">Одобрен</span>
                              : <span className="admin-status-pending">На модерации</span>}
                          </td>
                          <td>
                            {!review.isApproved && (
                              <button className="admin-action-btn edit" onClick={() => handleApproveReview(review.id)}>
                                Одобрить
                              </button>
                            )}
                            <button className="admin-action-btn delete" onClick={() => handleDeleteReview(review.id)}>
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* === СЕРТИФИКАТЫ === */}
          {activeTab === 'certs' && (
            <div>
              <h3 className="admin-title">Управление сертификатами</h3>
              <div className="admin-cert-upload">
                <input
                  type="text"
                  placeholder="Название (опционально)"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="admin-search-input"
                />
                <button className="admin-add-btn" onClick={() => certFileRef.current.click()}>
                  ＋ Загрузить
                </button>
                <input type="file" accept="image/*" ref={certFileRef} className="admin-hidden-input" onChange={handleCertUpload} />
              </div>
              <div className="admin-certs-grid">
                {certificates.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="admin-cert-card"
                    draggable
                    onDragStart={(e) => handleCertDragStart(e, index)}
                    onDragEnter={(e) => handleCertDragEnter(e, index)}
                    onDragEnd={handleCertDragEnd}
                  >
                    <img src={cert.imageUrl} alt={cert.title} className="admin-cert-image" />
                    <div className="admin-cert-body">
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => setCertificates(prev => prev.map(c => c.id === cert.id ? { ...c, title: e.target.value } : c))}
                        onBlur={(e) => handleCertTitleUpdate(cert.id, e.target.value)}
                        className="admin-cert-title-input"
                      />
                      <button className="admin-action-btn delete admin-cert-delete" onClick={() => handleDeleteCert(cert.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === СПРАВОЧНИКИ === */}
          {activeTab === 'dicts' && (
            <div className="dict-container">
              <div className="dict-block">
                <h3 className="admin-title">Категории</h3>
                <button className="admin-add-btn admin-add-btn-full" onClick={() => { setDictType('category'); setShowDictModal(true); }}>
                  ＋ Добавить категорию
                </button>
                <div className="dict-list">
                  {categories.map(cat => (
                    <div key={cat.id} className="dict-item">
                      <span>{cat.name}</span>
                      <button className="admin-action-btn delete" onClick={() => handleDeleteCategory(cat.id)}>Удалить</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dict-divider"></div>

              <div className="dict-block">
                <h3 className="admin-title">Производители</h3>
                <button className="admin-add-btn admin-add-btn-full" onClick={() => { setDictType('partner'); setShowDictModal(true); }}>
                  ＋ Добавить производителя
                </button>
                <div className="dict-list">
                  {partners.map(part => (
                    <div key={part.id} className="dict-item">
                      <span>{part.name}</span>
                      <button className="admin-action-btn delete" onClick={() => handleDeletePartner(part.id)}>Удалить</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductFormModal
        show={showProductForm}
        onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
        partners={partners}
      />
      <DeleteConfirmModal
        show={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteProduct}
        name={deleteTarget?.title}
        type="товар"
      />
      <DictAddModal
        show={showDictModal}
        onClose={() => setShowDictModal(null)}
        onSave={handleAddDict}
        type={dictType === 'category' ? 'категорию' : 'производителя'}
      />
      <OrderDetailsModal
        show={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Заказ #${selectedOrder?.id || ''}`}
        orders={selectedOrder ? [selectedOrder] : []}
      />
      <OrderDetailsModal
        show={!!selectedUserOrders}
        onClose={() => setSelectedUserOrders(null)}
        title={`История покупок: ${selectedUsername}`}
        orders={selectedUserOrders || []}
      />
    </div>
  );
}