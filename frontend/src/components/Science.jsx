export default function Science() {
  // Данные партнеров
  const partners = [
    { name: 'ООО "Биолит"', location: 'Томск, с 1991 года', icon: '🌿', class: 'biolit-icon', advs: ['Собственные поля в Алтае и Хакасии', 'Стандарт качества ХАССП', 'Партнерство с НИИ кардиологии СО РАН', '30+ лет опыта производства'] },
    { name: 'NutriCare International', location: 'Калифорния, США, с 1990 года', icon: '🇺🇸', class: 'nutricare-icon', advs: ['Стандарт качества GMP', '100% натуральное растительное сырье', 'Современные лаборатории', 'Международное признание'] },
    { name: 'НПФ "Новь"', location: 'Новосибирск, с 1992 года', icon: '💎', class: 'nov-icon', advs: ['Единственный российский производитель с правом использования эмблемы Красного Креста', 'Стандарт качества ISO 9000', 'Патенты РФ, Швейцарии и США', 'Природный минерал цеолит в основе'] },
    { name: 'AD Medicine LLC', location: 'Калифорния, США', icon: '🧬', class: 'admed-icon', advs: ['Лидер коллоидных БАД нового поколения', 'Стандарт GMP', 'Инновационные разработки', 'Международные награды'] },
    { name: 'ООО "Апифарм"', location: 'Новосибирск, с 1999 года', icon: '🐝', class: 'apifarm-icon', advs: ['Расположен на территории НИИ медицинской биотехнологии ГНЦ ВБ "Вектор"', 'Клинические тестирования с НИИ СО РАМН', 'Специализация на продуктах пчеловодства', 'Высокие стандарты качества'] },
    { name: 'ООО "ФитоЛайн"', location: 'Москва', icon: '🌲', class: 'fitoline-icon', advs: ['Золотая медаль им. И.И. Мечникова', 'Клинические испытания в МГСУ', 'Патенты РФ на зубные пасты', 'Хвойные БАД и косметика'] }
  ];

  // Данные продукции Арго
  const argoProducts = [
    {
      name: 'Витамины и минералы Argo', icon: '🌟', class: 'biolit-icon',
      advs: ['15 витаминов (A, C, D3, E, K, B-группы)', '8 минералов (Mg, Zn, Se, Cu)', 'Способствуют иммунной защите', 'GMP-сертификация'],
      comps: [['C₆H₈O₆', 'Витамин C'], ['Mg', 'Магний'], ['Zn', 'Цинк'], ['D₃', 'Витамин D₃']]
    },
    {
      name: 'Литовит-М (НПФ «Новь»)', icon: '💎', class: 'nov-icon',
      advs: ['Природный цеолит-цеолитит', 'Энтеросорбция токсинов', 'Клинически протестирован', 'ISO 9001, Красный Крест'],
      comps: [['SiO₂', 'Кремнезем'], ['Al₂O₃', 'Оксид алюминия'], ['Fe₂O₃', 'Оксид железа']]
    },
    {
      name: 'Коллоидные формулы NutriCare', icon: '🧪', class: 'nutricare-icon',
      advs: ['Уникальные коллоиды микроэлементов', 'Повышенная биодоступность', 'NSF-сертификация', 'Без ГМО и консервантов'],
      comps: [['Ag', 'Коллоидное серебро'], ['Au', 'Коллоидное золото'], ['Si', 'Коллоидный кремний']]
    }
  ];

  return (
    <section id="science" className="science">
      <div className="container">
        <div className="section-header fade-in">
          <div className="section-badge glass-card">
            <span>Научный подход</span>
          </div>
          <h2>Наши партнеры по разработке и производству</h2>
          <p>SanSoll сотрудничает с ведущими производителями компании Арго — научно-технологическими лидерами в области БАДов</p>
        </div>

        {/* Карточки партнеров */}
        <div className="partners-grid">
          {partners.map((p, idx) => (
            <div className="partner-card glass-card slide-up" key={idx}>
              <div className="partner-logo">
                <div className={`partner-icon ${p.class}`}>{p.icon}</div>
              </div>
              <h3>{p.name}</h3>
              <div className="partner-location">{p.location}</div>
              <div className="partner-advantages">
                {p.advs.map((adv, i) => (
                  <div className="advantage" key={i}>{adv}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Блок торговой продукции Арго */}
        <div className="science-molecules-section">
          <h3>Торговая продукция Арго — преимущества и компоненты</h3>
          <div className="argo-products-grid">
            {argoProducts.map((prd, idx) => (
              <div className="argo-product-card glass-card slide-up" key={idx}>
                <div className="partner-logo">
                  <div className={`partner-icon ${prd.class}`}>{prd.icon}</div>
                </div>
                <h4>{prd.name}</h4>
                <ul className="argo-advantages">
                  {prd.advs.map((adv, i) => (
                    <li key={i}><span className="adv-icon">✔</span> {adv}</li>
                  ))}
                </ul>
                <div className="argo-components">
                  {prd.comps.map((comp, i) => (
                    <div className="component" key={i}>
                      <span className="comp-icon">{comp[0]}</span>
                      <span>{comp[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}