package com.sansoll.app.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String categoryName;
    private String partnerName;
    private List<String> features;
    private List<String> imageUrls;
    private Double averageRating; // Типа средний рейтинг товара
    private String composition;
    private String indications;
    private String dosage;
    private String contraindications;
    private String certificate;
    private String manufacturer;
    private String dosageForm;
    private String defaultDosage;
    private Boolean isActive; 
    private BigDecimal discount;
    private Integer stock;
    private Boolean isBad;
    private Long categoryId;
    private Long partnerId;
    private Integer packSize;
    private String unit;
}