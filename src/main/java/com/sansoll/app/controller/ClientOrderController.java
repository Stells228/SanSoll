package com.sansoll.app.controller;

import com.sansoll.app.dto.CreateOrderDto;
import com.sansoll.app.dto.OrderItemDto;
import com.sansoll.app.entity.Order;
import com.sansoll.app.entity.OrderItem;
import com.sansoll.app.entity.Product;
import com.sansoll.app.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class ClientOrderController {

    private final OrderService orderService;

    public ClientOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderDto dto) {
        try {
            List<OrderItem> items = new ArrayList<>();
            for (OrderItemDto itemDto : dto.getItems()) {
                OrderItem item = new OrderItem();
                Product product = new Product();
                product.setId(itemDto.getId());
                item.setProduct(product);
                item.setQuantity(itemDto.getQuantity());
                items.add(item);
            }

            Order newOrder = orderService.createOrder(dto.getUsername(), items, dto.getAddress());

            return ResponseEntity.ok(Map.of(
                    "message", "Заказ создан",
                    "trackNumber", newOrder.getTrackNumber(),
                    "orderId", newOrder.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ошибка оформления заказа"));
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String username) {
        return ResponseEntity.ok(orderService.getUserOrders(username));
    }
}