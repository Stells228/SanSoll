const backgroundFormulas = [
  'C₆H₈O₆', // витамин C
  'C₂₁H₂₀O₆', // куркумин
  'C₄₃H₆₆N₁₂O₁₂S₂', // инсулин
  'C₈H₁₁NO₂', // дофамин
  'C₁₁H₁₅NO₂', // адреналин
  'C₁₇H₂₁NO₄', // морфин
  'C₆H₁₂O₆', // глюкоза
  'Mg', 
  'Zn', 
];

const backgroundIcons = [
  { src: '../2.png', class: 'med-icon med-icon-1', width: 60, height: 60 },
  { src: '../3.png', class: 'med-icon med-icon-2', width: 70, height: 70 },
  { src: '../4.png', class: 'med-icon med-icon-3', width: 50, height: 50 }
];

// Параметры "пилюль" для фона
const floatingPills = [
  { color: 'yellow', width: 40, height: 20, top: '10%', left: '15%' },
  { color: 'orange', width: 60, height: 36, top: '60%', left: '70%' },
  { color: 'yellow', width: 20, height: 10, top: '85%', left: '45%' },
  { color: 'orange', width: 30, height: 18, top: '35%', left: '85%' },
  { color: 'yellow', width: 50, height: 25, top: '77%', left: '20%' }
];

// Генерируем фоновые формулы на странице
function createFloatingFormulas() {
  const floatingArea = document.querySelector('.floating-elements');
  backgroundFormulas.forEach((formula, idx) => {
    const el = document.createElement('div');
    el.className = `floating-formula formula-${idx + 1}`;
    el.textContent = formula;
    // Случайное позиционирование:
    el.style.top = `${Math.floor(Math.random() * 80) + 5}%`;
    el.style.left = `${Math.floor(Math.random() * 70) + 10}%`;
    floatingArea.appendChild(el);
  });
}

// Фонарные фото-иконки на фоне
function createFloatingIcons() {
  const floatingArea = document.querySelector('.floating-elements');
  backgroundIcons.forEach(icon => {
    const el = document.createElement('div');
    el.className = icon.class;
    el.style.width = icon.width + 'px';
    el.style.height = icon.height + 'px';
    el.style.position = 'absolute';
    el.style.top = `${Math.floor(Math.random() * 80) + 5}%`;
    el.style.left = `${Math.floor(Math.random() * 70) + 10}%`;
    el.style.background = `url('${icon.src}') center/contain no-repeat`;
    el.style.filter = "sepia(100%) hue-rotate(35deg) saturate(1000%) brightness(1.4)";
    el.style.opacity = "0.15";
    floatingArea.appendChild(el);
  });
}

// Фоновые анимированные пилюли (капсулы)
function createFloatingPills() {
  const floatingArea = document.querySelector('.floating-elements');
  floatingPills.forEach((pill, idx) => {
    const el = document.createElement('div');
    el.className = `floating-pill pill-${idx + 1} ${pill.color}`;
    el.style.width = pill.width + 'px';
    el.style.height = pill.height + 'px';
    el.style.position = 'absolute';
    el.style.top = pill.top;
    el.style.left = pill.left;
    el.style.background = pill.color === 'yellow'
      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
      : 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)';
    el.style.borderRadius = "16px";
    el.style.opacity = "0.13";
    el.style.animation = `float-slow ${20 + (idx * 7)}s infinite linear`;
    floatingArea.appendChild(el);
  });
}

// Случайная генерация молекулярных кругов/структур
function createFloatingMolecules() {
  const floatingArea = document.querySelector('.floating-elements');
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = `molecular-structure structure-${i + 1}`;
    el.style.width = `${30 + Math.random() * 25}px`;
    el.style.height = `${30 + Math.random() * 25}px`;
    el.style.top = `${Math.floor(Math.random() * 80) + 5}%`;
    el.style.left = `${Math.floor(Math.random() * 70) + 10}%`;
    el.style.position = 'absolute';
    floatingArea.appendChild(el);
  }
}

// Инициализация всех «фонов»
function initFloatingBackground() {
  // Один раз создаём область для элементов если её нет
  let floatingArea = document.querySelector('.floating-elements');
  if (!floatingArea) {
    floatingArea = document.createElement('div');
    floatingArea.className = 'floating-elements';
    document.body.appendChild(floatingArea);
  }
  createFloatingFormulas();
  createFloatingIcons();
  createFloatingPills();
  createFloatingMolecules();
}

document.addEventListener('DOMContentLoaded', initFloatingBackground);
