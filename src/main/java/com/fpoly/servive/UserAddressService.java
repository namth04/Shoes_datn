package com.fpoly.service;

import com.fpoly.dto.request.UserAdressRequest;
import com.fpoly.dto.response.UserAdressResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserAddressService {

    public List<UserAdressResponse> findByUser();

    public UserAdressResponse findById(Long id);

    public UserAdressResponse create(UserAdressRequest userAdressRequest);

    public UserAdressResponse update(UserAdressRequest userAdressRequest);

    public void delete(Long id);

}
