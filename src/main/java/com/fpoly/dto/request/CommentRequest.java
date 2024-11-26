package com.fpoly.dto.request;

import com.fpoly.entity.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CommentRequest {

    private Long id;

    private Float star;

    private String content;

    private Product product;

    private List<String> listLink = new ArrayList<>();

}
