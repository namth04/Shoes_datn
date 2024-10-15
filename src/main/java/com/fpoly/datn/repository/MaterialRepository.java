package com.fpoly.datn.repository;

import com.fpoly.datn.entity.Material;
import com.fpoly.datn.model.dto.ChartDTO;
import com.fpoly.datn.model.dto.MaterialDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Material findByName(String name);

    @Query(value = "select * from material m " +
            "where m.id like concat('%',?1,'%') " +
            "and m.name like concat('%',?2,'%') " +
            "and m.status like concat('%',?3,'%')", nativeQuery = true)
    Page<Material> adminGetListMaterial(String id, String name, String status, Pageable pageable);

//    @Query(value = "SELECT m.* FROM material m " +
//            "JOIN product p ON m.id = p.material_id " +
//            "ORDER BY p.name", nativeQuery = true)
//    List<ChartDTO> getProductOrderMaterial();
@Query(name = "getProductOrderMaterials",nativeQuery = true)
List<ChartDTO> getProductOrderMaterials();
}
