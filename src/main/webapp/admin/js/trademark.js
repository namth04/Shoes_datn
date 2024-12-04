// Global variables for tracking existing trademarks
let existingTrademarks = [];

// Load and validate trademarks
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

// Clear input fields
function clearData() {
    document.getElementById("idres").value = "";
    document.getElementById("name").value = "";
}

// Load a specific trademark for editing
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

// Validate trademark name
function validateTrademark(name) {
    // Trim whitespace
    name = name.trim();

    // Check if name is empty
    if (!name) {
        toastr.warning("Tên nhãn hiệu không được để trống");
        return false;
    }

    // Check for duplicate names (case-insensitive)
    const isDuplicate = existingTrademarks.some(
        trademark => trademark.name.toLowerCase() === name.toLowerCase() &&
            trademark.id != document.getElementById("idres").value
    );

    if (isDuplicate) {
        toastr.warning("Tên nhãn hiệu đã tồn tại");
        return false;
    }

    return true;
}

function validateTrademark(name) {
    // Check if name is empty or contains only whitespace
    if (!name) {
        toastr.warning("Tên nhãn hiệu không được để trống");
        return false;
    }

    // Check for names that are just spaces
    if (name.trim() === '') {
        toastr.warning("Tên nhãn hiệu không được chỉ chứa khoảng trắng");
        return false;
    }

    // Check for duplicate names (case-insensitive)
    const isDuplicate = existingTrademarks.some(
        trademark => trademark.name.toLowerCase().trim() === name.toLowerCase().trim() &&
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

        // Validate trademark name (empty and duplicate checks)
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