package com.fpoly.datn.model.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.util.List;

@Setter
@Getter
public class ShortProductInfoDTO {
    private String id;
    private String name;
    private long price;
    private List<Integer> availableSizes;
    private List<String> availableColors; // Thêm thuộc tính cho màu sắc

    public ShortProductInfoDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public ShortProductInfoDTO(String id, String name, long price, Object availableSizes, Object availableColors) {
        this.id = id;
        this.name = name;
        this.price = price;

        // Xử lý availableSizes
        if (availableSizes != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                this.availableSizes = mapper.readValue((String) availableSizes, new TypeReference<List<Integer>>() {});
            } catch (IOException e) {
                this.availableSizes = null;
            }
        }

        // Xử lý availableColors
        if (availableColors != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                this.availableColors = mapper.readValue((String) availableColors, new TypeReference<List<String>>() {});
            } catch (IOException e) {
                this.availableColors = null;
            }
        }
    }
}
