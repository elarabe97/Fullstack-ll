package com.levelupgamer.backend.service;

import com.levelupgamer.backend.controller.auth.AuthDto;
import com.levelupgamer.backend.entity.Role;
import com.levelupgamer.backend.entity.User;
import com.levelupgamer.backend.repository.UserRepository;
import com.levelupgamer.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                boolean isDuoc = request.getEmail().endsWith("@duoc.cl");

                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .age(request.getAge())
                                .duocEmail(isDuoc)
                                .role(Role.CLIENT)
                                .points(0)
                                .build();

                userRepository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthDto.AuthResponse.builder()
                                .token(jwtToken)
                                .user(mapToDto(user))
                                .build();
        }

        public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthDto.AuthResponse.builder()
                                .token(jwtToken)
                                .user(mapToDto(user))
                                .build();
        }

        private AuthDto.UserDto mapToDto(User user) {
                return AuthDto.UserDto.builder()
                                .id(user.getId())
                                .fullName(user.getFullName())
                                .email(user.getEmail())
                                .age(user.getAge())
                                .duocEmail(user.isDuocEmail())
                                .role(user.getRole().name())
                                .points(user.getPoints())
                                .build();
        }
}
