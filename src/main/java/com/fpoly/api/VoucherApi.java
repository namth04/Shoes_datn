package com.fpoly.api;

import com.fpoly.entity.Voucher;
import com.fpoly.servive.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/voucher")
@CrossOrigin
public class VoucherApi {

    @Autowired
    private VoucherService voucherService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Voucher voucher) {
        Voucher result = voucherService.create(voucher);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> update(@RequestBody Voucher voucher) {
        Voucher result = voucherService.update(voucher);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id) {
        voucherService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/admin/block-or-unblock")
    public ResponseEntity<?> block(@RequestParam("id") Long id) {
        voucherService.block(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findAll-page")
    public ResponseEntity<?> findAll(@RequestParam(value = "start", required = false) Date start,
                                     @RequestParam(value = "end", required = false) Date end,
                                     Pageable pageable) {
        Page<Voucher> result = voucherService.findAll(start, end, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/findAll-list")
    public ResponseEntity<?> findAllList(@RequestParam(value = "start", required = false) Date start,
                                         @RequestParam(value = "end", required = false) Date end) {
        List<Voucher> result = voucherService.findAll(start, end);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        Optional<Voucher> result = voucherService.findById(id);
        return new ResponseEntity<>(result.get(), HttpStatus.OK);
    }

    @GetMapping("/public/findByCode")
    public ResponseEntity<?> findById(@RequestParam("code") String code, @RequestParam("amount") Double amount) {
        Optional<Voucher> result = voucherService.findByCode(code, amount);
        return new ResponseEntity<>(result.get(), HttpStatus.OK);
    }

    @PutMapping("/admin/auto-block")
    public ResponseEntity<?> autoBlockVoucher(@RequestParam("id") Long id) {
        Optional<Voucher> optionalVoucher = voucherService.findById(id);
        optionalVoucher.ifPresent(voucher -> {
            if (voucher.getEndDate() != null) {
                // Tạo Calendar để kiểm tra thời gian chính xác
                Calendar endDateTime = Calendar.getInstance();
                endDateTime.setTime(voucher.getEndDate());

                // Đặt giờ là 12:00:00
                endDateTime.set(Calendar.HOUR_OF_DAY, 12);
                endDateTime.set(Calendar.MINUTE, 0);
                endDateTime.set(Calendar.SECOND, 0);
                endDateTime.set(Calendar.MILLISECOND, 0);

                // So sánh với thời gian hiện tại
                Calendar now = Calendar.getInstance();

                if (now.getTime().compareTo(endDateTime.getTime()) >= 0) {
                    voucher.setBlock(true); // Khóa voucher nếu đã đến 12h trưa của ngày hết hạn
                    voucherService.update(voucher);
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
