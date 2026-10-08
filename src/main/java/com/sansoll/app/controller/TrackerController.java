package com.sansoll.app.controller;

import com.sansoll.app.entity.MedicineSchedule;
import com.sansoll.app.entity.UserMedicine;
import com.sansoll.app.service.TrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracker")
public class TrackerController {

    private final TrackerService trackerService;

    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }

    // ========================================
    // АПТЕЧКА
    // ========================================

    @GetMapping("/apteka")
    public ResponseEntity<List<UserMedicine>> getApteka(@RequestParam String username) {
        return ResponseEntity.ok(trackerService.getApteka(username));
    }

    @PostMapping("/apteka/custom")
    public ResponseEntity<?> addCustom(@RequestBody Map<String, Object> payload) {
        try {
            String username = payload.get("username").toString();
            String title = payload.get("title").toString();
            String unit = payload.get("unit") != null ? payload.get("unit").toString() : "таб";
            Double count = payload.get("count") != null
                    ? Double.parseDouble(payload.get("count").toString())
                    : 1.0;

            return ResponseEntity.ok(trackerService.addCustom(username, title, unit, count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/apteka/from-site")
    public ResponseEntity<?> addFromSite(@RequestBody Map<String, Object> payload) {
        try {
            String username = payload.get("username").toString();
            Long productId = Long.valueOf(payload.get("productId").toString());
            Double count = payload.get("count") != null
                    ? Double.parseDouble(payload.get("count").toString())
                    : null;

            return ResponseEntity.ok(trackerService.addFromSite(username, productId, count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/apteka/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String username = payload.get("username").toString();
            Double total = payload.get("totalUnits") != null
                    ? Double.parseDouble(payload.get("totalUnits").toString()) : null;
            Double taken = payload.get("takenUnits") != null
                    ? Double.parseDouble(payload.get("takenUnits").toString()) : null;

            return ResponseEntity.ok(trackerService.update(id, username, total, taken));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/apteka/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam String username) {
        try {
            trackerService.delete(id, username);
            return ResponseEntity.ok(Map.of("message", "Удалено"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ========================================
    // РАСПИСАНИЕ
    // ========================================

    @GetMapping("/schedule")
    public ResponseEntity<List<MedicineSchedule>> getSchedule(
            @RequestParam String username,
            @RequestParam String date) {
        return ResponseEntity.ok(trackerService.getSchedule(username, LocalDate.parse(date)));
    }

    @GetMapping("/schedule/range")
    public ResponseEntity<List<MedicineSchedule>> getScheduleRange(
            @RequestParam String username,
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(trackerService.getScheduleRange(
                username, LocalDate.parse(from), LocalDate.parse(to)));
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> addToSchedule(@RequestBody Map<String, Object> payload) {
        try {
            String username = payload.get("username").toString();
            Long medicineId = Long.valueOf(payload.get("medicineId").toString());
            LocalDate date = LocalDate.parse(payload.get("date").toString());
            String zone = payload.get("zone").toString();
            String time = payload.get("time") != null ? payload.get("time").toString() : "08:00";
            Double dose = payload.get("dose") != null
                    ? Double.valueOf(payload.get("dose").toString()) : 1.0;

            return ResponseEntity.ok(trackerService.addToSchedule(username, medicineId, date, zone, time, dose));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/schedule/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String username = payload.get("username").toString();
            String time = payload.get("time") != null ? payload.get("time").toString() : null;
            Double dose = payload.get("dose") != null
                    ? Double.valueOf(payload.get("dose").toString()) : null;

            return ResponseEntity.ok(trackerService.updateSchedule(id, username, time, dose));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/schedule/{id}/take")
    public ResponseEntity<?> takeSchedule(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String username = payload.get("username").toString();
            return ResponseEntity.ok(trackerService.takeSchedule(id, username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id, @RequestParam String username) {
        try {
            trackerService.deleteSchedule(id, username);
            return ResponseEntity.ok(Map.of("message", "Удалено"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ========================================
    // STREAK
    // ========================================

    @GetMapping("/streak")
    public ResponseEntity<?> getStreak(@RequestParam String username) {
        int streak = trackerService.calculateStreak(username);
        return ResponseEntity.ok(Map.of("streak", streak));
    }
}