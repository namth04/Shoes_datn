package com.fpoly.api;

import com.fpoly.dto.response.InvoiceDetailResponse;
import com.fpoly.repository.InvoiceRepository;
import com.fpoly.servive.InvoiceDetailService;
import com.fpoly.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice-detail")
@CrossOrigin
public class InvoiceDetailApi {

    @Autowired
    private InvoiceDetailService invoiceDetailService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private UserUtils userUtils;

    @GetMapping("/user/find-by-invoice")
    public ResponseEntity<?> findByInvoice(@RequestParam("idInvoice") Long idInvoice){
        List<InvoiceDetailResponse> response = invoiceDetailService.findByInvoice(idInvoice);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/admin/find-by-invoice")
    public ResponseEntity<?> findByInvoiceAdmin(@RequestParam("idInvoice") Long idInvoice){
        List<InvoiceDetailResponse> response = invoiceDetailService.findByInvoice(idInvoice);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
