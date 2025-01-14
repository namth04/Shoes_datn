var token = localStorage.getItem("token");
var size = 10;
async function loadBlog(page) {
    var sort = document.getElementById("sort").value
    var url = 'http://localhost:8080/api/blog/public/findAll?page=' + page + '&size=' + size + '&sort=' + sort;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += ` <tr>
                    <td>#${list[i].id}</td>
                    <td><img src="${list[i].imageBanner}" style="width: 100px;"></td>
                    <td>${list[i].createdDate}</td>
                    <td>${list[i].title}</td>
                    <td>${list[i].description}</td>
                    <td class="sticky-col">
                        <i onclick="deleteBlog(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="addblog?id=${list[i].id}"><i class="fa fa-edit iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listblog").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadBlog(${(Number(i) - 1)})" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

var linkImage = ''
async function saveBlog() {
    const loadingElement = document.getElementById("loading");
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const content = tinyMCE.get('editor').getContent().trim();
    const primaryBlog = document.getElementById("primaryBlog").checked;
    const fileInput = document.getElementById('fileimage');
    const uls = new URL(document.URL);
    const id = uls.searchParams.get("id");
    const url = 'http://localhost:8080/api/blog/admin/create';
    const uploadUrl = 'http://localhost:8080/api/public/upload-file';

    // Display loading spinner
    loadingElement.style.display = 'block';

    try {
        // Validate required fields
        if (!title) {
            toastr.warning("Không để trống tiêu đề");
            return;
        }
        if (!fileInput.files[0]) {
            toastr.warning("Không để trống ảnh bài viết");
            return;
        }
        if (!description) {
            toastr.warning("Không để trống mô tả");
            return;
        }
        if (!content) {
            toastr.warning("Không để trống nội dung");
            return;
        }

        // Upload image
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            toastr.error("Lỗi khi tải ảnh lên");
            return;
        }

        const linkImage = await uploadResponse.text();

        // Create blog object
        const blog = {
            id,
            title,
            description,
            content,
            imageBanner: linkImage,
            primaryBlog
        };

        // Send blog data
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(blog)
        });

        if (response.ok) {
            swal({
                    title: "Thông báo",
                    text: "Thêm/sửa blog thành công!",
                    type: "success"
                },
                function () {
                    window.location.replace('blog');
                });
        } else if (response.status === exceptionCode) {
            const result = await response.json();
            toastr.warning(result.defaultMessage);
        } else {
            toastr.error("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    } catch (error) {
        toastr.error("Đã xảy ra lỗi: " + error.message);
    } finally {
        // Hide loading spinner
        loadingElement.style.display = 'none';
    }
}

async function loadABlog() {
    var id = window.location.search.split('=')[1];
    if (id != null) {
        var url = 'http://localhost:8080/api/blog/public/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var blog = await response.json();
        document.getElementById("title").value = blog.title
        document.getElementById("description").value = blog.description
        document.getElementById("primaryBlog").checked = blog.primaryBlog
        document.getElementById("imgpreview").src = blog.imageBanner
        linkImage = blog.imageBanner
        tinyMCE.get('editor').setContent(blog.content)
    }
}


async function deleteBlog(id) {
    var con = confirm("Xác nhận xóa bài viết này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/blog/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Xóa bài viết thành công!",
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