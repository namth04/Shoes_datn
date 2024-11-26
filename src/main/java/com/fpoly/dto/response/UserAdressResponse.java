package com.fpoly.dto.response;

import com.fpoly.entity.Wards;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class UserAdressResponse {

    private Long id;

    private String fullname;

    private String phone;

    private String streetName;

    private Boolean primaryAddres;

    private Wards wards;

    private UserDto user;

    private Date createdDate;
}
