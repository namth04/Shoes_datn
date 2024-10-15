package com.fpoly.datn.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderInfoDTO {
    private long id;

    private long totalPrice;

    private int sizeVn;

    private double sizeUs;

    private double sizeCm;

    private String colorVn;

    private String productName;

    private String productImg;

    public OrderInfoDTO(long id, long totalPrice, int sizeVn, double sizeUs, double sizeCm, String colorVn, String productName, String productImg) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.sizeVn = sizeVn;
        this.sizeUs = sizeUs;
        this.sizeCm = sizeCm;
        this.colorVn = colorVn;
        this.productName = productName;
        this.productImg = productImg;
    }
}