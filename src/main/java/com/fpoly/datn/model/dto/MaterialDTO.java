package com.fpoly.datn.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class MaterialDTO {

    private Long id;
    private String name;
    private String description;
    private boolean status;
}
