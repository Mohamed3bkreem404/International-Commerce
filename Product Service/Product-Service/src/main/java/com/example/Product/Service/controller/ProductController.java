package com.example.Product.Service.controller;


import com.example.Product.Service.abstracts.ProductService;
import com.example.Product.Service.dtos.ProductCreate;
import com.example.Product.Service.dtos.ProductResponse;
import com.example.Product.Service.entities.Product;
import com.example.Product.Service.exceptions.GlobalResponse;
import com.example.Product.Service.reposoitories.ProductRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;


    @GetMapping
    public ResponseEntity<GlobalResponse<?>> findAll(){
        List<ProductResponse> products = productService.findAll();
        return ResponseEntity
                .ok(new GlobalResponse<>(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalResponse<?>> getProductById(@PathVariable UUID id){
        return ResponseEntity
                .ok(new GlobalResponse<>(productService.getProductById(id)));
    }

    @PostMapping
    public ResponseEntity<GlobalResponse<?>> createProduct(
            @Validated
            @RequestBody ProductCreate productCreate
            ){
        productService.addProduct(productCreate);
        return new ResponseEntity<>(new GlobalResponse<>("Product created") , HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delProduct(
            @PathVariable UUID id
    ){
        productService.delOne(id);
        return  ResponseEntity
                .noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @Validated
            @RequestBody ProductResponse productResponse,
            @PathVariable UUID id
            ){
        productService.updateOne(productResponse , id);
        return ResponseEntity
                .ok(new GlobalResponse<>(productResponse));
    }


}
