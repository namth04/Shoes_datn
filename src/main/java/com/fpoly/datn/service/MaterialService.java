package com.fpoly.datn.service;

import com.fpoly.datn.entity.Material;
import com.fpoly.datn.model.request.CreateMaterialRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MaterialService {

    Page<Material> adminGetListMaterials(String id, String name, String status, Integer page);

    List<Material> getListMaterial();

    Material createMaterial(CreateMaterialRequest createMaterialRequest);

    void updateMaterial(CreateMaterialRequest createMaterialRequest, Long id);

    void deleteMaterial(long id);

    Material getMaterialById(long id);

    long getCountMaterials();

}
