package com.example.Product.Service.services;

import com.example.Product.Service.abstracts.ProductService;
import com.example.Product.Service.config.CacheNames;
import com.example.Product.Service.dtos.ProductCreate;
import com.example.Product.Service.dtos.ProductResponse;
import com.example.Product.Service.entities.Product;
import com.example.Product.Service.exceptions.CustomerResponseException;
import com.example.Product.Service.reposoitories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class ProductServiceImp implements ProductService {


    @Autowired
    private ProductRepo productRepo;

    @Override
    @Cacheable(cacheNames = CacheNames.PRODUCTS_LIST, sync = true)
    public List<ProductResponse> findAll() {
        List<Product> products = productRepo.findAll();
        return products
                .stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    @Override
    @Cacheable(
            cacheNames = CacheNames.PRODUCTS_BY_NAME,
            key = "#root.target.normalizeNameKey(#name)",
            sync = true
    )
    public ProductResponse findByName(String name) {
        String normalizedName = normalizeNameKey(name);
        if (normalizedName.isBlank()) {
            throw CustomerResponseException.ResourceNotFound("Product name is required");
        }

        Product product = productRepo
                .findByNameContainingIgnoreCase(normalizedName)
                .stream()
                .findFirst()
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Product : " + normalizedName + " Not found !"));
        return ProductResponse.fromEntity(product);
    }


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_LIST, allEntries = true),
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_BY_NAME, allEntries = true)
    })
    public void addProduct(ProductCreate productCreate) {

        Product product = new Product();

        product.setName(productCreate.name());
        product.setPrice(productCreate.price());
        product.setDescription(productCreate.description());
        product.setStockQuantity(productCreate.stockQuantity());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now().plusHours(2));

        productRepo.save(product);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_BY_ID, key = "#id"),
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_BY_NAME, allEntries = true),
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_LIST, allEntries = true)
    })
    public void delOne(UUID id) {
        Product product = productRepo
                .findById(id)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Account with id: " + id + " not found !"));

        productRepo.delete(product);
    }

    //it suppose to make productUpdate dto but im lazy to do it lol
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_BY_ID, key = "#id"),
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_BY_NAME, allEntries = true),
            @CacheEvict(cacheNames = CacheNames.PRODUCTS_LIST, allEntries = true)
    })
    public void updateOne(ProductResponse productResponse, UUID id) {
        Product product = productRepo
                .findById(id)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Account with id: " + id + " not found !"));

        product.setName(productResponse.name());
        product.setPrice(productResponse.price());
        product.setDescription(productResponse.description());
        product.setStockQuantity(productResponse.stockQuantity());
        product.setUpdatedAt(LocalDateTime.now().plusHours(2));

        productRepo.save(product);

    }

    @Override
    @Cacheable(cacheNames = CacheNames.PRODUCTS_BY_ID, key = "#id", sync = true)
    public ProductResponse getProductById(UUID id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> CustomerResponseException.ResourceNotFound("Product with id: " + id + " not found !"));
        return ProductResponse.fromEntity(product);
    }

    public String normalizeNameKey(String name) {
        if (name == null) {
            return "";
        }
        return name.trim().toLowerCase(Locale.ROOT);
    }
}
