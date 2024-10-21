package com.fpoly.datn.service.impl;


import com.fpoly.datn.entity.Sole;
import com.fpoly.datn.exception.BadRequestException;
import com.fpoly.datn.exception.InternalServerException;
import com.fpoly.datn.exception.NotFoundException;
import com.fpoly.datn.model.mapper.SoleMapper;
import com.fpoly.datn.model.request.CreateSoleRequest;
import com.fpoly.datn.repository.SoleRepository;
import com.fpoly.datn.service.SoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static com.fpoly.datn.config.Contant.LIMIT_SOLE;

@Component
public class SoleServiceImpl implements SoleService {

    @Autowired
    private SoleRepository soleRepository;

    @Override
    public Page<Sole> adminGetListSoles(String id, String name, String status, Integer page) {
        page--;
        if (page < 0) {
            page = 0;
        }
        Pageable pageable = PageRequest.of(page, LIMIT_SOLE, Sort.by("created_at").descending());
        return soleRepository.adminGetListSoles(id, name, status, pageable);

    }

    @Override
    public List<Sole> getListSole() {
        return soleRepository.findAll();
    }

    @Override
    public Sole createSole(CreateSoleRequest createSoleRequest) {
        Sole sole = soleRepository.findByName(createSoleRequest.getName());
        if (sole != null) {
            throw new BadRequestException("Tên đế giày đã tồn tại trong hệ thống, Vui lòng chọn tên khác!");
        }
        sole = SoleMapper.toSole(createSoleRequest);
        soleRepository.save(sole);
        return sole;
    }

    @Override
    public void updateSole(CreateSoleRequest createSoleRequest, Long id) {
        Optional<Sole> sole = soleRepository.findById(id);
        if (sole.isEmpty()) {
            throw new NotFoundException("Tên đế giày không tồn tại!");
        }
        Sole sl = soleRepository.findByName(createSoleRequest.getName());
        if (sl != null) {
            if (!createSoleRequest.getId().equals(sl.getId()))
                throw new BadRequestException("Tên đế giày " + createSoleRequest.getName() + " đã tồn tại trong hệ thống, Vui lòng chọn tên khác!");
        }
        Sole so = sole.get();
        so.setId(id);
        so.setName(createSoleRequest.getName());
        so.setDescription(createSoleRequest.getDescription());
        so.setStatus(createSoleRequest.isStatus());
        so.setModifiedAt(new Timestamp(System.currentTimeMillis()));

        try {
            soleRepository.save(so);
        } catch (Exception ex) {
            throw new InternalServerException("Lỗi khi chỉnh sửa nhãn hiệu");
        }
    }

    @Override
    public void deleteSole(long id) {
        Optional<Sole> sole = soleRepository.findById(id);
        if (sole.isEmpty()) {
            throw new NotFoundException("Tên đế giày không tồn tại!");
        }
        try {
            soleRepository.deleteById(id);
        } catch (Exception ex) {
            throw new InternalServerException("Lỗi khi xóa đế giày!");
        }
    }

    @Override
    public Sole getSoleById(long id) {
        Optional<Sole> brand = soleRepository.findById(id);
        if (brand.isEmpty()) {
            throw new NotFoundException("Tên đế giày không tồn tại!");
        }
        return brand.get();
    }

    @Override
    public long getCountSoles() {
        return soleRepository.count();
    }
}
