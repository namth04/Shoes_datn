package com.fpoly.datn.model.mapper;

import com.fpoly.datn.entity.Brand;
import com.fpoly.datn.entity.Material;
import com.fpoly.datn.model.dto.MaterialDTO;
import com.fpoly.datn.model.request.CreateMaterialRequest;

import java.sql.Timestamp;

public class MaterialMapper {
    public static MaterialDTO toMaterialDTO(Material material){
        MaterialDTO materialDTO = new MaterialDTO();
        materialDTO.setId(material.getId());
        materialDTO.setName(material.getName());
        materialDTO.setDescription(material.getDescription());
        materialDTO.setStatus(material.isStatus());
        return materialDTO;

    }

    public static Material toMaterial(CreateMaterialRequest createMaterialRequest){
        Material material = new Material();
        material.setName(createMaterialRequest.getName());
        material.setDescription(createMaterialRequest.getDescription());
        material.setStatus(createMaterialRequest.isStatus());
        material.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return material;
    }
}
