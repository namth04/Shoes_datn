package com.fpoly.datn.controller.admin;


import com.fpoly.datn.entity.Material;
import com.fpoly.datn.entity.User;


import com.fpoly.datn.model.mapper.MaterialMapper;
import com.fpoly.datn.model.request.CreateMaterialRequest;
import com.fpoly.datn.security.CustomUserDetails;

import com.fpoly.datn.service.ImageService;
import com.fpoly.datn.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import java.util.List;

@Controller
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @Autowired
    private ImageService imageService;

    @GetMapping("/admin/materials")
    public String homePage(Model model,
                           @RequestParam(defaultValue = "", required = false) String id,
                           @RequestParam(defaultValue = "", required = false) String name,
                           @RequestParam(defaultValue = "", required = false) String status,
                           @RequestParam(defaultValue = "1", required = false) Integer page) {

        //Lấy tất cả các anh của user upload
        User user = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
        List<String> images = imageService.getListImageOfUser(user.getId());
        model.addAttribute("images", images);

        Page<Material> materials = materialService.adminGetListMaterials(id, name, status, page);
        model.addAttribute("materials", materials.getContent());
        model.addAttribute("totalPages", materials.getTotalPages());
        model.addAttribute("currentPage", materials.getPageable().getPageNumber() + 1);
        return "admin/material/list";
    }

    @PostMapping("/api/admin/materials")
    public ResponseEntity<Object> createMaterial(@Valid @RequestBody CreateMaterialRequest createMaterialRequest) {
        Material material = materialService.createMaterial(createMaterialRequest);
        return ResponseEntity.ok(MaterialMapper.toMaterialDTO(material));
    }

    @PutMapping("/api/admin/materials/{id}")
    public ResponseEntity<Object> updateMaterial(@Valid @RequestBody CreateMaterialRequest createMaterialRequest, @PathVariable long id) {
        materialService.updateMaterial(createMaterialRequest, id);
        return ResponseEntity.ok("Sửa chất liệu thành công!");
    }

    @DeleteMapping("/api/admin/materials/{id}")
    public ResponseEntity<Object> deleteMaterial(@PathVariable long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok("Xóa chất liệu thành công!");
    }
    @GetMapping("/api/admin/materials/{id}")
    public ResponseEntity<Object> getMaterialById(@PathVariable long id){
        Material material = materialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }
}