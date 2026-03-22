package com.example.DucQLNV.config;

import com.example.DucQLNV.entity.User;
import com.example.DucQLNV.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (!repo.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(encoder
                            .encode("123"))
                            .role("ADMIN")
                            .build();
            repo.save(admin);
        }
    }
}