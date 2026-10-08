package com.sansoll.app.service;

import com.sansoll.app.entity.Order;
import com.sansoll.app.entity.OrderStatus;
import com.sansoll.app.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminOrderService {

    private static final Logger log = LoggerFactory.getLogger(AdminOrderService.class);

    private final OrderRepository orderRepository;
    private final TrackerService trackerService;

    public AdminOrderService(OrderRepository orderRepository, TrackerService trackerService) {
        this.orderRepository = orderRepository;
        this.trackerService = trackerService;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public void updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));

        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = OrderStatus.valueOf(status);

        log.info("Смена статуса заказа #{}: {} → {}", id, oldStatus, newStatus);

        order.setStatus(newStatus);
        order.getItems().size(); // принудительная загрузка lazy-коллекции

        if (newStatus == OrderStatus.DELIVERED && oldStatus != OrderStatus.DELIVERED) {
            log.info("Заказ #{} доставлен — наполняем аптечку", id);
            trackerService.replenishFromOrder(order);
        }

        orderRepository.save(order);
    }
}