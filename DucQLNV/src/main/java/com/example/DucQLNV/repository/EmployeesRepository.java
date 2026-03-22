package com.example.DucQLNV.repository;

import com.example.DucQLNV.entity.Employees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeesRepository extends JpaRepository<Employees, String> {
}
