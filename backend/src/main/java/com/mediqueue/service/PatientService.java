
package com.mediqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediqueue.entity.Patient;
import com.mediqueue.repository.BillingRepository;
import com.mediqueue.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentService appointmentService;
    private final BillingRepository billingRepository;

    public PatientService(
            PatientRepository patientRepository,
            AppointmentService appointmentService,
            BillingRepository billingRepository) {

        this.patientRepository = patientRepository;
        this.appointmentService = appointmentService;
        this.billingRepository = billingRepository;
    }

    // Add a new patient
    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Get patient by ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));
    }

    // Update patient
    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient patient = getPatientById(id);

        patient.setName(updatedPatient.getName());
        patient.setAge(updatedPatient.getAge());
        patient.setGender(updatedPatient.getGender());
        patient.setPhone(updatedPatient.getPhone());
        patient.setEmail(updatedPatient.getEmail());
        patient.setDateOfBirth(updatedPatient.getDateOfBirth());

        return patientRepository.save(patient);
    }

    // Delete patient while preserving billing history
    @Transactional
    public void deletePatient(Long id) {

        if (billingRepository.existsByPatientId(id)) {
            throw new RuntimeException(
                    "Cannot delete patient because billing records exist. Preserve billing history.");
        }

        appointmentService.deleteAppointmentsByPatientId(id);
        patientRepository.deleteById(id);
    }
}
