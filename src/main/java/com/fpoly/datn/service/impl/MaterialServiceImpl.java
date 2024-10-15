package com.fpoly.datn.service.impl;

import com.fpoly.datn.entity.Brand;
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
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static com.fpoly.datn.config.Contant.LIMIT_BRAND;

@Component
public class MaterialServiceImpl implements MaterialService {
    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public Page<Material> adminGetListMaterial(String id, String name, String status, Integer page) {
        page--;
        if (page<0){
            page = 0;
        }
        Pageable pageable = PageRequest.of(page, LIMIT_BRAND, Sort.by("created_at").descending());
        return materialRepository.adminGetListMaterial(id, name, status, pageable);
    }

    @Override
    public List<Material> getListMaterial() {
        return materialRepository.findAll();
    }

    @Override
    public Material createMaterial(CreateMaterialRequest createMaterialRequest) {
        Material material = materialRepository.findByName(createMaterialRequest.getName());
        if (material != null){
            throw new BadRequestException("Tên chất liệu đã tồn tại trong hệ thống, vui lòng chọn tên khác!");
        }

        material = MaterialMapper.toMaterial(createMaterialRequest);
        materialRepository.save(material);
        return material;
    }

    @Override
    public void updateMaterial(CreateMaterialRequest createMaterialRequest) {
//        Optional<Material> material = materialRepository.findById(id);
//        if (material.isEmpty()) {
//            throw new NotFoundException("Tên nhãn hiệu không tồn tại!");
//        }
//        Material mr = materialRepository.findByName(createMaterialRequest.getName());
//        if (mr != null) {
//            if (!createMaterialRequest.getId().equals(mr.getId()))
//                throw new BadRequestException("Tên nhãn hiệu " + createMaterialRequest.getName() + " đã tồn tại trong hệ thống, Vui lòng chọn tên khác!");
//        }
//        Material mt = material.get();
//        mt.setId(id);
//        mt.setName(createMaterialRequest.getName());
//        mt.setDescription(createMaterialRequest.getDescription());
//        mt.setStatus(createMaterialRequest.isStatus());
//        mt.setModifiedAt(new Timestamp(System.currentTimeMillis()));
//
//        try {
//            materialRepository.save(mt);
//        } catch (Exception ex) {
//            throw new InternalServerException("Lỗi khi chỉnh sửa nhãn hiệu");
//        }
    }

    @Override
    public void deleteMaterial(Long id) {
        Optional<Material> material = materialRepository.findById(id);
        if (material.isEmpty()){
            throw new NotFoundException("Tên chất liệu không tồn tại!");
        }
        try {
            materialRepository.deleteById(id);
        } catch (Exception ex) {
            throw new InternalServerException("Lỗi khi xóa chất liệu!");
        }

    }

    @Override
    public Material getMaterialById(Long id) {
        Optional<Material> material = materialRepository.findById(id);
        if (material.isEmpty()){
            throw new NotFoundException("Tên chất liệu không tồn tại!");
        }
        return material.get();
    }

    @Override
    public long getCountMaterial() {
        return materialRepository.count();
    }
}
