package com.fpoly.repository;

import com.fpoly.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail,Long> {

    @Query("select i from InvoiceDetail i where i.invoice.id = ?1")
    public List<InvoiceDetail> findByInvoiceId(Long invoiceId);

    @Query("select count(i.id) from InvoiceDetail i where i.productSize.productColor.product.id = ?1")
    public Long countByProduct(Long idProduct);


    @Query("select count(i.id) from InvoiceDetail i where i.productSize.productColor.id = ?1")
    public Long countByProductColor(Long idProductColor);

    @Query("select count(i.id) from InvoiceDetail i where i.productSize.id = ?1")
    public Long countByProductSize(Long idProductSize);
}
