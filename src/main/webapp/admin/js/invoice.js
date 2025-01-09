var token = localStorage.getItem("token");

var size = 10;

function formatmoney(num) {
    return num.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
}

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

        let paymentStatusHtml = '<span class="chuathanhtoan">Thanh toán khi nhận hàng(COD)</span>';

        if (list[i].payType === 'PAYMENT_GPAY') {
            paymentStatusHtml = '<span class="dathanhtoan">Đã thanh toán</span>';
        } else if (list[i].payType === 'PAYMENT_DELIVERY' && list[i].status.name === 'Đã nhận đơn hàng') {
            paymentStatusHtml = '<span class="dathanhtoan">Đã thanh toán</span>';
        } else if (list[i].payType === 'PAY_COUNTER') {
            paymentStatusHtml = '<span class="dathanhtoan">Đã thanh toán</span>';
        }

        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td> ${list[i].address != null ? list[i].address : " "}</td>
                   
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

    let paymentStatusText = "Chưa thanh toán";

    if (result.payType === "PAYMENT_GPAY") {
        paymentStatusText = "Đã thanh toán";
    } else if (result.payType === "PAYMENT_DELIVERY" && result.status.name === "Đã nhận đơn hàng") {
        paymentStatusText = "Đã thanh toán";
    } else if (result.payType === "PAY_COUNTER") {
        paymentStatusText = "Đã thanh toán";
    }


    let paymentText = "Thanh toán khi nhận hàng (COD)";

    if (result.payType === "PAYMENT_GPAY") {
        paymentText = "Thanh toán qua GPay";
    } else if (result.payType === "PAY_COUNTER") {
        paymentText = "Thanh toán tại quầy";
    }


    document.getElementById("loaithanhtoan").innerHTML = paymentStatusText;

    document.getElementById("trangthaitt").innerHTML = paymentStatusText;

    document.getElementById("ttvanchuyen").innerHTML = result.status.name
    document.getElementById("tennguoinhan").innerHTML = result.receiverName
    document.getElementById("loaithanhtoan").innerHTML = paymentText;
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

async function createInvoice() {
    try {
        if (!confirm("Xác nhận")) return;

        const fullName = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!fullName) {
            toastr.warning('Vui lòng nhập tên khách hàng');
            return;
        }

        if (!phone) {
            toastr.warning('Vui lòng nhập số điện thoại');
            return;
        }

        if (!listProductTam || listProductTam.length === 0) {
            toastr.warning('Giỏ hàng trống. Vui lòng chọn sản phẩm');
            return;
        }

        const totalAmount = parseFloat(document.getElementById('tongtientt').innerText.replace(/[^\d]/g, '')) || 0;
        const customerPaid = parseFloat(document.getElementById('customerPaid').value) || 0;

        if (customerPaid < totalAmount) {
            toastr.dang('Tiền khách đưa không đủ để thanh toán!');
            return;
        }

        const listId = listProductTam.map(item => ({
            idProductSize: item.productSize.id,
            quantity: item.quantity
        }));

        const payload = {
            listProductSize: listId,
            fullName: fullName,
            phone: phone
        };

        let invoiceCreated = false;

        try {
            const res = await fetch('http://localhost:8080/api/invoice/admin/pay-counter', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                invoiceCreated = true;
                const changeAmount = customerPaid - totalAmount;

                const contentType = res.headers.get('content-type');
                let invoiceResponse = null;

                if (contentType && contentType.includes('application/json')) {
                    try {
                        invoiceResponse = await res.json();
                    } catch (parseError) {
                        console.warn('No JSON response, generating placeholder invoice details');
                    }
                }

                const invoiceDetails = createInvoiceDetailsObject(
                    invoiceResponse,
                    fullName,
                    phone,
                    totalAmount,
                    customerPaid,
                    changeAmount
                );

                if (invoiceCreated) {
                    exportInvoice(invoiceDetails);
                }

                swal({
                    title: "Thông báo",
                    text: "Tạo hóa đơn thành công",
                    type: "success",
                    closeOnConfirm: true
                }, function() {
                    if (invoiceCreated) {
                        resetInvoiceForm();
                        window.location.href = '/admin/invoice';
                    }
                });
            } else {

                const errorResult = await res.json();
                if (res.status === exceptionCode) {
                    toastr.warning(errorResult.defaultMessage || 'Có lỗi xảy ra');
                } else {
                    toastr.error(errorResult.message || 'Có lỗi xảy ra! Vui lòng thử lại.');
                }
            }
        } catch (error) {
            console.error("Lỗi khi tạo hóa đơn:", error);
            toastr.error ('Đã xảy ra lỗi khi tạo hóa đơn. Vui lòng thử lại.');
        }

    } catch (unexpectedError) {
        console.error("Lỗi không xác định khi tạo hóa đơn:", unexpectedError);
        toastr.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    }
}

function resetInvoiceForm() {
    document.getElementById("fullname").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("customerPaid").value = '';
    document.getElementById("changeAmount").value = '';

    listProductTam = [];
    loadSizeProduct();
}
function validateProductData(item) {
    console.log("Validating item:", item);
    console.log("Color info:", {
        productColor: item.color,
        colorFromSize: item.productSize?.color
    });
    console.log("Size info:", {
        directSize: item.productSize,
        sizeFromProductSize: item.productSize?.size
    });

    const colorName = item.productColor?.colorName
        || item.productSize?.color?.name
        || "Không xác định";

    const sizeName = item.productSize?.sizeName
        || item.productSize?.size?.name
        || "Không xác định";

    return {
        productName: item.product.name,
        colorName,
        sizeName
    };
}

function generateInvoiceNumber() {
    return 'HD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function exportInvoice(invoiceDetails) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website bán giày thể thao StepOn - Hóa Đơn Mua Hàng</title>
    <style>
    body {
    font-family: Arial, sans-serif;
    margin: 0;
    background-color: #e3f0d1;
    color: #333;
}

.invoice-container {
    max-width: 700px;
    margin: 20px auto;
    background-color: #f1f8e9;
    padding: 20px;
    border: 1px solid #c5e1a5;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

header {
    text-align: center;
    margin-bottom: 20px;
}

header h1 {
    margin: 0;
    color: #2e7d32;
}

header p {
    font-size: 14px;
    color: #555;
}

.invoice-info h2 {
    margin: 0;
    color: #4caf50;
    font-size: 18px;
}

.invoice-info p {
    font-size: 14px;
    color: #777;
}

.invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.invoice-table th, .invoice-table td {
    border-bottom: 1px solid #c8e6c9;
    padding: 10px 5px;
    text-align: left;
    font-size: 14px;
}

.invoice-table th {
    background-color: #81c784;
    color: white;
    text-transform: uppercase;
}

.invoice-summary {
    margin-top: 20px;
    text-align: right;
    font-size: 14px;
}

.invoice-summary p {
    margin: 5px 0;
    color: #2e7d32;
    font-weight: bold;
}

    </style>
</head>
        <body>
            ${createInvoiceHTML(invoiceDetails)}
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
function createInvoiceDetailsObject(invoiceResponse, fullName, phone, totalAmount, customerPaid, changeAmount) {
    const invoiceNumber = invoiceResponse?.id ? `HD-${invoiceResponse.id}` : generateInvoiceNumber();
    const items = listProductTam.map(item => ({
        productName: item.product.name,
        color: item.productColor.colorName,
        size: item.productSize.sizeName,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
    }));

    return {
        invoiceNumber: invoiceNumber,
        date: new Date().toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        customer: {
            name: fullName,
            phone: phone
        },
        items: items,
        totalAmount: formatCurrency(totalAmount),
        customerPaid: formatCurrency(customerPaid),
        changeAmount: formatCurrency(changeAmount)
    };
}
function createInvoiceHTML(invoiceDetails) {
    const itemRows = invoiceDetails.items.map(item => `
        <tr>
            <td>${item.productName}</td>
            <td>${item.color}</td>
            <td>${item.size}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.total)}</td>
        </tr>
    `).join('');
    return `

    <style>
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .invoice-header {
            text-align: center;
            background-color: #4a90e2;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .invoice-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .customer-info {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .invoice-table th {
            background-color: #4a90e2;
            color: white;
            padding: 10px;
            text-align: left;
        }
        .invoice-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .invoice-summary {
            background-color: #e6f2ff;
            padding: 15px;
            border-radius: 5px;
            text-align: right;
        }
        .invoice-summary p {
            margin: 10px 0;
            font-weight: bold;
        }
        .short-line {
            width: 300px;
            border: none;
            border-top: 2px solid #2e7d32;
            margin: 20px auto;
        }
    </style>
    <div class="invoice-container">
        <header>
            <h1>Hoá đơn bán hàng</h1>
            <p>FPT POLYTECHNIC, P.TRỊNH VĂN BÔ, HÀ NỘI • 0912 3456 7890 • sportstepon.vn</p>
        </header>
        <hr>
        <div class="customer-info">
            <p style="text-align: center">Số HĐ: ${invoiceDetails.invoiceNumber} || Ngày: ${invoiceDetails.date}</p>
            <hr class="short-line">
            <h3>Thông Tin Khách Hàng</h3>
            <p><strong>Họ Tên:</strong> ${invoiceDetails.customer.name}</p>
            <p><strong>Số Điện Thoại:</strong> ${invoiceDetails.customer.phone}</p>
        </div>
        <hr>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Sản Phẩm</th>
                    <th>Màu Sắc</th>
                    <th>Kích Thước</th>
                    <th>Giá Tiền</th>
                    <th>Số Lượng</th>
                    <th>Thành Tiền</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
            </tbody>
        </table>
        <div class="invoice-summary">
            <p>Tổng Tiền: ${invoiceDetails.totalAmount}</p>
            <p>Tiền Khách Đưa: ${invoiceDetails.customerPaid}</p>
            <p>Tiền Trả Lại: ${invoiceDetails.changeAmount}</p>
        </div>
    </div>
    `;
}

function calculateChange() {
    let totalAmountText = document.getElementById('tongtientt').innerText;

    // Chuyển đổi totalAmountText thành số sau khi loại bỏ ký tự không phải là số
    let totalAmount = parseFloat(totalAmountText.replace(/[^\d]/g, ''));
    // Kiểm tra nếu giá trị tổng tiền là âm hoặc không phải là số hợp lệ
    if (isNaN(totalAmount) || totalAmount < 0) {
        toastr.warning('Tổng tiền không thể là số âm. Vui lòng kiểm tra lại.');
        totalAmount = 0;  // Đặt lại tổng tiền về 0 nếu giá trị là âm
    }
    // Lấy giá trị khách trả từ ô nhập
    const customerPaidInput = document.getElementById('customerPaid').value.trim();
    let customerPaid = customerPaidInput ? parseFloat(customerPaidInput) : 0;

    // Kiểm tra và đảm bảo không cho phép số âm
    if (customerPaid < 0) {
        customerPaid = 0;  // Nếu giá trị âm, gán lại bằng 0
        document.getElementById('customerPaid').value = 0;  // Đặt lại giá trị trong ô nhập
    }
    // Tính toán số tiền thừa hoặc thiếu
    let change = customerPaid - totalAmount;

    // Nếu tiền khách trả ít hơn tổng tiền, hiển thị giá trị âm
    const formattedChange = change < 0
        ? `${Math.abs(change).toLocaleString()}đ (Còn thiếu)`
        : `${change.toLocaleString()}đ`;

    // Hiển thị số tiền thừa hoặc thiếu
    document.getElementById('changeAmount').value = formattedChange;
}


