package com.fpoly.datn.controller.admin;

import com.fpoly.datn.entity.Material;
import com.fpoly.datn.model.mapper.MaterialMapper;
import com.fpoly.datn.model.request.CreateMaterialRequest;
import com.fpoly.datn.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
public class MaterialController {
@Autowired
    private MaterialService materialService;

    @GetMapping("admin/materials")
    public String homePage(Model model,  @RequestParam(defaultValue = "", required = false) String id,
                           @RequestParam(defaultValue = "", required = false) String name,
                           @RequestParam(defaultValue = "", required = false) String status,
                           @RequestParam(defaultValue = "1", required = false) Integer page){
        Page<Material> materials = materialService.adminGetListMaterial(id,name,status, page);
        model.addAttribute("materials", materials.getContent());
        model.addAttribute("totalPages", materials.getTotalPages());
        model.addAttribute("currentPage", materials.getPageable().getPageNumber() + 1);
        return "admin/material/list";
    }

    @PostMapping("api/admin/materials")
    public ResponseEntity<Object> createMaterial(@Valid @RequestBody CreateMaterialRequest createMaterialRequest, @PathVariable long id){
        Material material = materialService.createMaterial(createMaterialRequest);
        return ResponseEntity.ok(MaterialMapper.toMaterialDTO(material));
    }

}
