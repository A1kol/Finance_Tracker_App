package com.myapp.finance_tracker_backend.controller;

import com.myapp.finance_tracker_backend.dto.LoginResponseDTO;
import com.myapp.finance_tracker_backend.model.User;
import com.myapp.finance_tracker_backend.service.classes.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.myapp.finance_tracker_backend.service.classes.UserServiceImpl;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserServiceImpl service;
    private final JWTService jwtService;

    @Autowired
    public UserController(UserServiceImpl service, JWTService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        System.out.println("Регистрация: " + user.getName() + ", пароль: " + user.getPassword());
        User registeredUser = service.registerUser(user);
        if(registeredUser != null) {
            return ResponseEntity.ok(registeredUser);
        } else return ResponseEntity.badRequest().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody User user) {
        System.out.println("➡️ Попытка логина: " + user.getName());
        User loginedUser = service.loginUser(user.getName(), user.getPassword());

        if(loginedUser != null) {
            String token = jwtService.generateToken(user.getName());
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            return ResponseEntity.ok(response);
        } else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
