package com.fpoly.mapper;

import com.fpoly.dto.request.CommentRequest;
import com.fpoly.dto.response.ProductCommentResponse;
import com.fpoly.entity.ProductComment;
import com.fpoly.entity.User;
import com.fpoly.utils.UserUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductCommentMapper {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserUtils userUtils;

    public ProductComment productCmtRequestToProductComment(CommentRequest request){
        ProductComment productComment = mapper.map(request, ProductComment.class);
        return productComment;
    }

    public ProductCommentResponse productCmtToProductCommentRes(ProductComment productComment){
        ProductCommentResponse productCommentResponse = mapper.map(productComment, ProductCommentResponse.class);
        productCommentResponse.setUser(userMapper.userToUserDto(productComment.getUser()));
        productCommentResponse.setIsMyComment(false);
        return productCommentResponse;
    }

    public List<ProductCommentResponse> listProductCmtToProCommentResponse(List<ProductComment> list){
        List<ProductCommentResponse> responses = new ArrayList<>();
        User user = userUtils.getUserWithAuthority();
        for(ProductComment p : list){
            ProductCommentResponse pro = productCmtToProductCommentRes(p);
            if(user != null){
                if(user.getId() == pro.getUser().getId()){
                    pro.setIsMyComment(true);
                }
            }
            responses.add(pro);
        }
        return responses;
    }
}
