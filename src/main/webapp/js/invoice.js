var token = localStorage.getItem("token");

async function loadMyInvoice() {
    var url = 'http://localhost:8080/api/invoice/user/find-by-user';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        let paymentStatus;
        if (list[i].payType !== 'PAYMENT_DELIVERY') {
            paymentStatus = '<span class="dathanhtoan">Đã thanh toán</span>';
        } else {
            // Nếu là COD và trạng thái là "Đã nhận đơn hàng"
            if (list[i].status.name === 'Đã nhận đơn hàng') {
                paymentStatus = '<span class="dathanhtoan">Đã thanh toán</span>';
            } else {
                paymentStatus = '<span class="chuathanhtoan">Chưa Thanh Toán</span>';
            }
        }

        main += `<tr>
                    <td onclick="loadDetailInvoice(${list[i].id})" data-bs-toggle="modal" data-bs-target="#modaldeail"><a class="yls pointer-event">${list[i].id}</a></td>
                    <td class="floatr">${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].address}</td>
                    <td class="floatr"><span class="yls">${formatmoney(Number(list[i].totalAmount) + Number(0))}</span></td>
                    <td><span class="span_pending">${paymentStatus}</span></td>
                    <td class="floatr"><span class="span_">${list[i].status.name}</span></td>
                    <td>
                    ${(list[i].status.id == 1 || list[i].status.id == 2) && list[i].payType == 'PAYMENT_DELIVERY' ?
            `<i onclick="cancelInvoice(${list[i].id})" class="fa fa-trash-o huydon"></i>` : ''}
                    </td>
                </tr>`
    }
    document.getElementById("listinvoice").innerHTML = main;
    document.getElementById("sldonhang").innerHTML = list.length + ' đơn hàng';

    var mobile = '';
    for (i = 0; i < list.length; i++) {
        // Xác định trạng thái thanh toán cho mobile view
        let mobilePaymentStatus;
        if (list[i].payType !== 'PAYMENT_DELIVERY') {
            mobilePaymentStatus = '<span class="dathanhtoan">Đã thanh toán</span>';
        } else {
            if (list[i].status.name === 'Đã nhận đơn hàng') {
                mobilePaymentStatus = '<span class="dathanhtoan">Đã thanh toán</span>';
            } else {
                mobilePaymentStatus = '<span class="chuathanhtoan">Thanh toán khi nhận hàng(COD)</span>';
            }
        }

        mobile += `<tr class="trmobile">
            <td style="width: 40%;">Đơn hàng</td>
            <td  class="position-relative">
                <a onclick="loadDetailInvoice(${list[i].id})" data-bs-toggle="modal" data-bs-target="#modaldeail" class="yls iddhmb pointer-event">#${list[i].id}</a>
                ${(list[i].status.id == 1 || list[i].status.id == 2) && list[i].payType == 'PAYMENT_DELIVERY' ?
            `<span onclick="cancelInvoice(${list[i].id})" class="huymobile">Hủy đơn</span>` : ''}
            </td>
        </tr>
        <tr>
            <td>Ngày: </td>
            <td>${list[i].createdTime} ${list[i].createdDate}</td>
        </tr>
        <tr>
            <td>Địa chỉ: </td>
            <td>${list[i].address}</td>
        </tr>
        <tr>
            <td>Giá trị đơn hàng:</td>
            <td class="yls">${formatmoney(list[i].totalAmount)}</td>
        </tr>
        <tr>
            <td>TT Thanh toán:</td>
            <td>${mobilePaymentStatus}</td>
        </tr>
        <tr>
            <td>TT Vận chuyển:<br><br></td>
            <td>${list[i].status.name}</td>
        </tr>`
    }
    document.getElementById("listinvoicemb").innerHTML = mobile;
}

async function loadDetailInvoice(id) {
    var url = 'http://localhost:8080/api/invoice-detail/user/find-by-invoice?idInvoice=' + id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await res.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td><img src="${list[i].product.imageBanner}" class="imgdetailacc"></td>
                    <td>
                        <a href="">${list[i].productName}</a><br>
                        <span>${list[i].colorName} / ${list[i].productSize.sizeName}</span><br>
                        <span>Mã sản phẩm: ${list[i].product.code}</span><br>
                        <span class="slmobile">SL: ${list[i].quantity}</span>
                    </td>
                    <td>${formatmoney(list[i].price)}</td>
                    <td class="sldetailacc">${list[i].quantity}</td>
                    <td class="pricedetailacc yls">${formatmoney(list[i].price * list[i].quantity)}</td>
                </tr>`
    }
    document.getElementById("listDetailinvoice").innerHTML = main;

    var url = 'http://localhost:8080/api/invoice/user/find-by-id?idInvoice=' + id;
    const resp = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await resp.json();
    document.getElementById("ngaytaoinvoice").innerHTML = result.createdTime + " " + result.createdDate;

    // Xử lý trạng thái thanh toán
    let paymentStatus;
    if (result.payType !== 'PAYMENT_DELIVERY') {
        paymentStatus = 'Đã thanh toán';
    } else {
        if (result.status.name === 'Đã nhận đơn hàng') {
            paymentStatus = 'Đã thanh toán';
        } else {
            paymentStatus = 'Chưa thanh toán';
        }
    }
    document.getElementById("trangthaitt").innerHTML = paymentStatus;

    // Cập nhật trạng thái vận chuyển
    document.getElementById("ttvanchuyen").innerHTML = result.status.name;

    // Cập nhật loại thanh toán
    let paymentDisplay;
    if (result.payType === "PAYMENT_DELIVERY") {
        if (result.status.name === "Đã nhận đơn hàng") {
            paymentDisplay = "Đã thanh toán";
        } else {
            paymentDisplay = "Thanh toán khi nhận hàng (COD)";
        }
    } else if (result.payType === "PAYMENT_MOMO") {
        paymentDisplay = "Thanh toán qua momo";
    } else if (result.payType === "PAYMENT_VNPAY") {
        paymentDisplay = "Thanh toán qua vnpay";
    } else if (result.payType === "PAYMENT_GPAY") {
        paymentDisplay = "Thanh toán qua gpay";
    } else if (result.payType === "PAY_COUNTER") {
        paymentDisplay = "Thanh toán tại quầy";
    }

    document.getElementById("loaithanhtoan").innerHTML = paymentDisplay;
    document.getElementById("tennguoinhan").innerHTML = result.receiverName;
    document.getElementById("addnhan").innerHTML = result.address;
    document.getElementById("phonenhan").innerHTML = result.phone;
    document.getElementById("ghichunh").innerHTML = result.note == "" || result.note == null ? 'Không có ghi chú' : result.note;
}

async function cancelInvoice(id) {
    var con = confirm("Xác nhận hủy đơn hàng này");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/invoice/user/cancel-invoice?idInvoice=' + id;
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (res.status < 300) {
        toastr.success("Hủy đơn hàng thành công!");
        loadMyInvoice();
    }
    if (res.status == exceptionCode) {
        var result = await res.json();
        toastr.warning(result.defaultMessage);
    }
}

// Hàm format tiền tệ
function formatmoney(money) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
}