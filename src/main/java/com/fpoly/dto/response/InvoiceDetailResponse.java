package com.fpoly.dto.response;

import com.fpoly.entity.Invoice;
import com.fpoly.entity.ProductColor;
import com.fpoly.entity.ProductSize;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceDetailResponse {

    private Long id;

    private Integer quantity;

    private Double price;

    private String productName;

    private String linkImage;

    private String colorName;

    private ProductSize productSize;

    private ProductColor productColor;

    private ProductResponse product;

    private Invoice invoice;
}
