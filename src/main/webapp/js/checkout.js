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
        console.log("Đang xử lý mua ngay...");
        var buyNowData = sessionStorage.getItem("buy_now_item");
        console.log("Buy Now Data:", buyNowData);

        if (!buyNowData) {
            toastr.error("Có lỗi xảy ra!");
            setTimeout(() => window.location.replace("cart"), 2000);
            return;
        }

        try {
            list = JSON.parse(buyNowData);
            console.log("Parsed Buy Now List:", list);

            if (!Array.isArray(list) || list.length === 0) {
                throw new Error("Dữ liệu mua ngay không hợp lệ");
            }

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
            toastr.error("Có lỗi xảy ra khi xử lý dữ liệu!");
            setTimeout(() => window.location.replace("cart"), 2000);
            return;
        }
    }
    else {
        var listcart = localStorage.getItem("product_cart");
        var selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");

        if (!listcart) {
            toastr.error("Bạn chưa có sản phẩm nào trong giỏ hàng!");
            setTimeout(() => window.location.replace("cart"), 2000);
            return;
        }

        if (selectedItems.length === 0) {
            toastr.error("Vui lòng chọn sản phẩm để thanh toán!");
            setTimeout(() => window.location.replace("cart"), 2000);
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
        main = list.map((item, index) => processItem(item, index)).join('');
    } else {
        main = list
            .filter((_, index) => selectedItems.includes(index))
            .map((item, index) => processItem(item, index))
            .join('');
    }

    if (main === '') {
        toastr.error("Không có sản phẩm nào được chọn.");
        setTimeout(() => window.location.replace("cart"), 2000);
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
function showError(message) {
    const errorElement = document.getElementById("blockmessErr");
    const messageElement = document.getElementById("messerr");

    if (errorElement && messageElement) {
        messageElement.textContent = message;
        errorElement.style.display = "block";
    } else {
        console.error("Element blockmessErr or messerr not found in DOM.");
    }
}

function clearVoucher() {
    resetVoucherState();
    const voucherModal = bootstrap.Modal.getInstance(document.getElementById("voucherModal"));
    if (voucherModal) {
        voucherModal.hide();
    }
}


function resetVoucherState() {

    voucherId = null;
    voucherCode = null;
    discountVou = 0;


    const moneyDiscount = document.getElementById("moneyDiscount");
    const totalFi = document.getElementById("totalfi");
    const blockMessErr = document.getElementById("blockmessErr");
    const blockMess = document.getElementById("blockmess");
    const codevoucher = document.getElementById("codevoucher");

    if (moneyDiscount) moneyDiscount.innerHTML = formatmoneyCheck(0);
    if (totalFi) totalFi.innerHTML = formatmoneyCheck(total);
    if (blockMessErr) blockMessErr.style.display = "none";
    if (blockMess) blockMess.style.display = "none";
    if (codevoucher) codevoucher.value = '';
}


async function loadVoucher() {
    var code = document.getElementById("codevoucher").value.trim();

    const blockMess = document.getElementById("blockmess");
    if (blockMess) blockMess.style.display = "none"; // Hide success message

    if (!code) {
        showError("Vui lòng nhập mã voucher!");
        return;
    }

    var url = `http://localhost:8080/api/voucher/public/findByCode?code=${code}&amount=${total}`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.status >= 400) {
            const errorMessage = result.defaultMessage || "Mã voucher không hợp lệ!";
            showError(errorMessage);
            resetVoucherState();
            return;
        }

        voucherId = result.id;
        voucherCode = result.code;
        discountVou = result.discount;

        const blockMessErr = document.getElementById("blockmessErr");
        const moneyDiscount = document.getElementById("moneyDiscount");
        const totalFi = document.getElementById("totalfi");

        if (blockMessErr) blockMessErr.style.display = "none";
        if (blockMess) blockMess.style.display = "block";
        if (moneyDiscount) moneyDiscount.innerHTML = formatmoneyCheck(discountVou);
        if (totalFi) totalFi.innerHTML = formatmoneyCheck(total - discountVou);

    } catch (error) {
        console.error("Lỗi khi gọi API voucher:", error);
        showError("Không thể kết nối tới server!");
        resetVoucherState();
    }
}


function toggleVoucherList() {
    const voucherList = document.getElementById('voucherList');
    if (!voucherList.classList.contains('show')) {
        loadVoucherList();
        voucherList.classList.add('show');
    } else {
        voucherList.classList.remove('show');
    }
}
async function loadVoucherList() {
    try {
        const response = await fetch('http://localhost:8080/api/voucher/public/findAll');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const vouchers = await response.json();

        if (!Array.isArray(vouchers)) {
            throw new Error("Không nhận được dữ liệu hợp lệ từ server.");
        }

        const voucherList = document.getElementById("voucherList");
        if (!voucherList) {
            console.error("Element voucherList not found in DOM.");
            return;
        }

        const currentDate = new Date();
        let html = "";

        vouchers.forEach(voucher => {
            if (!voucher || !voucher.endDate || voucher.discount === undefined || voucher.minAmount === undefined) {
                return;
            }

            const endDate = new Date(voucher.endDate);
            const isExpired = endDate < currentDate;
            const isDisabled = voucher.block || isExpired || total < voucher.minAmount;

            html += `
                <div class="voucher-item ${isDisabled ? 'disabled' : ''}">
                    <div class="voucher-info">
                        <div class="shop-badge">Shop Voucher</div>
                        <div class="voucher-discount">Giảm ${formatmoneyCheck(voucher.discount)}</div>
                        <div class="voucher-min">Đơn tối thiểu ${formatmoneyCheck(voucher.minAmount)}</div>
                        <div class="voucher-expiry">HSD: ${endDate.toLocaleDateString('vi-VN')}</div>
                        ${isExpired ? '<div class="voucher-expired">Đã hết hạn</div>' : ''}
                        ${voucher.block ? '<div class="voucher-blocked">Không khả dụng</div>' : ''}
                    </div>
                    <button class="save-btn" 
                            onclick="selectVoucher('${voucher.code}')"
                            ${isDisabled ? 'disabled' : ''}>
                        ${isDisabled ? 'Không khả dụng' : 'Áp dụng'}
                    </button>
                </div>
            `;
        });

        voucherList.innerHTML = html || '<div class="no-vouchers">Không có voucher khả dụng</div>';
    } catch (error) {
        console.error("Lỗi khi tải danh sách voucher:", error);
        const voucherList = document.getElementById("voucherList");
        if (voucherList) {
            voucherList.innerHTML = '<div class="error-message">Không thể tải danh sách voucher. Vui lòng thử lại sau.</div>';
        }
    }
}



function selectVoucher(code) {
    if (!code) {
        showError("Mã voucher không hợp lệ");
        return;
    }

    document.getElementById("codevoucher").value = code;
    loadVoucher();
    const voucherModal = bootstrap.Modal.getInstance(document.getElementById("voucherModal"));
    voucherModal.hide();
}


function showError(message) {
    const errorElement = document.getElementById('blockmessErr');
    const messageElement = document.getElementById('messerr');
    messageElement.textContent = message;
    errorElement.style.display = 'block';
}

async function paymentCod() {
    if (!listSize || listSize.length === 0) {
        toastr.error("Không có sản phẩm nào được chọn!");
        return;
    }


    var userAddressId = document.getElementById("sodiachi")?.value?.trim();
    if (!userAddressId) {
        // Nếu chưa có địa chỉ, hiển thị modal thêm mới địa chỉ
        $('#modaladd').modal('show'); // Sử dụng jQuery để hiển thị modal
        return;
    }

    var orderDto = {
        "payType": "PAYMENT_DELIVERY",
        "userAddressId": userAddressId,
        "voucherCode": voucherCode,
        "note": document.getElementById("ghichudonhang").value.trim(),
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

        if (res.ok) {
            var currentCart = JSON.parse(localStorage.getItem("product_cart")) || [];
            var selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");

            var remainingCart = currentCart.filter((_, index) => !selectedItems.includes(index));
            localStorage.setItem("product_cart", JSON.stringify(remainingCart));
            localStorage.removeItem("selected_items");

            swal({
                title: "Thông báo",
                text: "Đặt hàng thành công!",
                type: "success"
            }, function () {
                window.location.href = 'account#invoice';
            });
        } else {
            const errorData = await res.json();
            toastr.error(errorData.message || "Có lỗi xảy ra khi đặt hàng!");
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
            var buyNowData = sessionStorage.getItem("buy_now_data");
            if (buyNowData) {
                var buyNowList = JSON.parse(buyNowData);
                listSize = buyNowList.map(item => ({
                    "idProductSize": item.size.id,
                    "quantity": item.quantiy
                }));
            }
        } else {
            var savedListSize = sessionStorage.getItem("cart_list_size");
            if (savedListSize) {
                listSize = JSON.parse(savedListSize);
            }
        }
    }

    if (!Array.isArray(listSize) || listSize.length === 0) {
        console.error("ListSize không hợp lệ:", listSize);
        document.getElementById("thatbai").style.display = 'block';
        document.getElementById("thanhcong").style.display = 'none';
        document.getElementById("errormess").innerHTML = "Danh sách sản phẩm không hợp lệ!";
        return;
    }

    var orderDto = {
        "payType": "PAYMENT_GPAY",
        "userAddressId": sessionStorage.getItem("sodiachi"),
        "voucherCode": sessionStorage.getItem("voucherCode"),
        "note": sessionStorage.getItem("ghichudonhang"),
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

            setTimeout(() => {
                window.location.href = 'account#invoice';
            }, 2000);
        } else {
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
function checkout() {
    var confirmCheckout = confirm("Xác nhận đặt hàng!");
    if (!confirmCheckout) {
        return;
    }

    // Kiểm tra phương thức thanh toán
    var paytype = $('input[name=paytype]:checked').val();

    // Kiểm tra địa chỉ giao hàng
    var userAddressId = document.getElementById("sodiachi")?.value?.trim();
    if (!userAddressId) {
        // Hiển thị modal thêm địa chỉ
        const addAddressModal = new bootstrap.Modal(document.getElementById("modaladd"));
        addAddressModal.show();
        return;
    }

    // Xử lý thanh toán dựa trên phương thức
    if (paytype === "cod") {
        paymentCod();
    } else if (paytype === "gpay") {
        requestPayMentGpay();
    }
}

async function requestPayMentGpay() {
    var ghichu = document.getElementById("ghichudonhang").value;
    var sodiachi = document.getElementById("sodiachi").value;
    var returnurl = 'http://localhost:8080/payment';

    // Save necessary data to session storage
    sessionStorage.setItem('ghichudonhang', ghichu);
    sessionStorage.setItem('voucherCode', voucherCode);
    sessionStorage.setItem('paytype', "GPAY");
    sessionStorage.setItem('sodiachi', sodiachi);

    let paymentDto;
    const urlParams = new URLSearchParams(window.location.search);
    const isBuyNow = urlParams.get('type') === 'buynow';

    // Show loading state
    showLoadingOverlay();

    if (isBuyNow) {
        var buyNowData = sessionStorage.getItem("buy_now_item");
        if (!buyNowData) {
            hideLoadingOverlay();
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
        if (!listSize || listSize.length === 0) {
            hideLoadingOverlay();
            toastr.error("Không có sản phẩm nào được chọn!");
            return;
        }

        sessionStorage.setItem('payment_type', 'cart');
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

            window.location.href = result.url;
        }
        if (res.status == exceptionCode) {
            hideLoadingOverlay();
            toastr.warning(result.defaultMessage);
        }
    } catch (error) {
        console.error("Lỗi khi thực hiện thanh toán qua GPay:", error);
        hideLoadingOverlay();
        toastr.error("Có lỗi xảy ra khi thực hiện thanh toán!");
    }
}

function showLoadingOverlay() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Đang xử lý thanh toán...</div>
        `;
        document.body.appendChild(overlay);
    }
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

const style = document.createElement('style');
style.textContent = `
    #loadingOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 9999;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }

    .loading-text {
        font-size: 18px;
        color: #333;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
