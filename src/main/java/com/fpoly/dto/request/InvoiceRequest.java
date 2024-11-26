package com.fpoly.dto.request;

import com.fpoly.enums.PayType;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class InvoiceRequest {

    private PayType payType;

    private String requestIdMomo;

    private String orderIdMomo;

    private Long userAddressId;

    private String voucherCode;

    private String note;

    private String vnpOrderInfo;

    private String urlVnpay;

    private String statusGpay;

    private String merchantOrderId;

    private List<ProductSizeRequest> listProductSize = new ArrayList<>();
}
