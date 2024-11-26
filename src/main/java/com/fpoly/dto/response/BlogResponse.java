package com.fpoly.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class BlogResponse {

    private Long id;

    private Date createdDate;

    private String title;

    private String description;

    private String content;

    private Boolean primaryBlog;

    private String imageBanner;

    private UserDto user;
}
