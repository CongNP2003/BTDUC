package com.example.DucQLNV.service;

import com.example.DucQLNV.dto.mapper.UserMapper;
import com.example.DucQLNV.dto.request.UserRequest;
import com.example.DucQLNV.dto.respone.ApiResponse;
import com.example.DucQLNV.entity.User;
import com.example.DucQLNV.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthService {

    final UserRepository repo;
    final AuthenticationService jwtService;
    final PasswordEncoder encoder;
    final UserMapper userMapper;

    public String login(UserRequest request) {
        User user = repo.findByUsername(request.getUsername()).orElseThrow();
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
           return ("mật khẩu sai");
        }
        return jwtService.generateToken(user.getUsername());
    }
    public UserRequest register(UserRequest req) {
        if (repo.existsByUsername(req.getUsername())) {
            throw new RuntimeException("User exists");
        }
        User user = User.builder().username(req.getUsername())
                        .password(encoder.encode(req.getPassword()))
                        .role("USER")
                        .build();
        repo.save(user);
        return userMapper.toUserResponse(user);
    }
}