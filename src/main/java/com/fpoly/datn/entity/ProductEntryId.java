package com.fpoly.datn.entity;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class ProductEntryId implements Serializable {
    private String productId;
    private int size;
    private String color;
}
