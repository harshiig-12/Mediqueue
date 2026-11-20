
package com.mediqueue.service;

import java.util.Map;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mediqueue.dto.LoginRequest;
import com.mediqueue.dto.RegisterRequest;
import com.mediqueue.entity.User;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Map<String, Object> register(RegisterRequest request) {

        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Name, valid email and password of at least 8 characters are required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Public registration can never create an administrator.
        user.setRole("RECEPTIONIST");

        userRepository.save(user);

        return Map.of(
                "message", "Account registered successfully.",
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }

    public Map<String, Object> login(LoginRequest request) {

        User user = userRepository.findByEmail(
                request.getEmail().trim().toLowerCase())
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        return Map.of(
                "token", jwtService.generateToken(user),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }
}
