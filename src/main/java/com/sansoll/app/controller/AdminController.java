package com.sansoll.app.controller;

import com.sansoll.app.dto.ProductDto;
import com.sansoll.app.entity.Category;
import com.sansoll.app.entity.Certificate;
import com.sansoll.app.entity.Order;
import com.sansoll.app.entity.Partner;
import com.sansoll.app.entity.Review;
import com.sansoll.app.entity.User;
import com.sansoll.app.service.AdminCertificateService;
import com.sansoll.app.service.AdminDictService;
import com.sansoll.app.service.AdminOrderService;
import com.sansoll.app.service.AdminProductService;
import com.sansoll.app.service.AdminReviewService;
import com.sansoll.app.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminProductService productService;
    private final AdminOrderService orderService;
    private final AdminUserService userService;
    private final AdminCertificateService certificateService;
    private final AdminReviewService reviewService;
    private final AdminDictService dictService;

    public AdminController(AdminProductService productService,
                           AdminOrderService orderService,
                           AdminUserService userService,
                           AdminCertificateService certificateService,
                           AdminReviewService reviewService,
                           AdminDictService dictService) {
        this.productService = productService;
        this.orderService = orderService;
        this.userService = userService;
        this.certificateService = certificateService;
        this.reviewService = reviewService;
        this.dictService = dictService;
    }

    // ========================================
    // ТОВАРЫ
    // ========================================

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductDto dto) {
        try {
            return ResponseEntity.ok(productService.createProduct(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ошибка создания товара"));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDto dto) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ошибка обновления товара"));
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Товар удален"));
    }

    @PutMapping("/products/{id}/visibility")
    public ResponseEntity<?> toggleVisibility(@PathVariable Long id,
                                              @RequestBody Map<String, Boolean> payload) {
        try {
            productService.toggleVisibility(id, payload.get("isActive"));
            return ResponseEntity.ok(Map.of("message", "Статус обновлен"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/products/upload-image")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = productService.uploadImage(file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ========================================
    // ЗАКАЗЫ
    // ========================================

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> payload) {
        try {
            orderService.updateStatus(id, payload.get("status"));
            return ResponseEntity.ok(Map.of("message", "Статус обновлен"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ошибка обновления статуса"));
        }
    }

    // ========================================
    // ПОЛЬЗОВАТЕЛИ
    // ========================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                            @RequestBody Map<String, String> payload) {
        try {
            userService.updateUserRole(id, payload.get("role"));
            return ResponseEntity.ok(Map.of("message", "Роль обновлена"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ========================================
    // СЕРТИФИКАТЫ
    // ========================================

    @GetMapping("/certificates")
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAll());
    }

    @PostMapping("/certificates")
    public ResponseEntity<?> uploadCertificate(@RequestParam("file") MultipartFile file,
                                               @RequestParam("title") String title) {
        try {
            return ResponseEntity.ok(certificateService.upload(file, title));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/certificates/{id}")
    public ResponseEntity<?> updateCertificate(@PathVariable Long id,
                                               @RequestBody Certificate certData) {
        certificateService.updateTitle(id, certData.getTitle());
        return ResponseEntity.ok(Map.of("message", "Название обновлено"));
    }

    @PutMapping("/certificates/reorder")
    public ResponseEntity<?> reorderCertificates(@RequestBody List<Certificate> certs) {
        certificateService.reorder(certs);
        return ResponseEntity.ok(Map.of("message", "Порядок обновлен"));
    }

    @DeleteMapping("/certificates/{id}")
    public ResponseEntity<?> deleteCertificate(@PathVariable Long id) {
        certificateService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Сертификат удален"));
    }

    // ========================================
    // ОТЗЫВЫ
    // ========================================

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<?> approveReview(@PathVariable Long id) {
        reviewService.approve(id);
        return ResponseEntity.ok(Map.of("message", "Отзыв одобрен"));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Отзыв удален"));
    }

    // ========================================
    // СПРАВОЧНИКИ
    // ========================================

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(dictService.createCategory(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        dictService.deleteCategory(id);
        return ResponseEntity.ok(Map.of("message", "Категория удалена"));
    }

    @PostMapping("/partners")
    public ResponseEntity<Partner> createPartner(@RequestBody Partner partner) {
        return ResponseEntity.ok(dictService.createPartner(partner));
    }

    @DeleteMapping("/partners/{id}")
    public ResponseEntity<?> deletePartner(@PathVariable Long id) {
        dictService.deletePartner(id);
        return ResponseEntity.ok(Map.of("message", "Производитель удален"));
    }
}