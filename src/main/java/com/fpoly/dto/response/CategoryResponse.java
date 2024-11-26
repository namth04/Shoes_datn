package com.fpoly.dto.response;

import com.fpoly.entity.Category;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CategoryResponse {

    private Long id;

    private String name;

    private String imageBanner;

    private Boolean isPrimary;

    private String categoryParentName;

    private Long categoryParentId;

    private List<Category> categories = new ArrayList<>();
}
