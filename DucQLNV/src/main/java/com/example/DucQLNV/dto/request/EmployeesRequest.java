package com.example.DucQLNV.dto.request;

import com.example.DucQLNV.entity.Departments;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeesRequest {
    private String username;
    private String gender;
    private LocalDate date;
    private long phone;
    private Departments department;
}
