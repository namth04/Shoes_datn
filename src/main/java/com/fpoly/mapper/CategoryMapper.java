package com.fpoly.mapper;

import com.fpoly.dto.request.CategoryRequest;
import com.fpoly.dto.response.CategoryResponse;
import com.fpoly.entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CategoryMapper {

    @Autowired
    private ModelMapper mapper;

    public Category categoryRequestToCategory(CategoryRequest request){
        Category category = mapper.map(request, Category.class);
        return category;
    }

    public CategoryResponse categoryToCategoryResponse(Category category){
        CategoryResponse categoryResponse = mapper.map(category, CategoryResponse.class);
        if(category.getCategory() != null){
            categoryResponse.setCategoryParentId(category.getCategory().getId());
            categoryResponse.setCategoryParentName(category.getCategory().getName());
        }
        return categoryResponse;
    }

    public List<CategoryResponse> listCategoryToListCategoryResponse(List<Category> list){
        List<CategoryResponse> res = new ArrayList<>();
        for(Category c : list){
            res.add(categoryToCategoryResponse(c));
        }
        return res;
    }
}
