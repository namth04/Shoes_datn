const listFile = [];

var size = 8;

async function loadProduct(page, param, listCate) {
    if (param == null) {
        param = "";
    }

    var result = null;
    var url = '';
    let requestBody = null; // Khai báo requestBody bên ngoài
    // Xử lý trường hợp không có listcate
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

    // Kiểm tra nếu result không hợp lệ
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

    // Xây dựng phân trang
    var mainpage = '';
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadProduct(${(Number(i) - 1)}, '${param}', ${JSON.stringify(listCate)})" class="page-item">
                        <a class="page-link" href="#listsp">${i}</a>
                    </li>`;
    }
    document.getElementById("pageable").innerHTML = mainpage;
    // Gắn sự kiện onclick bằng JavaScript
    const pageItems = document.querySelectorAll("#pageable .page-item");
    pageItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            loadProduct(index, param, listCate);
        });
    });
}


async function filterByCate() {
    loadProduct(0, "", $("#listdpar").val());
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
        for (i = 0; i < result.productImages.length; i++) {
            main += `<div id="imgdathem${result.productImages[i].id}" class="col-md-3 col-sm-4 col-4">
                        <img style="width: 90%;" src="${result.productImages[i].linkImage}" class="image-upload">
                        <button onclick="deleteProductImage(${result.productImages[i].id})" class="btn btn-danger form-control">Xóa ảnh</button>
                    </div>`
        }
        document.getElementById("listanhdathem").innerHTML = main
        await loadAllCategorySelect();
        var listCate = []
        for (i = 0; i < result.productCategories.length; i++) {
            listCate.push(result.productCategories[i].category.id);
        }
        console.log(listCate)
        $("#listdpar").val(listCate).change();;
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

var linkbanner = '';

async function saveProduct() {
    document.getElementById("loading").style.display = 'block';
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("id");

    var url = id != null
        ? 'http://localhost:8080/api/product/admin/update'
        : 'http://localhost:8080/api/product/admin/create';

    // Collecting form data
    var codesp = document.getElementById("codesp").value.trim();
    var namesp = document.getElementById("namesp").value.trim();
    var price = document.getElementById("price").value.trim();
    var alias = document.getElementById("alias").value.trim();
    var listdpar = $("#listdpar").val();
    var description = tinyMCE.get('editor').getContent().trim();
    var thuonghieu = document.getElementById("thuonghieu").value.trim();
    var chatlieu = document.getElementById("chatlieu").value.trim();
    var degiay = document.getElementById("degiay").value.trim();

    // Validate basic fields
    if (!codesp) {
        toastr.warning("Mã sản phẩm không được để trống!");
        document.getElementById("loading").style.display = 'none';
        return;
    }

    if (!namesp) {
        toastr.warning("Tên sản phẩm không được để trống!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
        toastr.warning("Giá phải là số dương!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!alias) {
        toastr.warning("Alias không được để trống!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!listdpar || listdpar.length === 0) {
        toastr.warning("Vui lòng chọn danh mục!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!description) {
        toastr.warning("Mô tả không được để trống!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!thuonghieu) {
        toastr.warning("Vui lòng chọn thương hiệu!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!chatlieu) {
        toastr.warning("Vui lòng chọn chất liệu!");
        document.getElementById("loading").style.display = 'none';
        return;
    }
    if (!degiay) {
        toastr.warning("Vui lòng chọn đế giày!");
        document.getElementById("loading").style.display = 'none';
        return;
    }

    // Call loadColor to validate color and size
    await loadColor();  // Ensure this function is run before proceeding

    // If loadColor finds issues, it will return early with a warning, so we only proceed if everything is valid
    if (listColor.length === 0) {
        // No valid colors found
        document.getElementById("loading").style.display = 'none';
        return;
    }

    // File Upload and Data Preparation
    await uploadFile(document.getElementById("imgbanner"));
    var listLinkImg = id == null ? await uploadMultipleFileNotResp() : []; // Skip if updating
    await loadColor(); // Re-run loadColor if necessary for images

    if (!linkbanner) {
        toastr.warning("Vui lòng tải lên banner hình ảnh!");
        document.getElementById("loading").style.display = 'none';
        return;
    }

    if (id == null && (!listLinkImg || listLinkImg.length === 0)) { // Only check for detail images if creating
        toastr.warning("Vui lòng tải lên ít nhất một hình ảnh chi tiết!");
        document.getElementById("loading").style.display = 'none';
        return;
    }

    // Create product object
    var product = {
        id: id,
        code: codesp,
        alias: alias,
        name: namesp,
        imageBanner: linkbanner,
        price: price,
        description: description,
        listCategoryIds: listdpar,
        linkLinkImages: listLinkImg,
        colors: listColor,
        trademark: { id: thuonghieu },
        material: { id: chatlieu },
        sole: { id: degiay }
    };

    // Send API request
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(product)
    });

    // Handle response
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Thêm/Sửa sản phẩm thành công",
                type: "success"
            },
            function() {
                document.getElementById("loading").style.display = 'none';
                window.location.href = 'http://localhost:8080/admin/product';
            });
    } else {
        swal({
                title: "Thông báo",
                text: "Thêm/Sửa sản phẩm thất bại",
                type: "error"
            },
            function() {
                document.getElementById("loading").style.display = 'none';
                window.location.reload();
            });
    }
}





async function deleteProduct(id) {
    var con = confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/product/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa sản phẩm thành công!");
        await new Promise(r => setTimeout(r, 1000));
        window.location.reload();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
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
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
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


async function loadColor() {
    var list = document.getElementById("listcolorblock").getElementsByClassName("singlecolor");
    var listF = [];
    listColor = []; // Clear listColor to ensure it is fresh for this load

    for (i = 0; i < list.length; i++) {
        var singleColor = list[i];
        var idcolor = singleColor.getElementsByClassName("idcolor")[0];
        var colorName = singleColor.getElementsByClassName("colorName")[0];

        // Check if color name is empty
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

        // Validate each size block
        for (j = 0; j < sizeblockList.length; j++) {
            var size = sizeblockList[j];
            var objsize = {
                "id": size.getElementsByClassName("idsize")[0].value == '' ? null : size.getElementsByClassName("idsize")[0].value,
                "sizeName": size.getElementsByClassName("sizename")[0].value,
                "quantity": size.getElementsByClassName("sizequantity")[0].value,
            };

            // Validate size
            if (!objsize.sizeName || !objsize.quantity || isNaN(objsize.quantity) || Number(objsize.quantity) <= 0) {
                toastr.warning("Kích thước phải có tên và số lượng hợp lệ!");
                return;
            }

            listsizes.push(objsize);
        }

        // Validate that there is at least one size
        if (listsizes.length === 0) {
            toastr.warning("Vui lòng thêm ít nhất một kích thước cho màu sắc này!");
            return;
        }

        obj.size = listsizes;
        listColor.push(obj);
    }

    // Validate if at least one color has been added
    if (listColor.length === 0) {
        toastr.warning("Vui lòng chọn ít nhất một màu sắc!");
        return;
    }

    // Handle file uploads
    var listImg = await uploadMultipleFile(listF);

    for (i = 0; i < listImg.length; i++) {
        for (j = 0; j < listColor.length; j++) {
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

async function uploadMultipleFileNotResp() {
    const formData = new FormData()
    for (i = 0; i < listFile.length; i++) {
        formData.append("file", listFile[i])
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

function addBlockColor() {
    var main =
        `<div class="col-sm-6">
        <div class="singlecolor row">
            <div class="col-12"><i onclick="removeColorBlock(this)" class="fa fa-trash pointer"></i></div>
            <div class="col-8 inforcolor">
                <input type="hidden" class="idcolor">
                <label class="lb-form">Tên màu:</label>
                <input type="text" class="form-control colorName">
                <label class="lb-form">Ảnh màu</label>
                <input onchange="priviewImg(this)" type="file" class="form-control fileimgclo">
            </div>
            <div class="col-4 divimgpre">
                <img class="imgpreview" src="" style="width: 100%;">
            </div>
            <span onclick="addSizeBlock(this)" class="pointer btnaddsize"><i class="fa fa-plus"></i> Thêm size</span>
            <div class="listsizeblock">
                <!-- <div class="singelsizeblock">
                    <input type="hidden" class="idsize">
                    <input placeholder="tên size" class="sizename">
                    <input placeholder="Số lượng" value="0" class="sizequantity">
                    <i onclick="removeInputSize(this)" class="fa fa-trash-alt trashsize"></i>
                </div> -->
            </div>
        </div></div>`
    document.getElementById("listcolorblock").insertAdjacentHTML('beforeend', main);
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

function loadInit() {
    $('input#choosefile').change(function() {
        var files = $(this)[0].files;
    });
    document.querySelector('#choosefile').addEventListener("change", previewImages);

    function previewImages() {
        var files = $(this)[0].files;
        for (i = 0; i < files.length; i++) {
            listFile.push(files[i]);
        }

        var preview = document.querySelector('#preview');

        // if (this.files) {
        //     [].forEach.call(this.files, readAndPreview);
        // }
        for (i = 0; i < files.length; i++) {
            readAndPreview(files[i]);
        }

        function readAndPreview(file) {

            if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
                return alert(file.name + " is not an image");
            }

            var reader = new FileReader(file);

            reader.addEventListener("load", function() {
                document.getElementById("chon-anhs").className = 'col-sm-3';
                document.getElementById("chon-anhs").style.height = '100px';
                document.getElementById("chon-anhs").style.marginTop = '5px';
                document.getElementById("choose-image").style.height = '120px';
                document.getElementById("numimage").innerHTML = '';
                document.getElementById("camera").style.fontSize = '20px';
                document.getElementById("camera").style.marginTop = '40px';
                document.getElementById("camera").className = 'fas fa-plus';
                document.getElementById("choose-image").style.width = '90%';

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
                button.innerHTML = 'xóa'
                button.className = 'btn btn-warning';
                div.appendChild(button);

                button.addEventListener("click", function() {
                    div.remove();
                    console.log(listFile.length)
                    for (i = 0; i < listFile.length; i++) {
                        if (listFile[i] === file) {
                            listFile.splice(i, 1);
                        }
                    }
                    console.log(listFile.length)
                });
            });

            reader.readAsDataURL(file);

        }

    }

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
                  <td><button onclick="loadChiTietMauSac(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-primary">Chọn</button></td>
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

var listProductTam = [];
async function addTam(idsize, e){
    if(e.checked == false){
        removeTam(idsize)
        return;
    }
    if(checkTonTai(idsize) == true){
        return;
    }
    var url = 'http://localhost:8080/api/product-size/public/find-by-id?id=' + idsize
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    result.quantity = 1;
    listProductTam.push(result);
    loadSizeProduct();
}

function checkTonTai(idsize){
    for(var k=0; k< listProductTam.length; k++){
        if(listProductTam[k].productSize.id == idsize){
            return true;
        }
    }
    return false;
}

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
        main += `<tr>
            <td>Size: ${listProductTam[i].productSize.sizeName}, Màu: ${listProductTam[i].productColor.colorName}<br>${listProductTam[i].product.name}</td>
            <td>${formatmoney(listProductTam[i].product.price)}</td>
            <td>
                <div class="clusinp"><button onclick="upDownQuantity(${listProductTam[i].productSize.id},-1)" class="cartbtn"> - </button>
                <input value="${listProductTam[i].quantity}" class="inputslcart">
                <button onclick="upDownQuantity(${listProductTam[i].productSize.id},1)" class="cartbtn"> + </button></div>
            </td>
            <td><i onclick="removeTam(${listProductTam[i].productSize.id})" class="fa fa-trash-alt pointer"></i></td>
        </tr>`
    }
    document.getElementById("listproducttam").innerHTML = main;
    document.getElementById("tongtientt").innerHTML = formatmoney(tongtientt);
}

function upDownQuantity(idsize, quantity){
    for(i=0; i< listProductTam.length; i++){
        if(listProductTam[i].productSize.id == idsize){
            listProductTam[i].quantity = Number(listProductTam[i].quantity) + Number(quantity);
            if(listProductTam[i].quantity == 0){
                removeTam(idsize)
            }
            break;
        }
    }
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
