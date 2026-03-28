package com.example.Order.Service.services;

import com.example.Order.Service.abstracts.CartClient;
import com.example.Order.Service.abstracts.OrderService;
import com.example.Order.Service.dtos.CartResponse;
import com.example.Order.Service.dtos.CreateOrderRequest;
import com.example.Order.Service.dtos.OrderResponse;
import com.example.Order.Service.entities.Order;
import com.example.Order.Service.entities.OrderItem;
import com.example.Order.Service.enums.OrderStatus;
import com.example.Order.Service.enums.PaymentStatus;
import com.example.Order.Service.exceptions.CustomerResponseException;
import com.example.Order.Service.exceptions.GlobalResponse;
import com.example.Order.Service.repositories.OrderRepo;
import com.example.Order.Service.utility.SecurityUtility;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private CartClient cartClient;

    @Autowired
    private SecurityUtility securityUtility;

    @Override
    @Transactional
    public OrderResponse checkout(CreateOrderRequest createOrderRequest) {
        UUID userId = securityUtility.getCurrentUserId();

        GlobalResponse<CartResponse> cartWrapper = cartClient.getMyCart();
        CartResponse cartResponse = cartWrapper.getData();

        if (cartResponse == null || cartResponse.items() == null || cartResponse.items().isEmpty()) {
            throw CustomerResponseException.BadRequest("Cart is empty");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.CREATED);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setShippingAddress(createOrderRequest != null ? createOrderRequest.shippingAddress() : null);
        order.setNotes(createOrderRequest != null ? createOrderRequest.notes() : null);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setTotalAmount(cartResponse.totalPrice() != null ? cartResponse.totalPrice() : BigDecimal.ZERO);

        List<OrderItem> orderItems = cartResponse.items()
                .stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(cartItem.productId());
                    orderItem.setProductName(cartItem.productName());
                    orderItem.setPrice(cartItem.price());
                    orderItem.setQuantity(cartItem.quantity());
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .toList();

        order.setItems(orderItems);

        Order savedOrder = orderRepo.save(order);
        cartClient.clearCart();

        return OrderResponse.fromEntity(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders() {
        UUID userId = securityUtility.getCurrentUserId();

        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    @Override
    public OrderResponse getMyOrderById(UUID orderId) {
        UUID userId = securityUtility.getCurrentUserId();
        Order order = orderRepo.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Order not found: " + orderId));

        return OrderResponse.fromEntity(order);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(UUID orderId) {
        UUID userId = securityUtility.getCurrentUserId();
        Order order = orderRepo.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw CustomerResponseException.BadRequest("Order is already cancelled");
        }

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw CustomerResponseException.BadRequest("Completed order cannot be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Order updatedOrder = orderRepo.save(order);
        return OrderResponse.fromEntity(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse markOrderPaid(UUID orderId) {
        UUID userId = securityUtility.getCurrentUserId();
        Order order = orderRepo.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw CustomerResponseException.BadRequest("Cancelled order cannot be paid");
        }

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw CustomerResponseException.BadRequest("Order is already paid");
        }

        order.setStatus(OrderStatus.PAID);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setUpdatedAt(LocalDateTime.now());

        Order updatedOrder = orderRepo.save(order);
        return OrderResponse.fromEntity(updatedOrder);
    }
}
