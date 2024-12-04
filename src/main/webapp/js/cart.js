var idColorCart = -1;
var selectedColorImage = null;

async function clickColor(e, name, idColor) {
    idColorCart = idColor;

    // Xóa class 'imgactive' khỏi tất cả các ảnh
    var img = document.getElementsByClassName("imgldetail");
    for (i = 0; i < img.length; i++) {
        document.getElementsByClassName("imgldetail")[i].classList.remove('imgactive');
    }
    // Thêm class 'imgactive' vào ảnh được chọn
    e.classList.add('imgactive');
    // Lưu lại ảnh màu được chọn
    selectedColorImage = e.src;
    // Hiển thị tên màu
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

        // Hiển thị tổng số lượng của màu sắc
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
    var obj = {
        "product": product,
        "color": color,
        "size": size,
        "quantiy": document.getElementById("inputslcart").value,
        "colorImage": selectedColorImage || color.linkImage || product.imageBanner,
        "uniqueKey": `${product.id}_${color.id}_${sizeId}` // Thêm unique key
    };

    if (localStorage.getItem("product_cart") == null) {
        var listproduct = [];
        listproduct.push(obj);
        window.localStorage.setItem('product_cart', JSON.stringify(listproduct));
    } else {
        var list = JSON.parse(localStorage.getItem("product_cart"));

        // Tìm index của sản phẩm có cùng unique key
        var existingProductIndex = list.findIndex(item =>
            item.uniqueKey === obj.uniqueKey
        );

        if (existingProductIndex !== -1) {
            list[existingProductIndex].quantiy =
                Number(list[existingProductIndex].quantiy) + Number(obj.quantiy);
        } else {
            list.push(obj);
        }

        window.localStorage.setItem('product_cart', JSON.stringify(list));
    }

    toastr.success("Thêm giỏ hàng thành công");
    loadAllCart();
}

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
    var list = JSON.parse(localStorage.getItem("product_cart"));
    console.log(list)
    var main = ''
    var total = 0;
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>
                        <a href="detail?id=${list[i].product.id}&name=${list[i].product.alias}">
                            <img class="imgprocart" src="${list[i].colorImage || list[i].product.imageBanner}">
                        </a>
                        <div class="divnamecart">
                            <a href="detail?id=${list[i].product.id}&name=${list[i].product.alias}" class="nameprocart">${list[i].product.name}</a>
                            <p class="sizecart">${list[i].color.colorName} / ${list[i].size.sizeName}</p>
                        </div>
                    </td>
                    <td><p class="boldcart">${formatmoney(list[i].product.price)}</p></td>
                    <td>
                        <div class="clusinp"><button onclick="upDownQuantity(${list[i].size.id},-1)" class="cartbtn"> - </button>
                        <input value="${list[i].quantiy}" class="inputslcart">
                        <button onclick="upDownQuantity(${list[i].size.id},1)" class="cartbtn"> + </button></div>
                    </td>
                    <td>
                        <div class="tdpricecart">
                            <p class="boldcart">${formatmoney(list[i].quantiy * list[i].product.price)}</p>
                            <p onclick="remove(${list[i].product.id}, ${list[i].color.id}, ${list[i].size.id})" class="delcart"><i class="fa fa-trash-o facartde"></i></p>
                        </div>
                    </td>
                </tr>`
        total += Number(list[i].quantiy * list[i].product.price)
    }
    document.getElementById("listcartDes").innerHTML = main
    loadAllCartMobile();
    document.getElementById("slcart").innerHTML = list.length
    document.getElementById("tonggiatien").innerHTML = formatmoney(total)
}

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

    // Xóa tất cả sản phẩm có cùng product ID, color ID và size ID
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

// Hàm xử lý thanh toán thành công
function handleSuccessfulPayment() {
    var list = JSON.parse(localStorage.getItem("product_cart"));

    // Lọc ra các sản phẩm không phải từ nút thanh toán
    var remainingCart = list.filter(item => !item.isLatestCart);

    window.localStorage.setItem('product_cart', JSON.stringify(remainingCart));

    loadAllCart();
}