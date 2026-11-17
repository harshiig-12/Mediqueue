
package com.mediqueue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

}
