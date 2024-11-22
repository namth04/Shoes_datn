package com.fpoly.service;

import com.fpoly.datn.entity.Comment;
import com.fpoly.model.request.CreateCommentPostRequest;
import com.fpoly.model.request.CreateCommentProductRequest;
import org.springframework.stereotype.Service;

@Service
public interface CommentService {
    Comment createCommentPost(CreateCommentPostRequest createCommentPostRequest,long userId);
    Comment createCommentProduct(CreateCommentProductRequest createCommentProductRequest, long userId);
}
