package com.fpoly.datn.service;


import com.fpoly.datn.entity.User;
import com.fpoly.datn.model.dto.UserDTO;
import com.fpoly.datn.model.request.ChangePasswordRequest;
import com.fpoly.datn.model.request.CreateUserRequest;
import com.fpoly.datn.model.request.UpdateProfileRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<UserDTO> getListUsers();

    Page<User> adminListUserPages(String fullName, String phone, String email, Integer page);

    User createUser(CreateUserRequest createUserRequest);

    void changePassword(User user, ChangePasswordRequest changePasswordRequest);

    User updateProfile(User user, UpdateProfileRequest updateProfileRequest);
}
