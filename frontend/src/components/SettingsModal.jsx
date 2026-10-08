import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { showToast } from './Toast';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export default function SettingsModal({
  show,
  onClose,
  user,
  streak,
  onDeleteAccount,
  onProfileUpdate,
  savedAddresses,
  savedCards,
  onAddAddress,
  onRemoveAddress,
  onAddCard,
  onRemoveCard
}) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [deletePass, setDeletePass] = useState('');
  const [deleteMsg, setDeleteMsg] = useState({ text: '', type: '' });

  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ city: '', zip: '', street: '', house: '', apartment: '' });
  const [addrErrors, setAddrErrors] = useState({});

  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ cardNumber: '', cardExpiry: '', cardCvv: '' });
  const [cardErrors, setCardErrors] = useState({});

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (show && user?.username) {
      axios.get(`/api/users/profile?username=${user.username}`)
        .then(res => {
          setNewUsername(res.data.username);
          setEmail(res.data.email || '');
          setPhone(res.data.phone || '');
          if (res.data.avatarUrl) {
            setAvatarUrl(res.data.avatarUrl + '?t=' + Date.now());
          } else {
            setAvatarUrl(null);
          }
        })
        .catch(err => console.error('Ошибка загрузки профиля:', err));
    } else if (!show) {
      setProfileMsg({ text: '', type: '' });
      setPassMsg({ text: '', type: '' });
      setDeleteMsg({ text: '', type: '' });
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setDeletePass('');
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    }
  }, [show, user]);

  if (!show) return null;

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('8')) val = '7' + val.substring(1);
    if (!val.startsWith('7') && val.length > 0) val = '7' + val;
    val = val.substring(0, 11);
    let formatted = '+7';
    if (val.length > 1) formatted += ' (' + val.substring(1, 4);
    if (val.length >= 4) formatted += ') ' + val.substring(4, 7);
    if (val.length >= 7) formatted += '-' + val.substring(7, 9);
    if (val.length >= 9) formatted += '-' + val.substring(9, 11);
    setPhone(formatted);
  };

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', user.username);
    try {
      const response = await axios.post('/api/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatarUrl(response.data.avatarUrl + '?t=' + Date.now());
    } catch (err) {
      showToast('Ошибка загрузки фото', 'error');
    }
  };

  const handleSaveProfile = async () => {
    setProfileMsg({ text: 'Сохранение...', type: 'info' });
    try {
      await axios.put(`/api/users/profile?username=${user.username}`, { newUsername, phone });
      setProfileMsg({ text: 'Профиль успешно обновлён!', type: 'success' });
      setIsEditing(false);
      onProfileUpdate(newUsername);
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.error || 'Ошибка сохранения', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    setPassMsg({ text: '', type: '' });
    if (newPass !== confirmPass) {
      setPassMsg({ text: 'Новые пароли не совпадают!', type: 'error' });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ text: 'Пароль должен быть не менее 6 символов!', type: 'error' });
      return;
    }
    setPassMsg({ text: 'Изменение...', type: 'info' });
    try {
      await axios.put(`/api/users/password?username=${user.username}`, {
        currentPassword: currentPass,
        newPassword: newPass
      });
      setPassMsg({ text: 'Пароль успешно изменён!', type: 'success' });
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    } catch (err) {
      setPassMsg({ text: err.response?.data?.error || 'Ошибка смены пароля', type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMsg({ text: 'Удаление...', type: 'info' });
    try {
      await axios.delete(`/api/users/account?username=${user.username}`, { data: { password: deletePass } });
      onDeleteAccount();
    } catch (err) {
      setDeleteMsg({ text: err.response?.data?.error || 'Ошибка удаления. Проверьте пароль.', type: 'error' });
    }
  };

  const handleSaveNewAddress = () => {
    const errs = {};
    if (!newAddr.city) errs.city = 'Укажите город';
    if (!newAddr.zip) errs.zip = 'Укажите индекс';
    if (!newAddr.street) errs.street = 'Укажите улицу';
    if (!newAddr.house) errs.house = 'Укажите дом';
    setAddrErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onAddAddress(newAddr);
    setNewAddr({ city: '', zip: '', street: '', house: '', apartment: '' });
    setShowAddrForm(false);
  };

  const handleAddrChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'city' || name === 'street') val = val.replace(/[^a-zA-Zа-яА-ЯёЁ\s.-]/g, '');
    if (name === 'zip') val = val.replace(/\D/g, '').substring(0, 6);
    if (name === 'house' || name === 'apartment') val = val.replace(/[^a-zA-Zа-яА-Я0-9]/g, '').substring(0, 5);
    setNewAddr(prev => ({ ...prev, [name]: val }));
    setAddrErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleCardChange = (e) => {
    let val = e.target.value;
    const name = e.target.name;
    if (name === 'cardNumber') val = val.replace(/\D/g, '').substring(0, 16).match(/.{1,4}/g)?.join(' ') || '';
    if (name === 'cardExpiry') { val = val.replace(/\D/g, '').substring(0, 4); if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2); }
    if (name === 'cardCvv') val = val.replace(/\D/g, '').substring(0, 3);
    setNewCard(prev => ({ ...prev, [name]: val }));
    setCardErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSaveNewCard = () => {
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
    if (Object.keys(errs).length > 0) return;
    onAddCard(newCard);
    setNewCard({ cardNumber: '', cardExpiry: '', cardCvv: '' });
    setShowCardForm(false);
  };

  const userInitials = (isEditing ? newUsername : user?.username)?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Настройки аккаунта</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="modal-body settings-modal-body">
          <div className="settings-header-banner">
            <div className="header-bg-pill header-bg-pill-1"></div>
            <div className="header-bg-pill header-bg-pill-2"></div>
            <div className="header-bg-pill header-bg-pill-3"></div>
            <div className="header-bg-pill header-bg-pill-4"></div>

            <div className="settings-avatar-wrapper" onClick={handleAvatarClick}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="settings-avatar-img" />
              ) : (
                <span className="settings-avatar-placeholder">{userInitials}</span>
              )}
              <div className="settings-avatar-overlay">📷</div>
              <input type="file" ref={fileInputRef} className="admin-hidden-input" onChange={handleFileChange} accept="image/*" />
            </div>
            <h3 className="settings-username">{isEditing ? newUsername : user?.username}</h3>
            <p className="settings-email">{email || 'Email не указан'}</p>
          </div>

          <div className="settings-content">
            {/* Личные данные */}
            <div className="settings-block">
              <h3 className="settings-section-title">
                <img src="/icons/user.svg" alt="" className="settings-section-icon" />
                Личные данные
              </h3>
              <div className="settings-modal-grid">
                <div>
                  <label className="form-label">Имя пользователя</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" value={email} readOnly className="form-control" />
                </div>
                <div>
                  <label className="form-label">Телефон</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (999) 123-45-67"
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="settings-actions-right">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="cart-clear-btn settings-btn-edit"
                      onClick={() => setIsEditing(true)}
                    >
                      <img src="/icons/edit.svg" alt="edit" className="settings-icon-inline" />
                      Изменить данные
                    </button>
                  ) : (
                    <button type="button" className="cart-checkout-btn settings-btn-full" onClick={handleSaveProfile}>
                      Сохранить изменения
                    </button>
                  )}
                </div>
              </div>
              {profileMsg.text && (
                <div className={`danger-msg ${profileMsg.type}`}>{profileMsg.text}</div>
              )}
            </div>

            {/* Streak */}
            <div className="streak-block">
              <div className="streak-pill streak-pill-1"></div>
              <div className="streak-pill streak-pill-2"></div>
              <div className="streak-pill streak-pill-3"></div>
              <div className="streak-pill streak-pill-4"></div>

              <div className="streak-content">
                <div className="streak-trophy">🏆</div>
                <div className="streak-num">{streak}</div>
                <div className="streak-label">дней без пропусков!</div>
                <div className="streak-sublabel">Вы держите удар и заботитесь о здоровье. Так держать!</div>
              </div>
            </div>

            {/* Смена пароля */}
            <div className="settings-block">
              <h3 className="settings-section-title">
                <img src="/icons/passlock.svg" alt="" className="settings-section-icon" />
                Смена пароля
              </h3>
              <div className="settings-modal-grid">
                <div className="settings-modal-grid-full settings-pass-wrapper">
                  <label className="form-label">Текущий пароль</label>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Введите текущий пароль"
                    className="form-control"
                  />
                  <span className="settings-eye-btn" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                    {showCurrentPass ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>

                <div className="settings-pass-wrapper">
                  <label className="form-label">Новый пароль</label>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="form-control"
                  />
                  <span className="settings-eye-btn" onClick={() => setShowNewPass(!showNewPass)}>
                    {showNewPass ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>

                <div className="settings-pass-wrapper">
                  <label className="form-label">Повторите пароль</label>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Повторите пароль"
                    className="form-control"
                  />
                  <span className="settings-eye-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                    {showConfirmPass ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                </div>
              </div>
              <div className="settings-actions-right">
                <button type="button" className="cart-checkout-btn settings-btn-full" onClick={handleChangePassword}>
                  Изменить пароль
                </button>
              </div>
              {passMsg.text && <div className={`danger-msg ${passMsg.type}`}>{passMsg.text}</div>}
            </div>

            {/* Адреса */}
            <div className="settings-block">
              <h3 className="settings-section-title">
                <img src="/icons/adres.svg" alt="" className="settings-section-icon" />
                Адреса доставки
              </h3>
              <div className="settings-methods-list">
                {savedAddresses.map(addr => (
                  <div key={addr.id} className="settings-method-card">
                    <div>
                      <strong>{addr.city}, {addr.street} {addr.house}</strong>
                      <span>{addr.zip}, кв. {addr.apartment || '-'}</span>
                    </div>
                    <button className="settings-remove-btn" onClick={() => onRemoveAddress(addr.id)}>✖</button>
                  </div>
                ))}

                {!showAddrForm ? (
                  <button className="settings-add-btn" onClick={() => setShowAddrForm(true)}>＋ Добавить адрес</button>
                ) : (
                  <div className="settings-form">
                    <div className="settings-form-row-2">
                      <div>
                        <input type="text" name="city" placeholder="Город *" value={newAddr.city} onChange={handleAddrChange} className={`form-control ${addrErrors.city ? 'error-input' : ''}`} />
                        {addrErrors.city && <div className="error-text">{addrErrors.city}</div>}
                      </div>
                      <div>
                        <input type="text" name="zip" placeholder="Индекс *" value={newAddr.zip} onChange={handleAddrChange} className={`form-control ${addrErrors.zip ? 'error-input' : ''}`} />
                        {addrErrors.zip && <div className="error-text">{addrErrors.zip}</div>}
                      </div>
                    </div>
                    <div>
                      <input type="text" name="street" placeholder="Улица *" value={newAddr.street} onChange={handleAddrChange} className={`form-control ${addrErrors.street ? 'error-input' : ''}`} />
                      {addrErrors.street && <div className="error-text">{addrErrors.street}</div>}
                    </div>
                    <div className="settings-form-row-2b">
                      <div>
                        <input type="text" name="house" placeholder="Дом *" value={newAddr.house} onChange={handleAddrChange} className={`form-control ${addrErrors.house ? 'error-input' : ''}`} />
                        {addrErrors.house && <div className="error-text">{addrErrors.house}</div>}
                      </div>
                      <div>
                        <input type="text" name="apartment" placeholder="Квартира" value={newAddr.apartment} onChange={handleAddrChange} className="form-control" />
                      </div>
                    </div>
                    <div className="settings-form-actions">
                      <button className="cart-clear-btn" onClick={() => { setShowAddrForm(false); setAddrErrors({}); }}>Отмена</button>
                      <button className="cart-checkout-btn" onClick={handleSaveNewAddress}>Сохранить</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Карты */}
            <div className="settings-block">
              <h3 className="settings-section-title">
                <img src="/icons/wallet.svg" alt="" className="settings-section-icon" />
                Способы оплаты
              </h3>
              <div className="settings-methods-list">
                {savedCards.map(card => (
                  <div key={card.id} className="settings-method-card">
                    <div>
                      <strong>**** {card.cardNumber.slice(-4)}</strong>
                      <span>{card.cardExpiry}</span>
                    </div>
                    <button className="settings-remove-btn" onClick={() => onRemoveCard(card.id)}>✖</button>
                  </div>
                ))}

                {!showCardForm ? (
                  <button className="settings-add-btn" onClick={() => setShowCardForm(true)}>＋ Добавить карту</button>
                ) : (
                  <div className="settings-form">
                    <div>
                      <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={newCard.cardNumber} onChange={handleCardChange} maxLength="19" className={`form-control ${cardErrors.cardNumber ? 'error-input' : ''}`} />
                      {cardErrors.cardNumber && <div className="error-text">{cardErrors.cardNumber}</div>}
                    </div>
                    <div className="settings-form-row-2b">
                      <div>
                        <input type="text" name="cardExpiry" placeholder="ММ/ГГ" value={newCard.cardExpiry} onChange={handleCardChange} maxLength="5" className={`form-control ${cardErrors.cardExpiry ? 'error-input' : ''}`} />
                        {cardErrors.cardExpiry && <div className="error-text">{cardErrors.cardExpiry}</div>}
                      </div>
                      <div>
                        <input type="password" name="cardCvv" placeholder="CVV" value={newCard.cardCvv} onChange={handleCardChange} maxLength="3" className={`form-control ${cardErrors.cardCvv ? 'error-input' : ''}`} />
                        {cardErrors.cardCvv && <div className="error-text">{cardErrors.cardCvv}</div>}
                      </div>
                    </div>
                    <div className="settings-form-actions">
                      <button className="cart-clear-btn" onClick={() => { setShowCardForm(false); setCardErrors({}); }}>Отмена</button>
                      <button className="cart-checkout-btn" onClick={handleSaveNewCard}>Сохранить</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Внешний вид */}
            <div className="settings-block">
              <h3 className="settings-section-title">
                <img src="/icons/view.svg" alt="" className="settings-section-icon" />
                Внешний вид
              </h3>
              <div className="theme-selector">
                <div className={`theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                  <div className="theme-preview dark-preview">
                    <div className="preview-bar"></div>
                    <div className="preview-circle"></div>
                  </div>
                  <span>Тёмная тема</span>
                  {theme === 'dark' && <div className="theme-check">✓</div>}
                </div>

                <div className={`theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                  <div className="theme-preview light-preview">
                    <div className="preview-bar"></div>
                    <div className="preview-circle"></div>
                  </div>
                  <span>Светлая тема</span>
                  {theme === 'light' && <div className="theme-check">✓</div>}
                </div>
              </div>
            </div>

            {/* Опасная зона */}
            <div className="settings-block settings-block-danger">
              <h3 className="settings-section-title danger">
                <img src="/icons/danger.svg" alt="" className="settings-section-icon settings-section-icon--danger" />
                Опасная зона
              </h3>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  className="cart-delete-selected settings-btn-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Удалить аккаунт
                </button>
              ) : (
                <div className="danger-confirm">
                  <p>Вы уверены? Это действие необратимо.</p>
                  {deleteMsg.text && <div className={`danger-msg ${deleteMsg.type}`}>{deleteMsg.text}</div>}
                  <input
                    type="password"
                    value={deletePass}
                    onChange={(e) => setDeletePass(e.target.value)}
                    placeholder="Введите пароль для подтверждения"
                    className="form-control"
                  />
                  <div className="danger-actions">
                    <button type="button" className="cart-clear-btn" onClick={() => { setShowDeleteConfirm(false); setDeleteMsg({ text: '', type: '' }); }}>Отмена</button>
                    <button type="button" className="cart-delete-selected" onClick={handleDeleteAccount}>Удалить навсегда</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}