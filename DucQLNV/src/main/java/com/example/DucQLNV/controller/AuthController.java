package com.example.DucQLNV.controller;

import com.example.DucQLNV.dto.request.UserRequest;
import com.example.DucQLNV.dto.respone.ApiResponse;
import com.example.DucQLNV.service.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public ApiResponse login(@RequestBody UserRequest request) {
        var result =  service.login(request);
        return ApiResponse.builder()
                .result(result)
                .build();

    }

    @PostMapping("/register")
    public ApiResponse<UserRequest> register(@RequestBody UserRequest request) {
        return ApiResponse.<UserRequest>builder().result( service.register(request)).build();
    }
}