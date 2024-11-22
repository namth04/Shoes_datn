package com.fpoly.service;


import com.fpoly.entity.User;
import com.fpoly.model.dto.UserDTO;
import com.fpoly.model.request.ChangePasswordRequest;
import com.fpoly.model.request.CreateUserRequest;
import com.fpoly.model.request.UpdateProfileRequest;
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
