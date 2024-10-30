package com.fpoly.datn.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GpayPaymentRequest {
    private String merchantCode;
    private String requestId;
    private int amount;
    private String title;
    private String description;
    private String customerId;
    private String customerName;
    private String phone;
    private String email;
    private String address;
    private String callbackUrl;
    private String webhookUrl;
    private String paymentMethod;
    private String embedData;
    private String paymentType;
    private String signature;
    private String message;
    private boolean success;

}


