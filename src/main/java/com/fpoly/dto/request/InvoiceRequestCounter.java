package com.fpoly.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InvoiceRequestCounter {

    private List<ProductSizeRequest> listProductSize;

    private String fullName;

    private String phone;
}
