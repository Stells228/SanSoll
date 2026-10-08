import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CustomSelect({
  value,
  onChange,
  options,
  className,
  usePortal = true,      
  placeholder = 'Выберите...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const portalRef = useRef(null);

  const currentOption = options.find(opt => opt.value === value);

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen && usePortal) updateCoords();
    setIsOpen(prev => !prev);
  };

  // Закрытие по клику вне
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const inContainer = containerRef.current && containerRef.current.contains(e.target);
      const inPortal = portalRef.current && portalRef.current.contains(e.target);
      if (!inContainer && !inPortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Пересчёт координат при скролле/ресайзе
  useEffect(() => {
    if (!isOpen || !usePortal) return;
    const handler = () => updateCoords();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [isOpen, usePortal]);

  const optionsContent = (
    <div
      ref={portalRef}
      className="custom-select-options"
      style={usePortal ? {
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 9999
      } : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map(opt => (
        <div
          key={opt.value}
          className={`custom-select-option ${opt.value === value ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onChange(opt.value);
            setIsOpen(false);
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${className || ''}`}
      onClick={handleToggle}
    >
      <div className="custom-select-header">
        {currentOption ? currentOption.label : placeholder}
        <span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>▾</span>
      </div>

      {isOpen && (
        usePortal
          ? createPortal(optionsContent, document.body)
          : optionsContent
      )}
    </div>
  );
}