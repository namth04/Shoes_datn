package com.fpoly.servive;

import com.fpoly.dto.response.InvoiceDetailResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InvoiceDetailService {

    public List<InvoiceDetailResponse> findByInvoice(Long idInvoice);
}
