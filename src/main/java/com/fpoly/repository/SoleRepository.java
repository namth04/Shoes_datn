package com.fpoly.repository;


import com.fpoly.entity.Sole;
import com.fpoly.model.dto.ChartDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoleRepository extends JpaRepository<Sole, Long> {
    Sole findByName(String name);
    @Query(value = "SELECT * FROM sole s " +
            "WHERE s.id LIKE CONCAT('%',?1,'%') " +
            "AND s.name LIKE CONCAT('%',?2,'%') " +
            "AND s.status LIKE CONCAT('%',?3,'%')", nativeQuery = true)
    Page<Sole> adminGetListSoles(String id, String name, String status, Pageable pageable);

    @Query(name = "getProductOrderSoles",nativeQuery = true)
    List<ChartDTO> getProductOrderSoles();

}
