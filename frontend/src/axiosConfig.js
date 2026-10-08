import axios from 'axios';

// REQUEST: прикрепляем токен 
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Флаг, чтобы не зацикливать logout 
let isLoggingOut = false;

// RESPONSE: ловим 401 и 403 — оба значат "не авторизован" 
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !isLoggingOut) {
      isLoggingOut = true;
      console.warn(`>>> [AXIOS] ${status} — сессия недействительна, выходим`);

      localStorage.removeItem('token');
      localStorage.removeItem('username');

      window.dispatchEvent(new CustomEvent('app-toast', {
        detail: { message: 'Сессия истекла. Войдите заново.', type: 'error', duration: 4000 }
      }));

      // Перезагружаем только если мы не на главной
      const isHomePage = window.location.pathname === '/' && window.location.search === '';
      setTimeout(() => {
        if (isHomePage) {
          window.location.reload();
        } else {
          window.location.href = '/';
        }
      }, 500);
    }

    return Promise.reject(error);
  }
);

export default axios;