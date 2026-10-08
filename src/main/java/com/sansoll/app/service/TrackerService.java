package com.sansoll.app.service;

import com.sansoll.app.entity.MedicineSchedule;
import com.sansoll.app.entity.Order;
import com.sansoll.app.entity.OrderItem;
import com.sansoll.app.entity.Product;
import com.sansoll.app.entity.UserMedicine;
import com.sansoll.app.repository.MedicineScheduleRepository;
import com.sansoll.app.repository.ProductRepository;
import com.sansoll.app.repository.UserMedicineRepository;
import com.sansoll.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrackerService {

    private static final Logger log = LoggerFactory.getLogger(TrackerService.class);

    private final UserMedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final MedicineScheduleRepository scheduleRepository;
    private final ProductRepository productRepository;

    public TrackerService(UserMedicineRepository medicineRepository,
                          UserRepository userRepository,
                          MedicineScheduleRepository scheduleRepository,
                          ProductRepository productRepository) {
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.productRepository = productRepository;
    }

    // ========================================
    // АПТЕЧКА
    // ========================================

    public List<UserMedicine> getApteka(String username) {
        return medicineRepository.findByUser_Username(username);
    }

    public UserMedicine addCustom(String username, String title, String unit, Double count) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        UserMedicine m = new UserMedicine();
        m.setUser(user);
        m.setIsCustom(true);
        m.setCustomTitle(title);
        m.setCustomUnit(unit != null ? unit : "таб");
        m.setTotalUnits(count != null && count > 0 ? count : 1.0);
        m.setTakenUnits(0.0);
        return medicineRepository.save(m);
    }

    public UserMedicine addFromSite(String username, Long productId, Double count) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        double units = count != null && count > 0
                ? count
                : (product.getPackSize() != null ? product.getPackSize() : 1);

        var existing = medicineRepository.findByUser_UsernameAndProduct_Id(username, productId);
        if (existing.isPresent()) {
            UserMedicine m = existing.get();
            m.setTotalUnits(m.getTotalUnits() + units);
            return medicineRepository.save(m);
        }

        UserMedicine m = new UserMedicine();
        m.setUser(user);
        m.setProduct(product);
        m.setIsCustom(false);
        m.setTotalUnits(units);
        m.setTakenUnits(0.0);
        return medicineRepository.save(m);
    }

    public UserMedicine update(Long id, String username, Double totalUnits, Double takenUnits) {
        UserMedicine m = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Препарат не найден"));
        checkOwner(m.getUser().getUsername(), username);

        if (totalUnits != null) m.setTotalUnits(totalUnits);
        if (takenUnits != null) m.setTakenUnits(takenUnits);
        return medicineRepository.save(m);
    }

    public void delete(Long id, String username) {
        UserMedicine m = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Препарат не найден"));
        checkOwner(m.getUser().getUsername(), username);

        scheduleRepository.deleteByUserMedicine_Id(id);
        medicineRepository.delete(m);
    }

    // ========================================
    // АВТОПОПОЛНЕНИЕ ПРИ ДОСТАВКЕ
    // ========================================

    @Transactional
    public void replenishFromOrder(Order order) {
        log.info("replenishFromOrder: order #{}", order.getId());

        if (Boolean.TRUE.equals(order.getIsReplenished())) {
            log.debug("Заказ #{} уже наполнял аптечку — пропускаем", order.getId());
            return;
        }
        if (order.getUser() == null) {
            log.warn("Заказ #{} без пользователя — пропускаем", order.getId());
            return;
        }

        String username = order.getUser().getUsername();
        log.info("Пользователь: {}, товаров в заказе: {}", username, order.getItems().size());

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product == null) continue;

            double unitsToAdd = item.getQuantity()
                    * (product.getPackSize() != null ? product.getPackSize() : 1);

            var existing = medicineRepository.findByUser_UsernameAndProduct_Id(username, product.getId());
            if (existing.isPresent()) {
                UserMedicine m = existing.get();
                m.setTotalUnits(m.getTotalUnits() + unitsToAdd);
                medicineRepository.save(m);
                log.debug("+{} к {} (новый total: {})", unitsToAdd, product.getTitle(), m.getTotalUnits());
            } else {
                UserMedicine m = new UserMedicine();
                m.setUser(order.getUser());
                m.setProduct(product);
                m.setIsCustom(false);
                m.setTotalUnits(unitsToAdd);
                m.setTakenUnits(0.0);
                medicineRepository.save(m);
                log.debug("Создано: {} = {}", product.getTitle(), unitsToAdd);
            }
        }

        order.setIsReplenished(true);
    }

    // ========================================
    // РАСПИСАНИЕ
    // ========================================

    public List<MedicineSchedule> getSchedule(String username, LocalDate date) {
        return scheduleRepository.findByUser_UsernameAndDateOrderByIdAsc(username, date);
    }

    public List<MedicineSchedule> getScheduleRange(String username, LocalDate from, LocalDate to) {
        return scheduleRepository.findByUser_Username(username).stream()
                .filter(s -> !s.getDate().isBefore(from) && !s.getDate().isAfter(to))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .toList();
    }

    public MedicineSchedule addToSchedule(String username, Long medicineId, LocalDate date,
                                          String zone, String time, Double dose) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        var medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Препарат не найден"));
        checkOwner(medicine.getUser().getUsername(), username);

        MedicineSchedule s = new MedicineSchedule();
        s.setUser(user);
        s.setUserMedicine(medicine);
        s.setDate(date);
        s.setZone(zone);
        s.setTime(time != null ? time : "08:00");
        s.setDose(dose != null ? dose : 1.0);
        s.setTaken(false);
        return scheduleRepository.save(s);
    }

    public MedicineSchedule updateSchedule(Long id, String username, String time, Double dose) {
        MedicineSchedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        checkOwner(s.getUser().getUsername(), username);

        if (time != null) s.setTime(time);
        if (dose != null) s.setDose(dose);
        return scheduleRepository.save(s);
    }

    @Transactional
    public MedicineSchedule takeSchedule(Long id, String username) {
        MedicineSchedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        checkOwner(s.getUser().getUsername(), username);

        if (Boolean.TRUE.equals(s.getTaken())) {
            return s;
        }

        s.setTaken(true);

        UserMedicine m = s.getUserMedicine();
        double dose = s.getDose() != null ? s.getDose() : 1.0;
        double newTaken = Math.min(m.getTakenUnits() + dose, m.getTotalUnits());
        m.setTakenUnits(newTaken);
        medicineRepository.save(m);

        return scheduleRepository.save(s);
    }

    public void deleteSchedule(Long id, String username) {
        MedicineSchedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        checkOwner(s.getUser().getUsername(), username);
        scheduleRepository.delete(s);
    }

    // ========================================
    // STREAK
    // ========================================

    @Transactional(readOnly = true)
    public int calculateStreak(String username) {
        List<LocalDate> dates = scheduleRepository.findDistinctDatesByUsername(username);
        if (dates == null || dates.isEmpty()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        int streak = 0;

        for (LocalDate d : dates) {
            if (d == null) continue;

            List<MedicineSchedule> dayItems =
                    scheduleRepository.findByUser_UsernameAndDateOrderByIdAsc(username, d);
            if (dayItems == null || dayItems.isEmpty()) continue;

            boolean allTaken = dayItems.stream()
                    .allMatch(item -> Boolean.TRUE.equals(item.getTaken()));

            if (allTaken) {
                streak++;
            } else if (!d.isAfter(today) && !d.equals(today)) {
                // Прошлый день с непройденным приёмом — рвём streak
                break;
            }
        }
        return streak;
    }

    private void checkOwner(String ownerUsername, String requester) {
        if (!ownerUsername.equals(requester)) {
            throw new RuntimeException("Нет доступа");
        }
    }
}