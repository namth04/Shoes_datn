package com.fpoly.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SoleDTO {
    private long id;
    private String name;
    private String description;
    private boolean status;
}
