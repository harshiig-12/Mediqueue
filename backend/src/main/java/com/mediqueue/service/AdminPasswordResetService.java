package com.mediqueue.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mediqueue.repository.UserRepository;

@Component
@Profile("admin-reset")
public class AdminPasswordResetService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminPasswordResetService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {

        String email = System.getenv("MEDIQUEUE_ADMIN_EMAIL");
        String password = System.getenv("MEDIQUEUE_NEW_PASSWORD");

        if (email == null || email.isBlank()
                || password == null || password.length() < 12) {
            throw new IllegalStateException(
                    "Admin email and a password of at least 12 characters are required.");
        }

        var user = userRepository.findByEmail(
                email.trim().toLowerCase())
                .orElseThrow(() ->
                        new IllegalStateException("Admin account not found."));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        System.out.println("ADMIN password reset successfully.");
    }
}