package com.sansoll.app.repository;

import com.sansoll.app.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** Одобренные отзывы для отображения на сайте. */
    List<Review> findByIsApprovedTrue();

    /** Проверка: оставлял ли пользователь отзыв на этот товар. */
    boolean existsByUser_IdAndProduct_Id(Long userId, Long productId);
}