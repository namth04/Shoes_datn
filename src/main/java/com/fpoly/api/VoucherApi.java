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
import java.util.Map;
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
        Optional<Voucher> optionalVoucher = voucherService.findByCode(code, amount);

        if (optionalVoucher.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "defaultMessage", "Mã voucher không tồn tại hoặc không hợp lệ!"
            ));
        }

        Voucher voucher = optionalVoucher.get();

        Date currentDate = new Date(System.currentTimeMillis());

        if (voucher.getBlock() || (voucher.getEndDate() != null && voucher.getEndDate().before(currentDate))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "defaultMessage", "Mã voucher đã hết hạn hoặc bị chặn!"
            ));
        }

        if (amount < voucher.getMinAmount()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "defaultMessage", "Tổng đơn hàng không đủ điều kiện để áp dụng mã giảm giá!"
            ));
        }

        return ResponseEntity.ok(voucher);
    }

    @PutMapping("/admin/auto-block")
    public ResponseEntity<?> autoBlockVoucher(@RequestParam("id") Long id) {
        Optional<Voucher> optionalVoucher = voucherService.findById(id);
        optionalVoucher.ifPresent(voucher -> {
            if (voucher.getEndDate() != null) {

                Calendar endDateTime = Calendar.getInstance();
                endDateTime.setTime(voucher.getEndDate());


                endDateTime.set(Calendar.HOUR_OF_DAY, 23);
                endDateTime.set(Calendar.MINUTE, 0);
                endDateTime.set(Calendar.SECOND, 0);
                endDateTime.set(Calendar.MILLISECOND, 0);

                Calendar now = Calendar.getInstance();

                if (now.getTime().compareTo(endDateTime.getTime()) >= 0) {
                    voucher.setBlock(true);
                    voucherService.update(voucher);
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/public/findAll")
    public ResponseEntity<?> findAllPublic() {
        List<Voucher> vouchers = voucherService.findAll(null, null);
        if (vouchers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Không có voucher nào khả dụng.");
        }
        return ResponseEntity.ok(vouchers);
    }

}
