package com.example.Cart.Service.repositories;

import com.example.Cart.Service.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CartItemREpo extends JpaRepository<CartItem , UUID> {
}
