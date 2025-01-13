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
    var url = 'http://localhost:8080/api/login';
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    var user = {
        "username": username,
        "password": password,
        "tokenFcm": tokenFcm
    };

    if (!username) {
        toastr.warning('Vui lòng nhập email!');
        return;
    }

    if (!password) {
        toastr.warning('Vui lòng nhập mật khẩu!');
        return;
    }

    try {
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
                    window.location.href = 'confirm?email=' + username;
                });
            } else {
                toastr.warning(result.defaultMessage);
            }
        }
    } catch (error) {
        toastr.error('Đã xảy ra lỗi, vui lòng thử lại!');
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

function changeLink(element, tab) {
    document.querySelectorAll('.tabdv').forEach(el => {
        el.classList.remove('activetabdv');
    });

    element.classList.add('activetabdv');

    document.querySelectorAll('.tab-pane').forEach(el => {
        el.classList.remove('active');
    });

    document.getElementById(tab).classList.add('active');
}
function activateTab(tabName) {
    const tabElement = document.querySelector(`[onclick="changeLink(this,'${tabName}')"]`);
    if (tabElement) {
        changeLink(tabElement, tabName);
    }
}

window.onload = function() {
    loadMenu();
    loadAddress();
    loadAddressUser();
    loadMyInvoice();
    loadUserInfo();


    const hash = window.location.hash.substring(1);
    if (hash) {
        activateTab(hash);
    } else {
        activateTab('invoice');
    }
}

window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        activateTab(hash);
    }
});



async function regis() {
    var url = 'http://localhost:8080/api/regis';
    var email = document.getElementById("email").value.trim();
    var fullname = document.getElementById("fullname").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var password = document.getElementById("password").value.trim();

    var user = {
        "fullname": fullname,
        "email": email,
        "phone": phone,
        "password": password
    };

    if (!fullname) {
        toastr.warning('Vui lòng nhập họ tên!');
        return;
    }
    if (!phone) {
        toastr.warning('Vui lòng nhập điện thoại!');
        return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        toastr.warning(" Vui lòng nhập số điện thoại hợp lệ!");
        return;
    }
    if (!email) {
        toastr.warning('Vui lòng nhập email!');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toastr.warning('Vui lòng nhập email hợp lệ!');
        return;
    }
    if (!password) {
        toastr.warning('Vui lòng nhập mật khẩu');
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(user)
        });
        var result = await response.json();

        if (response.ok) {
            swal({
                title: "Thông báo",
                text: "Đăng ký thành công! Hãy check email của bạn!",
                type: "success"
            }, function() {
                window.location.href = 'confirm?email=' + result.email;
            });
        } else if (response.status === exceptionCode) {
            toastr.warning(result.defaultMessage);
        }
    } catch (error) {
        toastr.error('Đã xảy ra lỗi, vui lòng thử lại!');
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

async function forgotPassword() {
    var email = document.getElementById("email").value.trim();
    var url = 'http://localhost:8080/api/forgot-password?email=' + email
    const res = await fetch(url, {
        method: 'POST'
    });
    if(!email){
        toastr.warning('Vui lòng nhập email!');
        return;
    }
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
    var oldpass = document.getElementById("oldpass").value;
    var newpass = document.getElementById("newpass").value;
    var renewpass = document.getElementById("renewpass").value;
    var url = 'http://localhost:8080/api/user/change-password';


    if (!oldpass) {
        toastr.warning("Vui lòng nhập mật khẩu cũ.");
        return;
    }
    if (!newpass) {
        toastr.warning("Vui lòng nhập mật khẩu mới.");
        return;
    }
    if (!renewpass) {
        toastr.warning("Vui lòng nhập lại mật khẩu mới.");
        return;
    }


    if (newpass !== renewpass) {
        toastr.warning("Mật khẩu mới không trùng khớp.");
        return;
    }

    var passw = {
        "oldPass": oldpass,
        "newPass": newpass
    };

    try {
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
            }, function() {
                window.location.reload();
            });
        } else if (response.status == exceptionCode) {
            var result = await response.json();
            toastr.warning(result.defaultMessage);
        }
    } catch (error) {
        toastr.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
}
