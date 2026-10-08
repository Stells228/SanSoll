import { useState } from 'react';
import axios from 'axios';

// SVG иконки глаза (currentColor) - не хоччет иначе
const EyeIcon = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export default function AuthModal({ show, onClose, onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return '';
    if (pass.length < 6) return 'weak';
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8) return 'strong';
    return 'medium';
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = { weak: 'Слабый', medium: 'Средний', strong: 'Надёжный' };

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Пожалуйста, заполните имя пользователя';
    else if (username.length < 3) errors.username = 'Имя должно быть не короче 3 символов';

    if (!isLoginMode) {
      if (!email.trim()) errors.email = 'Пожалуйста, укажите email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Неверный формат email';
    }

    if (!password) errors.password = 'Пожалуйста, введите пароль';
    else if (password.length < 6) errors.password = 'Пароль должен быть не короче 6 символов';

    if (!isLoginMode) {
      if (!confirmPassword) errors.confirmPassword = 'Пожалуйста, повторите пароль';
      else if (password !== confirmPassword) errors.confirmPassword = 'Пароли не совпадают';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);

    const url = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginMode ? { username, password } : { username, email, password };

    try {
      const response = await axios.post(url, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      onLogin(response.data.username);

      setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
      setFormErrors({});
    } catch (err) {
      setServerError(err.response?.data?.error || 'Ошибка соединения с сервером.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    setFormErrors(prev => ({ ...prev, [field]: null }));
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setServerError(null);
    setFormErrors({});
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="auth-title">
            {isLoginMode ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="modal-body auth-modal-body">
          {serverError && (
            <div className="auth-server-error">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Имя пользователя */}
            <div className="form-group">
              <label className="form-label">Имя пользователя</label>
              <input
                type="text"
                className={`form-control ${formErrors.username ? 'error-input' : ''}`}
                placeholder="Ваш логин"
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
                required
              />
              {formErrors.username && <div className="error-text">{formErrors.username}</div>}
            </div>

            {/* Email (только при регистрации) */}
            {!isLoginMode && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${formErrors.email ? 'error-input' : ''}`}
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  required
                />
                {formErrors.email && <div className="error-text">{formErrors.email}</div>}
              </div>
            )}

            {/* Пароль */}
            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${formErrors.password ? 'error-input' : ''}`}
                style={{ paddingRight: '45px' }}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className={`auth-eye-icon ${formErrors.password ? 'password-error' : 'password-ok'}`}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
              {formErrors.password && <div className="error-text">{formErrors.password}</div>}
            </div>

            {/* Индикатор надёжности */}
            {!isLoginMode && password.length > 0 && (
              <div className="auth-strength">
                <span className="auth-strength-label">Надёжность:</span>
                <div className="auth-strength-bar">
                  <div className={`auth-strength-fill ${strength}`}></div>
                </div>
                <span className={`auth-strength-text ${strength}`}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}

            {/* Повтор пароля */}
            {!isLoginMode && (
              <div className="form-group">
                <label className="form-label">Повторите пароль</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${formErrors.confirmPassword ? 'error-input' : ''}`}
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                  required
                />
                {formErrors.confirmPassword && <div className="error-text">{formErrors.confirmPassword}</div>}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>

          <p className="auth-switch">
            {isLoginMode ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <span className="auth-switch-link" onClick={switchMode}>
              {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}