package com.fpoly.serviceImp;

import com.fpoly.dto.response.ProductSizeResponse;
import com.fpoly.entity.ProductSize;
import com.fpoly.repository.ProductSizeRepository;
import com.fpoly.servive.ProductSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductSizeServiceImp implements ProductSizeService {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Override
    public ProductSizeResponse findById(Long id) {
        ProductSize productSize = productSizeRepository.findById(id).get();
        ProductSizeResponse productSizeResponse = new ProductSizeResponse(productSize, productSize.getProductColor(), productSize.getProductColor().getProduct());
        return productSizeResponse;
    }
}
