package com.sansoll.app.service;

import com.sansoll.app.entity.Order;
import com.sansoll.app.entity.OrderItem;
import com.sansoll.app.entity.OrderStatus;
import com.sansoll.app.entity.Product;
import com.sansoll.app.entity.User;
import com.sansoll.app.repository.OrderRepository;
import com.sansoll.app.repository.ProductRepository;
import com.sansoll.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order createOrder(String username, List<OrderItem> items, String shippingAddress) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Товар не найден"));

            int newStock = product.getStock() - item.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Недостаточно товара на складе: " + product.getTitle());
            }
            product.setStock(newStock);
            productRepository.save(product);

            item.setProduct(product);
            item.setOrder(order);
            item.setPriceAtPurchase(product.getPrice());
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setItems(items);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        // Генерируем ЕДИНСТВЕННЫЙ trackNumber
        String trackNumber = "SS" + System.currentTimeMillis() + saved.getId();
        saved.setTrackNumber(trackNumber);

        return orderRepository.save(saved);
    }

    public List<Order> getUserOrders(String username) {
        return orderRepository.findByUser_Username(username);
    }
}