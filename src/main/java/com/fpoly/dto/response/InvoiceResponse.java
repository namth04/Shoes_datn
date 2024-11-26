package com.fpoly.dto.response;

import com.fpoly.entity.InvoiceStatus;
import com.fpoly.entity.Status;
import com.fpoly.enums.PayType;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class InvoiceResponse {

    private Long id;

    private Date createdDate;

    private Time createdTime;

    private Double totalAmount;

    private String receiverName;

    private String phone;

    private String note;

    private String address;

    private PayType payType;

    private UserAdressResponse userAddress;

    private Status status;

    private List<InvoiceStatus> invoiceStatuses = new ArrayList<>();
}
