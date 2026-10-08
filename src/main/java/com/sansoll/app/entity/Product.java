package com.sansoll.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id")
    private Partner partner;

    /** Список преимуществ товара (JSONB в PostgreSQL). */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> features;

    /** Состав. */
    @Column(columnDefinition = "TEXT")
    private String composition;

    /** Показания к применению. */
    @Column(columnDefinition = "TEXT")
    private String indications;

    /** Способ применения. */
    @Column(columnDefinition = "TEXT")
    private String dosage;

    /** Противопоказания. */
    @Column(columnDefinition = "TEXT")
    private String contraindications;

    /** Номер сертификата. */
    @Column(length = 255)
    private String certificate;

    /** Производитель (текстовое название). */
    @Column(length = 255)
    private String manufacturer;

    /** Сколько единиц в упаковке (80 таблеток, 235 мл). */
    @Column(name = "pack_size")
    private Integer packSize = 1;

    /** Единица измерения: таб, мл, гр, пакетик, стик. */
    @Column(name = "unit", length = 20)
    private String unit;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /** Форма выпуска: Капсулы, Порошок, Жидкость. */
    @Column(name = "dosage_form", length = 50)
    private String dosageForm;

    /** Дозировка по умолчанию: "2 таблетки", "1 ч.л.", "5 мл". */
    @Column(name = "default_dosage", length = 100)
    private String defaultDosage;

    /** Скидка в рублях. */
    @Column(name = "discount", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "is_bad")
    private Boolean isBad = false;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();
}