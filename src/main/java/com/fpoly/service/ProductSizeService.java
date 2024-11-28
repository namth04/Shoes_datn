package com.fpoly.service;

import com.fpoly.dto.response.ProductSizeResponse;
import org.springframework.stereotype.Service;

@Service
public interface ProductSizeService {
    ProductSizeResponse findById(Long id);

}
