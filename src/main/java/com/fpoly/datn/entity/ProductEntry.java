package com.fpoly.datn.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "product_entry")
@IdClass(ProductEntryId.class)
public class ProductEntry {
    @Id
    @Column(name = "size")
    private int size;
    @Id
    @Column(name = "color")
    private String color;
    @Id
    @Column(name = "product_id")
    private String productId;
    @Column(name = "quantity")
    private int quantity;
}
