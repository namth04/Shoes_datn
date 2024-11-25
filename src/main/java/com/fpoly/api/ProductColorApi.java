package com.fpoly.api;

import com.fpoly.exception.MessageException;
import com.fpoly.repository.InvoiceDetailRepository;
import com.fpoly.repository.ProductColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product-color")
@CrossOrigin
public class ProductColorApi {

    @Autowired
    private ProductColorRepository productColorRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        if(invoiceDetailRepository.countByProductColor(id) > 0){
            throw new MessageException("Màu sắc sản phẩm đã có người mua, không thể xóa");
        }
        productColorRepository.deleteById(id);
        return new ResponseEntity<>("delete success", HttpStatus.OK);
    }
}
