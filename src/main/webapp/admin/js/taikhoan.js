var token = localStorage.getItem("token");
var size = 20;
async function loadAllUser(page, param) {
    if (param == null) {
        param = "";
    }
    var url = 'http://localhost:8080/api/admin/get-user-by-role?page=' + page + '&size=' + size + '&q=' + param;
    var role = document.getElementById("role").value
    if (role != "") {
        url += '&role=' + role
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    console.log(result)
    var listUser = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < listUser.length; i++) {
        var btn = '';
        if (listUser[i].actived == 0) {
            var btn = `<td class="sticky-col"><button onclick="lockOrUnlock(${listUser[i].id},0)" class="btn btn-danger"><i class="fa fa-unlock"></i> Mở khóa</button></td>`
        } else {
            var btn = `<td class="sticky-col"><button onclick="lockOrUnlock(${listUser[i].id},1)" class="btn btn-primary"><i class="fa fa-lock"></i> Khóa</button></td>`
        }
        if (listUser[i].authorities.name == "ROLE_ADMIN") {
            btn = '<td class="sticky-col"></td>'
        }
        main += `<tr>
                    <td>${listUser[i].id}</td>
                    <td>${listUser[i].email}</td>
                    <td>${listUser[i].fullname}</td>
                    <td>${listUser[i].phone ? listUser[i].phone : ""}</td>
                    <td>${listUser[i].createdDate}</td>
                    <td>${listUser[i].authorities.name}</td>
                    ${btn}
                </tr>`
    }
    document.getElementById("listuser").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadAllUser(${(Number(i) - 1)},${param})" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}


function filteruser() {
    loadAllUser(0, "");
}

function searchTable() {
    var val = document.getElementById("searchtable").value;
    loadAllUser(0, val);
}


async function lockOrUnlock(id, type) {
    var con = confirm("Xác nhận hành động?");
    if (!con) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/lockOrUnlockUser?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    const result = await response.text();

    if (response.status < 300) {
        var mess = type == 1 ? 'Khóa thành công' : 'Mở khóa thành công';
        swal({
                title: "Thông báo",
                text: mess,
                type: "success"
            },
            function() {
                window.location.reload();
            });
    } else {
        swal({
            title: "Thông báo",
            text: result,
            type: "error"
        });
    }
}




async function addAdmin() {
    var url = 'http://localhost:8080/api/admin/addaccount';
    var fullname = document.getElementById("fullname").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("pass").value;
    var repassword = document.getElementById("repass").value;

    var user = {
        "fullname": fullname,
        "phone": phone,
        "email": email,
        "password": password
    };

    // Validate Fullname
    if (!fullname) {
        toastr.warning("Tên không được để trống!");
        return;
    }

    // Validate Phone
    const validPhonePrefixes = [
        "03", "05", "07", "08", "09" // Common prefixes for Vietnamese SIM cards
    ];
    const phoneRegex = /^0[35789]\d{8}$/; // Starts with 0, followed by valid prefixes, and exactly 10 digits

    if (!phone) {
        toastr.warning("Số điện thoại không được để trống!");
        return;
    }
    if (!phoneRegex.test(phone)) {
        toastr.warning(
            `Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng ${validPhonePrefixes.join(
                ", "
            )} và có 10 chữ số.`
        );
        return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        toastr.warning("Email không được để trống!");
        return;
    }
    if (!emailRegex.test(email)) {
        toastr.warning("Email không đúng định dạng!");
        return;
    }

    // Validate Password and Repassword
    if (password !== repassword) {
        toastr.warning("Mật khẩu không trùng khớp!");
        return;
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(user)
        });

        const result = await res.json();
        if (res.status < 300) {
            swal({
                    title: "Thông báo",
                    text: "Tạo tài khoản thành công!",
                    type: "success"
                },
                function() {
                    window.location.reload();
                });
        } else if (res.status === exceptionCode) {
            toastr.warning(result.defaultMessage);
        } else {
            toastr.warning("Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.");
        }
    } catch (error) {
        console.warning("Lỗi khi thêm tài khoản:", error);
        toastr.warning("Không thể kết nối tới server!");
    }
}
