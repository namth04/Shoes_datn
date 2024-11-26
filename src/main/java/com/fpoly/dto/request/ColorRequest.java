package com.fpoly.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class ColorRequest {

    private Long id;

    private String colorName;

    private String linkImage;

    private Boolean hasFile = false;

    private List<SizeRequest> size = new ArrayList<>();
}
