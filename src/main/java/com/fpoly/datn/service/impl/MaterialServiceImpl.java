package com.fpoly.datn.service.impl;


import com.fpoly.datn.entity.Material;
import com.fpoly.datn.exception.BadRequestException;
import com.fpoly.datn.exception.InternalServerException;
import com.fpoly.datn.exception.NotFoundException;
import com.fpoly.datn.model.mapper.MaterialMapper;
import com.fpoly.datn.model.request.CreateMaterialRequest;
import com.fpoly.datn.repository.MaterialRepository;
import com.fpoly.datn.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static com.fpoly.datn.config.Contant.LIMIT_MATERIAL;

@Component
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public Page<Material> adminGetListMaterials(String id, String name, String status, Integer page) {
        page--;
        if (page < 0) {
            page = 0;
        }
        Pageable pageable = PageRequest.of(page, LIMIT_MATERIAL, Sort.by("created_at").descending());
        return materialRepository.adminGetListMaterials(id, name, status, pageable);

    }

    @Override
    public List<Material> getListMaterial() {
        return materialRepository.findAll();
    }

    @Override
    public Material createMaterial(CreateMaterialRequest createMaterialRequest) {
        Material material = materialRepository.findByName(createMaterialRequest.getName());
        if (material != null) {
            throw new BadRequestException("Tên chất liệu đã tồn tại trong hệ thống, Vui lòng chọn tên khác!");
        }
        material = MaterialMapper.toMaterial(createMaterialRequest);
        materialRepository.save(material);
        return material;
    }

    @Override
    public void updateMaterial(CreateMaterialRequest createMaterialRequest, Long id) {
        Optional<Material> material = materialRepository.findById(id);
        if (material.isEmpty()) {
            throw new NotFoundException("Tên chất liệu không tồn tại!");
        }
        Material ma = materialRepository.findByName(createMaterialRequest.getName());
        if (ma != null) {
            if (!createMaterialRequest.getId().equals(ma.getId()))
                throw new BadRequestException("Tên chất liệu " + createMaterialRequest.getName() + " đã tồn tại trong hệ thống, Vui lòng chọn tên khác!");
        }
        Material rs = material.get();
        rs.setId(id);
        rs.setName(createMaterialRequest.getName());
        rs.setDescription(createMaterialRequest.getDescription());
        rs.setStatus(createMaterialRequest.isStatus());
        rs.setModifiedAt(new Timestamp(System.currentTimeMillis()));

        try {
            materialRepository.save(rs);
        } catch (Exception ex) {
            throw new InternalServerException("Lỗi khi chỉnh sửa chất liệu");
        }
    }

    @Override
    public void deleteMaterial(long id) {
        Optional<Material> material = materialRepository.findById(id);
        if (material.isEmpty()) {
            throw new NotFoundException("Tên chất liệu không tồn tại!");
        }
        try {
            materialRepository.deleteById(id);
        } catch (Exception ex) {
            throw new InternalServerException("Lỗi khi xóa chất liệu!");
        }
    }

    @Override
    public Material getMaterialById(long id) {
        Optional<Material> material = materialRepository.findById(id);
        if (material.isEmpty()) {
            throw new NotFoundException("Tên chất liệu  không tồn tại!");
        }
        return material.get();
    }

    @Override
    public long getCountMaterials() {
        return materialRepository.count();
    }
}
