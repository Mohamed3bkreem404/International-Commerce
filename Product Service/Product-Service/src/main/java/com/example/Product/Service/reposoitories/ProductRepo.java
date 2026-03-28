package com.example.Product.Service.reposoitories;

import com.example.Product.Service.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product , UUID> {
    List<Product> findByNameContainingIgnoreCase(String name);
}
