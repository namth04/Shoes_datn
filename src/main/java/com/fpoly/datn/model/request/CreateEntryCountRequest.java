package com.fpoly.datn.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CreateEntryCountRequest {
    @NotNull(message = "Size không được để trống")
    private int size;
    @NotNull(message = "Màu sắc không được để trống")
    private String color;

    @Min(0)
    private int count;

    @NotEmpty(message = "Mã sản phẩm trống")
    @NotNull(message = "Mã sản phẩm trống")
    @JsonProperty("product_id")
    private String productId;
}
