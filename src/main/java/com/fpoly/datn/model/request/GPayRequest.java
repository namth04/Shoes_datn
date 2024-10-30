package com.fpoly.datn.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GPayRequest {
    private String merchantCode;
    private long requestId;
    private long amount;


}