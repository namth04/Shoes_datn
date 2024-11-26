package com.fpoly.dto.request;

import com.fpoly.entity.Category;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class CategoryRequest {

    private Long id;

    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;

    private Boolean isPrimary;

    private String imageBanner;

    private Category category;
}
