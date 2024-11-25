package com.fpoly.api;

import com.fpoly.entity.Province;
import com.fpoly.entity.Wards;
import com.fpoly.repository.DistrictsRepository;
import com.fpoly.repository.ProvinceRepository;
import com.fpoly.repository.WardsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
public class AddressApi {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private DistrictsRepository districtsRepository;

    @Autowired
    private WardsRepository wardsRepository;

    @GetMapping("/public/province")
    public List<Province> findAllProvince(){
        return provinceRepository.findAll();
    }

    @GetMapping("/public/wards-by-id")
    public Wards getWardsById(@RequestParam("id") Long id){
        return wardsRepository.findById(id).get();
    }
}
