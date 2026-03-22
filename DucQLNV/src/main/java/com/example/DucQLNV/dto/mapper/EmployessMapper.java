package com.example.DucQLNV.dto.mapper;

import com.example.DucQLNV.dto.request.EmployeesRequest;
import com.example.DucQLNV.dto.respone.EmployeesResponse;
import com.example.DucQLNV.entity.Employees;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface EmployessMapper {
    Employees toEmployes (EmployeesRequest request);

    EmployeesResponse toEmployesRespone(Employees employees);

    void updateIssue(EmployeesRequest request, @MappingTarget Employees employees);

}
