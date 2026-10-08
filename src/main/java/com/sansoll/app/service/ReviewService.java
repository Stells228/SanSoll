package com.sansoll.app.service;

import com.sansoll.app.dto.CreateReviewDto;
import com.sansoll.app.entity.Order;
import com.sansoll.app.entity.OrderStatus;
import com.sansoll.app.entity.Product;
import com.sansoll.app.entity.Review;
import com.sansoll.app.entity.User;
import com.sansoll.app.repository.OrderRepository;
import com.sansoll.app.repository.ProductRepository;
import com.sansoll.app.repository.ReviewRepository;
import com.sansoll.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<Review> getApprovedReviews() {
        return reviewRepository.findByIsApprovedTrue();
    }

    @Transactional
    public void createReview(CreateReviewDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        if (reviewRepository.existsByUser_IdAndProduct_Id(user.getId(), product.getId())) {
            throw new RuntimeException("Вы уже оставляли отзыв на этот товар.");
        }

        List<Order> userOrders = orderRepository.findByUser_Username(dto.getUsername());
        boolean hasPurchasedAndDelivered = userOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .flatMap(o -> o.getItems().stream())
                .anyMatch(item -> item.getProduct().getId().equals(product.getId()));

        if (!hasPurchasedAndDelivered) {
            throw new RuntimeException("Вы можете оставить отзыв только после получения товара.");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setText(dto.getText());
        review.setIsApproved(false);

        reviewRepository.save(review);
    }
}