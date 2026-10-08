import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CustomSelect from './CustomSelect';
import { showToast } from './Toast';

// === УТИЛИТЫ ===

const getMonthDays = (dateStr) => {
  const parts = dateStr.split('-');
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayDate = new Date(year, month, i);
    days.push({
      name: i,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isToday: dayDate.toDateString() === new Date().toDateString()
    });
  }
  return days;
};

const getWeekDays = (dateStr) => {
  const parts = dateStr.split('-');
  const base = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const day = base.getDay() === 0 ? 7 : base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - day + 1);
  const days = [];
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      name: dayNames[i],
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      dayNum: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return days;
};

const convertScheduleToZones = (items) => {
  const byDate = {};
  items.forEach(item => {
    const d = item.date;
    if (!byDate[d]) byDate[d] = { morning: [], afternoon: [], evening: [] };
    byDate[d][item.zone].push({
      schedId: item.id,
      medicineId: item.userMedicine?.id,
      title: item.userMedicine?.product?.title || item.userMedicine?.customTitle || 'Без названия',
      unit: item.userMedicine?.product?.unit || item.userMedicine?.customUnit || 'таб',
      isCustom: item.userMedicine?.isCustom,
      imageUrl: item.userMedicine?.product?.images?.[0]?.imageUrl || null,
      time: item.time,
      dose: item.dose,
      taken: item.taken
    });
  });
  return byDate;
};

const getDefaultDose = (medicine) => {
  const dosage = medicine?.product?.defaultDosage;
  if (!dosage) return 1;
  const match = dosage.match(/[\d.,]+/);
  if (!match) return 1;
  const num = parseFloat(match[0].replace(',', '.'));
  return isNaN(num) ? 1 : num;
};

// === НАСТРОЕНИЯ ===
const MOODS = [
  { key: 'good',   icon: '/icons/otl.svg' },
  { key: 'normal', icon: '/icons/norm.svg' },
  { key: 'bad',    icon: '/icons/bad.svg' },
  { key: 'awful',  icon: '/icons/ochploch.svg' }
];

const getMoodIcon = (key) => {
  const mood = MOODS.find(m => m.key === key);
  return mood ? mood.icon : null;
};

// === КОМПОНЕНТ ===
export default function TrackerModal({ show, onClose, currentUser }) {
  const [apteka, setApteka] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [streak, setStreak] = useState(0);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarView, setCalendarView] = useState('month');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [customItem, setCustomItem] = useState({ title: '', unit: 'таб', count: 1 });
  const [journalText, setJournalText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const [refillId, setRefillId] = useState(null);
  const [refillAmount, setRefillAmount] = useState('');

  const [showCal, setShowCal] = useState(true);
  const [showApt, setShowApt] = useState(true);
  const [showSandbox, setShowSandbox] = useState(true);
  const [showJournal, setShowJournal] = useState(true);

  const [mobileAddZone, setMobileAddZone] = useState(null);
  const [mobileAddItem, setMobileAddItem] = useState('');

  const mountedRef = useRef(true);

  const [addFromSiteMode, setAddFromSiteMode] = useState(false);
  const [siteProductId, setSiteProductId] = useState('');
  const [siteCount, setSiteCount] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // === ЗАГРУЗКА ===

  const loadApteka = async () => {
    try {
      const res = await axios.get(`/api/tracker/apteka?username=${currentUser}`);
      if (mountedRef.current) setApteka(res.data);
    } catch (err) {
      console.error('Ошибка загрузки аптечки', err);
    }
  };

  const loadSchedule = async () => {
    try {
      const today = new Date();
      const from = new Date(today.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
      const to = new Date(today.getFullYear() + 1, 11, 31).toISOString().split('T')[0];
      const res = await axios.get(`/api/tracker/schedule/range?username=${currentUser}&from=${from}&to=${to}`);
      if (mountedRef.current) setSchedule(convertScheduleToZones(res.data));
    } catch (err) {
      console.error('Ошибка загрузки расписания', err);
    }
  };

  const loadStreak = async () => {
    try {
      const res = await axios.get(`/api/tracker/streak?username=${currentUser}`);
      if (mountedRef.current) setStreak(res.data.streak || 0);
    } catch (err) {
      console.error('Ошибка загрузки streak', err);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (show && currentUser) {
      // Товары для формы "С сайта"
      axios.get('/api/products?size=1000')
        .then(res => setAllProducts(res.data.content || []))
        .catch(err => console.error('Ошибка загрузки товаров', err));

      // Трекер
      loadApteka();
      loadSchedule();
      loadStreak();

      // Журнал из localStorage
      const savedJournal = localStorage.getItem('tracker_journal_' + currentUser);
      if (savedJournal) {
        try { setJournalEntries(JSON.parse(savedJournal)); } catch { }
      }
    }
  }, [show, currentUser]);

  useEffect(() => {
    if (currentUser && journalEntries.length > 0) {
      localStorage.setItem('tracker_journal_' + currentUser, JSON.stringify(journalEntries));
    }
  }, [journalEntries, currentUser]);

  if (!show) return null;

  const weekDays = getWeekDays(currentDate);
  const monthDays = getMonthDays(currentDate);

  const changeMonth = (delta) => {
    const parts = currentDate.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setMonth(d.getMonth() + delta);
    d.setDate(1);
    setCurrentDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const changeWeek = (delta) => {
    const parts = currentDate.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + (delta * 7));
    setCurrentDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const hasMedsOnDay = (dateStr) => {
    const sched = schedule[dateStr];
    if (!sched) return false;
    return (sched.morning?.length > 0 || sched.afternoon?.length > 0 || sched.evening?.length > 0);
  };

  // === DRAG & DROP ===

  const handleDragStart = (e, item) => {
    if (item.totalUnits - item.takenUnits <= 0) return;
    setDraggedItem(item);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnd = () => setDraggedItem(null);

  const handleDrop = async (e, zone) => {
    e.preventDefault();
    if (!draggedItem) return;

    const defaultDose = getDefaultDose(draggedItem);
    const remaining = draggedItem.totalUnits - draggedItem.takenUnits;

    if (defaultDose > remaining) {
      showToast(
        `Нельзя добавить: в аптечке осталось ${remaining.toFixed(1)} ${draggedItem.product?.unit || draggedItem.customUnit || 'шт'}, а доза — ${defaultDose}`,
        'error'
      );
      setDraggedItem(null);
      return;
    }

    try {
      await axios.post('/api/tracker/schedule', {
        username: currentUser,
        medicineId: draggedItem.id,
        date: currentDate,
        zone: zone,
        time: '08:00',
        dose: defaultDose
      });
      await loadSchedule();
    } catch (err) {
      showToast('Ошибка добавления в расписание', 'error');
    }
    setDraggedItem(null);
  };

  // === ПРИЁМ ===

  const handleTake = async (schedId) => {
    const daySched = schedule[currentDate] || { morning: [], afternoon: [], evening: [] };
    let item = null;
    for (const zone of ['morning', 'afternoon', 'evening']) {
      const found = daySched[zone]?.find(i => i.schedId === schedId);
      if (found) { item = found; break; }
    }

    if (item) {
      const medicine = apteka.find(a => a.id === item.medicineId);
      if (medicine) {
        const remaining = medicine.totalUnits - medicine.takenUnits;
        if (item.dose > remaining) {
          showToast(`Недостаточно в аптечке: осталось ${remaining.toFixed(1)}, нужно ${item.dose}`, 'error');
          return;
        }
      }
    }

    try {
      await axios.post(`/api/tracker/schedule/${schedId}/take`, { username: currentUser });
      await Promise.all([loadSchedule(), loadApteka(), loadStreak()]);
      showToast('Приём отмечен!', 'success');
    } catch (err) {
      showToast('Ошибка отметки приёма', 'error');
    }
  };

  // === АПТЕЧКА ===

  const handleAddCustom = async () => {
    if (!customItem.title.trim()) return;

    const count = parseFloat(customItem.count);
    if (isNaN(count) || count <= 0) {
      showToast('Укажите корректное количество', 'error');
      return;
    }

    try {
      await axios.post('/api/tracker/apteka/custom', {
        username: currentUser,
        title: customItem.title.trim(),
        unit: customItem.unit,
        count: count
      });
      setCustomItem({ title: '', unit: 'таб', count: 1 });
      setShowAddMenu(false);
      await loadApteka();
    } catch (err) {
      showToast('Ошибка добавления: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleDeleteApteka = async (id) => {
    try {
      await axios.delete(`/api/tracker/apteka/${id}?username=${currentUser}`);
      await Promise.all([loadApteka(), loadSchedule()]);
      showToast('Лекарство удалено', 'success');
    } catch (err) {
      showToast('Ошибка удаления', 'error');
    }
  };

  const handleUpdateAptekaCount = async (id, newTotal) => {
    try {
      await axios.put(`/api/tracker/apteka/${id}`, {
        username: currentUser,
        totalUnits: Math.max(0, parseFloat(newTotal) || 0)
      });
      await loadApteka();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefill = async (id) => {
    const amount = parseInt(refillAmount);
    if (isNaN(amount) || amount <= 0) {
      setRefillId(null);
      setRefillAmount('');
      return;
    }
    const item = apteka.find(a => a.id === id);
    if (!item) return;
    try {
      await axios.put(`/api/tracker/apteka/${id}`, {
        username: currentUser,
        totalUnits: item.totalUnits + amount
      });
      await loadApteka();
    } catch (err) {
      showToast('Ошибка пополнения', 'error');
    }
    setRefillId(null);
    setRefillAmount('');
  };

  // === ЖУРНАЛ ===

  const handleSaveJournal = () => {
    if (!selectedEmoji && !journalText) return;

    const today = new Date().toISOString().split('T')[0];

    setJournalEntries(prev => [
      { id: Date.now(), date: today, mood: selectedEmoji, text: journalText },
      ...prev
    ]);
    setJournalText('');
    setSelectedEmoji('');
    showToast('Запись сохранена', 'success');
  };

  // === РАСПИСАНИЕ ===

  const handleTimeChange = async (schedId, newTime) => {
    try {
      await axios.put(`/api/tracker/schedule/${schedId}`, {
        username: currentUser,
        time: newTime
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDoseChange = async (schedId, newDose) => {
    try {
      await axios.put(`/api/tracker/schedule/${schedId}`, {
        username: currentUser,
        dose: newDose
      });
      await loadSchedule();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromSchedule = async (schedId) => {
    try {
      await axios.delete(`/api/tracker/schedule/${schedId}?username=${currentUser}`);
      await loadSchedule();
    } catch (err) {
      showToast('Ошибка удаления из расписания', 'error');
    }
  };

  const handleMobileAdd = async (zone) => {
    if (!mobileAddItem) return;

    const medicine = apteka.find(a => a.id === parseInt(mobileAddItem));
    if (!medicine) return;

    const defaultDose = getDefaultDose(medicine);
    const remaining = medicine.totalUnits - medicine.takenUnits;

    if (defaultDose > remaining) {
      showToast(`Нельзя добавить: осталось ${remaining.toFixed(1)}, а доза — ${defaultDose}`, 'error');
      return;
    }

    try {
      await axios.post('/api/tracker/schedule', {
        username: currentUser,
        medicineId: parseInt(mobileAddItem),
        date: currentDate,
        zone: zone,
        time: '08:00',
        dose: defaultDose
      });
      await loadSchedule();
    } catch (err) {
      showToast('Ошибка добавления', 'error');
    }
    setMobileAddItem('');
    setMobileAddZone(null);
  };

  const handleTimeInput = (zone, idx, val) => {
    let v = val.replace(/[^\d:]/g, '');
    if (v.length === 2 && !v.includes(':')) v += ':';
    if (v.length > 5) v = v.substring(0, 5);
    const parts = v.split(':');
    if (parts[0] && parseInt(parts[0]) > 23) parts[0] = '23';
    if (parts[1] && parseInt(parts[1]) > 59) parts[1] = '59';
    v = parts.join(':');

    setSchedule(prev => {
      const daySchedule = prev[currentDate] ? { ...prev[currentDate] } : { morning: [], afternoon: [], evening: [] };
      const zoneItems = daySchedule[zone] ? [...daySchedule[zone]] : [];
      zoneItems[idx] = { ...zoneItems[idx], time: v };
      daySchedule[zone] = zoneItems;
      return { ...prev, [currentDate]: daySchedule };
    });
  };

  const handleAddFromSite = async () => {
    if (!siteProductId) {
      showToast('Выберите товар', 'error');
      return;
    }

    const count = parseFloat(siteCount);
    if (isNaN(count) || count <= 0) {
      showToast('Укажите корректное количество', 'error');
      return;
    }

    try {
      await axios.post('/api/tracker/apteka/from-site', {
        username: currentUser,
        productId: parseInt(siteProductId),
        count: count
      });
      setSiteProductId('');
      setSiteCount(1);
      setShowAddMenu(false);
      await loadApteka();
    } catch (err) {
      showToast('Ошибка добавления: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const currentDaySchedule = schedule[currentDate] || { morning: [], afternoon: [], evening: [] };

  return (
    <div className="modal tracker-modal" onClick={onClose}>
      <div className="modal-content tracker-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Трекер приёма БАДов</h2>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        <div className="tracker-body">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="tracker-left-col">
            <div className="mobile-collapse-btn" onClick={() => setShowCal(!showCal)}>
              <span>
                <img src="/icons/calendar.svg" alt="" className="tracker-collapse-icon" />
                Календарь
              </span>
              <span>{showCal ? '▲' : '▼'}</span>
            </div>
            {showCal && (
              <div className="tracker-calendar-wrapper">
                {calendarView === 'month' ? (
                  <>
                    <div className="cal-nav">
                      <button onClick={() => changeMonth(-1)}>‹</button>
                      <span>{new Date(currentDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={() => changeMonth(1)}>›</button>
                    </div>
                    <div className="month-grid">
                      {monthDays.map((day, i) => (
                        day ? (
                          <div
                            key={i}
                            className={`cal-day-month ${currentDate === day.date ? 'active' : ''} ${day.isToday ? 'today' : ''} ${hasMedsOnDay(day.date) ? 'has-meds' : ''}`}
                            onClick={() => { setCurrentDate(day.date); setCalendarView('week'); }}
                          >
                            {day.name}
                          </div>
                        ) : <div key={i} className="cal-day-empty"></div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cal-nav">
                      <button onClick={() => setCalendarView('month')}>← К месяцу</button>
                      <div className="cal-nav-controls">
                        <button onClick={() => changeWeek(-1)}>‹</button>
                        <button onClick={() => changeWeek(1)}>›</button>
                      </div>
                    </div>
                    <div className="week-grid">
                      {weekDays.map(day => (
                        <div
                          key={day.date}
                          className={`cal-day-week ${currentDate === day.date ? 'active' : ''} ${day.isToday ? 'today' : ''} ${hasMedsOnDay(day.date) ? 'has-meds' : ''}`}
                          onClick={() => setCurrentDate(day.date)}
                        >
                          <span>{day.name}</span>
                          <span>{day.dayNum}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mobile-collapse-btn" onClick={() => setShowApt(!showApt)}>
              <span>
                <img src="/icons/product.svg" alt="" className="tracker-collapse-icon" />
                Аптечка
              </span>
              <span>{showApt ? '▲' : '▼'}</span>
            </div>
            {showApt && (
              <div className="tracker-apteka">
                <h3>Моя аптечка</h3>
                <div className="sidebar-items">
                  {apteka.map(item => {
                    const remaining = item.totalUnits - item.takenUnits;
                    const displayRemaining = remaining % 1 === 0 ? remaining : remaining.toFixed(1);
                    const isLow = remaining > 0 && remaining <= item.totalUnits * 0.1;
                    const isOut = remaining <= 0;
                    const isRefilling = refillId === item.id;
                    const title = item.product?.title || item.customTitle || 'Без названия';
                    const unit = item.product?.unit || item.customUnit || 'таб';
                    const imgUrl = item.product?.images?.[0]?.imageUrl;

                    return (
                      <div
                        key={item.id}
                        className={`sidebar-card ${isOut ? 'out-of-stock' : ''}`}
                        draggable={!isOut}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                      >
                        {!item.isCustom && imgUrl && <img src={imgUrl} alt={title} />}
                        <div className="sidebar-info">
                          <strong>{title}</strong>
                          {isLow && !isOut && (
                            <span className="low-stock-warn">
                              <img src="/icons/danger.svg" alt="" className="low-stock-icon" />
                              Заканчивается
                            </span>
                          )}

                          {isOut && !isRefilling ? (
                            <button className="out-stock-btn" onClick={() => setRefillId(item.id)}>Пополнить</button>
                          ) : isRefilling ? (
                            <div className="stock-edit">
                              <input
                                type="number"
                                value={refillAmount}
                                onChange={(e) => setRefillAmount(e.target.value)}
                                placeholder="Кол-во"
                                className="stock-input"
                                autoFocus
                              />
                              <button className="refill-btn" onClick={() => handleRefill(item.id)}>✓</button>
                              <button className="cancel-refill-btn" onClick={() => setRefillId(null)}>✖</button>
                            </div>
                          ) : (
                            !isOut && (
                              <div className="stock-edit">
                                <span>Ост: </span>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={displayRemaining}
                                  onChange={(e) => {
                                    const newRemaining = parseFloat(e.target.value) || 0;
                                    const diff = newRemaining - remaining;
                                    handleUpdateAptekaCount(item.id, item.totalUnits + diff);
                                  }}
                                  className="stock-input"
                                />
                                <span>{unit}</span>
                              </div>
                            )
                          )}
                        </div>
                        <button
                          type="button"
                          className="delete-apteka-btn"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteApteka(item.id);
                          }}
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  className={`add-custom-btn ${showAddMenu ? 'add-custom-btn--close' : ''}`}
                  onClick={() => setShowAddMenu(!showAddMenu)}
                >
                  {showAddMenu ? '✕ Закрыть' : '+ Добавить препарат'}
                </button>

                {showAddMenu && (
                  <div className="add-menu-popup">
                    <div className="add-menu-tabs">
                      <button
                        type="button"
                        className={`add-tab ${!addFromSiteMode ? 'active' : ''}`}
                        onClick={() => setAddFromSiteMode(false)}
                      >
                        Своё лекарство
                      </button>
                      <button
                        type="button"
                        className={`add-tab ${addFromSiteMode ? 'active' : ''}`}
                        onClick={() => setAddFromSiteMode(true)}
                      >
                        С сайта
                      </button>
                    </div>

                    <div className="add-menu-content">
                      {!addFromSiteMode ? (
                        <div className="custom-form">
                          <input
                            type="text"
                            placeholder="Название"
                            value={customItem.title}
                            onChange={(e) => setCustomItem({ ...customItem, title: e.target.value })}
                          />
                          <div className="custom-form-row">
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              placeholder="Кол-во"
                              value={customItem.count}
                              onChange={(e) => setCustomItem({ ...customItem, count: e.target.value })}
                            />
                            <CustomSelect
                              value={customItem.unit}
                              onChange={(val) => setCustomItem({ ...customItem, unit: val })}
                              options={[
                                { value: 'таб', label: 'таб' },
                                { value: 'мл', label: 'мл' },
                                { value: 'гр', label: 'гр' },
                                { value: 'капс', label: 'капс' },
                                { value: 'стик', label: 'стик' },
                                { value: 'пакетик', label: 'пакетик' }
                              ]}
                            />
                          </div>
                          <button type="button" onClick={handleAddCustom}>Добавить</button>
                        </div>
                      ) : (
                        <div className="custom-form">
                          <CustomSelect
                            value={siteProductId}
                            onChange={(val) => setSiteProductId(val)}
                            options={[
                              { value: '', label: '-- Выберите товар --' },
                              ...allProducts.map(p => ({
                                value: p.id,
                                label: `${p.title} (${p.unit || 'шт'})`
                              }))
                            ]}
                          />
                          <div className="custom-form-row">
                            <input
                              type="number"
                              min="0.5"
                              step="0.5"
                              placeholder="Кол-во"
                              value={siteCount}
                              onChange={(e) => setSiteCount(e.target.value)}
                            />
                            <span className="count-label">
                              {allProducts.find(p => p.id === parseInt(siteProductId))?.unit || 'шт'}
                            </span>
                          </div>
                          <button type="button" onClick={handleAddFromSite}>Добавить</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ЦЕНТРАЛЬНАЯ КОЛОНКА */}
          <div className="tracker-center-col">
            <div className="mobile-collapse-btn" onClick={() => setShowSandbox(!showSandbox)}>
              <span>
                <img src="/icons/alarm.svg" alt="" className="tracker-collapse-icon" />
                Расписание
              </span>
              <span>{showSandbox ? '▲' : '▼'}</span>
            </div>
            {showSandbox && (
              <div className="time-slots">
                {['morning', 'afternoon', 'evening'].map(zone => {
                  const zoneData = {
                    morning: { label: 'Утро', icon: '/icons/morning.svg' },
                    afternoon: { label: 'День', icon: '/icons/light.svg' },
                    evening: { label: 'Вечер', icon: '/icons/dark.svg' }
                  }[zone];

                  return (
                    <div key={zone} className="time-slot" onDrop={(e) => handleDrop(e, zone)} onDragOver={handleDragOver}>
                      <h4>
                        <img src={zoneData.icon} alt="" className="time-slot-icon" />
                        {zoneData.label}
                      </h4>
                      <div className="slot-items-scroll">
                        {currentDaySchedule[zone]?.map((item, idx) => (
                          <div key={item.schedId} className={`slot-card ${item.taken ? 'taken' : ''}`}>
                            {!item.isCustom && item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
                            <div className="slot-info">
                              <strong className="slot-title">{item.title}</strong>
                              <div className="slot-controls">
                                <input
                                  type="text"
                                  value={item.time}
                                  onChange={(e) => handleTimeInput(zone, idx, e.target.value)}
                                  onBlur={(e) => handleTimeChange(item.schedId, e.target.value)}
                                  placeholder="08:00"
                                  maxLength="5"
                                  className="time-input"
                                />
                                <div className="dose-stepper">
                                  <button type="button" onClick={() => handleDoseChange(item.schedId, Math.max(0.5, parseFloat(item.dose) - 0.5))}>-</button>
                                  <span>{item.dose} {item.unit}</span>
                                  <button type="button" onClick={() => handleDoseChange(item.schedId, parseFloat(item.dose) + 0.5)}>+</button>
                                </div>
                              </div>
                            </div>
                            <div className="slot-actions">
                              {!item.taken
                                ? <button className="take-btn" onClick={() => handleTake(item.schedId)}>✓</button>
                                : <span className="taken-badge">Принято</span>}
                              <button className="remove-btn" onClick={() => handleRemoveFromSchedule(item.schedId)}>✖</button>
                            </div>
                          </div>
                        ))}
                        {(!currentDaySchedule[zone] || currentDaySchedule[zone].length === 0) && (
                          <div className="empty-text">
                            <span>Перетащите или нажмите</span>
                            {mobileAddZone === zone ? (
                              <div className="mobile-add-block">
                                <CustomSelect
                                  value={mobileAddItem}
                                  onChange={(val) => setMobileAddItem(val)}
                                  options={[
                                    { value: '', label: 'Выберите препарат' },
                                    ...apteka
                                      .filter(a => (a.totalUnits - a.takenUnits) > 0)
                                      .map(a => ({
                                        value: a.id,
                                        label: a.product?.title || a.customTitle || 'Без названия'
                                      }))
                                  ]}
                                  className="admin-select"
                                />
                                <button className="take-btn take-btn-full" onClick={() => handleMobileAdd(zone)}>
                                  Добавить в расписание
                                </button>
                              </div>
                            ) : (
                              <button className="take-btn take-btn-compact" onClick={() => setMobileAddZone(zone)}>
                                + Добавить
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="tracker-right-col">
            <div className="mobile-collapse-btn" onClick={() => setShowJournal(!showJournal)}>
              <span>
                <img src="/icons/journal.svg" alt="" className="tracker-collapse-icon" />
                Журнал самочувствия
              </span>
              <span>{showJournal ? '▲' : '▼'}</span>
            </div>
            {showJournal && (
              <div className="health-journal">
                <h3>Журнал самочувствия</h3>

                <div className="emoji-row">
                  {MOODS.map(m => (
                    <button
                      key={m.key}
                      type="button"
                      className={`mood-btn ${selectedEmoji === m.key ? 'active' : ''}`}
                      onClick={() => setSelectedEmoji(m.key)}
                    >
                      <img src={m.icon} alt={m.key} />
                    </button>
                  ))}
                </div>

                <div className="journal-text-wrapper">
                  <textarea
                    placeholder="Как вы себя чувствуете?"
                    value={journalText}
                    maxLength="500"
                    onChange={(e) => setJournalText(e.target.value)}
                    className="journal-text"
                  />
                  <span className="journal-counter">{journalText.length}/500</span>
                </div>

                <button className="save-journal-btn" onClick={handleSaveJournal}>
                  Сохранить запись
                </button>

                <div className="journal-history">
                  {journalEntries.map((j, i) => {
                    const icon = getMoodIcon(j.mood);
                    return (
                      <div key={j.id || i} className="history-item">
                        {icon
                          ? <img src={icon} alt="" className="history-mood-icon" />
                          : <span className="history-emoji">—</span>}
                        <div>
                          <span className="history-date">{new Date(j.date).toLocaleDateString('ru-RU')}</span>
                          <p>{j.text || 'Нет записей'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}