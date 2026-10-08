package com.sansoll.app.mapper;

import com.sansoll.app.dto.ProductDto;
import com.sansoll.app.entity.Product;
import com.sansoll.app.entity.ProductImage;
import com.sansoll.app.entity.Review;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductMapper {

    public ProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }

        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setFeatures(product.getFeatures());
        dto.setComposition(product.getComposition());
        dto.setIndications(product.getIndications());
        dto.setDosage(product.getDosage());
        dto.setContraindications(product.getContraindications());
        dto.setCertificate(product.getCertificate());
        dto.setManufacturer(product.getManufacturer());
        dto.setDosageForm(product.getDosageForm());
        dto.setDefaultDosage(product.getDefaultDosage());
        dto.setIsActive(product.getIsActive());
        dto.setDiscount(product.getDiscount());
        dto.setStock(product.getStock());
        dto.setIsBad(product.getIsBad());
        dto.setPackSize(product.getPackSize());
        dto.setUnit(product.getUnit());

        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategoryId(product.getCategory().getId());
        }

        if (product.getPartner() != null) {
            dto.setPartnerName(product.getPartner().getName());
            dto.setPartnerId(product.getPartner().getId());
        }

        dto.setImageUrls(collectImageUrls(product.getImages()));
        dto.setAverageRating(calculateAverageRating(product.getReviews()));

        return dto;
    }

    private List<String> collectImageUrls(List<ProductImage> images) {
        List<String> urls = new ArrayList<>();
        if (images == null) {
            return urls;
        }
        for (ProductImage img : images) {
            if (img != null && img.getImageUrl() != null) {
                urls.add(img.getImageUrl());
            }
        }
        return urls;
    }

    private Double calculateAverageRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }

        int sum = 0;
        int count = 0;
        for (Review review : reviews) {
            if (review != null && review.getRating() != null) {
                sum += review.getRating();
                count++;
            }
        }
        return count > 0 ? (double) sum / count : 0.0;
    }
}