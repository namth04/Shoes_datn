package com.fpoly.datn.config;

import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.Signature;
import java.util.Base64;

public class GPayPayment {

    private final String gpayUrl = "https://payment.sandbox.g-pay.vn/api/v4";
    private PrivateKey privateKey; // Khóa riêng RSA được tải từ file hoặc tạo trước đó.

    public String signPaymentData(String paymentData) throws Exception {
        // Tạo đối tượng Signature với thuật toán RSA
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);

        // Ký dữ liệu thanh toán
        signature.update(paymentData.getBytes(StandardCharsets.UTF_8));
        byte[] signedData = signature.sign();

        // Trả về chữ ký dưới dạng Base64
        return Base64.getEncoder().encodeToString(signedData);
    }

    public void createPayment(String amount, String orderId, String currency) throws Exception {
        // Tạo thông tin thanh toán
        String paymentData = String.format("{\"amount\":\"%s\", \"orderId\":\"%s\", \"currency\":\"%s\"}", amount, orderId, currency);

        // Ký thông tin thanh toán
        String signature = signPaymentData(paymentData);

        // Gửi yêu cầu đến GPAY
        // Sử dụng thư viện HTTP client để gửi paymentData và signature đến gpayUrl
        // ...
    }
}
