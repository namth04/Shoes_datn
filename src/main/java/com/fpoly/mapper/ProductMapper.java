package com.fpoly.mapper;

import com.fpoly.dto.request.ProductRequest;
import com.fpoly.dto.response.ProductResponse;
import com.fpoly.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    private ModelMapper mapper;

    public ProductResponse productToProResponse(Product product){
        ProductResponse response = mapper.map(product, ProductResponse.class);
        return response;
    }

    public Product productRequestToProduct(ProductRequest productRequest){
        Product product = mapper.map(productRequest, Product.class);
        return product;
    }

    public List<ProductResponse> listProductToProResponse(List<Product> list){
        List<ProductResponse> responses = list.stream().map(post -> mapper.map(post, ProductResponse.class))
                .collect(Collectors.toList());
        return responses;
    }
}
