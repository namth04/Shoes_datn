package com.fpoly.controller.admin;


import com.fpoly.entity.Sole;
import com.fpoly.entity.User;
import com.fpoly.model.mapper.SoleMapper;
import com.fpoly.model.request.CreateSoleRequest;
import com.fpoly.security.CustomUserDetails;
import com.fpoly.service.ImageService;
import com.fpoly.service.SoleService;
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
public class SoleController {

    @Autowired
    private SoleService soleService;

    @Autowired
    private ImageService imageService;

    @GetMapping("/admin/soles")
    public String homePage(Model model,
                           @RequestParam(defaultValue = "", required = false) String id,
                           @RequestParam(defaultValue = "", required = false) String name,
                           @RequestParam(defaultValue = "", required = false) String status,
                           @RequestParam(defaultValue = "1", required = false) Integer page) {

        //Lấy tất cả các anh của user upload
        User user = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
        List<String> images = imageService.getListImageOfUser(user.getId());
        model.addAttribute("images", images);

        Page<Sole> soles = soleService.adminGetListSoles(id, name, status, page);
        System.out.println("Soles Content: " + soles.getContent());
        model.addAttribute("soles", soles.getContent());
        model.addAttribute("totalPages", soles.getTotalPages());
        model.addAttribute("currentPage", soles.getPageable().getPageNumber() + 1);
        return "admin/sole/list";
    }

    @PostMapping("/api/admin/soles")
    public ResponseEntity<Object> createSole(@Valid @RequestBody CreateSoleRequest createSoleRequest) {
        Sole sole = soleService.createSole(createSoleRequest);
        return ResponseEntity.ok(SoleMapper.toSoleDTO(sole));
    }

    @PutMapping("/api/admin/soles/{id}")
    public ResponseEntity<Object> updateSole(@Valid @RequestBody CreateSoleRequest createSoleRequest, @PathVariable long id) {
        soleService.updateSole(createSoleRequest, id);
        return ResponseEntity.ok("Sửa đế giày thành công!");
    }

    @DeleteMapping("/api/admin/soles/{id}")
    public ResponseEntity<Object> deleteSole(@PathVariable long id) {
        soleService.deleteSole(id);
        return ResponseEntity.ok("Xóa đế giày thành công!");
    }
    @GetMapping("/api/admin/soles/{id}")
    public ResponseEntity<Object> getSoleById(@PathVariable long id){
        Sole sole = soleService.getSoleById(id);
        return ResponseEntity.ok(sole);
    }
}
