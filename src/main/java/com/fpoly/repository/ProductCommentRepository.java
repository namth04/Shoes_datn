package com.fpoly.repository;

import com.fpoly.entity.ProductComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductCommentRepository extends JpaRepository<ProductComment,Long> {

    @Query("select p from ProductComment p where p.product.id = ?1")
    public List<ProductComment> findByProductId(Long productId);
}
