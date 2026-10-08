package com.sansoll.app.service;

import com.sansoll.app.dto.ProductDto;
import com.sansoll.app.entity.Product;
import com.sansoll.app.mapper.ProductMapper;
import com.sansoll.app.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public Page<ProductDto> getProducts(int page, int size,
                                        List<Long> categoryIds, List<Long> partnerIds,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        boolean noCategories = categoryIds == null || categoryIds.isEmpty();
        boolean noPartners = partnerIds == null || partnerIds.isEmpty();
        boolean noSearch = search == null || search.trim().isEmpty();

        Page<Product> productsPage;
        if (noCategories && noPartners && minPrice == null && maxPrice == null && noSearch) {
            productsPage = productRepository.findByIsActiveTrue(pageable);
        } else {
            String searchParam = noSearch ? "" : search.trim();
            productsPage = productRepository.findFilteredProducts(
                    noCategories ? null : categoryIds,
                    noPartners ? null : partnerIds,
                    minPrice, maxPrice, searchParam, pageable
            );
        }

        return productsPage.map(productMapper::toDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));
        return productMapper.toDto(product);
    }
}