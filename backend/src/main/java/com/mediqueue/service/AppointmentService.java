
package com.mediqueue.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mediqueue.entity.Appointment;
import com.mediqueue.entity.Doctor;
import com.mediqueue.entity.Patient;
import com.mediqueue.repository.AppointmentRepository;
import com.mediqueue.repository.DoctorRepository;
import com.mediqueue.repository.PatientRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment createAppointment(
            Appointment appointment,
            Long patientId,
            Long doctorId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDateTime newStart = appointment.getAppointmentDateTime();

        if (newStart == null) {
            throw new RuntimeException("Appointment date and time are required.");
        }

        if (newStart.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book an appointment in the past.");
        }

        LocalDateTime newEnd = newStart.plusMinutes(30);
        LocalDateTime newStartMinusDuration = newStart.minusMinutes(30);

        boolean alreadyBooked =
                appointmentRepository.hasOverlappingAppointment(
                        doctorId,
                        newStartMinusDuration,
                        newEnd
                );

        if (alreadyBooked) {
            throw new RuntimeException(
                    "This doctor already has an appointment during this time slot."
            );
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDoctorName(doctor.getName());
        appointment.setStatus("SCHEDULED");

        return appointmentRepository.save(appointment);
    }

    public Appointment completeAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("COMPLETED");
        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public void deleteAppointmentsByPatientId(Long patientId) {
        appointmentRepository.deleteByPatientId(patientId);
    }
}
