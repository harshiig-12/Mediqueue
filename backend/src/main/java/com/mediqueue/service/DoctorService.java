
package com.mediqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediqueue.entity.Doctor;
import com.mediqueue.repository.AppointmentRepository;
import com.mediqueue.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
private final AppointmentRepository appointmentRepository;

    public DoctorService(
        DoctorRepository doctorRepository,
        AppointmentRepository appointmentRepository) {

    this.doctorRepository = doctorRepository;
    this.appointmentRepository = appointmentRepository;
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

   @Transactional 
public void deleteDoctor(Long id) {
    getDoctorById(id);

    appointmentRepository.unlinkDoctorFromAppointments(id);

    doctorRepository.deleteById(id);
}
}
