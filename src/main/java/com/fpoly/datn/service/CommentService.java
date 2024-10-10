package com.fpoly.datn.service;

import com.fpoly.datn.entity.Comment;
import com.fpoly.datn.model.request.CreateCommentPostRequest;
import com.fpoly.datn.model.request.CreateCommentProductRequest;
import org.springframework.stereotype.Service;

@Service
public interface CommentService {
    Comment createCommentPost(CreateCommentPostRequest createCommentPostRequest,long userId);
    Comment createCommentProduct(CreateCommentProductRequest createCommentProductRequest, long userId);
}
