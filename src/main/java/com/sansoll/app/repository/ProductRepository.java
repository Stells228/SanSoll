package com.sansoll.app.repository;

import com.sansoll.app.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

       Page<Product> findByIsActiveTrue(Pageable pageable);
       @Query("SELECT p FROM Product p WHERE p.isActive = true " +
                     "AND (:categoryIds IS NULL OR p.category.id IN :categoryIds) " +
                     "AND (:partnerIds IS NULL OR p.partner.id IN :partnerIds) " +
                     "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
                     "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
                     "AND (:search = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')))")
       Page<Product> findFilteredProducts(
                     @Param("categoryIds") List<Long> categoryIds,
                     @Param("partnerIds") List<Long> partnerIds,
                     @Param("minPrice") BigDecimal minPrice,
                     @Param("maxPrice") BigDecimal maxPrice,
                     @Param("search") String search,
                     Pageable pageable);
}