package com.fpoly.datn.repository;

import com.fpoly.datn.entity.ProductEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductEntryRepository extends JpaRepository<ProductEntry, Long> {
    Optional<ProductEntry> findByProductIdAndSizeAndColor(String id, int size, String color);

    // Lấy size của sản phẩm
    @Query(nativeQuery = true, value = "SELECT pe.size FROM product_entry pe WHERE pe.product_id = ?1 AND pe.quantity > 0")
    List<Integer> findAllSizeOfProduct(String id);
    // Lấy danh sách màu sắc của sản phẩm
    @Query(nativeQuery = true, value = "SELECT DISTINCT pe.color FROM product_entry pe WHERE pe.product_id = ?1 AND pe.quantity > 0")
    List<String> findAllColorsOfProduct(String productId);

    // Lấy tất cả các mục sản phẩm theo productId
    List<ProductEntry> findByProductId(String id);

    // Kiểm tra sản phẩm và kích thước có sẵn
    @Query(nativeQuery = true, value = "SELECT * FROM product_entry WHERE product_id = ?1 AND size = ?2 AND color = ?3 AND quantity > 0")
    ProductEntry checkProductEntryAvailable(String id, int size, String color);


    // Trừ 1 sản phẩm theo kích thước
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE product_entry SET quantity = quantity - 1 WHERE product_id = ?1 AND size = ?2 AND color = ?3")
    void minusOneProductByEntry(String id, int size,String color);

    // Cộng 1 sản phẩm theo kích thước
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE product_entry SET quantity = quantity + 1 WHERE product_id = ?1 AND size = ?2 AND color = ?3")
    void plusOneProductByEntry(String id, int size, String color);


    // Xóa tất cả sản phẩm theo productId
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM product_entry WHERE product_id = ?1")
    void deleteByProductId(String id);


}
