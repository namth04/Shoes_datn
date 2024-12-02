var token = localStorage.getItem("token");
var size = 2;

async function loadVoucher(page, start, end) {
    var url = 'http://localhost:8080/api/voucher/admin/findAll-page?page=' + page + '&size=' + size;
    if (start != null && start != "" && end != null && end != "" && start != 'null' && end != 'null') {
        url += '&start=' + start + '&end=' + end
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].code}</td>
                    <td>${list[i].name}</td>
                    <td>${formatmoney(list[i].minAmount)}</td>
                    <td>${formatmoney(list[i].discount)}</td>
                    <td>${list[i].startDate}</td>
                    <td>${list[i].endDate}</td>
                    <td>${list[i].block == true ? '<span class="locked">Đã khóa</span>':'<span class="actived">Đang hoạt động</span>'}</td>
                    <td class="sticky-col">
                        <i onclick="deleteVoucher(${list[i].id})" class="fa fa-trash iconaction"></i><br>
                        <a href="addvoucher?id=${list[i].id}"><i class="fa fa-edit iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listvoucher").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadVoucher(${(Number(i) - 1)},'${start}','${end}')" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

async function filter() {
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    if (start != "" && end != "") {
        loadVoucher(0, start, end);
    }
}

async function loadAVoucher() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id != null) {
        var url = 'http://localhost:8080/api/voucher/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        document.getElementById("code").value = result.code
        document.getElementById("namevoucher").value = result.name
        document.getElementById("minamount").value = result.minAmount
        document.getElementById("discount").value = result.discount
        document.getElementById("from").value = result.startDate
        document.getElementById("to").value = result.endDate
        result.block == true ? document.getElementById("lockvoucher").checked = true : false;
    }
}

function validateVoucherForm() {
    // Get all form values
    const code = document.getElementById("code").value.trim();
    const name = document.getElementById("namevoucher").value.trim();
    const minAmount = document.getElementById("minamount").value;
    const discount = document.getElementById("discount").value;
    const startDate = document.getElementById("from").value;
    const endDate = document.getElementById("to").value;

    let isValid = true;

    // Validate code
    if (!code) {
        toastr.error("Mã voucher không được để trống");
        isValid = false;
    } else if (code.length < 3 || code.length > 20) {
        toastr.error("Mã voucher phải từ 3-20 ký tự");
        isValid = false;
    } else if (!/^[A-Z0-9]+$/.test(code)) {
        toastr.error("Mã voucher chỉ được chứa chữ in hoa và số");
        isValid = false;
    }

    // Validate name
    if (!name) {
        toastr.error("Tên voucher không được để trống");
        isValid = false;
    } else if (name.length < 5 || name.length > 100) {
        toastr.error("Tên voucher phải từ 5-100 ký tự");
        isValid = false;
    }

    // Validate minimum amount
    if (!minAmount) {
        toastr.error("Giá trị đơn hàng tối thiểu không được để trống");
        isValid = false;
    } else {
        const minAmountNum = parseFloat(minAmount);
        if (isNaN(minAmountNum) || minAmountNum < 0) {
            toastr.error("Giá trị đơn hàng tối thiểu phải là số dương");
            isValid = false;
        }
    }

    // Validate discount
    if (!discount) {
        toastr.error("Giá trị giảm không được để trống");
        isValid = false;
    } else {
        const discountNum = parseFloat(discount);
        const minAmountNum = parseFloat(minAmount);
        if (isNaN(discountNum) || discountNum <= 0) {
            toastr.error("Giá trị giảm phải là số dương");
            isValid = false;
        } else if (discountNum >= minAmountNum) {
            toastr.error("Giá trị giảm phải nhỏ hơn giá trị đơn hàng tối thiểu");
            isValid = false;
        }
    }

    if (!startDate) {
        toastr.error("Ngày bắt đầu không được để trống");
        isValid = false;
    }

    if (!endDate) {
        toastr.error("Ngày kết thúc không được để trống");
        isValid = false;
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (start < now) {
            toastr.error("Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại");
            isValid = false;
        }

        if (end <= start) {
            toastr.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
            isValid = false;
        }
    }

    return isValid;
}

async function saveVoucher() {
    // Validate form before proceeding
    if (!validateVoucherForm()) {
        return;
    }

    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var code = document.getElementById("code").value.trim();
    var namevoucher = document.getElementById("namevoucher").value.trim();
    var minamount = document.getElementById("minamount").value;
    var discount = document.getElementById("discount").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var lockvoucher = document.getElementById("lockvoucher").checked

    var url = 'http://localhost:8080/api/voucher/admin/create';
    if (id != null) {
        url = 'http://localhost:8080/api/voucher/admin/update';
    }

    var voucher = {
        "id": id,
        "code": code,
        "name": namevoucher,
        "discount": discount,
        "minAmount": minamount,
        "startDate": from,
        "endDate": to,
        "block": lockvoucher
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(voucher)
        });

        if (response.status < 300) {
            swal({
                    title: "Thông báo",
                    text: "thêm/sửa voucher thành công!",
                    type: "success"
                },
                function() {
                    window.location.href = 'voucher'
                });
        }
        if (response.status == exceptionCode) {
            const result = await response.json()
            toastr.warning(result.defaultMessage);
        }
    } catch (error) {
        toastr.error("Đã xảy ra lỗi khi lưu voucher. Vui lòng thử lại.");
    }
}

async function deleteVoucher(id) {
    var con = confirm("Bạn chắc chắn muốn xóa voucher này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/voucher/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa voucher thành công!");
        await new Promise(r => setTimeout(r, 1000));
        window.location.reload();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}