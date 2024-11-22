package com.fpoly.model.mapper;


import com.fpoly.entity.Sole;
import com.fpoly.model.dto.SoleDTO;
import com.fpoly.model.request.CreateSoleRequest;

import java.sql.Timestamp;

public class SoleMapper {
    public static SoleDTO toSoleDTO(Sole sole){
        SoleDTO soleDTO = new SoleDTO();
        soleDTO.setId(sole.getId());
        soleDTO.setName(sole.getName());
        soleDTO.setDescription(sole.getDescription());
        soleDTO.setStatus(sole.isStatus());

        return soleDTO;
    }

    public static Sole toSole(CreateSoleRequest createSoleRequest){
        Sole sole= new Sole();
        sole.setName(createSoleRequest.getName());
        sole.setDescription(createSoleRequest.getDescription());
        sole.setStatus(createSoleRequest.isStatus());
        sole.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return sole;
    }
}
