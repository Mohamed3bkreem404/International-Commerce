package com.example.Cart.Service.services;

import com.example.Cart.Service.abstracts.CartService;
import com.example.Cart.Service.abstracts.ProductClient;
import com.example.Cart.Service.dtos.AddCartItemRequest;
import com.example.Cart.Service.dtos.CartResponse;
import com.example.Cart.Service.dtos.ProductResponse;
import com.example.Cart.Service.dtos.UpdateCartItemRequest;
import com.example.Cart.Service.entities.Cart;
import com.example.Cart.Service.entities.CartItem;
import com.example.Cart.Service.exceptions.CustomerResponseException;
import com.example.Cart.Service.exceptions.GlobalResponse;
import com.example.Cart.Service.repositories.CartRepo;
import com.example.Cart.Service.utility.SecurityUtility;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartServiceImp implements CartService {

    @Autowired
    private SecurityUtility securityUtility;

    @Autowired
    private CartRepo cartRepo;


    @Autowired
    private ProductClient productClient;





    @Override
    @Transactional
    public CartResponse getMyCart() {

        UUID userId = securityUtility.getCurrentUserId();

        Cart cart = getOrCreateCart(userId);

        return CartResponse.fromEntity(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(AddCartItemRequest addCartItemRequest) {

        if (addCartItemRequest.quantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        GlobalResponse<ProductResponse> response =
                productClient.getProductById(addCartItemRequest.productId());

        ProductResponse productResponse = response.getData();

        BigDecimal price = productResponse.price();

        UUID userId = securityUtility.getCurrentUserId();

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existItem = cart.getItems()
                .stream()
                .filter(item -> item.getProductId().equals(addCartItemRequest.productId()))
                .findFirst();

        if (existItem.isPresent())
        {
            CartItem item = existItem.get();
            item.setQuantity(item.getQuantity() + addCartItemRequest.quantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductName(productResponse.name());
            newItem.setProductId(addCartItemRequest.productId());
            newItem.setQuantity(addCartItemRequest.quantity());
            newItem.setPrice(price);
            newItem.setCart(cart);

            cart.getItems().add(newItem);
        }
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepo.save(cart);
        return CartResponse.fromEntity(cart);

    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(UUID productId, UpdateCartItemRequest updateCartItemRequest) {
        UUID userId = securityUtility.getCurrentUserId();
        Cart cart = getCartOrThrow(userId);

        CartItem item = findItemOrThrow(cart, productId);
        item.setQuantity(updateCartItemRequest.quantity());
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepo.save(cart);
        return CartResponse.fromEntity(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(UUID productId) {
        UUID userId = securityUtility.getCurrentUserId();
        Cart cart = getCartOrThrow(userId);

        CartItem item = findItemOrThrow(cart, productId);
        cart.getItems().remove(item);
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepo.save(cart);
        return CartResponse.fromEntity(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart() {
        UUID userId = securityUtility.getCurrentUserId();
        Cart cart = getOrCreateCart(userId);

        cart.getItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepo.save(cart);
        return CartResponse.fromEntity(cart);
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepo.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
    }

    private Cart getCartOrThrow(UUID userId) {
        return cartRepo.findByUserId(userId)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Cart not found for user: " + userId));
    }

    private CartItem findItemOrThrow(Cart cart, UUID productId) {
        return cart.getItems()
                .stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Cart item not found for product: " + productId));
    }

    private Cart createNewCart(UUID userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepo.save(cart);
    }

}
