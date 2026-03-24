package com.example.DucQLNV.controller;

import com.example.DucQLNV.dto.request.EmployeesRequest;
import com.example.DucQLNV.dto.request.UserRequest;
import com.example.DucQLNV.dto.respone.ApiResponse;
import com.example.DucQLNV.dto.respone.EmployeesResponse;
import com.example.DucQLNV.dto.respone.UserRespone;
import com.example.DucQLNV.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService service;

    @GetMapping("/user")
    public ApiResponse<List<UserRespone>> getLisUser(
            @RequestParam(defaultValue = "0") int from,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<UserRespone>>builder()
                .result(service.getAllUser(from, size))
                .build();
    }

    @DeleteMapping("/user/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        service.deleteUser(id);
        return ApiResponse.<Void>builder().code(HttpStatus.OK.value()).build();
    }

    @PatchMapping("/user/{id}")
    public ApiResponse<UserRespone> UpdateeUser(@PathVariable String id, @RequestBody UserRequest request) {
        return ApiResponse.<UserRespone>builder()
                .result(service.updateUser(id, request))
                .build();
    }
}
