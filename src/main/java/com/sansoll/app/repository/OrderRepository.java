package com.sansoll.app.repository;

import com.sansoll.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ВАЖНО: JOIN FETCH заставляет БД сразу загрузить товары (items) и их продукты
    // (product)
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.user.username = :username")
    List<Order> findByUser_Username(@Param("username") String username);
}