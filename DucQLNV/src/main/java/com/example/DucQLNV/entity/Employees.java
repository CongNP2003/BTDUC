package com.example.DucQLNV.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "Employees")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Employees {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String username;
    private String gender;
    private LocalDate date;
    private long phone;
    private Instant createdDate;
    private Instant lastUpDateTime;
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Departments department;
}
