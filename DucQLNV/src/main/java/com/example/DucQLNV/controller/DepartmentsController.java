package com.example.DucQLNV.controller;

import com.example.DucQLNV.dto.request.DepartmentsRequest;
import com.example.DucQLNV.dto.respone.ApiResponse;
import com.example.DucQLNV.dto.respone.DepartmentsResponse;
import com.example.DucQLNV.service.DepartmentsService;
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
public class DepartmentsController {
    DepartmentsService service;

    @PostMapping("/department")
    ApiResponse<DepartmentsResponse>creatDepartment(@RequestBody DepartmentsRequest request) {
        return ApiResponse.<DepartmentsResponse>builder()
                .result(service.creatDepartment(request))
                .build();
    }

    @DeleteMapping("/department/{id}")
    public ApiResponse<Void> deleteDepartment(@PathVariable String id) {
        service.deleteDepartments(id);
        return ApiResponse.<Void>builder().code(HttpStatus.OK.value())
                .build();
    }

    @GetMapping("/department")
    public ApiResponse<List<DepartmentsResponse>> getLisEmployee() {
        return ApiResponse.<List<DepartmentsResponse>>builder()
                .result(service.getAllDepartments())
                .build();
    }

    @PatchMapping("/department/{id}")
    public ApiResponse<DepartmentsResponse> UpdateDepartment(@PathVariable String id, @RequestBody DepartmentsRequest request) {
        return ApiResponse.<DepartmentsResponse>builder()
                .result(service.updateDepartment(id, request))
                .build();
    }
}
