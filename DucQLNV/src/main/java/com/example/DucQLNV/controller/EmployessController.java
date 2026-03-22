package com.example.DucQLNV.controller;

import com.example.DucQLNV.dto.request.EmployeesRequest;
import com.example.DucQLNV.dto.respone.ApiResponse;
import com.example.DucQLNV.dto.respone.EmployeesResponse;
import com.example.DucQLNV.service.EmployeesService;
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
public class EmployessController {
    EmployeesService service;

    @PostMapping("/employee")
    ApiResponse<EmployeesResponse> employeeCreat(@RequestBody EmployeesRequest request) {
        return ApiResponse.<EmployeesResponse>builder()
                .result(service.creatEmployees(request))
                .build();
    }

    @GetMapping("/employee")
    public ApiResponse<List<EmployeesResponse>> getLisEmployee(
            @RequestParam(defaultValue = "0") int from,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<EmployeesResponse>>builder()
                .result(service.getAllEmployees(from, size))
                .build();
    }

    @DeleteMapping("/employee/{id}")
    public ApiResponse<Void> deleteEmployee(@PathVariable String id) {
        service.deleteEmployees(id);
        return ApiResponse.<Void>builder().code(HttpStatus.OK.value()).build();
    }

    @GetMapping("/employee/{id}")
    public ApiResponse<EmployeesResponse> getEmployee(@PathVariable String id) {
        return ApiResponse.<EmployeesResponse>builder()
                .result(service.getEmployees(id))
                .build();
    }

    @PatchMapping("/employee/{id}")
    public ApiResponse<EmployeesResponse> UpdateeEployee(@PathVariable String id, @RequestBody EmployeesRequest request) {
        return ApiResponse.<EmployeesResponse>builder()
                .result(service.updateEmployees(id, request))
                .build();
    }
}
