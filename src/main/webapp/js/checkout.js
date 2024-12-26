var token = localStorage.getItem("token");

async function checkroleUser() {
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/user/check-role-user';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('login')
    }
}

var total = 0;
var listSize = [];

async function loadCartCheckOut() {
    const urlParams = new URLSearchParams(window.location.search);
    const isBuyNow = urlParams.get('type') === 'buynow';
    var list;

    if (isBuyNow) {
        // Thêm debug log
        console.log("Đang xử lý mua ngay...");

        var buyNowData = sessionStorage.getItem("buy_now_item");
        console.log("Buy Now Data:", buyNowData); // Debug

        if (!buyNowData) {
            alert("Có lỗi xảy ra!");
            window.location.replace("cart");
            return;
        }

        try {
            list = JSON.parse(buyNowData);
            console.log("Parsed Buy Now List:", list); // Debug

            if (!Array.isArray(list) || list.length === 0) {
                throw new Error("Dữ liệu mua ngay không hợp lệ");
            }

            // Kiểm tra cấu trúc dữ liệu
            const validItem = list.every(item =>
                item.product &&
                item.color &&
                item.size &&
                item.quantiy &&
                item.product.price
            );

            if (!validItem) {
                throw new Error("Cấu trúc dữ liệu sản phẩm không hợp lệ");
            }
        } catch (error) {
            console.error("Lỗi khi xử lý dữ liệu mua ngay:", error);
            alert("Có lỗi xảy ra khi xử lý dữ liệu!");
            window.location.replace("cart");
            return;
        }
    } else {
        var listcart = localStorage.getItem("product_cart");
        var selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");

        if (!listcart) {
            alert("Bạn chưa có sản phẩm nào trong giỏ hàng!");
            window.location.replace("cart");
            return;
        }
        if (!isBuyNow && selectedItems.length === 0) {
            alert("Vui lòng chọn sản phẩm để thanh toán!");
            window.location.replace("cart");
            return;
        }

        list = JSON.parse(listcart);
    }

    var main = '';
    total = 0;
    listSize = [];

    const processItem = (item, index) => {
        if (!item.product || !item.color || !item.size || !item.quantiy) {
            console.error("Item không hợp lệ:", item);
            return '';
        }

        console.log("Đang xử lý item:", item);

        total += Number(item.quantiy * item.product.price);

        listSize.push({
            "idProductSize": item.size.id,
            "quantity": item.quantiy
        });

        return `<div class="row">
            <div class="col-lg-2 col-md-3 col-sm-3 col-3 colimgcheck">
                <img src="${item.colorImage || item.product.imageBanner}" class="procheckout">
                <span class="slpro">${item.quantiy}</span>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-6 col-6">
                <span class="namecheck">${item.product.name}</span>
                <span class="colorcheck">${item.color.colorName} / ${item.size.sizeName}</span>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-3 pricecheck">
                <span>${formatmoneyCheck(item.quantiy * item.product.price)}</span>
            </div>
        </div>`;
    };

    if (isBuyNow) {
        console.log("List mua ngay:", list);
        main = list.map((item, index) => processItem(item, index)).join('');
    } else {
        main = list
            .filter((_, index) => selectedItems.includes(index))
            .map((item, index) => processItem(item, index))
            .join('');
    }

    if (main === '') {
        alert("Không có sản phẩm nào được chọn.");
        window.location.replace("cart");
        return;
    }

    console.log("Final Main HTML:", main);
    console.log("Total:", total);
    console.log("ListSize:", listSize);

    document.getElementById("listproductcheck").innerHTML = main;
    document.getElementById("totalAmount").innerHTML = formatmoneyCheck(total);
    document.getElementById("totalfi").innerHTML = formatmoneyCheck(total + 0);

    if (isBuyNow) {
        console.log("Giữ lại buy_now_item cho quá trình thanh toán");
    }
}

function formatmoneyCheck(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}
var voucherId = null;
var voucherCode = null;
var discountVou = 0;
async function loadVoucher() {
    var code = document.getElementById("codevoucher").value

    var url = 'http://localhost:8080/api/voucher/public/findByCode?code=' + code + '&amount=' + total;
    const response = await fetch(url, {});
    var result = await response.json();
    if (response.status == exceptionCode) {
        var mess = result.defaultMessage
        document.getElementById("messerr").innerHTML = mess;
        document.getElementById("blockmessErr").style.display = 'block';
        document.getElementById("blockmess").style.display = 'none';
        voucherCode = null;
        voucherId = null;
        discountVou = 0;
        document.getElementById("moneyDiscount").innerHTML = formatmoneyCheck(0);
        document.getElementById("totalfi").innerHTML = formatmoneyCheck(total + 0); // Changed from +20000 to +0
    }
    if (response.status < 300) {
        voucherId = result.id;
        voucherCode = result.code;
        discountVou = result.discount;
        document.getElementById("blockmessErr").style.display = 'none';
        document.getElementById("blockmess").style.display = 'block';
        document.getElementById("moneyDiscount").innerHTML = formatmoneyCheck(result.discount);
        document.getElementById("totalfi").innerHTML = formatmoneyCheck(total - result.discount + 0); // Changed from +20000 to +0
    }
}
function checkout() {
    var con = confirm("Xác nhận đặt hàng!");
    if (con == false) {
        return;
    }
    var paytype = $('input[name=paytype]:checked').val()
    if (paytype == "momo") {
        requestPayMentMomo()
    }
    if (paytype == "cod") {
        paymentCod();
    }
    if (paytype == "vnpay") {
        requestPayMentVnpay();
    }
    if (paytype == "gpay") {
        requestPayMentGpay();
    }
}

async function requestPayMentGpay() {
    var ghichu = document.getElementById("ghichudonhang").value;
    var sodiachi = document.getElementById("sodiachi").value;
    var returnurl = 'http://localhost:8080/payment';

    // Lưu thông tin chung
    sessionStorage.setItem('ghichudonhang', ghichu);
    sessionStorage.setItem('voucherCode', voucherCode);
    sessionStorage.setItem('paytype', "GPAY");
    sessionStorage.setItem('sodiachi', sodiachi);

    let paymentDto;
    const urlParams = new URLSearchParams(window.location.search);
    const isBuyNow = urlParams.get('type') === 'buynow';

    if (isBuyNow) {
        // Xử lý mua ngay
        var buyNowData = sessionStorage.getItem("buy_now_item");
        if (!buyNowData) {
            toastr.error("Không tìm thấy thông tin sản phẩm!");
            return;
        }

        var buyNowList = JSON.parse(buyNowData);
        sessionStorage.setItem('payment_type', 'buy_now');
        sessionStorage.setItem('buy_now_data', buyNowData);

        paymentDto = {
            "content": "Thanh toán đơn hàng mua ngay",
            "returnUrl": returnurl,
            "notifyUrl": returnurl,
            "codeVoucher": voucherCode,
            "listProductSize": buyNowList.map(item => ({
                "idProductSize": item.size.id,
                "quantity": item.quantiy
            }))
        };
    } else {
        // Xử lý mua từ giỏ hàng
        if (!listSize || listSize.length === 0) {
            toastr.error("Không có sản phẩm nào được chọn!");
            return;
        }

        sessionStorage.setItem('payment_type', 'cart');
        // Lưu listSize hiện tại để dùng sau này
        sessionStorage.setItem('cart_list_size', JSON.stringify(listSize));

        paymentDto = {
            "content": "Thanh toán đơn hàng từ giỏ hàng",
            "returnUrl": returnurl,
            "notifyUrl": returnurl,
            "codeVoucher": voucherCode,
            "listProductSize": listSize
        };
    }

    try {
        const res = await fetch('http://localhost:8080/api/gpay/urlpayment', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(paymentDto)
        });

        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == exceptionCode) {
            toastr.warning(result.defaultMessage);
        }
    } catch (error) {
        console.error("Lỗi khi thực hiện thanh toán qua GPay:", error);
        toastr.error("Có lỗi xảy ra khi thực hiện thanh toán!");
    }
}
async function paymentCod() {
    if (!listSize || listSize.length === 0) {
        toastr.error("Không có sản phẩm nào được chọn!");
        return;
    }

    var orderDto = {
        "payType": "PAYMENT_DELIVERY",
        "userAddressId": document.getElementById("sodiachi").value,
        "voucherCode": voucherCode,
        "note": document.getElementById("ghichudonhang").value,
        "listProductSize": listSize
    };

    var url = 'http://localhost:8080/api/invoice/user/create';
    var token = localStorage.getItem("token");

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(orderDto)
        });

        if (res.status < 300) {

            var currentCart = JSON.parse(localStorage.getItem("product_cart"));
            var selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");

            var remainingCart = currentCart.filter((_, index) => !selectedItems.includes(index));


            localStorage.setItem("product_cart", JSON.stringify(remainingCart));
            localStorage.removeItem("selected_items");

            swal({
                title: "Thông báo",
                text: "Đặt hàng thành công!",
                type: "success"
            }, function () {
                window.location.replace("account#invoice")
            });
        }
    } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        toastr.error("Có lỗi xảy ra khi đặt hàng!");
    }
}
async function paymentOnline() {
    var uls = new URL(document.URL);
    var statusGpay = uls.searchParams.get("status");
    var merchantOrderId = uls.searchParams.get("merchant_order_id");
    var paytype = sessionStorage.getItem("paytype");
    var paymentType = sessionStorage.getItem("payment_type");

    let listSize = [];

    if (paytype === "GPAY") {
        if (paymentType === 'buy_now') {
            // Xử lý mua ngay
            var buyNowData = sessionStorage.getItem("buy_now_data");
            if (buyNowData) {
                var buyNowList = JSON.parse(buyNowData);
                listSize = buyNowList.map(item => ({
                    "idProductSize": item.size.id,
                    "quantity": item.quantiy
                }));
            }
        } else {
            // Xử lý mua từ giỏ hàng
            var savedListSize = sessionStorage.getItem("cart_list_size");
            if (savedListSize) {
                listSize = JSON.parse(savedListSize);
            }
        }
    }

    // Kiểm tra listSize
    if (!Array.isArray(listSize) || listSize.length === 0) {
        console.error("ListSize không hợp lệ:", listSize);
        document.getElementById("thatbai").style.display = 'block';
        document.getElementById("thanhcong").style.display = 'none';
        document.getElementById("errormess").innerHTML = "Danh sách sản phẩm không hợp lệ!";
        return;
    }

    var note = sessionStorage.getItem("ghichudonhang");
    var sodiachi = sessionStorage.getItem("sodiachi");
    var voucherCode = sessionStorage.getItem("voucherCode");

    var orderDto = {
        "payType": "PAYMENT_GPAY",
        "userAddressId": sodiachi,
        "voucherCode": voucherCode,
        "note": note,
        "statusGpay": statusGpay,
        "merchantOrderId": merchantOrderId,
        "listProductSize": listSize
    };

    try {
        const res = await fetch('http://localhost:8080/api/invoice/user/create', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(orderDto)
        });

        var result = await res.json();

        if (res.status < 300) {
            if (paymentType === 'buy_now') {
                sessionStorage.removeItem("buy_now_data");
                sessionStorage.removeItem("buy_now_item");
            } else {
                var currentCart = JSON.parse(localStorage.getItem("product_cart"));
                var selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");
                var remainingCart = currentCart.filter((_, index) => !selectedItems.includes(index));
                localStorage.setItem("product_cart", JSON.stringify(remainingCart));
                localStorage.removeItem("selected_items");
            }

            sessionStorage.removeItem("ghichudonhang");
            sessionStorage.removeItem("voucherCode");
            sessionStorage.removeItem("paytype");
            sessionStorage.removeItem("sodiachi");
            sessionStorage.removeItem("payment_type");
            sessionStorage.removeItem("cart_list_size");

            document.getElementById("thanhcong").style.display = 'block';
            document.getElementById("thatbai").style.display = 'none';
        } else if (res.status == exceptionCode) {
            document.getElementById("thatbai").style.display = 'block';
            document.getElementById("thanhcong").style.display = 'none';
            document.getElementById("errormess").innerHTML = result.defaultMessage;
        }
    } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        document.getElementById("thatbai").style.display = 'block';
        document.getElementById("thanhcong").style.display = 'none';
        document.getElementById("errormess").innerHTML = "Có lỗi xảy ra khi xử lý thanh toán!";
    }
}