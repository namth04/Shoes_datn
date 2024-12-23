let existingTrademarks = [];

async function loadResult() {
    try {
        var url = 'http://localhost:8080/api/trademark/public/all';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Không thể tải danh sách nhãn hiệu');
        }

        existingTrademarks = await response.json();

        var main = '';
        for (let i = 0; i < existingTrademarks.length; i++) {
            main += `<tr>
                        <td>${existingTrademarks[i].id}</td>
                        <td>${existingTrademarks[i].name}</td>
                        <td class="sticky-col">
                            <i onclick="deleteResult(${existingTrademarks[i].id})" class="fa fa-trash-alt iconaction"></i>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#addtk" onclick="loadAResult(${existingTrademarks[i].id})"><i class="fa fa-edit iconaction"></i></a>
                        </td>
                    </tr>`
        }
        document.getElementById("listresult").innerHTML = main;
    } catch (error) {
        toastr.error('Lỗi: ' + error.message);
    }
}

function clearData() {
    document.getElementById("idres").value = "";
    document.getElementById("name").value = "";
}


async function loadAResult(id) {
    try {
        const response = await fetch('http://localhost:8080/api/trademark/public/findById?id=' + id);

        if (!response.ok) {
            throw new Error('Không thể tải thông tin nhãn hiệu');
        }

        var result = await response.json();
        document.getElementById("idres").value = result.id;
        document.getElementById("name").value = result.name;
    } catch (error) {
        toastr.error('Lỗi: ' + error.message);
    }
}


function validateTrademark(name) {
    name = name.trim();
    if (!name) {
        toastr.warning("Tên nhãn hiệu không được để trống");
        return false;
    }
    const isDuplicate = existingTrademarks.some(
        trademark => trademark.name.toLowerCase().trim() === name.toLowerCase() &&
            trademark.id != document.getElementById("idres").value
    );
    if (isDuplicate) {
        toastr.warning("Tên nhãn hiệu đã tồn tại");
        return false;
    }
    return true;
}
async function saveResult() {
    try {
        const nameInput = document.getElementById("name");
        const name = nameInput.value.trim();

        if (!validateTrademark(name)) {
            return;
        }
        var payload = {
            "id": document.getElementById("idres").value || null,
            "name": name,
        }

        const response = await fetch('http://localhost:8080/api/trademark/admin/create', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });

        if (response.status < 300) {
            toastr.success(payload.id ? "Cập nhật thành công" : "Thêm mới thành công");
            clearData();
            loadResult();
        } else if (response.status === exceptionCode) {
            var result = await response.json();
            toastr.warning(result.defaultMessage);
        } else {
            toastr.error('Lỗi không xác định khi lưu nhãn hiệu');
        }
    } catch (error) {
        toastr.error('Lỗi: ' + error.message);
    }
}
async function deleteResult(id) {
    try {

        var con = confirm("Bạn chắc chắn muốn xóa nhãn hiệu này?");
        if (!con) {
            return;
        }
        var url = 'http://localhost:8080/api/trademark/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toastr.success("Xóa thành công!");
            loadResult();
        } else if (response.status === exceptionCode) {
            var result = await response.json()
            if (result.defaultMessage.includes('đang được sử dụng')) {
                toastr.error("Không thể xóa! Nhãn hiệu này đang được sử dụng.");
            } else {
                toastr.warning(result.defaultMessage);
            }
        } else {
            toastr.error('Nhãn hiệu này đang được sử dụng');
        }
    } catch (error) {
        toastr.error('Lỗi: ' + error.message);
    }
}
document.addEventListener('DOMContentLoaded', loadResult);