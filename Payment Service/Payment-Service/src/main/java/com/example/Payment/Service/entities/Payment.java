package com.example.Payment.Service.entities;

import com.example.Payment.Service.enums.PaymentMethod;
import com.example.Payment.Service.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_record")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID orderId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false, unique = true)
    private String transactionReference;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime paidAt;
}
