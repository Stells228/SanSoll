import { useState } from 'react';

const FAQ_ITEMS = [
  { q: "Какой срок годности у ваших товаров?", a: "Срок годности указан на упаковке каждого изделия. Обычно это 12–24 месяца с даты производства при соблюдении условий хранения." },
  { q: "Из чего состоят ваши продукты?", a: "Все ингредиенты перечислены на упаковке и на странице описания товара. Мы используем только натуральные компоненты без ГМО и искусственных добавок." },
  { q: "Проходят ли ваши товары сертификацию?", a: "Да, все продукты сертифицированы и имеют действующие сертификаты качества. Их можно просмотреть в разделе «Сертификаты»." },
  { q: "При какой температуре хранить продукцию?", a: "Рекомендуем хранить в сухом прохладном месте при температуре от +5 °C до +25 °C, вдали от прямых солнечных лучей." },
  { q: "Как оформить возврат товара?", a: "Для возврата напишите нам в телеграм (@SanSoll_bot) или воспользуйтесь формой обратной связи. Возврат возможен в течение 14 дней при сохранении товарного вида." },
  { q: "Содержит ли ваша продукция спиртовую основу?", a: "Нет, вся наша продукция не содержит спирт. Большая часть продукции состоит из чистого экстракта или на водной основе." },
  { q: "Можно ли давать вашу продукцию детям?", a: "Да, можно, но в соотношении 1/2 от взрослой дозы." }
];

export default function Faq() {
  // Храним МАССИВ открытых индексов, а не один
  const [openIndices, setOpenIndices] = useState([]);

  const toggleFaq = (index) => {
    setOpenIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index] 
    );
  };

  const isOpen = (index) => openIndices.includes(index);

  return (
    <section id="faq" className="faq">
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-badge glass-card">FAQ</span>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => (
            <div className={`faq-item ${isOpen(idx) ? 'active' : ''}`} key={idx}>
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                {item.q}
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}