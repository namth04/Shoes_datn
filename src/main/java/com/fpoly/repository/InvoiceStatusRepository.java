package com.fpoly.repository;

import com.fpoly.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface InvoiceStatusRepository extends JpaRepository<InvoiceStatus,Long> {

    @Query("select i from InvoiceStatus i where i.invoice.id = ?1 and i.status.id = ?2")
    public Optional<InvoiceStatus> findByInvoiceAndStatus(Long invoiceId, Long statusId);
}
