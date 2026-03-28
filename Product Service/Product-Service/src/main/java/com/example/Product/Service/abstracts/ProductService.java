package com.example.Product.Service.abstracts;

import com.example.Product.Service.dtos.ProductCreate;
import com.example.Product.Service.dtos.ProductResponse;
import com.example.Product.Service.entities.Product;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    List<ProductResponse> findAll();
    ProductResponse findByName(String name);
    void addProduct(ProductCreate productCreate);
    void delOne(UUID id);
    void updateOne(ProductResponse productResponse , UUID id);
    ProductResponse getProductById(UUID id);
}
