package com.example.DucQLNV.service;

import com.example.DucQLNV.dto.mapper.EmployessMapper;
import com.example.DucQLNV.dto.request.EmployeesRequest;
import com.example.DucQLNV.dto.respone.EmployeesResponse;
import com.example.DucQLNV.entity.Departments;
import com.example.DucQLNV.entity.Employees;
import com.example.DucQLNV.repository.DepartmentsRepository;
import com.example.DucQLNV.repository.EmployeesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmployeesService {
    EmployessMapper employessMapper;
    EmployeesRepository employeesRepository;
    DepartmentsRepository departmentsRepository;

    public EmployeesResponse creatEmployees(EmployeesRequest request){
        String idDepartment = request.getDepartment().getId();
        Departments department = departmentsRepository.findById(idDepartment).orElseThrow();
        Employees employees = Employees.builder()
                .createdDate(Instant.now())
                .lastUpDateTime(Instant.now())
                .username(request.getUsername())
                .date(request.getDate())
                .department(department)
                .gender(request.getGender())
                .phone(request.getPhone())
                .build();
        employeesRepository.save(employees);
        return employessMapper.toEmployesRespone(employees);
    }

    public EmployeesResponse updateEmployees(String id, EmployeesRequest request) {

        Employees employees = employeesRepository.findById(id).orElseThrow(() -> new RuntimeException("id không tồn tại"));
        Departments department = employees.getDepartment();
        if (request.getDepartment() != null) {
            department = departmentsRepository
                    .findById(request.getDepartment().getId())
                    .orElseThrow();
        }
        employees.setUsername(request.getUsername());
        employees.setGender(request.getGender());
        employees.setPhone(request.getPhone());
        employees.setDate(request.getDate());
        employees.setDepartment(department);
        employees.setLastUpDateTime(Instant.now());

        employeesRepository.save(employees);

        return employessMapper.toEmployesRespone(employees);
    }
    public List<EmployeesResponse> getAllEmployees(int from, int size){
        int page = from / size;
        Pageable pageable = PageRequest.of(page, size);
        Page<Employees> employeesPage = employeesRepository.findAll(pageable);
        return employeesPage.getContent().stream().map(employessMapper::toEmployesRespone).toList();
    }

    public EmployeesResponse getEmployees (String id) {
        Employees employees = employeesRepository.findById(id).orElseThrow(() -> new RuntimeException("Id không tồn tại"));
        return employessMapper.toEmployesRespone(employees);
    }

    public boolean deleteEmployees (String id) {
        Employees employees = employeesRepository.findById(id).orElseThrow(() -> new RuntimeException("Id không tồn tại"));
        employeesRepository.delete(employees);
        return true;
    }
}
