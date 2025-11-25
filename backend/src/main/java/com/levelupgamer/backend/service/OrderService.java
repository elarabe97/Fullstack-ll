package com.levelupgamer.backend.service;

import com.levelupgamer.backend.controller.order.OrderDto;
import com.levelupgamer.backend.entity.*;
import com.levelupgamer.backend.repository.OrderRepository;
import com.levelupgamer.backend.repository.ProductRepository;
import com.levelupgamer.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(String userEmail, OrderDto.CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderItem> orderItems = new ArrayList<>();
        int subtotal = 0;

        for (OrderDto.OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findByCode(itemDto.getCode())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getCode()));

            int lineTotal = product.getPrice() * itemDto.getQty();
            subtotal += lineTotal;

            if (product.getStock() < itemDto.getQty()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setStock(product.getStock() - itemDto.getQty());
            productRepository.save(product);

            orderItems.add(OrderItem.builder()
                    .productCode(product.getCode())
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .qty(itemDto.getQty())
                    .build());
        }

        int discount = 0;
        if (user.isDuocEmail()) {
            discount = (int) (subtotal * 0.20);
        }

        int total = subtotal - discount;
        int pointsEarned = (int) Math.floor(total / 1000.0);

        Order order = Order.builder()
                .user(user)
                .subtotal(subtotal)
                .discount(discount)
                .total(total)
                .pointsEarned(pointsEarned)
                .items(orderItems)
                .build();

        // Link items to order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        // Update user points
        user.setPoints(user.getPoints() + pointsEarned);
        userRepository.save(user);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }
}
