
var token = localStorage.getItem("token");

var size = 10;
async function loadInvoice(page) {
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    var type = document.getElementById("type").value
    var trangthai = document.getElementById("trangthai").value
    var sort = document.getElementById("sort").value
    var url = 'http://localhost:8080/api/invoice/admin/find-all?page=' + page + '&size=' + size + '&sort=' + sort;
    if (start != "" && end != "") {
        url += '&from=' + start + '&to=' + end;
    }
    if (type != -1) {
        url += '&paytype=' + type;
    }
    if (trangthai != -1) {
        url += '&status=' + trangthai
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;
    var main = '';
    for (i = 0; i < list.length; i++) {
        // Logic hiển thị trạng thái thanh toán
        let paymentStatusHtml = '<span class="chuathanhtoan">Thanh toán khi nhận hàng(COD)</span>';

        // Nếu là GPAY hoặc VNPAY thì luôn hiển thị Đã thanh toán
        if (list[i].payType === 'PAYMENT_VNPAY' || list[i].payType === 'PAYMENT_GPAY') {
            paymentStatusHtml = '<span class="dathanhtoan">Đã thanh toán</span>';
        }
        // Nếu là COD và trạng thái là Đã nhận đơn hàng thì hiển thị Đã thanh toán
        else if (list[i].payType === 'PAYMENT_DELIVERY' && list[i].status.name === 'Đã nhận đơn hàng') {
            paymentStatusHtml = '<span class="dathanhtoan">Đã thanh toán</span>';
        }

        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].address}</td>
                    <td>${formatmoney(list[i].totalAmount)}</td>
                    <td>${paymentStatusHtml}</td>
                    <td>${list[i].status.name}</td>
                    <td>${list[i].payType}</td>
                    <td class="sticky-col">
                        <i onclick="loadDetailInvoice(${list[i].id})" data-bs-toggle="modal" data-bs-target="#modaldeail" class="fa fa-eye iconaction"></i>
                        <i onclick="openStatus(${list[i].id},${list[i].status.id})" data-bs-toggle="modal" data-bs-target="#capnhatdonhang" class="fa fa-edit iconaction"></i><br>
                    </td>
                </tr>`
    }
    document.getElementById("listinvoice").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadInvoice(${(Number(i) - 1)})" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

async function loadDetailInvoice(id) {
    var url = 'http://localhost:8080/api/invoice-detail/admin/find-by-invoice?idInvoice=' + id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await res.json();
    var main = ''
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
    document.getElementById("listDetailinvoice").innerHTML = main

    var url = 'http://localhost:8080/api/invoice/admin/find-by-id?idInvoice=' + id;
    const resp = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await resp.json();
    document.getElementById("ngaytaoinvoice").innerHTML = result.createdTime + " " + result.createdDate

    // Logic hiển thị trạng thái thanh toán trong chi tiết
    let paymentStatusText = "Thanh toán khi nhận hàng (COD)";

    if (result.payType === "PAYMENT_VNPAY" || result.payType === "PAYMENT_GPAY") {
        paymentStatusText = "Đã thanh toán";
    }

    else if (result.payType === "PAYMENT_DELIVERY" && result.status.name === "Đã nhận đơn hàng") {
        paymentStatusText = "Đã thanh toán";
    }
    // Các phương thức khác
    else if (result.payType === "PAYMENT_MOMO") {
        paymentStatusText = "Thanh toán qua momo";
    } else if (result.payType === "PAY_COUNTER") {
        paymentStatusText = "Thanh toán tại quầy";
    }
    document.getElementById("trangthaitt").innerHTML = paymentStatusText;

    document.getElementById("ttvanchuyen").innerHTML = result.status.name
    document.getElementById("tennguoinhan").innerHTML = result.receiverName

    document.getElementById("addnhan").innerHTML = result.address
    document.getElementById("phonenhan").innerHTML = result.phone
    document.getElementById("ghichunh").innerHTML = result.note == "" || result.note == null ? 'Không có ghi chú' : result.note
}


async function openStatus(idinvoice, idstatus) {
    document.getElementById("iddonhangupdate").value = idinvoice
    document.getElementById("trangthaiupdate").value = idstatus
}

async function updateStatus() {
    var idtrangthai = document.getElementById("trangthaiupdate").value
    var idinvoice = document.getElementById("iddonhangupdate").value
    var url = 'http://localhost:8080/api/invoice/admin/update-status?idInvoice=' + idinvoice + '&idStatus=' + idtrangthai;
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (res.status < 300) {
        toastr.success("Cập nhật trạng thái đơn hàng thành công!");
        $("#capnhatdonhang").modal("hide")
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}


async function loadStatusUpdate() {
    var url = 'http://localhost:8080/api/status/admin/all';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("trangthaiupdate").innerHTML = main
}

async function loadAllStatus() {
    var url = 'http://localhost:8080/api/status/admin/all';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '<option value="-1">--- Tất cả ---</option>';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("trangthai").innerHTML = main
}

async function createInvoice(){
    var con = confirm("Xác nhận");
    if(con == false){
        return;
    }
    var listId = [];
    for(var i=0; i<listProductTam.length; i++){
        var obj = {
            "idProductSize":listProductTam[i].productSize.id,
            "quantity":listProductTam[i].quantity
        }
        listId.push(obj);
    }
    var payload = {
        "listProductSize":listId,
        "fullName":document.getElementById("fullname").value,
        "phone":document.getElementById("phone").value,
    }
    const res = await fetch('http://localhost:8080/api/invoice/admin/pay-counter', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    if(res.status < 300){
        swal({
                title: "Thông báo",
                text: "Thành công",
                type: "success"
            },
            function() {
                window.location.href = '/admin/invoice'
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}