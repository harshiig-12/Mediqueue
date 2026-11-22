
package com.mediqueue.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mediqueue.repository.UserRepository;

@Component
@Profile("admin-setup")
public class AdminSetupService implements CommandLineRunner {

    private final UserRepository userRepository;

    public AdminSetupService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        String email = System.getenv("MEDIQUEUE_ADMIN_EMAIL");

        if (email == null || email.isBlank()) {
            throw new IllegalStateException(
                "Set MEDIQUEUE_ADMIN_EMAIL before running admin setup.");
        }

        int updated = userRepository.updateUserRole(
            email.trim().toLowerCase(), "ADMIN");

        if (updated == 0) {
            throw new IllegalStateException(
                "No account found for: " + email);
        }

        System.out.println("ADMIN role assigned successfully.");
    }
}
