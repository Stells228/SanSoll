import { useEffect, useState } from 'react';

let toastId = 0;

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { message, type = 'info', duration = 4000 } = e.detail;
      const id = ++toastId;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  const dismiss = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast toast--${t.type}`}
          onClick={() => dismiss(t.id)}
          role="alert"
        >
          <div className="toast-bar"></div>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function showToast(message, type = 'info', duration = 4000) {
  window.dispatchEvent(new CustomEvent('app-toast', {
    detail: { message, type, duration }
  }));
}