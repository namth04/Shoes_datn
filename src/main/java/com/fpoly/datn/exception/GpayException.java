package com.fpoly.datn.exception;

public class GpayException extends Exception {
    public GpayException(String message) {
        super(message);
    }

    public GpayException(String message, Throwable cause) {
        super(message, cause);
    }
}