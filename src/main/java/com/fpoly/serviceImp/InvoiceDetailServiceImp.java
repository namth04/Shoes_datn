package com.fpoly.serviceImp;

import com.fpoly.dto.response.InvoiceDetailResponse;
import com.fpoly.entity.InvoiceDetail;
import com.fpoly.mapper.InvoiceDetailMapper;
import com.fpoly.repository.InvoiceDetailRepository;
import com.fpoly.servive.InvoiceDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class InvoiceDetailServiceImp implements InvoiceDetailService {

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private InvoiceDetailMapper invoiceDetailMapper;

    @Override
    public List<InvoiceDetailResponse> findByInvoice(Long idInvoice) {
        List<InvoiceDetail> list = invoiceDetailRepository.findByInvoiceId(idInvoice);
        List<InvoiceDetailResponse> result = new ArrayList<>();
        for(InvoiceDetail d : list){
            result.add(invoiceDetailMapper.invoiceDetailToResponse(d));
        }
        return result;
    }
}
