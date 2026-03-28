package com.example.API.Gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.*;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;


@Configuration
public class GatewayRoutesConfig {

    @Value("${USER_SERVICE_URL:http://localhost:9002}")
    private String userServiceUrl;

    @Value("${PRODUCT_SERVICE_URL:http://localhost:9001}")
    private String productServiceUrl;

    @Value("${CART_SERVICE_URL:http://localhost:9003}")
    private String cartServiceUrl;

    @Value("${ORDER_SERVICE_URL:http://localhost:9004}")
    private String orderServiceUrl;

    @Value("${PAYMENT_SERVICE_URL:http://localhost:9005}")
    private String paymentServiceUrl;

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route("user-service")
                .POST("/api/v1/auth/**" , http())
                .before(uri(userServiceUrl))
                .build()

                .and(route("product-service")
                        .GET("/api/v1/products/**", http())
                        .POST("/api/v1/products/**", http())
                        .PUT("/api/v1/products/**", http())
                        .DELETE("/api/v1/products/**", http())
                        .before(uri(productServiceUrl))
                        .build())

                .and(route("cart-service")
                        .GET("/api/v1/cart/**", http())
                        .POST("/api/v1/cart/**", http())
                        .PUT("/api/v1/cart/**", http())
                        .DELETE("/api/v1/cart/**", http())
                        .before(uri(cartServiceUrl))
                        .build())

                .and(route("order-service")
                        .GET("/api/v1/orders/**", http())
                        .POST("/api/v1/orders/**", http())
                        .PUT("/api/v1/orders/**", http())
                        .DELETE("/api/v1/orders/**", http())
                        .before(uri(orderServiceUrl))
                        .build())

                .and(route("payment-service")
                        .GET("/api/v1/payments/**", http())
                        .POST("/api/v1/payments/**", http())
                        .PUT("/api/v1/payments/**", http())
                        .DELETE("/api/v1/payments/**", http())
                        .before(uri(paymentServiceUrl))
                        .build());
    }

}
