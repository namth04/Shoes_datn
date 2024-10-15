package com.fpoly.datn.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class ProductColorId implements Serializable {
    private String productId;
    private String color;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductColorId)) return false;
        ProductColorId that = (ProductColorId) o;
        return productId.equals(that.productId) && color.equals(that.color);
    }

    @Override
    public int hashCode() {
        return 31 * productId.hashCode() + color.hashCode();
    }
}
