package com.fpoly.datn.service.impl;

import com.fpoly.datn.entity.*;
import com.fpoly.datn.exception.BadRequestException;
import com.fpoly.datn.exception.InternalServerException;
import com.fpoly.datn.exception.NotFoundException;
import com.fpoly.datn.model.request.GPayRequest;
import com.fpoly.datn.model.request.GpayPaymentRequest;
import com.fpoly.datn.repository.ProductRepository;
import com.fpoly.datn.repository.StatisticRepository;
import com.fpoly.datn.model.dto.OrderDetailDTO;
import com.fpoly.datn.model.dto.OrderInfoDTO;
import com.fpoly.datn.model.request.CreateOrderRequest;
import com.fpoly.datn.model.request.UpdateDetailOrder;
import com.fpoly.datn.model.request.UpdateStatusOrderRequest;
import com.fpoly.datn.repository.OrderRepository;
import com.fpoly.datn.repository.ProductEntryRepository;
import com.fpoly.datn.service.OrderService;
import com.fpoly.datn.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.fpoly.datn.config.Contant.*;

@Controller
public class OrderServiceImpl implements OrderService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductEntryRepository productEntryRepository;


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private StatisticRepository statisticRepository;

    @Override
    public Page<Order> adminGetListOrders(String id, String name, String phone, String status, String product, int page) {
        page--;
        if (page < 0) {
            page = 0;
        }
        int limit = 10;
        Pageable pageable = PageRequest.of(page, limit, Sort.by("created_at").descending());
        return orderRepository.adminGetListOrder(id, name, phone, status, product, pageable);
    }

    @Override
    public Order createOrder(CreateOrderRequest createOrderRequest, long userId) {

        // Kiểm tra sản phẩm có tồn tại
        Optional<Product> product = productRepository.findById(createOrderRequest.getProductId());
        if (product.isEmpty()) {
            throw new NotFoundException("Sản phẩm không tồn tại!");
        }

        // Kiểm tra size và màu sắc có sẵn
        ProductEntry productEntry = productEntryRepository.checkProductEntryAvailable(
                createOrderRequest.getProductId(),
                createOrderRequest.getSize(),
                createOrderRequest.getColor()
        );
        if (productEntry == null) {
            throw new BadRequestException("Size hoặc màu của sản phẩm tạm hết, vui lòng chọn sản phẩm khác!");
        }

        // Kiểm tra giá sản phẩm
        if (product.get().getSalePrice() != createOrderRequest.getProductPrice()) {
            throw new BadRequestException("Giá sản phẩm đã thay đổi, vui lòng đặt hàng lại!");
        }

        // Tạo đối tượng Order
        Order order = new Order();
        User user = new User();
        user.setId(userId);
        order.setCreatedBy(user);
        order.setBuyer(user);
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        order.setReceiverAddress(createOrderRequest.getReceiverAddress());
        order.setReceiverName(createOrderRequest.getReceiverName());
        order.setReceiverPhone(createOrderRequest.getReceiverPhone());
        order.setNote(createOrderRequest.getNote());
        order.setSize(createOrderRequest.getSize());
        order.setColor(createOrderRequest.getColor());
        order.setPrice(createOrderRequest.getProductPrice());
        order.setTotalPrice(createOrderRequest.getTotalPrice());
        order.setStatus(ORDER_STATUS);
        order.setQuantity(1);
        order.setProduct(product.get());

        // Cập nhật phương thức thanh toán
        order.setPaymentMethod(createOrderRequest.getPaymentMethod());

//        // Xử lý thanh toán GPay
//        if (createOrderRequest.getPaymentMethod() == 2) { // 2 cho GPay
//            GPayRequest gpayRequest = new GPayRequest();
//            gpayRequest.setMerchantCode("MC001");
//            gpayRequest.setRequestId(order.getId());
//            gpayRequest.setAmount(order.getTotalPrice());

//            // Gọi dịch vụ thanh toán GPay
//            GPayService gpayService = new GPayService(); 
//            GpayPaymentRequest gpayResponse = gpayService.processPayment(gpayRequest);

//            // Kiểm tra phản hồi từ GPay
//            if (gpayResponse.isSuccess()) {
//                order.setPaymentStatus("SUCCESS"); // Cập nhật trạng thái thanh toán thành công
//            } else {
//                order.setPaymentStatus("FAILED"); // Cập nhật trạng thái thanh toán thất bại
//                throw new BadRequestException("Thanh toán GPay không thành công: " + gpayResponse.getMessage());
//            }
//        } else {
//            order.setPaymentStatus("PENDING"); // Nếu không thanh toán qua GPay
//        }

        // Lưu đơn hàng vào cơ sở dữ liệu
        orderRepository.save(order);
        return order;
    }




    @Override
    public void updateDetailOrder(UpdateDetailOrder updateDetailOrder, long id, long userId) {
        // Kiểm tra có đơn hàng
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isEmpty()) {
            throw new NotFoundException("Đơn hàng không tồn tại");
        }

        Order order = orderOptional.get();

        // Kiểm tra quyền truy cập (nếu cần)
        if (order.getBuyer().getId() != userId) {
            throw new BadRequestException("Bạn không có quyền cập nhật đơn hàng này");
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.getStatus() != ORDER_STATUS) {
            throw new BadRequestException("Chỉ có thể cập nhật đơn hàng ở trạng thái chờ lấy hàng");
        }

        // Kiểm tra sản phẩm có tồn tại
        Optional<Product> productOptional = productRepository.findById(updateDetailOrder.getProductId());
        if (productOptional.isEmpty()) {
            throw new BadRequestException("Sản phẩm không tồn tại");
        }
        Product product = productOptional.get();

        // Kiểm tra giá sản phẩm
        if (product.getSalePrice() != updateDetailOrder.getProductPrice()) {
            throw new BadRequestException("Giá sản phẩm đã thay đổi, vui lòng đặt hàng lại");
        }

        // Kiểm tra size và màu sắc sản phẩm
        ProductEntry productEntry = productEntryRepository.checkProductEntryAvailable(
                updateDetailOrder.getProductId(),
                updateDetailOrder.getSize(),
                updateDetailOrder.getColor()
        );
        if (productEntry == null) {
            throw new BadRequestException("Size hoặc màu của sản phẩm tạm hết, vui lòng chọn sản phẩm khác");
        }

        // Kiểm tra mã khuyến mãi
        if (!updateDetailOrder.getCouponCode().isEmpty()) {
            Promotion promotion = promotionService.checkPromotion(updateDetailOrder.getCouponCode());
            if (promotion == null) {
                throw new NotFoundException("Mã khuyến mãi không tồn tại hoặc chưa được kích hoạt");
            }
            long promotionPrice = promotionService.calculatePromotionPrice(updateDetailOrder.getProductPrice(), promotion);
            if (promotionPrice != updateDetailOrder.getTotalPrice()) {
                throw new BadRequestException("Tổng giá trị đơn hàng đã thay đổi. Vui lòng kiểm tra và đặt lại đơn hàng");
            }
            Order.UsedPromotion usedPromotion = new Order.UsedPromotion(
                    updateDetailOrder.getCouponCode(),
                    promotion.getDiscountType(),
                    promotion.getDiscountValue(),
                    promotion.getMaximumDiscountValue()
            );
            order.setPromotion(usedPromotion);
        }

        // Cập nhật thông tin đơn hàng
        order.setModifiedAt(new Timestamp(System.currentTimeMillis()));
        order.setProduct(product);
        order.setSize(updateDetailOrder.getSize());
        order.setColor(updateDetailOrder.getColor());
        order.setPrice(updateDetailOrder.getProductPrice());
        order.setTotalPrice(updateDetailOrder.getTotalPrice());
        order.setStatus(ORDER_STATUS); 

        // Cập nhật phương thức thanh toán
        order.setPaymentMethod(updateDetailOrder.getPaymentMethod());

        // Cập nhật thông tin người dùng sửa đổi
        User user = new User();
        user.setId(userId);
        order.setModifiedBy(user);

        // Lưu đơn hàng vào cơ sở dữ liệu
        try {
            orderRepository.save(order);
        } catch (Exception e) {
            throw new InternalServerException("Lỗi khi cập nhật: " + e.getMessage());
        }
    }

    @Override
    public Order findOrderById(long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new NotFoundException("Đơn hàng không tồn tại");
        }
        return order.get();
    }

    @Override
    public void updateStatusOrder(UpdateStatusOrderRequest updateStatusOrderRequest, long orderId, long userId) {
        Optional<Order> rs = orderRepository.findById(orderId);
        if (rs.isEmpty()) {
            throw new NotFoundException("Đơn hàng không tồn tại");
        }
        Order order = rs.get();
        //Kiểm tra trạng thái của đơn hàng
        boolean check = false;
        for (Integer status : LIST_ORDER_STATUS) {
            if (status == updateStatusOrderRequest.getStatus()) {
                check = true;
                break;
            }
        }
        if (!check) {
            throw new BadRequestException("Trạng thái đơn hàng không hợp lệ");
        }
        //Cập nhật trạng thái đơn hàng
        if (order.getStatus() == ORDER_STATUS) {
            //Đơn hàng ở trạng thái chờ lấy hàng
            if (updateStatusOrderRequest.getStatus() == ORDER_STATUS) {
                order.setReceiverPhone(updateStatusOrderRequest.getReceiverPhone());
                order.setReceiverName(updateStatusOrderRequest.getReceiverName());
                order.setReceiverAddress(updateStatusOrderRequest.getReceiverAddress());
                //Đơn hàng ở trạng thái đang vận chuyển
            } else if (updateStatusOrderRequest.getStatus() == DELIVERY_STATUS) {
                //Trừ đi một sản phẩm
                productEntryRepository.minusOneProductByEntry(order.getProduct().getId(), order.getSize(),order.getColor());
                //Đơn hàng ở trạng thái đã giao hàng
            } else if (updateStatusOrderRequest.getStatus() == COMPLETED_STATUS) {
                //Trừ đi một sản phẩm và cộng một sản phẩm vào sản phẩm đã bán và cộng tiền
                productEntryRepository.minusOneProductByEntry(order.getProduct().getId(), order.getSize(),order.getColor());
                productRepository.plusOneProductTotalSold(order.getProduct().getId());
                statistic(order.getTotalPrice(), order.getQuantity(), order);
            } else if (updateStatusOrderRequest.getStatus() != CANCELED_STATUS) {
                throw new BadRequestException("Không thế chuyển sang trạng thái này");
            }
            //Đơn hàng ở trạng thái đang giao hàng
        } else if (order.getStatus() == DELIVERY_STATUS) {
            //Đơn hàng ở trạng thái đã giao hàng
            if (updateStatusOrderRequest.getStatus() == COMPLETED_STATUS) {
                //Cộng một sản phẩm vào sản phẩm đã bán và cộng tiền
                productRepository.plusOneProductTotalSold(order.getProduct().getId());
                statistic(order.getTotalPrice(), order.getQuantity(), order);
                //Đơn hàng ở trạng thái đã hủy
            } else if (updateStatusOrderRequest.getStatus() == RETURNED_STATUS) {
                //Cộng lại một sản phẩm đã bị trừ
                productEntryRepository.plusOneProductByEntry(order.getProduct().getId(), order.getSize(),order.getColor());
                //Đơn hàng ở trạng thái đã trả hàng
            } else if (updateStatusOrderRequest.getStatus() == CANCELED_STATUS) {
                //Cộng lại một sản phẩm đã bị trừ
                productEntryRepository.plusOneProductByEntry(order.getProduct().getId(), order.getSize(),order.getColor());
            } else if (updateStatusOrderRequest.getStatus() != DELIVERY_STATUS) {
                throw new BadRequestException("Không thế chuyển sang trạng thái này");
            }
            //Đơn hàng ở trạng thái đã giao hàng
        } else if (order.getStatus() == COMPLETED_STATUS) {
            //Đơn hàng đang ở trạng thái đã hủy
            if (updateStatusOrderRequest.getStatus() == RETURNED_STATUS) {
                //Cộng một sản phẩm đã bị trừ và trừ đi một sản phẩm đã bán và trừ số tiền
                productEntryRepository.plusOneProductByEntry(order.getProduct().getId(), order.getSize(),order.getColor());
                productRepository.minusOneProductTotalSold(order.getProduct().getId());
                updateStatistic(order.getTotalPrice(), order.getQuantity(), order);
            } else if (updateStatusOrderRequest.getStatus() != COMPLETED_STATUS) {
                throw new BadRequestException("Không thế chuyển sang trạng thái này");
            }
        } else {
            if (order.getStatus() != updateStatusOrderRequest.getStatus()) {
                throw new BadRequestException("Không thế chuyển đơn hàng sang trạng thái này");
            }
        }

        User user = new User();
        user.setId(userId);
        order.setModifiedBy(user);
        order.setModifiedAt(new Timestamp(System.currentTimeMillis()));
        order.setNote(updateStatusOrderRequest.getNote());
        order.setStatus(updateStatusOrderRequest.getStatus());
        try {
            orderRepository.save(order);
        } catch (Exception e) {
            throw new InternalServerException("Lỗi khi cập nhật trạng thái");
        }
    }
    @Override
    public List<OrderInfoDTO> getListOrderOfPersonByStatus(int status, long userId) {
        List<OrderInfoDTO> list = orderRepository.getListOrderOfPersonByStatus(status, userId);

        // Tạo bản đồ ánh xạ kích thước
        Map<String, Double> sizeUsMap = new HashMap<>();
        Map<String, Double> sizeCmMap = new HashMap<>();

        // Kiểm tra kích thước trước khi thêm vào bản đồ
        if (SIZE_VN.size() == SIZE_US.length && SIZE_VN.size() == SIZE_CM.length) {
            for (int i = 0; i < SIZE_VN.size(); i++) {
                // Sử dụng giá trị int của SIZE_VN và ánh xạ tới double
                sizeUsMap.put(String.valueOf(SIZE_VN.get(i)), SIZE_US[i]);  // SIZE_US[i] là double
                sizeCmMap.put(String.valueOf(SIZE_VN.get(i)), SIZE_CM[i]);  // SIZE_CM[i] là double
            }
        } else {
            throw new IllegalStateException("Kích thước VN, US và CM không tương thích về độ dài!");
        }

        // Cập nhật kích thước và màu sắc cho từng đơn hàng
        for (OrderInfoDTO dto : list) {
            int sizeVn = dto.getSizeVn();
            String sizeVnKey = String.valueOf(sizeVn);
            if (sizeUsMap.containsKey(sizeVnKey)) {
                dto.setSizeUs(sizeUsMap.get(sizeVnKey));
                dto.setSizeCm(sizeCmMap.get(sizeVnKey));
            } else {
                System.out.println("Kích thước VN không hợp lệ: " + sizeVn);
            }


            // Cập nhật màu sắc
            String colorVn = dto.getColorVn(); // Giả sử có phương thức getColorVn()
            if (colorVn != null && COlOR_VN.contains(colorVn)) {
                dto.setColorVn(colorVn);
            } else {
                System.out.println("Màu sắc không hợp lệ: " + colorVn);
            }
        }

        return list;
    }




    @Override
    public OrderDetailDTO userGetDetailById(long id, long userId) {
        OrderDetailDTO order = orderRepository.userGetDetailById(id, userId);
        if (order == null) {
            return null;
        }

        // Cập nhật trạng thái
        switch (order.getStatus()) {
            case ORDER_STATUS:
                order.setStatusText("Chờ lấy hàng");
                break;
            case DELIVERY_STATUS:
                order.setStatusText("Đang giao hàng");
                break;
            case COMPLETED_STATUS:
                order.setStatusText("Đã giao hàng");
                break;
            case CANCELED_STATUS:
                order.setStatusText("Đơn hàng đã trả lại");
                break;
            case RETURNED_STATUS:
                order.setStatusText("Đơn hàng đã hủy");
                break;
            default:
                order.setStatusText("Trạng thái không xác định");
                break;
        }

        // Cập nhật kích thước
        for (int i = 0; i < SIZE_VN.size(); i++) {
            if (SIZE_VN.get(i) == order.getSizeVn()) {
                order.setSizeUs(SIZE_US[i]);
                order.setSizeCm(SIZE_CM[i]);
            }
        }

        // Cập nhật màu sắc nếu cần thiết
        String colorVn = order.getColorVn();
        if (colorVn != null) {
            // Giả sử bạn có một danh sách màu sắc để kiểm tra
            if (COlOR_VN.contains(colorVn)) {
                order.setColorVn(colorVn); // Cập nhật màu sắc nếu hợp lệ
            } else {
                System.out.println("Màu sắc không hợp lệ: " + colorVn);
            }
        }

        return order;
    }


    @Override
    public void userCancelOrder(long id, long userId) {
        Optional<Order> rs = orderRepository.findById(id);
        if (rs.isEmpty()) {
            throw new NotFoundException("Đơn hàng không tồn tại");
        }
        Order order = rs.get();
        if (order.getBuyer().getId() != userId) {
            throw new BadRequestException("Bạn không phải chủ nhân đơn hàng");
        }
        if (order.getStatus() != ORDER_STATUS) {
            throw new BadRequestException("Trạng thái đơn hàng không phù hợp để hủy. Vui lòng liên hệ với shop để được hỗ trợ");
        }

        order.setStatus(CANCELED_STATUS);
        orderRepository.save(order);
    }

    @Override
    public long getCountOrder() {
        return orderRepository.count();
    }

    public void statistic(long amount, int quantity, Order order) {
        Statistic statistic = statisticRepository.findByCreatedAT();
        if (statistic != null){
            statistic.setOrder(order);
            statistic.setSales(statistic.getSales() + amount);
            statistic.setQuantity(statistic.getQuantity() + quantity);
            statistic.setProfit(statistic.getSales() - (statistic.getQuantity() * order.getProduct().getPrice()));
            statisticRepository.save(statistic);
        }else {
            Statistic statistic1 = new Statistic();
            statistic1.setOrder(order);
            statistic1.setSales(amount);
            statistic1.setQuantity(quantity);
            statistic1.setProfit(amount - (quantity * order.getProduct().getPrice()));
            statistic1.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            statisticRepository.save(statistic1);
        }
    }

    public void updateStatistic(long amount, int quantity, Order order) {
        Statistic statistic = statisticRepository.findByCreatedAT();
        if (statistic != null) {
            statistic.setOrder(order);
            statistic.setSales(statistic.getSales() - amount);
            statistic.setQuantity(statistic.getQuantity() - quantity);
            statistic.setProfit(statistic.getSales() - (statistic.getQuantity() * order.getProduct().getPrice()));
            statisticRepository.save(statistic);
        }
    }
}
