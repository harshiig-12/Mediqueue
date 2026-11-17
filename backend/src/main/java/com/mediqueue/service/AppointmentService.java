
package com.mediqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mediqueue.entity.Appointment;
import com.mediqueue.entity.Patient;
import com.mediqueue.repository.AppointmentRepository;
import com.mediqueue.repository.PatientRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));
    }

    public Appointment createAppointment(
            Appointment appointment, Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        appointment.setPatient(patient);

        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
    public void deleteAppointmentsByPatientId(Long patientId) {
    appointmentRepository.deleteByPatientId(patientId);
}
}
