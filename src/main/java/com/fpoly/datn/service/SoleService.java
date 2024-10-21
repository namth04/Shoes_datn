package com.fpoly.datn.service;


import com.fpoly.datn.entity.Sole;
import com.fpoly.datn.model.request.CreateSoleRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SoleService {
    Page<Sole> adminGetListSoles(String id, String name, String status, Integer page);

    List<Sole> getListSole();

    Sole createSole(CreateSoleRequest createSoleRequest);

    void updateSole(CreateSoleRequest createSoleRequest, Long id);

    void deleteSole(long id);

    Sole getSoleById(long id);

    long getCountSoles();
}
