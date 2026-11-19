
package com.mediqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mediqueue.entity.Doctor;
import com.mediqueue.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor doctor = getDoctorById(id);

        doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setPhone(updatedDoctor.getPhone());
        doctor.setEmail(updatedDoctor.getEmail());
        doctor.setConsultationFee(updatedDoctor.getConsultationFee());

        doctor.setAvailableDays(updatedDoctor.getAvailableDays());

        doctor.setMorningStartTime(updatedDoctor.getMorningStartTime());
        doctor.setMorningEndTime(updatedDoctor.getMorningEndTime());

        doctor.setEveningStartTime(updatedDoctor.getEveningStartTime());
        doctor.setEveningEndTime(updatedDoctor.getEveningEndTime());

        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }
}
