package com.example.Order.Service.abstracts;

import com.example.Order.Service.dtos.CreateOrderRequest;
import com.example.Order.Service.dtos.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse checkout(CreateOrderRequest createOrderRequest);

    List<OrderResponse> getMyOrders();

    OrderResponse getMyOrderById(UUID orderId);

    OrderResponse cancelOrder(UUID orderId);

    OrderResponse markOrderPaid(UUID orderId);
}
