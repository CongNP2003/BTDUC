package com.example.DucQLNV.service;

import com.example.DucQLNV.dto.mapper.DepartmentsMapper;
import com.example.DucQLNV.dto.request.DepartmentsRequest;
import com.example.DucQLNV.dto.respone.DepartmentsResponse;
import com.example.DucQLNV.entity.Departments;
import com.example.DucQLNV.entity.User;
import com.example.DucQLNV.repository.DepartmentsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DepartmentsService {
    DepartmentsMapper mapper;
    DepartmentsRepository  departmentsRepository;

    public DepartmentsResponse creatDepartment(DepartmentsRequest request){
        Departments departments = Departments.builder()
                .name(request.getName())
                .createdDate(Instant.now())
                .lastUpDateTime(Instant.now())
                .build();
        departmentsRepository.save(departments);
        return mapper.toDepartmentRespone(departments);
    }

    public DepartmentsResponse updateDepartment (String id, DepartmentsRequest request){
        Departments departments = departmentsRepository.findById(id).orElseThrow(() -> new RuntimeException("Id không tồn tại"));
        mapper.updateIssue(request, departments);
        departments.builder()
                .name(request.getName())
                .lastUpDateTime(Instant.now())
                .build();
        departmentsRepository.save(departments);
        return mapper.toDepartmentRespone(departments);
    }

    public List<DepartmentsResponse> getAllDepartments (int from, int size){
        int page = from / size;
        Pageable pageable = PageRequest.of(
                page, size, Sort.by(Sort.Direction.ASC, "createdDate"));
        Page<Departments> departments = departmentsRepository.findAll(pageable);
        return departments.getContent()
                .stream()
                .map(mapper::toDepartmentRespone)
                .toList();
    }

    public boolean deleteDepartments (String id){
        Departments departments = departmentsRepository.findById(id).orElseThrow(() -> new RuntimeException("Id không tồn tại"));
        departmentsRepository.delete(departments);
        return true;
    }
}
