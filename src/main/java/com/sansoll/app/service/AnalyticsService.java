package com.sansoll.app.service;

import com.sansoll.app.entity.LoginLog;
import com.sansoll.app.repository.AnalyticsRepository;
import com.sansoll.app.repository.LoginLogRepository;
import com.sansoll.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private LoginLogRepository loginLogRepository;
    @Autowired
    private AnalyticsRepository analyticsRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getVisitsByDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate fromDate = today.minusDays(days - 1);

        // Заполняем нулями все дни
        Map<LocalDate, Long> counts = new LinkedHashMap<>();
        for (int i = 0; i < days; i++) {
            counts.put(fromDate.plusDays(i), 0L);
        }

        // Вытаскиваем даты и группируем
        List<LocalDateTime> dates = loginLogRepository.findLoginDatesSince(fromDate.atStartOfDay());
        for (LocalDateTime dt : dates) {
            LocalDate d = dt.toLocalDate();
            if (counts.containsKey(d)) {
                counts.put(d, counts.get(d) + 1);
            }
        }

        // Формируем ответ
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<LocalDate, Long> e : counts.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("date", e.getKey().toString());
            item.put("count", e.getValue());
            result.add(item);
        }
        return result;
    }

    public List<Map<String, Object>> getRevenueByDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate fromDate = today.minusDays(days - 1);

        Map<LocalDate, Double> sums = new LinkedHashMap<>();
        for (int i = 0; i < days; i++) {
            sums.put(fromDate.plusDays(i), 0.0);
        }

        List<Object[]> rows = analyticsRepository.findOrderDatesAndAmountsSince(fromDate.atStartOfDay());
        for (Object[] row : rows) {
            LocalDateTime dt = (LocalDateTime) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            LocalDate d = dt.toLocalDate();
            if (sums.containsKey(d)) {
                sums.put(d, sums.get(d) + amount.doubleValue());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<LocalDate, Double> e : sums.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("date", e.getKey().toString());
            item.put("revenue", e.getValue());
            result.add(item);
        }
        return result;
    }

    public List<Map<String, Object>> getTopProducts(int limit) {
        List<Object[]> rows = analyticsRepository.topProducts();
        List<Map<String, Object>> result = new ArrayList<>();
        int count = 0;
        for (Object[] row : rows) {
            if (count >= limit)
                break;
            Map<String, Object> item = new HashMap<>();
            item.put("productId", row[0]);
            item.put("title", row[1]);
            item.put("quantity", ((Number) row[2]).longValue());
            result.add(item);
            count++;
        }
        return result;
    }

    public void logLogin(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            LoginLog log = new LoginLog();
            log.setUser(user);
            loginLogRepository.save(log);
        });
    }
}