package com.example.DucQLNV.dto.mapper;

import com.example.DucQLNV.dto.request.DepartmentsRequest;
import com.example.DucQLNV.dto.respone.DepartmentsResponse;
import com.example.DucQLNV.entity.Departments;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface DepartmentsMapper {
    Departments toDepartments (DepartmentsRequest request);

    DepartmentsResponse toDepartmentRespone(Departments departments);

    void updateIssue(DepartmentsRequest request, @MappingTarget Departments departments);

}
