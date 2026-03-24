package com.example.DucQLNV.dto.mapper;


import com.example.DucQLNV.dto.request.UserRequest;
import com.example.DucQLNV.dto.respone.UserRespone;
import com.example.DucQLNV.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
   // User toUser(UserRequest request);

    UserRequest toUserResponse(User user);

    UserRespone toUserMapper(User user);
}
