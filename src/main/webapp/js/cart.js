var idColorCart = -1;
var selectedColorImage = null;

async function clickColor(e, name, idColor) {
    idColorCart = idColor;

    var img = document.getElementsByClassName("imgldetail");
    for (i = 0; i < img.length; i++) {
        document.getElementsByClassName("imgldetail")[i].classList.remove('imgactive');
    }
    e.classList.add('imgactive');

    selectedColorImage = e.src;

    document.getElementById("colorname").innerHTML = name;
    try {
        var url = `http://localhost:8080/api/product-size/public/find-by-product-color?idProColor=${idColor}`;
        const response = await fetch(url, {});
        var list = await response.json();

        var main = '';
        var totalQuantity = 0;

        for (i = 0; i < list.length; i++) {
            if (list[i].quantity > 0) {
                main += `
                <div class="colsize col-lg-2 col-md-2 col-sm-2 col-2">
                    <label onclick="clickSize(this)" class="radio-custom" for="size${list[i].id}">
                        ${list[i].sizeName}
                        <input value="${list[i].id}" type="radio" name="sizepro" id="size${list[i].id}">
                    </label>
                </div>`;
                totalQuantity += list[i].quantity;
            } else {
                main += `
                <div class="colsize col-lg-2 col-md-2 col-sm-2 col-2">
                    <label class="radio-custom disablesize" for="size${list[i].id}">
                        ${list[i].sizeName}
                    </label>
                </div>`;
            }
        }

        document.getElementById("listsize").innerHTML = main;

        document.getElementById("quantityA").innerHTML = `Số lượng: ${totalQuantity}`;
    } catch (error) {
        console.error('Error fetching sizes:', error);
    }
}
async function addCart(product) {
    var sizeId = null;
    try {
        sizeId = document.querySelector('input[name="sizepro"]:checked').value;
    } catch (error) {
        toastr.error("Bạn chưa chọn kích thước sản phẩm");
        return;
    }
    var color = null;
    var size = null;
    var listColor = product.productColors;
    for (i = 0; i < listColor.length; i++) {
        if (listColor[i].id == idColorCart) {
            color = listColor[i];
        }
    }
    var listSize = color.productSizes;
    for (i = 0; i < listSize.length; i++) {
        if (listSize[i].id == sizeId) {
            size = listSize[i];
        }
    }
    // Kiểm tra số lượng nhập
    var quantityAdded = Number(document.getElementById("inputslcart").value);
    if (isNaN(quantityAdded) || quantityAdded < 1) {
        toastr.error("Số lượng không hợp lệ. Vui lòng nhập số lượng lớn hơn hoặc bằng 1.");
        document.getElementById("inputslcart").value = 1; // Đặt lại giá trị mặc định
        return;
    }
    console.log(quantityAdded);
    var totalQuantityElement = document.getElementById("quantityA");
    console.log(totalQuantityElement);
    var totalQuantity = Number(totalQuantityElement.innerHTML.replace("Số lượng: ", ""));
    if (quantityAdded > totalQuantity) {
        toastr.error("Vượt quá số lượng sản phẩm có sẵn");
        return;
    }

    var obj = {
        "product": product,
        "color": color,
        "size": size,
        "quantiy": document.getElementById("inputslcart").value,
        "colorImage": selectedColorImage || color.linkImage || product.imageBanner,
        "uniqueKey": `${product.id}_${color.id}_${sizeId}`
    };

    if (localStorage.getItem("product_cart") == null) {
        var listproduct = [];
        listproduct.push(obj);
        window.localStorage.setItem('product_cart', JSON.stringify(listproduct));
    } else {
        var list = JSON.parse(localStorage.getItem("product_cart"));

        var existingProductIndex = list.findIndex(item =>
            item.uniqueKey === obj.uniqueKey
        );

        if (existingProductIndex !== -1) {
            var currentQuantity = Number(list[existingProductIndex].quantiy);
            var newTotalQuantity = currentQuantity + Number(obj.quantiy);

            try {
                var url = `http://localhost:8080/api/product-size/public/find-quantity-by-color-and-size?colorId=${color.id}&sizeId=${sizeId}`;
                const response = await fetch(url);
                var maxQuantity = await response.json();

                if (newTotalQuantity > maxQuantity) {
                    toastr.error(`Bạn đã thêm hết sản phẩm này vào giỏ hàng. Không thể thêm nữa.`);
                    return;
                }

                list[existingProductIndex].quantiy = newTotalQuantity;
            } catch (error) {
                console.error("Lỗi kiểm tra số lượng sản phẩm:", error);
                toastr.error("Không thể kiểm tra số lượng sản phẩm");
                return;
            }
        } else {
            list.push(obj);
        }

            window.localStorage.setItem('product_cart', JSON.stringify(list));

            totalQuantity -= quantityAdded;
            totalQuantityElement.innerHTML = `Số lượng: ${totalQuantity}`;

            toastr.success("Thêm giỏ hàng thành công");
            loadAllCart();
            loadCartMenu();
        }
    }

window.addEventListener("load", () => {
    const message = localStorage.getItem("cart_message");
    if (message) {
        toastr.success(message);
        localStorage.removeItem("cart_message");
    }
});

async function addLatestCart(product) {
    var sizeId = null;
    var color = null;
    var size = null;

    var listColor = product.productColors;
    if (listColor.length > 0) {
        color = listColor[0];
    } else {
        toastr.error("Sản phẩm không có màu để chọn");
        return;
    }

    var listSize = color.productSizes;
    if (listSize.length > 0) {
        size = listSize[0];
        sizeId = size.id;
    } else {
        toastr.error("Sản phẩm không có size để chọn");
        return;
    }

    var obj = {
        "product": product,
        "color": color,
        "size": size,
        "quantiy": document.getElementById("inputslcart")?.value || 1,
        "colorImage": color.linkImage || product.imageBanner,
        "isLatestCart": true
    };

    var listproduct = [obj];
    window.localStorage.setItem('product_cart', JSON.stringify(listproduct));

    toastr.success("Thêm giỏ hàng thành công");
    loadAllCart();
}

async function loadAllCart() {
    var listcart = localStorage.getItem("product_cart");
    if (listcart == null) {
        return;
    }
    var list = JSON.parse(listcart);
    console.log(list);

    var main = '';
    var total = 0;

    let selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");

    for (let i = 0; i < list.length; i++) {
        const product = list[i];
        const isChecked = selectedItems.includes(i);

        main += `<tr>
                    <td>
                        <input type="checkbox" class="product-checkbox" data-index="${i}" onchange="updateTotal()"
                               ${isChecked ? 'checked' : ''}> 
                    </td>
                    <td>
                        <a href="detail?id=${product.product.id}&name=${product.product.alias}">
                            <img class="imgprocart" src="${product.colorImage || product.product.imageBanner}">
                        </a>
                        <div class="divnamecart">
                            <a href="detail?id=${product.product.id}&name=${product.product.alias}" class="nameprocart">${product.product.name}</a>
                            <p class="sizecart">${product.color.colorName} / ${product.size.sizeName}</p>
                        </div>
                    </td>
                    <td><p class="boldcart">${formatmoney(product.product.price)}</p></td>
                    <td>
                        <div class="clusinp">
                            <button onclick="upDownQuantity(${product.size.id}, -1)" class="cartbtn"> - </button>
                            <input value="${product.quantiy}" class="inputslcart" data-index="${i}">
                            <button onclick="upDownQuantity(${product.size.id}, 1)" class="cartbtn"> + </button>
                        </div>
                    </td>
                    <td>
                        <div class="tdpricecart">
                            <p class="boldcart">${formatmoney(product.quantiy * product.product.price)}</p>
                            <p onclick="remove(${product.product.id}, ${product.color.id}, ${product.size.id})" class="delcart">
                                <i class="fa fa-trash-o facartde"></i>
                            </p>
                        </div>
                    </td>
                </tr>`;

        if (isChecked) {
            total += Number(product.quantiy * product.product.price);
        }
    }

    document.getElementById("listcartDes").innerHTML = main;
    loadAllCartMobile();
    document.getElementById("slcart").innerHTML = list.length;
    document.getElementById("tonggiatien").innerHTML = formatmoney(total);

    // Checkbox cha: chọn/tắt tất cả
    document.getElementById("select-all").addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(".product-checkbox");
        const isChecked = this.checked;

        checkboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
            const index = checkbox.dataset.index;
            updateSelectedItems(index, isChecked);
        });

        updateTotal();
    });

    // Checkbox con: đồng bộ hóa với checkbox cha
    const checkboxes = document.querySelectorAll(".product-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const index = this.dataset.index;
            updateSelectedItems(index, this.checked);
            updateTotal();
        });
    });
    // Ngăn nhập số âm trong ô nhập số lượng
    const quantityInputs = document.querySelectorAll(".inputslcart");
    quantityInputs.forEach((input) => {
        input.addEventListener("input", function () {
            if (this.value < 1) {
                this.value = 1; // Đặt lại giá trị thành 1 nếu nhập số âm
            }
        });

        input.addEventListener("change", function () {
            if (this.value < 1) {
                this.value = 1; // Đặt lại giá trị thành 1 khi thay đổi
            }
        });
    });
}
async function validateAndRedirectToCheckout() {
    // 1. Kiểm tra giỏ hàng có dữ liệu không
    const cartData = localStorage.getItem("product_cart");
    if (!cartData) {
        toastr.error("Giỏ hàng của bạn đang trống!");
        return;
    }

    // 2. Kiểm tra có sản phẩm được chọn không
    const selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");
    if (selectedItems.length === 0) {
        toastr.error("Vui lòng chọn sản phẩm để thanh toán!");
        return;
    }

    try {
        const cart = JSON.parse(cartData);
        const selectedProducts = cart.filter((_, index) => selectedItems.includes(index));

        // Kiểm tra nếu không có sản phẩm hợp lệ
        if (selectedProducts.length === 0) {
            toastr.error("Không có sản phẩm hợp lệ được chọn để thanh toán!");
            return;
        }

        const errors = [];

        // 3. Kiểm tra tính hợp lệ của từng sản phẩm được chọn
        for (const item of selectedProducts) {
            // 3.1 Kiểm tra cấu trúc dữ liệu sản phẩm
            if (!item.product || !item.color || !item.size || !item.quantiy || !item.product.price) {
                errors.push(`Sản phẩm "${item.product?.name || 'Không xác định'}" có dữ liệu không hợp lệ!`);
                continue;
            }

            try {
                // 3.2 Kiểm tra tồn tại và số lượng trong kho
                const sizeUrl = `http://localhost:8080/api/product-size/public/find-quantity-by-color-and-size?colorId=${item.color.id}&sizeId=${item.size.id}`;
                const response = await fetch(sizeUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                let availableQuantity;
                try {
                    availableQuantity = await response.json();
                } catch (e) {
                    errors.push(`Size ${item.size.sizeName} của sản phẩm "${item.product.name}" màu ${item.color.colorName} không còn tồn tại trong hệ thống!`);
                    continue;
                }

                // 3.3 Kiểm tra số lượng
                if (availableQuantity === null || availableQuantity === undefined) {
                    errors.push(`Size ${item.size.sizeName} của sản phẩm "${item.product.name}" màu ${item.color.colorName} không còn tồn tại trong hệ thống!`);
                    continue;
                }

                if (availableQuantity === 0) {
                    errors.push(`Size ${item.size.sizeName} của sản phẩm "${item.product.name}" màu ${item.color.colorName} đã hết hàng!`);
                    continue;
                }

                if (item.quantiy > availableQuantity) {
                    errors.push(`Size ${item.size.sizeName} của sản phẩm "${item.product.name}" màu ${item.color.colorName} chỉ còn ${availableQuantity} sản phẩm!`);
                    continue;
                }

            } catch (error) {
                console.error("Lỗi kiểm tra sản phẩm với database:", error);
                errors.push(`Không thể kiểm tra thông tin sản phẩm "${item.product.name}". Vui lòng thử lại sau!`);
                continue;
            }
        }

        // 4. Hiển thị lỗi nếu có
        if (errors.length > 0) {
            errors.forEach(error => {
                toastr.error(error);
            });
            return;
        }

        // 5. Chỉ chuyển trang khi mọi thứ hợp lệ
        window.location.href = 'checkout';

    } catch (error) {
        console.error("Lỗi kiểm tra giỏ hàng:", error);
        toastr.error("Có lỗi xảy ra khi kiểm tra giỏ hàng!");
    }
}
function updateSelectedItems(index, isSelected) {
    let selectedItems = JSON.parse(localStorage.getItem("selected_items") || "[]");

    if (isSelected) {
        if (!selectedItems.includes(parseInt(index))) {
            selectedItems.push(parseInt(index));
        }
    } else {
        selectedItems = selectedItems.filter(item => item !== parseInt(index));
    }

    localStorage.setItem("selected_items", JSON.stringify(selectedItems));

    // Check if all child checkboxes are selected
    const totalCheckboxes = document.querySelectorAll(".product-checkbox").length;
    const checkedCheckboxes = document.querySelectorAll(".product-checkbox:checked").length;

    const selectAllCheckbox = document.getElementById("select-all");
    selectAllCheckbox.checked = (totalCheckboxes === checkedCheckboxes);
    selectAllCheckbox.indeterminate = (checkedCheckboxes > 0 && checkedCheckboxes < totalCheckboxes);
}
updateSelectedItems();
function updateTotal() {
    let total = 0;
    const checkboxes = document.querySelectorAll(".product-checkbox");
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked); // Kiểm tra tất cả checkbox con

    document.getElementById("select-all").checked = allChecked; // Cập nhật trạng thái checkbox cha

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const index = parseInt(checkbox.dataset.index);
            const product = JSON.parse(localStorage.getItem("product_cart"))[index];
            total += Number(product.quantiy * product.product.price);
        }
    });

    document.getElementById("tonggiatien").innerHTML = formatmoney(total); // Cập nhật tổng tiền
}
updateTotal();
async function loadAllCartMobile() {
    var list = JSON.parse(localStorage.getItem("product_cart"));
    var main = ''
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td>
            <a href="detail?id=${list[i].product.id}&name=${list[i].product.alias}">
                <img class="imgprocmobile" src="${list[i].colorImage || list[i].product.imageBanner}">
            </a>
        </td>
        <td class="tdinforcart">
            <a href="detail?id=${list[i].product.id}&name=${list[i].product.alias}" class="nameprocmobile">${list[i].product.name}</a>
            <p class="sizecmobile">${list[i].color.colorName} / ${list[i].size.sizeName}</p>
            <div class="clusinpmobile">
                <button onclick="upDownQuantity(${list[i].size.id},-1)" class="cartbtn"> - </button>
                <input value="${list[i].quantiy}" class="inputslcart">
                <button onclick="upDownQuantity(${list[i].size.id},1)" class="cartbtn"> + </button>
            </div>
        </td>
        <td class="tdinforcart">
          <i onclick="remove(${list[i].product.id}, ${list[i].color.id}, ${list[i].size.id})" class="fa fa-trash-o facartde cartdels"></i>
            <p class="boldcart pricecmobile">${formatmoney(list[i].quantiy * list[i].product.price)}&ThinSpace;</p>
        </td>
    </tr>`
    }
    document.getElementById("tablemobilecart").innerHTML = main
}

async function remove(productId, colorId, sizeId) {
    var list = JSON.parse(localStorage.getItem("product_cart"));

    var remainingArr = list.filter(data =>
        !(data.product.id === productId &&
            data.color.id === colorId &&
            data.size.id === sizeId)
    );

    window.localStorage.setItem('product_cart', JSON.stringify(remainingArr));
    toastr.success("Xóa sản phẩm thành công");
    loadAllCart();
}

async function upDownQuantity(idsize, quantiy) {
    var list = JSON.parse(localStorage.getItem("product_cart"));

    for (i = 0; i < list.length; i++) {
        if (list[i].size.id == idsize) {

            var currentQuantity = Number(list[i].quantiy);
            var newQuantity = currentQuantity + Number(quantiy);

            if (newQuantity < 1) {
                toastr.error("Số lượng không thể nhỏ hơn 1");
                return;
            }
            try {

                var url = `http://localhost:8080/api/product-size/public/find-quantity-by-color-and-size?colorId=${list[i].color.id}&sizeId=${idsize}`;
                const response = await fetch(url);
                var maxQuantity = await response.json();


                if (newQuantity > maxQuantity) {
                    toastr.error(`Số lượng sản phẩm chỉ còn ${maxQuantity}`);
                    return;
                }

                list[i].quantiy = newQuantity;
            } catch (error) {
                console.error("Error checking product quantity:", error);
                toastr.error("Không thể kiểm tra số lượng sản phẩm");
                return;
            }
        }
    }

    window.localStorage.setItem('product_cart', JSON.stringify(list));

    var remainingArr = list.filter(data => data.quantiy > 0);
    window.localStorage.setItem('product_cart', JSON.stringify(remainingArr));

    loadAllCart();
}

async function productLqCart() {
    var listcart = localStorage.getItem("product_cart");
    if (listcart == null) {
        return;
    }
    var list = JSON.parse(localStorage.getItem("product_cart"));
    var listCategory = [];
    for (i = 0; i < list.length; i++) {
        var listcate = list[i].product.productCategories;
        for (j = 0; j < listcate.length; j++) {
            listCategory.push(listcate[j].category.id);
        }
    }

    var url = 'http://localhost:8080/api/product/public/searchFull?page=0&size=6';
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(listCategory)
    });
    var resultLq = await res.json();

    var list = resultLq.content
    var main = ''
    var licart = JSON.parse(listcart);
    for (i = 0; i < list.length; i++) {
        var choses = false;
        for (j = 0; j < licart.length; j++) {
            if (licart[j].product.id == list[i].id) {
                choses = true;
            }
        }
        if (choses == true) {
            continue;
        }

        var listimg = ''
        for (j = 0; j < list[i].productImages.length; j++) {
            listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
        }
        main += `<div class="col-lg-3 col-md-3 col-sm-6 col-6">
                <a href="detail?id=${list[i].id}&name=${list[i].alias}" class="linkpro">
                    <div class="singlepro">
                        <div class="productsold"><span class="reviewsp">Đã bán: ${list[i].quantitySold}</span></div>
                        <img src="${list[i].imageBanner}" class="imgpro">
                        <span class="proname">${list[i].name}</span>
                        <span class="proprice">${formatmoney(list[i].price)}</span>
                        <div class="listimgpro">${listimg}</div>
                    </div>
                </a>
            </div>`
    }
    document.getElementById("listproductgycart").innerHTML = main;
}

function handleSuccessfulPayment() {
    var list = JSON.parse(localStorage.getItem("product_cart"));

    var remainingCart = list.filter(item => !item.isLatestCart);

    window.localStorage.setItem('product_cart', JSON.stringify(remainingCart));

    loadAllCart();
}