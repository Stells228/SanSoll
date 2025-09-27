// Тут происходит создание контента для секций "Научный подход", "Молекулярная основа здоровья" и карточки партнеров

const sciencePartners = [
  {
    name: "ООО 'Биолит'",
    city: "Томск",
    logo: "🌿",
    advantages: [
      "Собственные поля в Алтае и Хакасии",
      "Стандарт качества ХАССП",
      "Партнерство с НИИ кардиологии СО РАН",
      "30+ лет опыта производства"
    ],
  },
  {
    name: "NutriCare International",
    city: "Калифорния, США",
    logo: "🇺🇸",
    advantages: [
      "Стандарт качества GMP",
      "100% натуральное растительное сырье",
      "Современные лаборатории",
      "Международное признание"
    ],
  },
  {
    name: "НПФ 'Новь'",
    city: "Новосибирск",
    logo: "💎",
    advantages: [
      "Единственный производитель с эмблемой Красного Креста",
      "Стандарт ISO 9000",
      "Патенты РФ/Швейцарии/США",
      "Цеолит — природный минерал"
    ],
  },
  {
    name: "AD Medicine LLC",
    city: "Калифорния, США",
    logo: "🧬",
    advantages: [
      "Лидер коллоидных БАД нового поколения",
      "Стандарт GMP",
      "Инновационные разработки",
      "Международные награды"
    ],
  },
  {
    name: "ООО 'Апифарм'",
    city: "Новосибирск, с 1999 года",
    logo: "🐝",
    advantages: [
      "Расположен на территории НИИ медицинской биотехнологии ГНЦ ВБ 'Вектор'",
      "Клинические тестирования с НИИ СО РАМН",
      "Специализация на продуктах пчеловодства",
      "Высокие стандарты качества"
    ],
  },
  {
    name: "ООО 'ФитоЛайн'",
    city: "Москва",
    logo: "🌲",
    advantages: [
      "Золотая медаль им. И.И. Мечникова",
      "Клинические испытания в МГСУ",
      "Патенты РФ на зубные пасты",
      "Хвойные БАД и косметика"
    ],
  }
];

const argoProducts = [
  {
    name: "Витамины и минералы Argo",
    icon: "🌟",
    advantages: [
      "15 витаминов (A, C, D3, E, K, B-группы)",
      "8 минералов (Mg, Zn, Se, Cu)",
      "Способствуют иммунной защите",
      "GMP-сертификация"
    ],
    components: [
      { formula: "C₆H₈O₆", name: "Витамин C" },
      { formula: "Mg", name: "Магний" },
      { formula: "Zn", name: "Цинк" },
      { formula: "D₃", name: "Витамин D₃" }
    ]
  },
  {
    name: "Литовит-М (НПФ 'Новь')",
    icon: "💎",
    advantages: [
      "Природный цеолит-цеолитит",
      "Энтеросорбция токсинов",
      "Клинически протестирован",
      "ISO 9001, Красный Крест"
    ],
    components: [
      { formula: "SiO₂", name: "Кремнезем" },
      { formula: "Al₂O₃", name: "Оксид алюминия" },
      { formula: "Fe₂O₃", name: "Оксид железа" }
    ]
  },
  {
    name: "Коллоидные формулы NutriCare",
    icon: "🧪",
    advantages: [
      "Уникальные коллоиды микроэлементов",
      "Повышенная биодоступность",
      "NSF-сертификация",
      "Без ГМО и консервантов"
    ],
    components: [
      { formula: "Ag", name: "Коллоидное серебро" },
      { formula: "Au", name: "Коллоидное золото" },
      { formula: "Si", name: "Коллоидный кремний" }
    ]
  }
];

function renderSciencePartners() {
  const grid = document.querySelector('.partners-grid');
  grid.innerHTML = sciencePartners.map(partner => `
    <div class="partner-card glass-card slide-up">
      <div class="partner-logo">
        <div class="partner-icon">${partner.logo}</div>
      </div>
      <h3>${partner.name}</h3>
      <div class="partner-location">${partner.city}</div>
      <div class="partner-advantages">
        ${partner.advantages.map(adv => `<div class="advantage">${adv}</div>`).join("")}
      </div>
    </div>
  `).join('');
}

function renderArgoProducts() {
  const grid = document.querySelector('.argo-products-grid');
  grid.innerHTML = argoProducts.map(prd => `
    <div class="argo-product-card glass-card slide-up">
      <div class="partner-logo">
        <div class="partner-icon">${prd.icon}</div>
      </div>
      <h4>${prd.name}</h4>
      <ul class="argo-advantages">
        ${prd.advantages.map(adv => `<li><span class="adv-icon">✔</span>${adv}</li>`).join("")}
      </ul>
      <div class="argo-components">
        ${prd.components.map(comp => `
          <div class="component"><span class="comp-icon">${comp.formula}</span><span>${comp.name}</span></div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Молекулярная основа — динамические молекулы
const molecules = [
  { title: 'Витамин C', formula: 'C₆H₈O₆', text: 'Антиоксидант для иммунитета', structure: 'structure-vitamin-c' },
  { title: 'Куркумин', formula: 'C₂₁H₂₀O₆', text: 'Противовоспалительный компонент', structure: 'structure-curcumin' },
  { title: 'Омега-3', formula: 'C₂₀H₃₀O₂', text: 'Незаменимые жирные кислоты', structure: 'structure-omega' }
];

function renderMolecularSection() {
  const grid = document.querySelector('.science-grid');
  grid.innerHTML = molecules.map(mol => `
    <div class="science-card glass-card">
      <div class="molecule-visual">
        <div class="molecule-structure ${mol.structure}">
          <div class="atom carbon"></div>
          <div class="atom oxygen"></div>
          <div class="atom hydrogen"></div>
          <div class="bond bond-1"></div>
          <div class="bond bond-2"></div>
          <div class="bond bond-3"></div>
        </div>
      </div>
      <h4>${mol.title}</h4>
      <div class="formula-display">${mol.formula}</div>
      <p>${mol.text}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // Рендерим партнеров и продукцию
  if (document.querySelector('.partners-grid')) renderSciencePartners();
  if (document.querySelector('.argo-products-grid')) renderArgoProducts();
  if (document.querySelector('.science-grid')) renderMolecularSection();
});
