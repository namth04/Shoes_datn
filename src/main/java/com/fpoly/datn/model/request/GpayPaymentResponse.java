package com.fpoly.datn.model.request;

import com.fpoly.datn.config.GPayTokenGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GpayPaymentResponse {

    private GPayTokenGenerator.Meta meta;
}
