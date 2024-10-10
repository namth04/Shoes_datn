package com.fpoly.datn.service;

import com.fpoly.datn.entity.Product;
import com.fpoly.datn.entity.ProductColor;
import com.fpoly.datn.entity.ProductSize;
import com.fpoly.datn.entity.Promotion;
import com.fpoly.datn.model.dto.DetailProductInfoDTO;
import com.fpoly.datn.model.dto.PageableDTO;
import com.fpoly.datn.model.dto.ProductInfoDTO;
import com.fpoly.datn.model.dto.ShortProductInfoDTO;
import com.fpoly.datn.model.request.CreateProductRequest;
import com.fpoly.datn.model.request.CreateSizeCountRequest;
import com.fpoly.datn.model.request.CreateColorCountRequest;
import com.fpoly.datn.model.request.FilterProductRequest;
import com.fpoly.datn.model.request.UpdateFeedBackRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {

    // Lấy sản phẩm cho admin
    Page<Product> adminGetListProduct(String id, String name, String category, String brand, String material, String sole, Integer page);

    // Tạo sản phẩm
    Product createProduct(CreateProductRequest createProductRequest);

    // Sửa sản phẩm
    void updateProduct(CreateProductRequest createProductRequest, String id);

    // Lấy chi tiết sản phẩm
    Product getProductById(String id);

    // Xóa sản phẩm theo nhiều ID
    void deleteProduct(String[] ids);

    // Xóa sản phẩm theo ID
    void deleteProductById(String id);

    // Lấy danh sách sản phẩm bán nhiều nhất
    List<ProductInfoDTO> getListBestSellProducts();

    // Lấy danh sách sản phẩm mới nhất
    List<ProductInfoDTO> getListNewProducts();

    // Lấy danh sách sản phẩm được xem nhiều
    List<ProductInfoDTO> getListViewProducts();

    // Lấy chi tiết sản phẩm theo ID
    DetailProductInfoDTO getDetailProductById(String id);

    // Lấy sản phẩm liên quan
    List<ProductInfoDTO> getRelatedProducts(String id);

    // Lấy các size có sẵn của sản phẩm
    List<Integer> getListAvailableSize(String id);

    // Tạo số lượng theo size
    void createSizeCount(CreateSizeCountRequest createSizeCountRequest);

    // Lấy danh sách size của sản phẩm
    List<ProductSize> getListSizeOfProduct(String id);

    // Lấy các màu có sẵn của sản phẩm
    List<String> getListAvailableColor(String id);

    // Tạo số lượng theo màu
    void createColorCount(CreateColorCountRequest createColorCountRequest);

    // Lấy danh sách màu của sản phẩm
    List<ProductColor> getListColorOfProduct(String id);


    // Lấy danh sách sản phẩm ngắn gọn
    List<ShortProductInfoDTO> getListProduct();

    // Lấy sản phẩm có sẵn
    List<ShortProductInfoDTO> getAvailableProducts();

    // Kiểm tra xem sản phẩm có size hay không
    boolean checkProductSizeAvailable(String id, int size);

    // Kiểm tra xem sản phẩm có màu hay không
    boolean checkProductColorAvailable(String id, String color);

    // Kiểm tra khuyến mãi công khai
    List<ProductInfoDTO> checkPublicPromotion(List<ProductInfoDTO> products);

    // Lọc sản phẩm theo yêu cầu
    PageableDTO filterProduct(FilterProductRequest req);

    // Tìm kiếm sản phẩm theo từ khóa
    PageableDTO searchProductByKeyword(String keyword, Integer page);

    // Kiểm tra mã khuyến mãi
    Promotion checkPromotion(String code);

    // Đếm số lượng sản phẩm
    long getCountProduct();

    // Cập nhật hình ảnh phản hồi
    void updatefeedBackImages(String id, UpdateFeedBackRequest req);

    // Lấy tất cả sản phẩm
    List<Product> getAllProduct();
}
