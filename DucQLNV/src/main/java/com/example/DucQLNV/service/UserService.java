package com.example.DucQLNV.service;

import com.example.DucQLNV.dto.mapper.UserMapper;
import com.example.DucQLNV.dto.request.UserRequest;
import com.example.DucQLNV.dto.respone.EmployeesResponse;
import com.example.DucQLNV.dto.respone.UserRespone;
import com.example.DucQLNV.entity.Employees;
import com.example.DucQLNV.entity.User;
import com.example.DucQLNV.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    final PasswordEncoder encoder;

    public List<UserRespone> getAllUser(int from, int size){
        int page = from / size;
        Pageable pageable = PageRequest.of(
                page, size, Sort.by(Sort.Direction.ASC, "createdDate"));
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.getContent()
                .stream()
                .map(userMapper::toUserMapper)
                .toList();
    }

    public UserRespone updateUser(String userId, UserRequest request){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getUsername() != null ) {
            user.setUsername(request.getUsername());
        }
        if (request.getPassword() != null ){
            user.setPassword(encoder.encode(request.getPassword()));
        }
        if (request.getRole() != null ) {
            user.setRole(request.getRole());
        }
        user.setLastUpDateTime(Instant.now());
        userRepository.save(user);
        return userMapper.toUserMapper(user);
    }

    public boolean deleteUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(user.getId());
        return true;
    }
}
