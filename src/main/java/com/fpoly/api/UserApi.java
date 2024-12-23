package com.fpoly.api;

import com.fpoly.repository.InvoiceRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.fpoly.dto.request.LoginDto;
import com.fpoly.dto.request.PasswordDto;
import com.fpoly.dto.request.TokenDto;
import com.fpoly.dto.request.UserRequest;
import com.fpoly.dto.response.UserDto;
import com.fpoly.entity.User;
import com.fpoly.exception.MessageException;
import com.fpoly.jwt.JwtTokenProvider;
import com.fpoly.mapper.UserMapper;
import com.fpoly.repository.UserRepository;
import com.fpoly.servive.GoogleOAuth2Service;
import com.fpoly.servive.UserService;
import com.fpoly.utils.MailService;
import com.fpoly.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserApi {

    private final UserRepository userRepository;
    @Autowired
    private  InvoiceRepository invoiceRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserUtils userUtils;

    private final MailService mailService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserApi(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, UserUtils userUtils, MailService mailService) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userUtils = userUtils;
        this.mailService = mailService;
    }

    @Autowired
    private GoogleOAuth2Service googleOAuth2Service;

    @PostMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody String credential) throws Exception {
        GoogleIdToken.Payload payload = googleOAuth2Service.verifyToken(credential);
        if(payload == null){
            throw new MessageException("Đăng nhập thất bại");
        }
        TokenDto tokenDto = userService.loginWithGoogle(payload);
        return new ResponseEntity(tokenDto, HttpStatus.OK);
    }


    @PostMapping("/login")
    public TokenDto authenticate(@RequestBody LoginDto loginDto) throws Exception {
        TokenDto tokenDto = userService.login(loginDto.getUsername(), loginDto.getPassword(), loginDto.getTokenFcm());
        return tokenDto;
    }

    @PostMapping("/regis")
    public ResponseEntity<?> regisUser(@RequestBody UserRequest userRequest) throws URISyntaxException {
        User user = userMapper.userRequestToUser(userRequest);
        UserDto result= userMapper.userToUserDto(userService.regisUser(user));
        return ResponseEntity
                .created(new URI("/api/register-user/" + user.getUsername()))
                .body(result);
    }

    @PostMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam String email, @RequestParam String key) throws URISyntaxException {
        userService.activeAccount(key, email);
        return new ResponseEntity<>("kích hoạt thành công", HttpStatus.OK);
    }

    @PostMapping("/user/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDto passwordDto){
        userService.changePass(passwordDto.getOldPass(), passwordDto.getNewPass());
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> changePassword(@RequestParam String email){
        userService.forgotPassword(email);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @GetMapping("/admin/get-user-by-role")
    public ResponseEntity<?> getUserByRole(@RequestParam(value = "role", required = false) String role,
                                           @RequestParam(value = "q", required = false) String search,
                                           Pageable pageable){
        Page<UserDto> userDtos = userService.getUserByRole("%"+search+"%",role,pageable);
        return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @GetMapping("/admin/check-role-admin")
    public void checkRoleAdmin(){
        System.out.println("admin");
    }

    @GetMapping("/user/check-role-user")
    public void checkRoleUser(){
        System.out.println("user");
    }

    @PostMapping("/admin/lockOrUnlockUser")
    public ResponseEntity<String> activeOrUnactiveUser(@RequestParam("id") Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra nếu người dùng đã mua hàng
        boolean hasInvoices = invoiceRepository.existsByUserAddress_User_Id(id);
        if (hasInvoices && user.getActived()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Người dùng đã mua hàng, không thể khóa tài khoản.");
        }

        // Toggle trạng thái actived
        user.setActived(!user.getActived());
        userRepository.save(user);

        String message = user.getActived() ? "Mở khóa thành công" : "Khóa tài khoản thành công";
        return ResponseEntity.ok(message);
    }

    @PostMapping("/admin/addaccount")
    public ResponseEntity<?> addaccount(@RequestBody UserRequest userRequest) throws URISyntaxException {
        User user = userMapper.userRequestToUser(userRequest);
        UserDto result= userMapper.userToUserDto(userService.addAccount(user));
        return ResponseEntity
                .created(new URI("/api/register-user/" + user.getUsername()))
                .body(result);
    }
}
