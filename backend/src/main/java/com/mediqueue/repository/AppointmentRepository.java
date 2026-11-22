
package com.mediqueue.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.mediqueue.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Transactional
@Modifying
@Query("DELETE FROM Appointment a WHERE a.patient.id = :patientId")
void deleteByPatientId(@Param("patientId") Long patientId);

    boolean existsByDoctorIdAndAppointmentDateTimeAndStatus(
            Long doctorId,
            LocalDateTime appointmentDateTime,
            String status
    );
@Transactional
    @Modifying(flushAutomatically = true, clearAutomatically = true)
@Query("UPDATE Appointment a SET a.doctor = NULL WHERE a.doctor.id = :doctorId")
void unlinkDoctorFromAppointments(@Param("doctorId") Long doctorId);
}
