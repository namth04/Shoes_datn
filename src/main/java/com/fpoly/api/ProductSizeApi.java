package com.fpoly.api;

import com.fpoly.dto.response.ProductSizeResponse;
import com.fpoly.entity.ProductSize;
import com.fpoly.exception.MessageException;
import com.fpoly.repository.InvoiceDetailRepository;
import com.fpoly.repository.ProductSizeRepository;
import com.fpoly.servive.ProductSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-size")
@CrossOrigin
public class ProductSizeApi {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private ProductSizeService productSizeService;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        if(invoiceDetailRepository.countByProductSize(id) > 0){
            throw new MessageException("Size sản phẩm đã có người mua, không thể xóa");
        }
        productSizeRepository.deleteById(id);
        return new ResponseEntity<>("delete success", HttpStatus.OK);
    }

    @GetMapping("/public/find-by-product-color")
    public ResponseEntity<?> findByProColor(@RequestParam("idProColor") Long id){
        List<ProductSize> result = productSizeRepository.findByProductColor(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/public/find-by-id")
    public ResponseEntity<?> findById(@RequestParam Long id){
        ProductSizeResponse result = productSizeService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @GetMapping("/public/find-quantity-by-color-and-size")
    public ResponseEntity<Integer> findQuantityByColorAndSize(@RequestParam Long colorId, @RequestParam Long sizeId) {
        Integer quantity = productSizeRepository.findQuantityByColorAndSize(colorId, sizeId);
        return ResponseEntity.ok(quantity);
    }
}
