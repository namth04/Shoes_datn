package com.fpoly.dto.response;

import com.fpoly.entity.Product;
import com.fpoly.entity.ProductColor;
import com.fpoly.entity.ProductSize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeResponse {

    private ProductSize productSize;

    private ProductColor productColor;

    private Product product;
}
