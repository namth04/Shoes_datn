function handleCredentialResponse(response) {
    console.log(response);
    console.log(response.credential);
    sendLoginRequestToBackend(response.credential);
}

async function sendLoginRequestToBackend(accessToken) {
    var response = await fetch('http://localhost:8080/api/login/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: accessToken
    })
    var result = await response.json();

    if (response.status < 300) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        if (result.user.authorities.name === "ROLE_ADMIN") {
            window.location.href = 'admin/index';
        }
        if (result.user.authorities.name === "ROLE_USER") {
            window.location.href = 'index';
        }
    }
    if (response.status == exceptionCode) {
        if (result.errorCode == 300) {
            swal({
                title: "Thông báo",
                text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
                type: "warning"
            }, function() {
                window.location.href = 'confirm?email=' + username
            });
        } else {
            toastr.warning(result.defaultMessage);
        }
    }
}


async function login() {
    var url = 'http://localhost:8080/api/login'
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var user = {
        "username": username,
        "password": password,
        "tokenFcm":tokenFcm
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        if (result.user.authorities.name === "ROLE_ADMIN") {
            window.location.href = 'admin/index';
        }
        if (result.user.authorities.name === "ROLE_USER") {
            window.location.href = 'index';
        }
    }
    if (response.status == exceptionCode) {
        if (result.errorCode == 300) {
            swal({
                title: "Thông báo",
                text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
                type: "warning"
            }, function() {
                window.location.href = 'confirm?email=' + username
            });
        } else {
            toastr.warning(result.defaultMessage);
        }
    }
}




function getRole(role) {
    switch(role) {
        case 'ROLE_ADMIN':
            return 'Quản trị viên';
        case 'ROLE_USER':
            return 'Người dùng';
        default:
            return role;
    }
}

function loadUserInfo() {
    var userData = localStorage.getItem("user");
    if (!userData) {
        window.location.href = 'login';
        return;
    }

    var user = JSON.parse(userData);


    var avaaccount = document.querySelector('.avaaccount');
    if (avaaccount) {
        var usernameDiv = document.createElement('div');
        usernameDiv.className = 'username-display';
        usernameDiv.innerHTML = `<span class="user-fullname">${user.fullname || 'Người dùng'}</span>`;
        avaaccount.insertBefore(usernameDiv, avaaccount.querySelector('.btnlogoutacc'));
    }


    var infoHtml = `
    <div role="tabpanel" class="tab-pane" id="infor">
        <div class="headeraccount">
            <p class="fontyel">Thông tin cá nhân</p>
           
        </div>
        <div class="contentacc">
            <div class="row singleadd">
                <div class="col-lg-11 col-md-11 col-sm-12 col-12">
                    <table class="table tableadd">
                        <tr>
                            <td class="tdleft">Họ tên:</td>
                            <td class="tdright">${user.fullname || 'Chưa cập nhật'}</td>
                        </tr>
                        <tr>
                            <td class="tdleft">Email:</td>
                            <td class="tdright">${user.email || 'Chưa cập nhật'}</td>
                        </tr>
                        <tr>
                            <td class="tdleft">Số điện thoại:</td>
                            <td class="tdright">${user.phone || 'Chưa cập nhật'}</td>
                        </tr>
                        <tr>
                            <td class="tdleft">Vai trò:</td>
                            <td class="tdright">${getRole(user.authorities.name)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>`;


    var navTabs = document.querySelector('.sinv');
    if (navTabs) {
        var infoTabHtml = `
        <div nofi="infor" onclick="changeLink(this,'infor')" class="tabdv">
            <a data-toggle="tab" href="#infor"><img class="imgau" src="image/user.svg"> Tài khoản của tôi</a>
        </div>`;
        navTabs.insertAdjacentHTML('afterbegin', infoTabHtml);
    }


    var contentTab = document.querySelector('.contentab');
    if (contentTab) {
        contentTab.insertAdjacentHTML('afterbegin', infoHtml);
    }

    document.getElementById('edit-fullname').value = user.fullname || '';
    document.getElementById('edit-phone').value = user.phone || '';
}


function changeLink(e, link) {
    var tabs = document.getElementsByClassName("tabdv");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("activetabdv");
    }

    e.classList.add('activetabdv');

    var tabPanes = document.getElementsByClassName("tab-pane");
    for (var i = 0; i < tabPanes.length; i++) {
        tabPanes[i].classList.remove("active");
    }
    document.getElementById(link).classList.add('active');
}



async function regis() {
    var url = 'http://localhost:8080/api/regis'
    var email = document.getElementById("email").value
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var password = document.getElementById("password").value
    var user = {
        "fullname": fullname,
        "email": email,
        "phone": phone,
        "password": password
    }
    if(!email){
        toastr.warning('Vui lòng nhập email!');
        return;
    }
    if(!fullname){
        toastr.warning('Vui lòng nhập họ tên!');
        return;
    }
    if(!phone){
        toastr.warning('Vui lòng nhập điện thoại!');
        return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        toastr.warning("Số điện thoại không hợp lệ!");
        return;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Đăng ký thành công! Hãy check email của bạn!",
                type: "success"
            },
            function() {
                window.location.href = 'confirm?email=' + result.email
            });
    }
    if (response.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }

}


async function confirmAccount() {
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = document.getElementById("maxacthuc").value;
    var url = 'http://localhost:8080/api/active-account?email=' + email + '&key=' + key
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Xác nhận tài khoản thành công!",
                type: "success"
            },
            function() {
                window.location.href = 'login'
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}

async function forgorPassword() {
    var email = document.getElementById("email").value
    var url = 'http://localhost:8080/api/forgot-password?email=' + email
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status < 300) {
        swal({
                title: "",
                text: "Mật khẩu mới đã được gửi về email của bạn",
                type: "success"
            },
            function() {
                window.location.replace("login")
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}

async function changePassword() {
    var token = localStorage.getItem("token");
    var oldpass = document.getElementById("oldpass").value
    var newpass = document.getElementById("newpass").value
    var renewpass = document.getElementById("renewpass").value
    var url = 'http://localhost:8080/api/user/change-password';
    if (newpass != renewpass) {
        alert("Mật khẩu mới không trùng khớp");
        return;
    }
    var passw = {
        "oldPass": oldpass,
        "newPass": newpass
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(passw)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Cập nhật mật khẩu thành công, hãy đăng nhập lại",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}