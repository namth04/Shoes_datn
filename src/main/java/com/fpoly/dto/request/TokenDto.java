package com.fpoly.dto.request;

import com.fpoly.dto.response.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDto {

    private String token;

    private UserDto user;
}
