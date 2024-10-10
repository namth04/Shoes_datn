package com.fpoly.datn.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CreateSoleRequest {
    @NotBlank(message = "Tên đế trống!")
    @Size(max = 50, message = "Tên đế có độ dài tối đa 50 ký tự!")
    private String name; 

    private Long id; 

    private String description; 

    private String thumbnail; 

    private boolean status; 
}
