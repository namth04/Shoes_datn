var token = localStorage.getItem("token"); // Lấy token từ localStorage
var size = 10;

async function loadInvoice(page) {
    var start = document.getElementById("start").value; // Lấy giá trị ngày bắt đầu
    var end = document.getElementById("end").value; // Lấy giá trị ngày kết thúc
    var type = document.getElementById("type").value; // Lấy loại thanh toán
    var trangthai = document.getElementById("trangthai").value; // Lấy trạng thái
    var sort = document.getElementById("sort").value; // Lấy kiểu sắp xếp

    // Tạo URL API
    var url = 'http://localhost:8080/api/invoice/admin/find-all?page=' + page + '&size=' + size + '&sort=' + sort;

    // Thêm các tham số lọc (nếu có)
    if (start != "" && end != "") {
        url += '&from=' + start + '&to=' + end;
    }
    if (type != -1) {
        url += '&paytype=' + type;
    }
    if (trangthai != -1) {
        url += '&status=' + trangthai;
    }
    if(trangthai == -1){
        url += '&status=' + 1;
    }

    // Gửi request đến API
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token, // Thêm token vào header
        })
    });

    // Chuyển đổi dữ liệu nhận được từ API
    var result = await response.json();
    console.log(result);
    var list = result.content;

    // Sắp xếp lại dữ liệu, ưu tiên trạng thái "Chờ xác nhận" lên đầu
    list.sort((a, b) => {
        const waitingStatusName = 'Đang chờ xác nhận'; // Tên chính xác của trạng thái "Đang chờ xác nhận"
        if (a.status.name === waitingStatusName) return 1;
        if (b.status.name === waitingStatusName) return 1;
        return 0;
    });

    // Hiển thị dữ liệu ra bảng
    var main = '';
    for (let i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].address}</td>
                    <td>${formatmoney(list[i].totalAmount)}</td>
                    <td>${list[i].payType != 'PAYMENT_DELIVERY'
            ? '<span class="dathanhtoan">Đã thanh toán</span>'
            : '<span class="chuathanhtoan">Thanh toán khi nhận hàng (COD)</span>'}</td>
                    <td>${list[i].status.name}</td>
                    <td>${list[i].payType}</td>
                    <td class="sticky-col">
                        <i onclick="loadDetailInvoice(${list[i].id})" 
                           data-bs-toggle="modal" data-bs-target="#modaldeail" 
                           class="fa fa-eye iconaction"></i>
                        <i onclick="openStatus(${list[i].id}, ${list[i].status.id})" 
                           data-bs-toggle="modal" data-bs-target="#capnhatdonhang" 
                           class="fa fa-edit iconaction"></i>
                    </td>
                </tr>`;
    }
    document.getElementById("listinvoice").innerHTML = main;

    // Tạo phân trang
    var mainpage = '';
    for (let i = 1; i <= result.totalPages; i++) {
        mainpage += `<li onclick="loadInvoice(${(i - 1)})" class="page-item">
                         <a class="page-link" href="#listsp">${i}</a>
                     </li>`;
    }
    document.getElementById("pageable").innerHTML = mainpage;
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
    result.payType!="PAYMENT_DELIVERY"?document.getElementById("loaithanhtoan").innerHTML = "Đã thanh toán":"Thanh toán khi nhận hàng"
    result.payType=="PAYMENT_VNPAY"?document.getElementById("loaithanhtoan").innerHTML = "Thanh toán qua vnpay":"Thanh toán khi nhận hàng (COD)"
    result.payType=="PAYMENT_GPAY"?document.getElementById("loaithanhtoan").innerHTML = "Thanh toán qua gpay":"Thanh toán khi nhận hàng (COD)"
    result.payType=="PAY_COUNTER"? document.getElementById("loaithanhtoan").innerHTML = "Thanh toán tại quầy":"Thanh toán khi nhận hàng (COD)"
    document.getElementById("ttvanchuyen").innerHTML = result.status.name
    document.getElementById("tennguoinhan").innerHTML = result.receiverName
    document.getElementById("addnhan").innerHTML = result.address
    document.getElementById("addnhan").innerHTML = result.address
    document.getElementById("phonenhan").innerHTML = result.phone
    document.getElementById("phonenhan").innerHTML = result.phone
    document.getElementById("ghichunh").innerHTML = result.note == "" || result.note == null ? 'Không có ghi chú' : result.note
}

function openStatus(idinvoice, idstatus) {
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