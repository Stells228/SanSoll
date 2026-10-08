package com.sansoll.app.controller;

import com.sansoll.app.dto.CreateReviewDto;
import com.sansoll.app.entity.Review;
import com.sansoll.app.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getApprovedReviews() {
        return ResponseEntity.ok(reviewService.getApprovedReviews());
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody CreateReviewDto dto) {
        try {
            reviewService.createReview(dto);
            return ResponseEntity.ok(Map.of("message", "Отзыв отправлен на модерацию!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}