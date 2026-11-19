
package com.mediqueue.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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

    private static final int DEFAULT_DURATION = 30;

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
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));
    }

    private int calculateDuration(String appointmentType) {

        if (appointmentType == null || appointmentType.isBlank()) {
            throw new RuntimeException("Please select an appointment type.");
        }

        return switch (appointmentType.toUpperCase(Locale.ROOT)) {
            case "NEW_PATIENT" -> 30;
            case "FOLLOW_UP" -> 15;
            case "GENERAL" -> 20;
            case "COMPLEX" -> 45;
            default -> throw new RuntimeException(
                    "Invalid appointment type.");
        };
    }

    private int getDuration(Appointment appointment) {
        Integer duration = appointment.getEstimatedDurationMinutes();

        return duration != null ? duration : DEFAULT_DURATION;
    }

    private void validateDoctorAvailability(
            Doctor doctor,
            LocalDateTime appointmentDateTime,
            int duration) {

        if (doctor.getAvailableDays() == null
                || doctor.getAvailableDays().isBlank()) {
            throw new RuntimeException(
                    "Doctor availability has not been configured.");
        }

        DayOfWeek day = appointmentDateTime.getDayOfWeek();

        String dayName = day.getDisplayName(
                TextStyle.FULL, Locale.ENGLISH);

        boolean availableDay = List.of(
                doctor.getAvailableDays().split(","))
                .stream()
                .map(String::trim)
                .anyMatch(d -> d.equalsIgnoreCase(dayName));

        if (!availableDay) {
            throw new RuntimeException(
                    "Doctor is not available on " + dayName + ".");
        }

        LocalTime time = appointmentDateTime.toLocalTime();
        LocalTime appointmentEnd = time.plusMinutes(duration);

        boolean morningShift =
                doctor.getMorningStartTime() != null
                && doctor.getMorningEndTime() != null
                && !time.isBefore(doctor.getMorningStartTime())
                && !appointmentEnd.isAfter(doctor.getMorningEndTime());

        boolean eveningShift =
                doctor.getEveningStartTime() != null
                && doctor.getEveningEndTime() != null
                && !time.isBefore(doctor.getEveningStartTime())
                && !appointmentEnd.isAfter(doctor.getEveningEndTime());

        if (!morningShift && !eveningShift) {
            throw new RuntimeException(
                    "Appointment does not fit within the doctor's working shifts.");
        }
    }

    private void validateNoOverlap(
            Long doctorId,
            LocalDateTime appointmentDateTime,
            int duration,
            Long excludedAppointmentId) {

        LocalDateTime newEnd =
                appointmentDateTime.plusMinutes(duration);

        List<Appointment> existingAppointments =
                appointmentRepository.findAll();

        for (Appointment existing : existingAppointments) {

            if (!"SCHEDULED".equals(existing.getStatus())) {
                continue;
            }

            if (existing.getDoctor() == null
                    || !existing.getDoctor().getId().equals(doctorId)) {
                continue;
            }

            if (excludedAppointmentId != null
                    && existing.getId().equals(excludedAppointmentId)) {
                continue;
            }

            LocalDateTime existingStart =
                    existing.getAppointmentDateTime();

            LocalDateTime existingEnd =
                    existingStart.plusMinutes(getDuration(existing));

            boolean overlaps =
                    appointmentDateTime.isBefore(existingEnd)
                    && newEnd.isAfter(existingStart);

            if (overlaps) {
                throw new RuntimeException(
                        "This doctor already has an overlapping appointment.");
            }
        }
    }

    public Appointment createAppointment(
            Appointment appointment,
            Long patientId,
            Long doctorId) {

        LocalDateTime appointmentDateTime =
                appointment.getAppointmentDateTime();

        if (appointmentDateTime == null
                || appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Cannot book an appointment in the past.");
        }

        int duration = calculateDuration(
                appointment.getAppointmentType());

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        validateDoctorAvailability(
                doctor, appointmentDateTime, duration);

        validateNoOverlap(
                doctorId, appointmentDateTime, duration, null);

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDoctorName(doctor.getName());
        appointment.setEstimatedDurationMinutes(duration);
        appointment.setStatus("SCHEDULED");

        return appointmentRepository.save(appointment);
    }

    public Appointment rescheduleAppointment(
            Long appointmentId,
            Long doctorId,
            LocalDateTime newStart) {

        Appointment appointment = getAppointmentById(appointmentId);

        if (!"SCHEDULED".equals(appointment.getStatus())) {
            throw new RuntimeException(
                    "Only scheduled appointments can be rescheduled.");
        }

        if (newStart == null
                || newStart.isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Cannot reschedule an appointment to the past.");
        }

        int duration = getDuration(appointment);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        validateDoctorAvailability(doctor, newStart, duration);

        validateNoOverlap(
                doctorId, newStart, duration, appointmentId);

        appointment.setDoctor(doctor);
        appointment.setDoctorName(doctor.getName());
        appointment.setAppointmentDateTime(newStart);

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

public List<LocalDateTime> getAvailableSlots(
        Long doctorId,
        LocalDate date,
        String appointmentType) {

    Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() ->
                    new RuntimeException("Doctor not found"));

    int duration = calculateDuration(appointmentType);

    String dayName = date.getDayOfWeek()
            .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

    boolean availableDay = List.of(
            doctor.getAvailableDays().split(","))
            .stream()
            .map(String::trim)
            .anyMatch(d -> d.equalsIgnoreCase(dayName));

    List<LocalDateTime> availableSlots = new ArrayList<>();

    if (!availableDay) {
        return availableSlots;
    }

    LocalTime[][] shifts = {
        {doctor.getMorningStartTime(), doctor.getMorningEndTime()},
        {doctor.getEveningStartTime(), doctor.getEveningEndTime()}
    };

    for (LocalTime[] shift : shifts) {

        LocalTime start = shift[0];
        LocalTime end = shift[1];

        if (start == null || end == null) {
            continue;
        }

        for (LocalTime time = start;
             !time.plusMinutes(duration).isAfter(end);
             time = time.plusMinutes(15)) {

            LocalDateTime slot = LocalDateTime.of(date, time);

            if (slot.isBefore(LocalDateTime.now())) {
                continue;
            }

            try {
                validateNoOverlap(
                        doctorId, slot, duration, null);

                availableSlots.add(slot);

            } catch (RuntimeException e) {
                // Skip slots that overlap existing appointments
            }
        }
    }

    return availableSlots;
}

}
