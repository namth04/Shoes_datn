package com.fpoly.datn.repository;

import com.fpoly.datn.entity.Material;
import com.fpoly.datn.model.dto.ChartDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Material findByName(String name);

    @Query(value = "SELECT * FROM material m " +
            "WHERE (?1 IS NULL OR m.id LIKE CONCAT('%', ?1, '%')) " +
            "AND (?2 IS NULL OR m.name LIKE CONCAT('%', ?2, '%')) " +
            "AND (?3 IS NULL OR m.status LIKE CONCAT('%', ?3, '%'))",
            nativeQuery = true)
    Page<Material> adminGetListMaterials(String id, String name, String status, Pageable pageable);

    @Query(name = "getProductOrderMaterial", nativeQuery = true)
    List<ChartDTO> getProductOrderMaterial();


}
