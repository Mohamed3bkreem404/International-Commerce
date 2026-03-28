package com.example.Payment.Service.repositories;

import com.example.Payment.Service.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, UUID> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Payment> findByIdAndUserId(UUID id, UUID userId);

    Optional<Payment> findByOrderIdAndUserId(UUID orderId, UUID userId);
}
