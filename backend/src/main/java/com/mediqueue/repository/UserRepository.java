
package com.mediqueue.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mediqueue.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    @Modifying
@Query("UPDATE User u SET u.role = :role WHERE u.email = :email")
int updateUserRole(
        @Param("email") String email,
        @Param("role") String role
);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
