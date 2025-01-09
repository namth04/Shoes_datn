let listFile = [];
var size = 8;

async function loadProduct(page, param, listCate) {
    if (param == null) {
        param = "";
    }

    var result = null;
    var url = '';
    let requestBody = null;
    if (listCate == null || listCate.length === 0) {
        url = `http://localhost:8080/api/product/public/findByParam?page=${page}&size=${size}&q=${param}`;
        try {
            const response = await fetch(url, { method: 'GET' });
            result = await response.json();
        } catch (error) {
            console.error("Error fetching data: ", error);
            toastr.error("Có lỗi khi tải dữ liệu sản phẩm.");
            return;
        }
    } else {
        requestBody = {
            listIdCategory: listCate || []
        };
        url = 'http://localhost:8080/api/product/public/searchFull?page=' + page + '&size=' + size ;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(requestBody)
            });
            result = await response.json();
        } catch (error) {
            console.error("Error fetching data: ", error);
            toastr.error("Có lỗi khi tìm kiếm sản phẩm.");
            return;
        }
    }

    if (!result || !result.content) {
        toastr.error("Không tìm thấy sản phẩm.");
        return;
    }

    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        var listdm = '<div class="listtag">'
        for (j = 0; j < list[i].productCategories.length; j++) {
            listdm += `<a href="" class="tagcauhoi">.${list[i].productCategories[j].category.name}</a>`;
        }
        listdm += '</div>';

        main += `<tr>
                    <td>#${list[i].id}</td>
                    <td><img src="${list[i].imageBanner}" style="width: 100px;"></td>
                    <td>${list[i].code}</td>
                    <td>${listdm}</td>
                    <td>
                        Thương hiệu: ${list[i].trademark ? list[i].trademark.name : ''}<br>
                        Chất liệu: ${list[i].material ? list[i].material.name : ''}<br>
                        Đế giày: ${list[i].sole ? list[i].sole.name : ''}
                    </td>
                    <td>${list[i].name}</td>
                    <td>${formatmoney(list[i].price)}</td>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].quantitySold}</td>
                    <td class="sticky-col">
                        <i onclick="deleteProduct(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="addproduct?id=${list[i].id}"><i class="fa fa-edit iconaction"></i><br></a>
                    </td>
                </tr>`;
    }

    document.getElementById("listproduct").innerHTML = main;

    var mainpage = '';
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadProduct(${(Number(i) - 1)}, '${param}', ${JSON.stringify(listCate)})" class="page-item">
                        <a class="page-link" href="#listsp">${i}</a>
                    </li>`;
    }
    document.getElementById("pageable").innerHTML = mainpage;
    const pageItems = document.querySelectorAll("#pageable .page-item");
    pageItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            loadProduct(index, param, listCate);
        });
    });
}
async function loadAProduct() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id != null) {
        var url = 'http://localhost:8080/api/product/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        console.log(result)
        document.getElementById("codesp").value = result.code
        document.getElementById("namesp").value = result.name
        document.getElementById("alias").value = result.alias
        document.getElementById("price").value = result.price
        document.getElementById("anhdathem").style.display = 'block'
        linkbanner = result.imageBanner
        document.getElementById("imgpreproduct").src = result.imageBanner
        tinyMCE.get('editor').setContent(result.description)
        var main = ''

        listFile = [];
        for (i = 0; i < result.productImages.length; i++) {
            listFile.push({
                id: result.productImages[i].id,
                isExisting: true,
                url: result.productImages[i].linkImage
            });
            main += `<div id="imgdathem${result.productImages[i].id}" class="col-md-3 col-sm-4 col-4">
                        <img style="width: 90%;" src="${result.productImages[i].linkImage}" class="image-upload">
                        <button onclick="deleteProductImage(${result.productImages[i].id})" class="btn btn-danger form-control">Xóa ảnh</button>
                    </div>`
        }
        document.getElementById("listanhdathem").innerHTML = main

        updateChooseFileButton();
        await loadAllCategorySelect();
        var listCate = []
        console.log(listCate)
        for (i = 0; i < result.productCategories.length; i++) {
            listCate.push(result.productCategories[i].category.id);
        }
        $("#listdpar").val(listCate).change();
        var color = result.productColors;
        var mcl = ''
        for (i = 0; i < color.length; i++) {
            var blocks = '';
            var size = color[i].productSizes;
            for (j = 0; j < size.length; j++) {
                blocks += ` <div class="singelsizeblock">
                            <input value="${size[j].id}" type="hidden" class="idsize">
                            <input value="${size[j].sizeName}" placeholder="tên size" class="sizename">
                            <input value="${size[j].quantity}" placeholder="Số lượng" class="sizequantity">
                            <i onclick="deleteProductSize(${size[j].id})" class="fa fa-trash-alt trashsize"></i>
                        </div>`
            }
            mcl += `<div class="col-sm-6">
            <div class="singlecolor row">
                <div class="col-12"><i onclick="deleteProductColor(${color[i].id})" class="fa fa-trash pointer"></i></div>
                <div class="col-8 inforcolor">
                    <input type="hidden" value="${color[i].id}" class="idcolor">
                    <label class="lb-form">Tên màu:</label>
                    <input type="text" value="${color[i].colorName}" class="form-control colorName">
                    <label class="lb-form">Ảnh màu</label>
                    <input onchange="priviewImg(this)" type="file" class="form-control fileimgclo">
                </div>
                <div class="col-4 divimgpre">
                    <img class="imgpreview" src="${color[i].linkImage}" style="width: 100%;">
                </div>
                <span onclick="addSizeBlock(this)" class="pointer btnaddsize"><i class="fa fa-plus"></i> Thêm size</span>
                <div class="listsizeblock">
                   ${blocks}
                </div>
            </div></div>`
        }
        document.getElementById("listcolorblock").innerHTML = mcl
        document.getElementById("thuonghieu").value = result.trademark.id;
        document.getElementById("chatlieu").value = result.material.id;
        document.getElementById("degiay").value = result.sole.id;
    }
}

async function deleteProductImage(id) {
    var con = confirm("Bạn muốn xóa ảnh này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-image/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa ảnh thành công!");
        document.getElementById("imgdathem" + id).style.display = 'none';

        // Remove the deleted image from listFile
        listFile = listFile.filter(file => !(file.isExisting && file.id === id));

        // Update choose file button state
        updateChooseFileButton();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

function updateChooseFileButton() {
    const maxImages = 3;
    const currentImageCount = listFile.length;
    const chooseFileInput = document.querySelector('#choosefile');
    const chooseImageDiv = document.getElementById("choose-image");

    if (currentImageCount >= maxImages) {
        chooseFileInput.disabled = true;
        chooseImageDiv.style.opacity = "0.5";
        chooseImageDiv.style.cursor = "not-allowed";
        chooseFileInput.value = ''; // Clear any selected files
    } else {
        chooseFileInput.disabled = false;
        chooseImageDiv.style.opacity = "1";
        chooseImageDiv.style.cursor = "pointer";
    }
}

function loadInit() {
    $('input#choosefile').change(function() {
        var files = $(this)[0].files;
    });
    document.querySelector('#choosefile').addEventListener("change", previewImages);
    updateChooseFileButton();

    function previewImages() {
        var files = $(this)[0].files;

        // Calculate remaining slots considering both existing and new files
        const remainingSlots = 3 - listFile.filter(file => !file.isExisting).length -
            listFile.filter(file => file.isExisting).length;

        if (remainingSlots <= 0) {
            toastr.warning("Chỉ được phép thêm tối đa 3 ảnh sản phẩm phụ!");
            return;
        }

        // Only process up to the remaining slots
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        var preview = document.querySelector('#preview');

        filesToProcess.forEach(file => {
            if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
                toastr.warning(file.name + " không phải là file ảnh hợp lệ");
                return;
            }

            listFile.push({
                file: file,
                isExisting: false
            });
            readAndPreview(file);
        });

        updateChooseFileButton();

        function readAndPreview(file) {
            var reader = new FileReader();

            reader.addEventListener("load", function() {
                var div = document.createElement('div');
                div.className = 'col-md-3 col-sm-6 col-6';
                div.style.height = '120px';
                div.style.paddingTop = '5px';
                div.marginTop = '100px';
                preview.appendChild(div);

                var img = document.createElement('img');
                img.src = this.result;
                img.style.height = '85px';
                img.style.width = '90%';
                img.className = 'image-upload';
                img.style.marginTop = '5px';
                div.appendChild(img);

                var button = document.createElement('button');
                button.style.height = '30px';
                button.style.width = '90%';
                button.innerHTML = 'xóa';
                button.className = 'btn btn-warning';
                div.appendChild(button);

                button.addEventListener("click", function() {
                    div.remove();
                    listFile = listFile.filter(f =>
                        f.isExisting || (f.file !== file)
                    );
                    updateChooseFileButton();
                });
            });

            reader.readAsDataURL(file);
        }
    }
}


async function uploadMultipleFileNotResp() {
    const formData = new FormData()

    const newFiles = listFile.filter(file => !file.isExisting);
    for (let file of newFiles) {
        formData.append("file", file.file)
    }

    if (newFiles.length === 0) {
        return [];
    }

    var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        return await res.json();
    } else {
        return [];
    }
}

async function filterByCate() {
    loadProduct(0, "", $("#listdpar").val());
}


let listColor = [];
let linkbanner = null;


function isColorDuplicate(newColorName, currentColorBlock = null) {
    const colorBlocks = document.getElementById("listcolorblock").getElementsByClassName("singlecolor");
    for (let block of colorBlocks) {
        if (block === currentColorBlock?.parentNode.parentNode) continue;
        const existingName = block.getElementsByClassName("colorName")[0].value.trim().toLowerCase();
        if (existingName === newColorName.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function validateColors() {
    const colorBlocks = document.getElementById("listcolorblock").getElementsByClassName("singlecolor");
    if (colorBlocks.length === 0) {
        toastr.warning("Vui lòng thêm ít nhất một màu sắc!");
        return false;
    }
    return true;
}


async function saveProduct() {
    try {

        document.getElementById("loading").style.display = 'block';
        const uls = new URL(document.URL);
        const id = uls.searchParams.get("id");
        const formData = {
            codesp: document.getElementById("codesp").value.trim(),
            namesp: document.getElementById("namesp").value.trim(),
            price: document.getElementById("price").value.trim(),
            alias: document.getElementById("alias").value.trim(),
            listdpar: $("#listdpar").val(),
            description: tinyMCE.get('editor').getContent().trim(),
            thuonghieu: document.getElementById("thuonghieu").value.trim(),
            chatlieu: document.getElementById("chatlieu").value.trim(),
            degiay: document.getElementById("degiay").value.trim()
        };

        if (!validateProduct(formData)) {
            document.getElementById("loading").style.display = 'none';
            return;
        }
        await loadColor();

        if (listColor.length === 0) {
            document.getElementById("loading").style.display = 'none';
            return;
        }
        const [bannerResult, detailImagesResult] = await Promise.all([
            uploadFile(document.getElementById("imgbanner")),
            id == null ? uploadMultipleFileNotResp() : Promise.resolve([])
        ]);

        if (!linkbanner) {
            toastr.warning("Vui lòng tải lên banner hình ảnh!");
            document.getElementById("loading").style.display = 'none';
            return;
        }

        if (id == null && (!detailImagesResult || detailImagesResult.length === 0)) {
            toastr.warning("Vui lòng tải lên ít nhất một hình ảnh chi tiết!");
            document.getElementById("loading").style.display = 'none';
            return;
        }
        if (!validateColors()) {
            document.getElementById("loading").style.display = 'none';
            return;
        }

        const url = id != null
            ? 'http://localhost:8080/api/product/admin/update'
            : 'http://localhost:8080/api/product/admin/create';

        const product = {
            id: id,
            code: formData.codesp,
            alias: formData.alias,
            name: formData.namesp,
            imageBanner: linkbanner,
            price: formData.price,
            description: formData.description,
            listCategoryIds: formData.listdpar,
            linkLinkImages: detailImagesResult,
            colors: listColor,
            trademark: { id: formData.thuonghieu },
            material: { id: formData.chatlieu },
            sole: { id: formData.degiay }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(product)
        });

        if (response.status < 300) {
            swal({
                title: "Thông báo",
                text: "Thêm/Sửa sản phẩm thành công",
                type: "success"
            }, () => {
                document.getElementById("loading").style.display = 'none';
                window.location.href = 'http://localhost:8080/admin/product';
            });
        } else {
            const errorData = await response.json();
            if (errorData.message && errorData.message.includes("Mã sản phẩm")) {
                toastr.warning(errorData.message);
            } else {
                toastr.error("Mã sản phẩm đã tồn tại!");
            }
            document.getElementById("loading").style.display = 'none';
        }


    } catch (error) {
        console.error('Error:', error);
        swal({
            title: "Thông báo",
            text: "Thêm/Sửa sản phẩm thất bại",
            type: "error"
        }, () => {
            document.getElementById("loading").style.display = 'none';
            // window.location.reload();
        });
    }
}

function addBlockColor() {
    var main = `<div class="col-sm-6">
        <div class="singlecolor row">
            <div class="col-12"><i onclick="removeColorBlock(this)" class="fa fa-trash pointer"></i></div>
            <div class="col-8 inforcolor">
                <input type="hidden" class="idcolor">
                <label class="lb-form">Tên màu:</label>
                <input type="text" class="form-control colorName" onchange="validateColorName(this)">
                <label class="lb-form">Ảnh màu</label>
                <input onchange="priviewImg(this)" type="file" class="form-control fileimgclo">
            </div>
            <div class="col-4 divimgpre">
                <img class="imgpreview" src="" style="width: 100%;">
            </div>
            <span onclick="addSizeBlock(this)" class="pointer btnaddsize"><i class="fa fa-plus"></i> Thêm size</span>
            <div class="listsizeblock">
            </div>
        </div></div>`;
    document.getElementById("listcolorblock").insertAdjacentHTML('beforeend', main);
}

function validateColorName(input) {
    const colorName = input.value.trim();
    if (isColorDuplicate(colorName, input)) {
        toastr.warning(`Màu sắc "${colorName}" đã tồn tại!`);
        input.value = '';
        input.focus();
    }
}
async function addColor() {
    const colorName = document.getElementById("colorName").value.trim();
    const colorCode = document.getElementById("colorCode").value.trim();

    if (!colorName) {
        toastr.warning("Tên màu không được để trống!");
        return;
    }
    if (!colorCode) {
        toastr.warning("Mã màu không được để trống!");
        return;
    }

    if (isColorDuplicate(colorName)) {
        toastr.warning("Tên màu này đã tồn tại!");
        return;
    }

    const newColor = {
        colorName: colorName,
        colorCode: colorCode,
        sizes: []
    };

    listColor.push(newColor);
    renderColorTable();

    document.getElementById("colorName").value = "";
    document.getElementById("colorCode").value = "";
    document.getElementById("sizeTable").style.display = "none";
}


function removeColor(index) {
    listColor.splice(index, 1);
    renderColorTable();
}


function renderColorTable() {
    const tableBody = document.getElementById("colorTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    listColor.forEach((color, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${color.colorName}</td>
            <td>
                <div class="color-preview" style="background-color: ${color.colorCode}"></div>
                ${color.colorCode}
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeColor(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function validateProduct(data) {
    const validations = [
        { condition: !data.codesp, message: "Mã sản phẩm không được để trống!" },
        { condition: !data.namesp, message: "Tên sản phẩm không được để trống!" },
        { condition: !data.price || isNaN(data.price) || Number(data.price) <= 0, message: "Giá phải là số dương!" },
        { condition: !data.alias, message: "Alias không được để trống!" },
        { condition: !data.listdpar || data.listdpar.length === 0, message: "Vui lòng chọn danh mục!" },
        { condition: !data.description, message: "Mô tả không được để trống!" },
        { condition: !data.thuonghieu, message: "Vui lòng chọn thương hiệu!" },
        { condition: !data.chatlieu, message: "Vui lòng chọn chất liệu!" },
        { condition: !data.degiay, message: "Vui lòng chọn đế giày!" }
    ];

    for (const validation of validations) {
        if (validation.condition) {
            toastr.warning(validation.message);
            return false;
        }
    }
    return true;
}

async function deleteProduct(productId) {
    try {
        const url = `http://localhost:8080/api/product/admin/findById?id=${productId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });

        if (!response.ok) {
            toastr.error("Không thể lấy thông tin sản phẩm.");
            return;
        }

        const product = await response.json();

        const confirmDelete = confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
        if (!confirmDelete) {
            return;
        }
        if (product.quantitySold > 0) {
            toastr.warning("Sản phẩm đã có người mua, không thể xóa.");
            return;
        }

        const deleteUrl = `http://localhost:8080/api/product/admin/delete?id=${productId}`;
        const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });

        if (deleteResponse.ok) {
            toastr.success("Sản phẩm đã được xóa thành công.");
            loadProduct(0, "", []);
        } else {
            toastr.error("Không thể xóa sản phẩm.");
        }
    } catch (error) {
        console.error("Error deleting product: ", error);
        toastr.error("Có lỗi xảy ra khi xóa sản phẩm.");
    }
}

async function deleteProductSize(id) {
    var con = confirm("Bạn muốn xóa size này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-size/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa thành công!");
        await new Promise(r => setTimeout(r, 1000));
        loadAProduct();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteProductColor(id) {
    var con = confirm("Bạn muốn xóa màu này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product-color/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        await new Promise(r => setTimeout(r, 1000));
        loadAProduct();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


function checkDuplicateColors() {
    const colorBlocks = document.getElementById("listcolorblock").getElementsByClassName("singlecolor");
    const colorNames = new Set();

    for (let block of colorBlocks) {
        const colorName = block.getElementsByClassName("colorName")[0].value.trim().toLowerCase();
        if (colorName) {
            if (colorNames.has(colorName)) {
                toastr.warning(`Màu sắc "${colorName}" đã tồn tại!`);
                return false;
            }
            colorNames.add(colorName);
        }
    }
    return true;
}

async function loadColor() {
    var list = document.getElementById("listcolorblock").getElementsByClassName("singlecolor");
    var listF = [];
    listColor = [];

    if (!checkDuplicateColors()) {
        return;
    }

    for (let i = 0; i < list.length; i++) {
        var singleColor = list[i];
        var idcolor = singleColor.getElementsByClassName("idcolor")[0];
        var colorName = singleColor.getElementsByClassName("colorName")[0];

        if (!colorName.value.trim()) {
            toastr.warning("Tên màu sắc không được để trống!");
            return;
        }

        listF.push(singleColor.getElementsByClassName("fileimgclo")[0]);
        var obj = {
            "id": idcolor.value == '' ? null : idcolor.value,
            "colorName": colorName.value,
            "hasFile": singleColor.getElementsByClassName("fileimgclo")[0].files.length == 0 ? false : true,
            "linkImage": null
        };

        var listsizes = [];
        var sizeblockList = singleColor.getElementsByClassName("singelsizeblock");

        var existingSizeNames = new Set();
        for (let j = 0; j < sizeblockList.length; j++) {
            var size = sizeblockList[j];
            var sizeName = size.getElementsByClassName("sizename")[0].value.trim();
            var quantity = size.getElementsByClassName("sizequantity")[0].value;

            if (!sizeName) {
                toastr.warning("Tên kích thước không được để trống!");
                return;
            }

            if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
                toastr.warning("Số lượng phải là số dương!");
                return;
            }
            if (existingSizeNames.has(sizeName)) {
                toastr.warning(`Kích thước "${sizeName}" đã tồn tại!`);
                return;
            }
            existingSizeNames.add(sizeName);
            var objsize = {
                "id": size.getElementsByClassName("idsize")[0].value == '' ? null : size.getElementsByClassName("idsize")[0].value,
                "sizeName": sizeName,
                "quantity": quantity,
            };
            listsizes.push(objsize);
        }

        if (listsizes.length === 0) {
            toastr.warning("Vui lòng thêm ít nhất một kích thước cho màu sắc này!");
            return;
        }

        obj.size = listsizes;
        listColor.push(obj);
    }


    if (listColor.length === 0) {
        toastr.warning("Vui lòng thêm ít nhất một màu sắc!");
        return;
    }

    var listImg = await uploadMultipleFile(listF);

    for (let i = 0; i < listImg.length; i++) {
        for (let j = 0; j < listColor.length; j++) {
            if (listColor[j].hasFile == true) {
                if (listColor[j].linkImage == null) {
                    listColor[j].linkImage = listImg[i].link;
                    break;
                }
            }
        }
    }

    console.log(listColor);
}



async function uploadMultipleFile(listF) {
    const formData = new FormData()
    for (i = 0; i < listF.length; i++) {
        formData.append("file", listF[i].files[0])
    }
    var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file-order-response';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    return await res.json();
}

async function uploadFile(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        linkbanner = await res.text();
    }
}
function priviewImg(e) {
    var dv = e.parentNode.parentNode;
    var img = dv.getElementsByClassName("divimgpre")[0].getElementsByClassName("imgpreview")[0]
    const [file] = e.files
    if (file) {
        img.src = URL.createObjectURL(file)
    }
}


function addSizeBlock(e) {
    var dv = e.parentNode;
    var listSize = dv.getElementsByClassName("listsizeblock")[0];
    var main = `<div class="singelsizeblock">
                    <input type="hidden" class="idsize">
                    <input placeholder="tên size" class="sizename">
                    <input placeholder="Số lượng" value="0" class="sizequantity">
                    <i onclick="removeInputSize(this)" class="fa fa-trash-alt trashsize"></i>
                </div>`
    listSize.insertAdjacentHTML('beforeend', main);
}

function removeColorBlock(e) {
    var dv = e.parentNode.parentNode;
    dv.remove();
}

function removeInputSize(e) {
    var dv = e.parentNode;
    dv.remove();
}

async function loadAllCategorySelect() {
    var url = 'http://localhost:8080/api/category/public/findAllList';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("listdpar").innerHTML = main
    const ser = $("#listdpar");
    ser.select2({
        placeholder: "Chọn danh mục sản phẩm",
    });
}


async function loadAllProductList(){
    var search = document.getElementById("search").value
    var url = 'http://localhost:8080/api/product/public/findAll-list?search=' + search
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = "";
    for(i=0; i<list.length; i++){
        main += `<tr>
                  <td>${list[i].code}</td>
                  <td>${list[i].name}</td>
                  <td>${formatmoney(list[i].price)}</td>
<td>
    <button onclick="loadChiTietMauSac(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-success">
        <i class="bx bx-plus"></i>
    </button>
</td>
                </tr>`
    }
    document.getElementById("listproduct").innerHTML = main;
}

async function loadChiTietMauSac(idproduct){
    var url = 'http://localhost:8080/api/product/public/findById?id=' + idproduct
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.productColors
    document.getElementById("listspchitiet").innerHTML = "";
    var main = document.getElementById("listspchitiet");
    for(i=0; i<list.length; i++){
        var trfirst = document.createElement("tr");
        var tdfirst = document.createElement("td");
        tdfirst.rowSpan = list[i].productSizes.length
        tdfirst.innerHTML = list[i].colorName
        trfirst.appendChild(tdfirst)

        if(list[i].productSizes.length > 0){
            var td1 = document.createElement("td");
            td1.innerHTML = list[i].productSizes[0].sizeName;
            var td2 = document.createElement("td");
            td2.innerHTML = list[i].productSizes[0].quantity;
            var td3 = document.createElement("td");

            var checked = checkTonTai(list[i].productSizes[0].id)
            var ck =''
            var onc = '';
            if(checked == true){
                onc = `removeTam(${list[i].productSizes[0].id}, this)`
                ck = 'checked'
            }
            else{
                onc = `addTam(${list[i].productSizes[0].id}, this)`
            }
            td3.innerHTML = `<input onchange="${onc}"  ${ck}  type="checkbox">`


            trfirst.appendChild(td1)
            trfirst.appendChild(td2)
            trfirst.appendChild(td3)
        }
        main.appendChild(trfirst)
        if(list[i].productSizes.length > 1){
            for(j=1; j< list[i].productSizes.length; j++){
                var trsecond = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.innerHTML = list[i].productSizes[j].sizeName;
                var td2 = document.createElement("td");
                td2.innerHTML = list[i].productSizes[j].quantity;
                var td3 = document.createElement("td");
                var checked = checkTonTai(list[i].productSizes[j].id)
                var onc = '';
                var ck =''
                if(checked == true){
                    onc = `removeTam(${list[i].productSizes[j].id}, this)`
                    ck = 'checked'
                }
                else{
                    onc = `addTam(${list[i].productSizes[j].id}, this)`
                }
                td3.innerHTML = `<input onchange="${onc}" ${ck} type="checkbox">`
                td3.onchange = function (){
                    if(checked == true){
                        removeTam(list[i].productSizes[j].id)
                    }
                    else{
                        addTam(list[i].productSizes[j].id)
                    }
                }
                trsecond.appendChild(td1)
                trsecond.appendChild(td2)
                trsecond.appendChild(td3)
                main.appendChild(trsecond)
            }
        }

    }
}

var listProductTam = JSON.parse(localStorage.getItem("listProductTam")) || [];
async function addTam(idsize, e) {
    if (e.checked == false) {
        removeTam(idsize);
        return;
    }
    if (checkTonTai(idsize) == true) {
        return;
    }
    var url = 'http://localhost:8080/api/product-size/public/find-by-id?id=' + idsize;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();

    const formattedResult = {
        product: result.product,
        productColor: {
            colorName: result.productColor.colorName,
            id: result.productColor.id
        },
        productSize: {
            id: result.productSize.id,
            sizeName: result.productSize.sizeName,
            quantity: result.productSize.quantity
        },
        quantity: 1
    };

    listProductTam.push(formattedResult);
    saveToLocalStorage();
    loadSizeProduct();
}

function removeTam(idsize) {
    listProductTam = listProductTam.filter(item => item.productSize.id !== idsize);
    saveToLocalStorage();
    loadSizeProduct();
}

function checkTonTai(idsize) {
    for (var k = 0; k < listProductTam.length; k++) {
        if (listProductTam[k].productSize.id == idsize) {
            return true;
        }
    }
    return false;
}

function saveToLocalStorage() {
    localStorage.setItem("listProductTam", JSON.stringify(listProductTam));
}

function loadSizeProduct() {
    console.log(listProductTam);
}

document.addEventListener("DOMContentLoaded", () => {
    listProductTam = JSON.parse(localStorage.getItem("listProductTam")) || [];
    loadSizeProduct();
});


function removeTam(idsize){
    for(i=0; i< listProductTam.length; i++){
        if(listProductTam[i].productSize.id == idsize){
            listProductTam.splice(i, 1);
        }
    }
    loadSizeProduct();
}

function loadSizeProduct(){
    var main = '';
    var tongtientt = 0;
    for(i=0; i< listProductTam.length; i++){
        tongtientt = Number(tongtientt) + Number(listProductTam[i].product.price) * Number(listProductTam[i].quantity);
        const colorName = listProductTam[i].productColor.colorName;
        const sizeName = listProductTam[i].productSize.sizeName;
        const maxQuantity = listProductTam[i].productSize.quantity;

        main += `<tr>
            <td>Size: ${sizeName}, Màu: ${colorName}<br>${listProductTam[i].product.name}</td>
            <td>${formatmoney(listProductTam[i].product.price)}</td>
            <td>
                <div class="clusinp">
                    <button onclick="upDownQuantity(${listProductTam[i].productSize.id},-1)" class="cartbtn"> - </button>
                    <input type="number" value="${listProductTam[i].quantity}" 
                           onchange="validateInputQuantity(${listProductTam[i].productSize.id}, this)" 
                           min="1" max="${maxQuantity}" 
                           class="inputslcart no-spinners">
                    <button onclick="upDownQuantity(${listProductTam[i].productSize.id},1)" class="cartbtn"> + </button>
                </div>
            </td>
            <td><i onclick="removeTam(${listProductTam[i].productSize.id})" class="fa fa-trash-alt pointer"></i></td>
        </tr>`
    }
    document.getElementById("listproducttam").innerHTML = main;
    document.getElementById("tongtientt").innerHTML = formatmoney(tongtientt);
}

const style = document.createElement('style');
style.textContent = `
    .no-spinners::-webkit-inner-spin-button, 
    .no-spinners::-webkit-outer-spin-button { 
        -webkit-appearance: none;
        margin: 0;
    }
    .no-spinners {
        -moz-appearance: textfield;
    }
`;
document.head.appendChild(style);

function validateInputQuantity(idsize, input) {
    const newQuantity = parseInt(input.value);
    const item = listProductTam.find(item => item.productSize.id === idsize);

    if (!item) return;

    if (isNaN(newQuantity)) {
        input.value = 1;
        item.quantity = 1;
        toastr.error("Vui lòng nhập số");
        return;
    }

    if (newQuantity < 1) {
        input.value = 1;
        item.quantity = 1;
        toastr.error("Số lượng không thể nhỏ hơn 1");
        return;
    }
    if (newQuantity > item.productSize.quantity) {
        input.value = item.productSize.quantity;
        item.quantity = item.productSize.quantity;
        toastr.error(`Số lượng sản phẩm chỉ còn ${item.productSize.quantity}`);
        return;
    }

    item.quantity = newQuantity;
    loadSizeProduct();
}

function upDownQuantity(idsize, quantity){
    const item = listProductTam.find(item => item.productSize.id === idsize);
    if (!item) return;

    const newQuantity = Number(item.quantity) + Number(quantity);

    if (newQuantity < 1) {
        toastr.error("Số lượng không thể nhỏ hơn 1");
        return;
    }

    if (newQuantity > item.productSize.quantity) {
        toastr.error(`Số lượng sản phẩm chỉ còn ${item.productSize.quantity}`);
        return;
    }

    item.quantity = newQuantity;
    loadSizeProduct();
}
async function loadSelect() {
    var response = await fetch('http://localhost:8080/api/material/public/all', {
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("chatlieu").innerHTML = main

    var response = await fetch('http://localhost:8080/api/trademark/public/all', {
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("thuonghieu").innerHTML = main

    var response = await fetch('http://localhost:8080/api/sole/public/all', {
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("degiay").innerHTML = main
}
async function addColor(){
    var response = await fetch('http://localhost:8080/api/trademark/public/all')

}