package com.example.DucQLNV.dto.respone;

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
public class EmployeesResponse {
    String id;
    String username;
    String gender;
    LocalDate date;
    long phone;
    Departments department;
}
