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

    List<Integer> availableEntry;


    public ShortProductInfoDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public ShortProductInfoDTO(String id, String name, long price, Object availableEntry) {
        this.id = id;
        this.name = name;
        this.price = price;

        // Xử lý danh sách entry có sẵn
        if (availableEntry != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                this.availableEntry = mapper.readValue((String) availableEntry, new TypeReference<List<Integer>>() {
                });
            } catch (IOException e) {
                this.availableEntry = null;
            }
        }
    }
}
