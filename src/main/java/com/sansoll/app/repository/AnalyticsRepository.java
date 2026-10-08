package com.sansoll.app.repository;

import com.sansoll.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Order, Long> {

    // Вытаскиваем пары (createdAt, totalAmount), группировать будем в Java
    @Query("SELECT o.createdAt, o.totalAmount FROM Order o " +
            "WHERE o.createdAt >= :from " +
            "AND o.status <> com.sansoll.app.entity.OrderStatus.CANCELLED")
    List<Object[]> findOrderDatesAndAmountsSince(@Param("from") LocalDateTime from);

    // Топ-N: отдельный запрос, тут всё ок
    @Query("SELECT i.product.id, i.product.title, SUM(i.quantity) " +
            "FROM OrderItem i " +
            "WHERE i.order.status <> com.sansoll.app.entity.OrderStatus.CANCELLED " +
            "GROUP BY i.product.id, i.product.title " +
            "ORDER BY SUM(i.quantity) DESC")
    List<Object[]> topProducts();
}