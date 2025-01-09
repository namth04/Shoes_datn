async function loadProductIndex(page) {
    var size = 10;
    var url = 'http://localhost:8080/api/product/public/findAll?page=' + page + '&size=' + size;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        var listimg = ''
        for (j = 0; j < list[i].productImages.length; j++) {
            listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
        }
        main += `<div class="col-lg-20p col-md-3 col-sm-6 col-6">
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
    document.getElementById("listproductindex").innerHTML = main

    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li class="page-item"><a class="page-link" onclick="handlePageClick(event, ${(Number(i) - 1)})">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

function handlePageClick(event, page) {
    event.preventDefault();
    loadProductIndex(page);
}


async function loadSanPhamBanChay(page) {
    var size= 5;
    var url = 'http://localhost:8080/api/product/public/findAll?page=' + page + '&size=' + size + '&sort=quantitySold,desc';
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        var listimg = ''
        for (j = 0; j < list[i].productImages.length; j++) {
            listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
        }
        main += `<div class="col-lg-20p col-md-3 col-sm-6 col-6">
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
    document.getElementById("listproductbanchay").innerHTML = main

    if (result.last == false) {
        document.getElementById("btnsanphambanchay").onclick = function () {
            loadSanPhamBanChay(Number(page) + Number(1));
        }
    } else {
        document.getElementById("btnsanphambanchay").onclick = function () {
            toastr.warning("Đã hết kết quả tìm kiếm");
        }
    }
}


async function loadAProduct() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id != null) {
        var url = 'http://localhost:8080/api/product/public/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        document.getElementById("detailnamepro").innerHTML = result.name
        document.getElementById("codepro").innerHTML = result.code
        document.getElementById("quansale").innerHTML = 'Đã bán : ' + result.quantitySold
        document.getElementById("pricedetail").innerHTML = formatmoney(result.price)
        document.getElementById("imgdetailpro").src = result.imageBanner
        document.getElementById("quantityA").innerHTML = result.quantity
        document.getElementById("descriptiondetail").innerHTML = result.description
        document.getElementById("thuonghieu").innerHTML = result.trademark==null?'':result.trademark.name
        document.getElementById("chatlieu").innerHTML = result.material==null?'':'Chất liệu: '+result.material.name
        document.getElementById("degiay").innerHTML = result.sole==null?'':'Loại đế giày: '+result.sole.name
        document.getElementById("btnaddcart").onclick = function() {
            addCart(result);
        }
        document.getElementById("btnmuangay").onclick = function () {
            if (!idColorCart) {
                toastr.error("Vui lòng chọn màu sản phẩm");
                return;
            }

            var selectedSize = document.querySelector('input[name="sizepro"]:checked');
            if (!selectedSize) {
                toastr.error("Bạn chưa chọn kích thước sản phẩm");
                return;
            }

            var quantity = parseInt(document.getElementById("inputslcart").value) || 1;
            if (quantity > maxQuantity) {
                toastr.error(`Số lượng tồn kho không đủ. Chỉ còn ${maxQuantity} sản phẩm`);
                return;
            }

            var buyNowItem = [{
                product: result,
                color: {
                    id: idColorCart,
                    colorName: document.getElementById("colorname").innerHTML
                },
                size: {
                    id: selectedSize.value,
                    sizeName: selectedSize.parentElement.textContent.trim()
                },
                quantiy: quantity,
                colorImage: document.getElementById("imgdetailpro").src
            }];

            sessionStorage.setItem("buy_now_item", JSON.stringify(buyNowItem));

            window.location.href = "checkout?type=buynow";
        }
    }

        console.log("result"+result.name)
        var main = ''
        for (i = 0; i < result.productImages.length; i++) {
            main += `<div class="col-lg-2 col-md-2 col-sm-2 col-2 singdimg">
                        <img onclick="clickImgdetail(this)" src="${result.productImages[i].linkImage}" class="imgldetail">
                    </div>`
        }
        document.getElementById("listimgdetail").innerHTML = main

        var main = ''
        for (i = 0; i < result.productColors.length; i++) {
            main += `<div class="col-lg-2 col-md-2 col-sm-2 col-2 singdimg">
                        <img onclick="clickColor(this,'${result.productColors[i].colorName}',${result.productColors[i].id})" src="${result.productColors[i].linkImage}" class="imgldetail imgcolordt">
                    </div>`
        }
        document.getElementById("listimgColor").innerHTML = main
        if (result.productColors.length > 0) {
            var imgF = document.getElementsByClassName("imgcolordt")[0];
            clickColor(imgF, result.productColors[0].colorName, result.productColors[0].id);
        }

        var listCate = [];
        for (i = 0; i < result.productCategories.length; i++) {
            listCate.push(result.productCategories[i].category.id);
        }
        var url = 'http://localhost:8080/api/product/public/searchFull?page=0&size=6';
        const res = await fetch(url, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(listCate)
        });
        var resultLq = await res.json();
        var list = resultLq.content
        var main = ''
        for (i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                continue;
            }
            var listimg = ''
            for (j = 0; j < list[i].productImages.length; j++) {
                listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
            }
            main += `<div class="col-lg-20p col-md-3 col-sm-6 col-6">
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
        document.getElementById("listProductGy").innerHTML = main;
}

async function clickImgdetail(e) {
    var img = document.getElementsByClassName("imgldetail");
    for (i = 0; i < img.length; i++) {
        document.getElementsByClassName("imgldetail")[i].classList.remove('imgactive');
    }
    e.classList.add('imgactive')
    document.getElementById("imgdetailpro").src = e.src
}


async function clickColor(e, name, idColor) {
    idColorCart = idColor;

    var img = document.getElementsByClassName("imgldetail");
    for (i = 0; i < img.length; i++) {
        document.getElementsByClassName("imgldetail")[i].classList.remove('imgactive');
    }

    e.classList.add('imgactive');

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
                totalQuantity += list[i].quantity
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

async function clickSize(e) {
    var size = document.getElementsByClassName("radio-custom");
    for (i = 0; i < size.length; i++) {
        document.getElementsByClassName("radio-custom")[i].classList.remove('activesize');
    }

    e.classList.add('activesize');

    var inp = e.getElementsByTagName('input')[0];
    inp.checked = 'checked';

    var idSize = inp.value;


    await displayProductQuantity(idColorCart, idSize);
}

let maxQuantity = 0;
async function displayProductQuantity(idProColor, idSize) {
    try {
        var url = `http://localhost:8080/api/product-size/public/find-quantity-by-color-and-size?colorId=${idProColor}&sizeId=${idSize}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        var quantityElement = document.getElementById("quantityA");

        if (response.ok) {
            var quantity = await response.json();

            maxQuantity = quantity;

            if (quantity > 0) {
                quantityElement.innerHTML = `Số lượng: ${quantity}`;
                quantityElement.classList.remove('text-danger');
                quantityElement.classList.add('text-black');
            } else {
                quantityElement.innerHTML = "Hết hàng";
                quantityElement.classList.remove('text-black');
                quantityElement.classList.add('text-danger');
            }

            return quantity;
        } else {
            quantityElement.innerHTML = "Không tìm thấy số lượng";
            quantityElement.classList.remove('text-black');
            quantityElement.classList.add('text-danger');
            return 0;
        }
    } catch (error) {
        console.error('Error fetching product quantity:', error);
        return 0;
    }
}

function upAndDownDetail(idsize, quantityChange) {
    var list = JSON.parse(localStorage.getItem("product_cart"));
    for (i = 0; i < list.length; i++) {
        if (list[i].size.id == idsize) {
            var newQuantity = Number(list[i].quantiy) + Number(quantityChange);

            if (newQuantity <= 0) {
                toastr.error("Số lượng không thể nhỏ hơn 1");
                return;
            }
            if (newQuantity > list[i].size.quantity) {
                toastr.error(`Số lượng sản phẩm chỉ còn ${list[i].size.quantity}`);
                return;
            }

            list[i].quantiy = newQuantity;
        }
    }

    window.localStorage.setItem('product_cart', JSON.stringify(list));


    var remainingArr = list.filter(data => data.quantiy > 0);
    window.localStorage.setItem('product_cart', JSON.stringify(remainingArr));

    loadAllCart();
}
function upAndDownDetail(val) {
    var quantityInput = document.getElementById("inputslcart");
    var currentQuantity = Number(quantityInput.value);

    if (val < 0 && currentQuantity <= 1) {
        toastr.error("Số lượng không thể nhỏ hơn 1");
        return;
    }

    var newQuantity = currentQuantity + val;

    if (newQuantity > maxQuantity) {
        toastr.error(`Số lượng sản phẩm chỉ còn ${maxQuantity}`);
        return;
    }

    quantityInput.value = newQuantity;
}
function validateQuantityAndAddToCart(product) {

    var quantityInput = document.getElementById('quantityInput');
    var currentQuantity = parseInt(quantityInput.value) || 1;

    if (currentQuantity > maxQuantity) {
        alert(`Rất tiếc, chỉ còn ${maxQuantity} sản phẩm trong kho`);

        quantityInput.value = maxQuantity;
        return;
    }

    addCart(product, currentQuantity);
}
async function renderProductList(result) {
    var productListContainer = document.getElementById("listproductpro");
    productListContainer.innerHTML = "";

    var list = result.content;
    var main = '';

    for (var i = 0; i < list.length; i++) {
        var listimg = list[i].productImages.map(img =>
            `<div class="divimgsmpro"><img class="imgsmpro" src="${img.linkImage}"></div>`
        ).join('');

        main += `
            <div class="col-lg-3 col-md-3 col-sm-6 col-6">
                <a href="detail?id=${list[i].id}&name=${list[i].alias}" class="linkpro">
                    <div class="singlepro">
                        <div class="productsold"><span class="reviewsp">Đã bán: ${list[i].quantitySold}</span></div>
                        <img src="${list[i].imageBanner}" class="imgpro">
                        <span class="proname">${list[i].name}</span>
                        <span class="proprice">${formatmoney(list[i].price)}</span>
                        <div class="listimgpro">${listimg}</div>
                    </div>
                </a>
            </div>`;
    }

    productListContainer.innerHTML = main;
    document.getElementById("slsp").innerHTML = result.totalElements;
}

function renderPagination(totalPage, loadFunction) {
    var mainpage = '';
    for (var i = 1; i <= totalPage; i++) {
        mainpage += `
            <li onclick="${loadFunction.name}(${i - 1}, document.getElementById('sortpro').value)" class="page-item">
                <a class="page-link" href="#listsp">${i}</a>
            </li>`;
    }
    document.getElementById("pageable").innerHTML = mainpage;
}

var size = 4;
var currentFilterType = 1;

function sortProduct() {
    var sort = document.getElementById("sortpro").value;
    switch(currentFilterType) {
        case 1:
            loadProductByCategory(0, sort);
            break;
        case 2:
            searchFull(0, sort);
            break;
        case 3:
            searchFullmobile(0, sort);
            break;
    }
}

async function loadProductByCategory(page, sort) {
    currentFilterType = 1;
    var uls = new URL(document.URL);
    var category = uls.searchParams.get("category");

    var url = `http://localhost:8080/api/product/public/findByCategory?page=${page}&size=${size}&idCategory=${category}`;

    if (sort && sort !== "") {
        url += `&sort=${sort}`;
    }

    try {
        const response = await fetch(url, { method: 'GET' });
        var result = await response.json();
        renderProductList(result);
        renderPagination(result.totalPages, loadProductByCategory);
    } catch (error) {
        console.error("Error loading products by category:", error);
    }
}

function formatmoney(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
function validatePriceInputs(input) {
    input.value = input.value.replace(/[^\d]/g, '');

    // Convert to number for comparison
    const value = parseInt(input.value) || 0;


    if (value < 0) {
        input.value = '0';
    }
}

function validatePriceInputs(event) {
    // Chỉ cho phép nhập số, không cho phép nhập ký tự khác
    let value = event.target.value;

    // Chỉ giữ lại các ký tự số
    let numericValue = value.replace(/[^0-9]/g, '');

    // Nếu giá trị đã thay đổi (có ký tự không phải số), cập nhật lại input
    if (value !== numericValue) {
        event.target.value = numericValue;
    }
}

function validatePriceRange() {
    const minPrice = parseFloat(document.getElementById("min_price").value) || 0;
    const maxPrice = parseFloat(document.getElementById("max_price").value) || 0;

    if (maxPrice < minPrice) {
        alert("Giá tối đa phải lớn hơn giá tối thiểu!");
        return false;
    }
    return true;
}

async function searchFull(page, sort) {
    // Validate price range before proceeding
    if (!validatePriceRange()) {
        return;
    }

    currentFilterType = 2;
    var min_price = parseFloat(document.getElementById("min_price").value) || 0;
    var max_price = parseFloat(document.getElementById("max_price").value) || Number.MAX_SAFE_INTEGER;

    // Get parent categories
    const parentCategories = document.querySelectorAll('.cateparent input.inputcheck');
    let selectedCategories = [];

    // Process parent and child categories
    parentCategories.forEach(parentCheckbox => {
        const singleListMenu = parentCheckbox.closest('.singlelistmenu');
        const childCheckboxes = singleListMenu.querySelectorAll('.listsubcate .inputcheck');

        if (parentCheckbox.checked) {
            selectedCategories.push(parentCheckbox.value);

            childCheckboxes.forEach(childCheckbox => {
                if (childCheckbox.checked) {
                    selectedCategories.push(childCheckbox.value);
                }
            });
        } else {
            childCheckboxes.forEach(childCheckbox => {
                if (childCheckbox.checked) {
                    if (!selectedCategories.includes(parentCheckbox.value)) {
                        selectedCategories.push(parentCheckbox.value);
                    }
                    selectedCategories.push(childCheckbox.value);
                }
            });
        }
    });

    // Get selected trademarks
    var listTra = document.getElementById("listthuonghieu").getElementsByClassName("inputchecktrademark");
    var listTrademark = Array.from(listTra).filter(input => input.checked).map(input => input.value);

    // Prepare payload
    var payload = {
        "listIdCategory": selectedCategories,
        "listIdTrademark": listTrademark
    };

    // Build URL with query parameters
    var url = `http://localhost:8080/api/product/public/searchFull?page=${page}&size=${size}&smallPrice=${min_price}&largePrice=${max_price}`;

    if (sort) {
        url += `&sort=${sort}`;
    }

    try {
        // Make API request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Process response
        var result = await response.json();
        renderProductList(result);
        renderPagination(result.totalPages, searchFull);
    } catch (error) {
        console.error("Error in full search:", error);
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const minPriceInput = document.getElementById("min_price");
    const maxPriceInput = document.getElementById("max_price");

    // Sử dụng sự kiện input để kiểm tra ngay khi người dùng nhập
    minPriceInput.addEventListener('input', validatePriceInputs);
    maxPriceInput.addEventListener('input', validatePriceInputs);
});
document.addEventListener('DOMContentLoaded', function() {
    const minPriceInput = document.getElementById("min_price");
    const maxPriceInput = document.getElementById("max_price");

    minPriceInput.addEventListener('input', function() {
        validatePriceInputs(this);
    });

    maxPriceInput.addEventListener('input', function() {
        validatePriceInputs(this);
    });
});

function handleCategoryChange(checkbox) {
    const allCheckedBoxes = document.querySelectorAll('.inputcheck:checked, .inputchecktrademark:checked');

    if (allCheckedBoxes.length === 0) {
        return;
    }

    searchFull(0, null);
}

function clickOpenSubMenu(e) {
    var sing = e.closest('.singlelistmenu');
    var subCate = sing.querySelector('.listsubcate');
    var parentCheckbox = sing.querySelector('.cateparent input');

    subCate.classList.toggle('show');

    if (!subCate.classList.contains('show')) {
        var listInput = subCate.querySelectorAll('.inputcheck');
        listInput.forEach(input => input.checked = false);
    }

    handleCategoryChange();
}

async function postData(page) {
    const size = 2;
    const min_price = parseFloat(document.getElementById("min_price").value) || 0;
    const max_price = parseFloat(document.getElementById("max_price").value) || Number.MAX_SAFE_INTEGER;
    const listCa = document.getElementById("listsearchCategory").getElementsByClassName("inputcheck");
    const listcate = Array.from(listCa).filter(input => input.checked).map(input => input.value);
    const listTra = document.getElementById("listthuonghieu").getElementsByClassName("inputchecktrademark");
    const listTrademark = Array.from(listTra).filter(input => input.checked).map(input => input.value);
    const url = `http://localhost:8080/api/product/public/searchFull?smallPrice=${min_price}&largePrice=${max_price}&size=${size}`;


    const payload = {
        listIdCategory: listcate,
        listIdTrademark: listTrademark
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {

            const result = await response.json();
            renderProductList(result.content);
            renderPagination(result.totalPages,postData);
            console.log("Dữ liệu trả về từ API:", result);
        } else {
            console.error("Lỗi khi gọi API:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu POST:", error);
    }
}

async function loadTrademarkSub() {
    try {
        const response = await fetch('http://localhost:8080/api/trademark/public/all');
        var list = await response.json();

        var main = list.map(trademark => `
            <div class="singlelistmenu">
                <label class="checkbox-custom cateparent">${trademark.name}
                    <input value="${trademark.id}" class="inputchecktrademark" onchange="handleCategoryChange(this)" type="checkbox">
                    <span class="checkmark-checkbox"></span>
                </label>
            </div>
        `).join('');

        document.getElementById("listthuonghieu").innerHTML = main;
    } catch (error) {
        console.error("Error loading trademarks:", error);
    }
}
async function loadCategorySub() {
    try {
        const response = await fetch('http://localhost:8080/api/category/public/findPrimaryCategory');
        var list = await response.json();

        var main = list.map(category => {
            var mainChild = category.categories.map(child => `
                <label class="checkbox-custom">${child.name}
                    <input value="${child.id}" class="inputcheck" onchange="handleCategoryChange(this)" type="checkbox">
                    <span class="checkmark-checkbox"></span>
                </label>
            `).join('');

            return `
                <div class="singlelistmenu">
                    <label class="checkbox-custom cateparent">${category.name}
                        <input value="${category.id}" class="inputcheck" onchange="clickOpenSubMenu(this)" type="checkbox">
                        <span class="checkmark-checkbox"></span>
                    </label>
                    <div class="listsubcate">
                        ${mainChild}
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById("listsearchCategory").innerHTML = main;
        document.getElementById("listsearchCategoryMobile").innerHTML = main;
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}



async function loadAllProductList() {
    var search = document.getElementById("search").value;

    try {
        const response = await fetch(`http://localhost:8080/api/product/public/findAll-list?search=${search}`);
        var list = await response.json();

        var main = list.map(product => `
            <tr>
                <td>${product.code}</td>
            </tr>
        `).join('');

        document.getElementById("listproduct").innerHTML = main;
    } catch (error) {
        console.error("Error loading product list:", error);
    }
}