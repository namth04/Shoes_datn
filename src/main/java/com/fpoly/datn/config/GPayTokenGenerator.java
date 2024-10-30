package com.fpoly.datn.config;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

public class GPayTokenGenerator {

    private static final String API_URL = "https://payment.sandbox.g-pay.vn/api/v4/authentication/token/create";

    public static void main(String[] args) {
        String merchantCode = "MC001";
        String password = "123456aA@";

        try {
            String token = generateAccessToken(merchantCode, password);
            System.out.println("Access Token: " + token);
        } catch (Exception e) {
            System.err.println("Error generating access token: " + e.getMessage());
        }
    }

    public static String generateAccessToken(String merchantCode, String password) throws RestClientException {
        RestTemplate restTemplate = new RestTemplate();

        // Thiết lập headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Tạo body cho yêu cầu
        String requestBody = String.format("{\"merchant_code\": \"%s\", \"password\": \"%s\"}", merchantCode, password);

        // Tạo entity cho yêu cầu
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        // Gửi yêu cầu POST đến API
        ResponseEntity<TokenResponse> responseEntity = restTemplate.exchange(API_URL, HttpMethod.POST, entity, TokenResponse.class);

        // Xử lý phản hồi
        if (responseEntity.getBody() != null && responseEntity.getBody().getResponse() != null) {
            return responseEntity.getBody().getResponse().getToken();
        } else {
            throw new RuntimeException("Failed to get token: " + responseEntity.getBody().getMeta().getMsg());
        }
    }

    // Lớp chứa phản hồi từ API
    public static class TokenResponse {
        private Meta meta;
        private Response response;

        public Meta getMeta() {
            return meta;
        }

        public Response getResponse() {
            return response;
        }
    }

    public static class Meta {
        private String code;
        private String msg;

        public String getCode() {
            return code;
        }

        public String getMsg() {
            return msg;
        }
    }

    public static class Response {
        private String token;
        private long expired_at;

        public String getToken() {
            return token;
        }

        public long getExpiredAt() {
            return expired_at;
        }
    }
}
