package com.fpoly.datn.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderDetailDTO {
    private long id;

    private long totalPrice;

    private long productPrice;

    private String receiverName;

    private String receiverPhone;

    private String receiverAddress;

    private int status;

    private String statusText;

    private int sizeVn;

    private double sizeUs;

    private double sizeCm;

    private String colorVn;

    private String productName;

    private String productImg;

    private int paymentMethod;

    private String paymentStatus;

    public OrderDetailDTO(long id, long totalPrice, long productPrice, String receiverName, String receiverPhone, String receiverAddress, int status, String statusText, int sizeVn, double sizeUs, double sizeCm, String colorVn, String productName, String productImg, int paymentMethod, String paymentStatus) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.productPrice = productPrice;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.receiverAddress = receiverAddress;
        this.status = status;
        this.statusText = statusText;
        this.sizeVn = sizeVn;
        this.sizeUs = sizeUs;
        this.sizeCm = sizeCm;
        this.colorVn = colorVn;
        this.productName = productName;
        this.productImg = productImg;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }
}
