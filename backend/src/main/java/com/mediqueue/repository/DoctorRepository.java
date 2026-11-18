
package com.mediqueue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
