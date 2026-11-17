
package com.mediqueue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> { 
    void deleteByPatientId(Long patientId);
}

