package com.fpoly.datn.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UpdateDetailOrder {
    @NotBlank(message = "Sản phẩm trống")
    @JsonProperty("product_id")
    private String productId;

    @Min(value = 35)
    @Max(value = 42)
    private int size;
    @JsonProperty("color")
    private String color;

    @JsonProperty("coupon_code")
    private String couponCode;

    @JsonProperty("total_price")
    private long totalPrice;

    @JsonProperty("product_price")
    private long productPrice;

    @JsonProperty("payment_method")
    private int paymentMethod;

    @JsonProperty("payment_status")
    private String paymentStatus;

}
