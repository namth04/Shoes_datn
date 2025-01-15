package com.fpoly.serviceImp;

import com.fpoly.config.Environment;
import com.fpoly.dto.request.InvoiceRequest;
import com.fpoly.dto.request.InvoiceRequestCounter;
import com.fpoly.dto.request.ProductSizeRequest;
import com.fpoly.dto.request.PushNotificationRequest;
import com.fpoly.dto.response.InvoiceResponse;
import com.fpoly.entity.*;
import com.fpoly.enums.PayType;
import com.fpoly.exception.MessageException;
import com.fpoly.firebase.PushNotificationService;
import com.fpoly.mapper.InvoiceMapper;
import com.fpoly.models.QueryStatusTransactionResponse;
import com.fpoly.processor.QueryTransactionStatus;
import com.fpoly.repository.*;
import com.fpoly.servive.InvoiceService;
import com.fpoly.servive.VoucherService;
import com.fpoly.utils.CommonPage;
import com.fpoly.utils.Contains;
import com.fpoly.utils.StatusUtils;
import com.fpoly.utils.UserUtils;
import com.fpoly.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

@Component
public class InvoiceServiceImp implements InvoiceService {

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private HistoryPayRepository historyPayRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private UserAddressRepository userAddressRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private InvoiceStatusRepository invoiceStatusRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private CommonPage commonPage;

    @Autowired
    private PushNotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VNPayService vnPayService;

    @Override
    public InvoiceResponse create(InvoiceRequest invoiceRequest) {
        if(invoiceRequest.getPayType().equals(PayType.PAYMENT_MOMO)){
            if(invoiceRequest.getRequestIdMomo() == null || invoiceRequest.getOrderIdMomo() == null){
                throw new MessageException("orderid and requestid require");
            }
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceRequest.getOrderIdMomo(), invoiceRequest.getRequestIdMomo()).isPresent()){
                throw new MessageException("Đơn hàng đã được thanh toán");
            }
            Environment environment = Environment.selectEnv("dev");
            try {
                QueryStatusTransactionResponse queryStatusTransactionResponse = QueryTransactionStatus.process(environment, invoiceRequest.getOrderIdMomo(), invoiceRequest.getRequestIdMomo());
                System.out.println("qqqq-----------------------------------------------------------"+queryStatusTransactionResponse.getMessage());
                if(queryStatusTransactionResponse.getResultCode() != 0){
                    throw new MessageException("Đơn hàng chưa được thanh toán");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MessageException("Đơn hàng chưa được thanh toán");
            }
        }

        if(invoiceRequest.getPayType().equals(PayType.PAYMENT_VNPAY)){
            if(invoiceRequest.getVnpOrderInfo() == null){
                throw new MessageException("vnpay order infor require");
            }
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceRequest.getVnpOrderInfo(), invoiceRequest.getVnpOrderInfo()).isPresent()){
                throw new MessageException("Đơn hàng đã được thanh toán");
            }
            int paymentStatus = vnPayService.orderReturnByUrl(invoiceRequest.getUrlVnpay());
            if(paymentStatus != 1){
                throw new MessageException("Thanh toán thất bại");
            }
        }
        if(invoiceRequest.getPayType().equals(PayType.PAYMENT_GPAY)){
            if(historyPayRepository.findByOrderIdAndRequestId(invoiceRequest.getMerchantOrderId(), invoiceRequest.getMerchantOrderId()).isPresent()){
                throw new MessageException("Đơn hàng đã được thanh toán");
            }
            if(!invoiceRequest.getStatusGpay().equals("ORDER_SUCCESS")){
                throw new MessageException("Thanh toán thất bại");
            }
        }

        if(invoiceRequest.getUserAddressId() == null){
            throw new MessageException("user address id require");
        }
        Optional<UserAddress> userAddress = userAddressRepository.findById(invoiceRequest.getUserAddressId());
        if(userAddress.isEmpty()){
            throw new MessageException("user address not found");
        }
        if(userAddress.get().getUser().getId() != userUtils.getUserWithAuthority().getId()){
            throw new MessageException("access deneid");
        }
        if(invoiceRequest.getListProductSize() == null){
            throw new MessageException("product size require");
        }
        if(invoiceRequest.getListProductSize().size() < 1){
            throw new MessageException("lenght of product size must > 0");
        }
        Double totalAmount = 0D;
        for(ProductSizeRequest p : invoiceRequest.getListProductSize()){
            if(p.getIdProductSize() == null){
                throw new MessageException("id product size require");
            }
            Optional<ProductSize> productSize = productSizeRepository.findById(p.getIdProductSize());
            if(productSize.isEmpty()){
                throw new MessageException("product size: "+p.getIdProductSize()+" not found");
            }
            if(productSize.get().getQuantity() < p.getQuantity()){
                throw new MessageException("product size: "+p.getIdProductSize()+" not enough quantity");
            }
            totalAmount += productSize.get().getProductColor().getProduct().getPrice() * p.getQuantity();
        }


        Invoice invoice = new Invoice();
        invoice.setCreatedDate(new Date(System.currentTimeMillis()));
        invoice.setCreatedTime(new Time(System.currentTimeMillis()));
        invoice.setUserAddress(userAddress.get());
        invoice.setNote(invoiceRequest.getNote());
        invoice.setPhone(userAddress.get().getPhone());
        invoice.setAddress(userAddress.get().getStreetName()+", "+userAddress.get().getWards().getName()+", "+userAddress.get().getWards().getDistricts().getName()+". "+userAddress.get().getWards().getDistricts().getProvince().getName());
        invoice.setReceiverName(userAddress.get().getFullname());
        invoice.setPayType(invoiceRequest.getPayType());
        invoice.setStatus(statusRepository.findById(StatusUtils.DANG_CHO_XAC_NHAN).get());
        if(invoiceRequest.getVoucherCode() != null){
            if(!invoiceRequest.getVoucherCode().equals("null") && !invoiceRequest.getVoucherCode().equals("")){
                System.out.println("voucher use === "+invoiceRequest.getVoucherCode());
                Optional<Voucher> voucher = voucherService.findByCode(invoiceRequest.getVoucherCode(), totalAmount);
                if(voucher.isPresent()){
                    totalAmount = totalAmount - voucher.get().getDiscount();
                    invoice.setVoucher(voucher.get());
                }
            }
        }
        invoice.setTotalAmount(totalAmount);
        Invoice result = invoiceRepository.save(invoice);

        for(ProductSizeRequest p : invoiceRequest.getListProductSize()){
            ProductSize productSize = productSizeRepository.findById(p.getIdProductSize()).get();
            InvoiceDetail invoiceDetail = new InvoiceDetail();
            invoiceDetail.setInvoice(result);
            invoiceDetail.setPrice(productSize.getProductColor().getProduct().getPrice());
            invoiceDetail.setQuantity(p.getQuantity());
            invoiceDetail.setProductSize(productSize);
            invoiceDetailRepository.save(invoiceDetail);


            productSize.setQuantity(productSize.getQuantity() - p.getQuantity());
            productSizeRepository.save(productSize);

            productSize.getProductColor().getProduct().setQuantitySold(
                    productSize.getProductColor().getProduct().getQuantitySold() + p.getQuantity()
            );

            productRepository.save(productSize.getProductColor().getProduct());
        }

        if(invoiceRequest.getPayType().equals(PayType.PAYMENT_MOMO) || invoiceRequest.getPayType().equals(PayType.PAYMENT_VNPAY)){
            HistoryPay historyPay = new HistoryPay();
            historyPay.setInvoice(result);
            if (invoiceRequest.getPayType().equals(PayType.PAYMENT_MOMO)){
                historyPay.setRequestId(invoiceRequest.getRequestIdMomo());
                historyPay.setOrderId(invoiceRequest.getOrderIdMomo());
            }
            if (invoiceRequest.getPayType().equals(PayType.PAYMENT_VNPAY)){
                historyPay.setRequestId(invoiceRequest.getVnpOrderInfo());
                historyPay.setOrderId(invoiceRequest.getVnpOrderInfo());
            }
            if (invoiceRequest.getPayType().equals(PayType.PAYMENT_GPAY)){
                historyPay.setRequestId(invoiceRequest.getMerchantOrderId());
                historyPay.setOrderId(invoiceRequest.getMerchantOrderId());
            }
            historyPay.setCreatedTime(new Time(System.currentTimeMillis()));
            historyPay.setCreatedDate(new Date(System.currentTimeMillis()));
            historyPay.setTotalAmount(totalAmount);
            historyPayRepository.save(historyPay);
        }

        InvoiceStatus invoiceStatus = new InvoiceStatus();
        invoiceStatus.setInvoice(result);
        invoiceStatus.setCreatedDate(new Date(System.currentTimeMillis()));
        invoiceStatus.setCreatedTime(new Time(System.currentTimeMillis()));
        invoiceStatus.setStatus(statusRepository.findById(StatusUtils.DANG_CHO_XAC_NHAN).get());
        invoiceStatusRepository.save(invoiceStatus);

        PushNotificationRequest request = new PushNotificationRequest("Vừa có đơn đặt hàng mới: ","Đơn hàng mới"+result.getId(),"newinvoice",null);
        List<User> users = userRepository.getUserByRole(Contains.ROLE_ADMIN);
        for(User u : users){
            if(u.getTokenFcm() != null){
                if(!u.getTokenFcm().equals("")){
                    request.setToken(u.getTokenFcm());
                    notificationService.sendPushNotificationToToken(request);
                }
            }
        }
        return invoiceMapper.invoiceToInvoiceResponse(result);
    }

    @Override
    public InvoiceResponse updateStatus(Long invoiceId, Long statusId) {
        Optional<Status> status = statusRepository.findById(statusId);
        if (status.isEmpty()) {
            throw new MessageException("Status ID not found");
        }
        Long idSt = status.get().getId();

        if (idSt == StatusUtils.DANG_CHO_XAC_NHAN) {
            throw new MessageException("Không thể cập nhật trạng thái này");
        }
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if (invoice.isEmpty()) {
            throw new MessageException("Invoice ID not found");
        }

        Long currentStatusId = invoice.get().getStatus().getId();
        if (currentStatusId == StatusUtils.KHONG_NHAN_HANG ||
                currentStatusId == StatusUtils.DA_HUY ||
                currentStatusId == StatusUtils.DA_NHAN) {
            throw new MessageException("Không thể cập nhật trạng thái từ trạng thái hiện tại");
        }

        // Kiểm tra nếu trạng thái hiện tại là DA_GUI
        if (currentStatusId == StatusUtils.DA_GUI) {
            // Chỉ cho phép cập nhật sang KHONG_NHAN_HANG hoặc DA_NHAN
            if (statusId != StatusUtils.KHONG_NHAN_HANG && statusId != StatusUtils.DA_NHAN) {
                throw new MessageException("Đơn hàng đã được gửi đi,không thể cập nhật trạng thái này!");
            }
        }

        if (statusId == StatusUtils.DANG_CHO_XAC_NHAN) {
            throw new MessageException("Không thể cập nhật trạng thái này");
        }

        if (invoiceStatusRepository.findByInvoiceAndStatus(invoiceId, statusId).isPresent()) {
            throw new MessageException("Trạng thái đơn hàng này đã được cập nhật");
        }

        if (statusId == StatusUtils.KHONG_NHAN_HANG) {
            List<InvoiceDetail> listInvoiceDetails = invoiceDetailRepository.findByInvoiceId(invoiceId);
            for (InvoiceDetail detail : listInvoiceDetails) {
                ProductSize productSize = detail.getProductSize();

                productSize.setQuantity(productSize.getQuantity() + detail.getQuantity());
                productSizeRepository.save(productSize);

                productSize.getProductColor().getProduct().setQuantitySold(
                        productSize.getProductColor().getProduct().getQuantitySold() - detail.getQuantity()
                );
                productRepository.save(productSize.getProductColor().getProduct());
            }
        }

        InvoiceStatus invoiceStatus = new InvoiceStatus();
        invoiceStatus.setInvoice(invoice.get());
        invoiceStatus.setCreatedDate(new Date(System.currentTimeMillis()));
        invoiceStatus.setCreatedTime(new Time(System.currentTimeMillis()));
        invoiceStatus.setStatus(status.get());
        invoiceStatusRepository.save(invoiceStatus);

        invoice.get().setStatus(status.get());
        invoiceRepository.save(invoice.get());

        return invoiceMapper.invoiceToInvoiceResponse(invoice.get());
    }

    @Override
    public List<InvoiceResponse> findByUser() {
        User user = userUtils.getUserWithAuthority();
        List<Invoice> invoices = invoiceRepository.findByUser(user.getId());
        List<InvoiceResponse> list = invoiceMapper.invoiceListToInvoiceResponseList(invoices);
        return list;
    }

    @Override
    public Page<InvoiceResponse> findAll(Date from, Date to, Pageable pageable) {
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        Page<Invoice> page = invoiceRepository.findByDate(from, to,pageable);
        List<InvoiceResponse> list = invoiceMapper.invoiceListToInvoiceResponseList(page.getContent());
        Page<InvoiceResponse> result = commonPage.restPage(page,list);
        return result;
    }

    @Override
    public InvoiceResponse cancelInvoice(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if (invoice.isEmpty()) {
            throw new MessageException("Invoice ID not found");
        }

        if (invoice.get().getUserAddress().getUser().getId() != userUtils.getUserWithAuthority().getId()) {
            throw new MessageException("Access denied");
        }

        if (invoice.get().getPayType().equals(PayType.PAYMENT_GPAY)) {
            Long idSt = invoice.get().getStatus().getId();
            if (idSt != StatusUtils.DANG_CHO_XAC_NHAN) {
                throw new MessageException("Đơn hàng đã được thanh toán qua GPay, không thể hủy");
            }
        } else if (!invoice.get().getPayType().equals(PayType.PAYMENT_DELIVERY)) {
            throw new MessageException("Đơn hàng đã được thanh toán, không thể hủy");
        }

        Long idSt = invoice.get().getStatus().getId();
        if (idSt == StatusUtils.DA_GUI || idSt == StatusUtils.DA_NHAN ||
                idSt == StatusUtils.DA_HUY || idSt == StatusUtils.KHONG_NHAN_HANG) {
            throw new MessageException(invoice.get().getStatus().getName() + " không thể hủy hàng");
        }

        invoice.get().setStatus(statusRepository.findById(StatusUtils.DA_HUY).get());
        Invoice result = invoiceRepository.save(invoice.get());

        List<InvoiceDetail> list = invoiceDetailRepository.findByInvoiceId(invoiceId);
        for (InvoiceDetail i : list) {

            i.getProductSize().setQuantity(i.getQuantity() + i.getProductSize().getQuantity());
            productSizeRepository.save(i.getProductSize());


            i.getProductSize().getProductColor().getProduct().setQuantitySold(
                    i.getProductSize().getProductColor().getProduct().getQuantitySold() - i.getQuantity()
            );
            productRepository.save(i.getProductSize().getProductColor().getProduct());
        }

        InvoiceStatus invoiceStatus = new InvoiceStatus();
        invoiceStatus.setInvoice(invoice.get());
        invoiceStatus.setCreatedDate(new Date(System.currentTimeMillis()));
        invoiceStatus.setCreatedTime(new Time(System.currentTimeMillis()));
        invoiceStatus.setStatus(statusRepository.findById(StatusUtils.DA_HUY).get());
        invoiceStatusRepository.save(invoiceStatus);

        return invoiceMapper.invoiceToInvoiceResponse(result);
    }


    @Override
    public InvoiceResponse findById(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        if(invoice.get().getUserAddress().getUser().getId() != userUtils.getUserWithAuthority().getId()){
            throw new MessageException("access denied");
        }
        return invoiceMapper.invoiceToInvoiceResponse(invoice.get());
    }

    @Override
    public InvoiceResponse findByIdForAdmin(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if(invoice.isEmpty()){
            throw new MessageException("invoice id not found");
        }
        return invoiceMapper.invoiceToInvoiceResponse(invoice.get());
    }

    @Override
    public Page<InvoiceResponse> findAllFull(Date from, Date to, PayType payType, Long statusId, Pageable pageable) {
        if(from == null || to == null){
            from = Date.valueOf("2000-01-01");
            to = Date.valueOf("2200-01-01");
        }
        Page<Invoice> page = null;
        if(payType == null && statusId == null){
            page = invoiceRepository.findByDate(from, to,pageable);
        }
        if(payType == null && statusId != null){
            page = invoiceRepository.findByDateAndStatus(from, to, statusId,pageable);
        }
        if(payType != null && statusId == null){
            page = invoiceRepository.findByDateAndPaytype(from, to,payType,pageable);
        }
        if(payType != null && statusId != null){
            page = invoiceRepository.findByDateAndPaytypeAndStatus(from, to,payType,statusId,pageable);
        }

        List<InvoiceResponse> list = invoiceMapper.invoiceListToInvoiceResponseList(page.getContent());
        Page<InvoiceResponse> result = commonPage.restPage(page,list);
        return result;
    }

    @Transactional
    public void payCounter(InvoiceRequestCounter invoiceRequestCounter) {
        if (invoiceRequestCounter.getListProductSize() == null || invoiceRequestCounter.getListProductSize().isEmpty()) {
            throw new MessageException("Hãy chọn 1 sản phẩm");
        }


        Double totalAmount = 0D;
        for (ProductSizeRequest p : invoiceRequestCounter.getListProductSize()) {
            Optional<ProductSize> productSizeOpt = productSizeRepository.findById(p.getIdProductSize());
            if (productSizeOpt.isEmpty()) {
                throw new MessageException("Không tìm thấy sản phẩm với ID: " + p.getIdProductSize());
            }

            ProductSize productSize = productSizeOpt.get();
            if (productSize.getQuantity() < p.getQuantity()) {
                throw new MessageException("Sản phẩm " + productSize.getSizeName() +
                        " màu " + productSize.getProductColor().getColorName() +
                        " " + productSize.getProductColor().getProduct().getName() +
                        " không đủ số lượng (Còn: " + productSize.getQuantity() + ")");
            }
            totalAmount += productSize.getProductColor().getProduct().getPrice() * p.getQuantity();
        }

        Invoice invoice = new Invoice();
        invoice.setCreatedDate(new Date(System.currentTimeMillis()));
        invoice.setCreatedTime(new Time(System.currentTimeMillis()));
        invoice.setPhone(invoiceRequestCounter.getPhone().trim());
        invoice.setReceiverName(invoiceRequestCounter.getFullName().trim());
        invoice.setPayType(PayType.PAY_COUNTER);
        invoice.setStatus(statusRepository.findById(StatusUtils.DA_NHAN).get());
        invoice.setTotalAmount(totalAmount);
        Invoice savedInvoice = invoiceRepository.save(invoice);


        for (ProductSizeRequest p : invoiceRequestCounter.getListProductSize()) {
            ProductSize productSize = productSizeRepository.findById(p.getIdProductSize()).get();

            synchronized (ProductSize.class) {

                if (productSize.getQuantity() < p.getQuantity()) {
                    throw new MessageException("Sản phẩm " + productSize.getSizeName() +
                            " màu " + productSize.getProductColor().getColorName() +
                            " " + productSize.getProductColor().getProduct().getName() +
                            " đã hết hàng trong quá trình xử lý");
                }


                InvoiceDetail invoiceDetail = new InvoiceDetail();
                invoiceDetail.setInvoice(savedInvoice);
                invoiceDetail.setPrice(productSize.getProductColor().getProduct().getPrice());
                invoiceDetail.setQuantity(p.getQuantity());
                invoiceDetail.setProductSize(productSize);
                invoiceDetailRepository.save(invoiceDetail);


                productSize.setQuantity(productSize.getQuantity() - p.getQuantity());
                productSizeRepository.save(productSize);

                Product product = productSize.getProductColor().getProduct();
                product.setQuantitySold(product.getQuantitySold() + p.getQuantity());
                productRepository.save(product);
            }
        }


        InvoiceStatus invoiceStatus = new InvoiceStatus();
        invoiceStatus.setInvoice(savedInvoice);
        invoiceStatus.setCreatedDate(new Date(System.currentTimeMillis()));
        invoiceStatus.setCreatedTime(new Time(System.currentTimeMillis()));
        invoiceStatus.setStatus(statusRepository.findById(StatusUtils.DA_NHAN).get());
        invoiceStatusRepository.save(invoiceStatus);
    }
}
