package com.fpoly.dto.response;

import com.fpoly.entity.Authority;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class UserDto {

    private Long id;

    private String username;

    private String email;

    private String fullname;

    private String phone;

    private Boolean actived;

    private Date createdDate;

    private String tokenFcm;

    private Authority authorities;
}

