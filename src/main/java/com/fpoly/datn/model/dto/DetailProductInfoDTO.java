package com.fpoly.datn.model.dto;

import com.fpoly.datn.entity.Brand;
import com.fpoly.datn.entity.Comment;
import com.fpoly.datn.entity.Material;
import com.fpoly.datn.entity.Sole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DetailProductInfoDTO {
    private String id;

    private String name;

    private String slug;

    private long price;

    private int views;

    private long totalSold;

    private ArrayList<String> productImages;

    private ArrayList<String> feedbackImages;

    private long promotionPrice;

    private String couponCode;

    private String description;

    private Brand brand;
    private Sole sole;
    private Material material;

    private List<Comment> comments;
}
