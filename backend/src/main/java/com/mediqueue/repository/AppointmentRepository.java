package com.mediqueue.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mediqueue.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    void deleteByPatientId(Long patientId);

    @Query("""
        SELECT COUNT(a) > 0
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.status = 'SCHEDULED'
        AND a.appointmentDateTime < :newEnd
        AND a.appointmentDateTime > :newStartMinusDuration
    """)
    boolean hasOverlappingAppointment(
            @Param("doctorId") Long doctorId,
            @Param("newStartMinusDuration") LocalDateTime newStartMinusDuration,
            @Param("newEnd") LocalDateTime newEnd
    );
}