package com.sansoll.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "medicine_schedules")
@Getter
@Setter
public class MedicineSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "orders", "reviews"})
    private User user;

    // Из какой аптечки взяли (для кастомных — тоже ссылка на UserMedicine)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_medicine_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private UserMedicine userMedicine;

    @Column(nullable = false)
    private LocalDate date;

    // "morning" / "afternoon" / "evening"
    @Column(nullable = false, length = 20)
    private String zone;

    // "08:00"
    @Column(length = 5)
    private String time;

    // 0.5, 1, 1.5 и т.д.
    @Column(nullable = false)
    private Double dose = 1.0;

    @Column(nullable = false)
    private Boolean taken = false;
}