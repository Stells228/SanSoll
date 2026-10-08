package com.sansoll.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_medicines")
@Getter
@Setter
public class UserMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "orders", "reviews"})
    private User user;

    /** Ссылка на товар. NULL для кастомных препаратов (см. customTitle). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "category", "partner", "reviews"})
    private Product product;

    @Column(nullable = false)
    private Double totalUnits = 0.0;

    @Column(nullable = false)
    private Double takenUnits = 0.0;

    /** Пользователь добавил препарат вручную (не из каталога). */
    @Column(name = "is_custom", nullable = false)
    private Boolean isCustom = false;

    /** Название кастомного препарата (если isCustom == true). */
    @Column(name = "custom_title", length = 255)
    private String customTitle;

    /** Единица измерения: таб, мл, гр, капс. */
    @Column(name = "custom_unit", length = 20)
    private String customUnit;

    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt = LocalDateTime.now();
}