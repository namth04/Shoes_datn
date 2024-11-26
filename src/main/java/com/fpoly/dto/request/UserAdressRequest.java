package com.fpoly.dto.request;

import com.fpoly.entity.Wards;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class UserAdressRequest {

    private Long id;

    private String fullname;

    private String phone;

    private String streetName;

    private Boolean primaryAddres;

    @NotNull(message = "Xã/ thị trấn không được để trống")
    private Wards wards;
}
